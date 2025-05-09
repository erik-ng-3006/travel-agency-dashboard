import { useState } from 'react';
import { Header } from 'components';
import { ComboBoxComponent } from '@syncfusion/ej2-react-dropdowns';
import type { Route } from './+types/create-trip';
import { comboBoxItems, selectItems } from '~/constants';
import { cn, formatKey } from '~/lib/utils';
import {
	LayerDirective,
	LayersDirective,
	MapsComponent,
} from '@syncfusion/ej2-react-maps';
import { world_map } from '~/constants/world_map';
import { ButtonComponent } from '@syncfusion/ej2-react-buttons';
import { account } from '~/appwrite/client';

export const loader = async () => {
	const response = await fetch('https://restcountries.com/v3.1/all');

	const data = await response.json();

	return data.map((country: any) => ({
		name: country.flag + ' ' + country.name.common,
		coordinate: country.latlng,
		value: country.name.common,
		openStreetMap: country.maps?.openStreetMaps,
	}));
};
const CreateTrip = ({ loaderData }: Route.ComponentProps) => {
	const countries = loaderData as Country[];

	const [formData, setFormData] = useState<TripFormData>({
		country: countries[0].name || '',
		travelStyle: '',
		interest: '',
		budget: '',
		duration: 0,
		groupType: '',
	});

	const [error, setError] = useState<string | null>(null);

	const [loading, setLoading] = useState(false);

	const countryData = countries.map((country) => ({
		name: country.name,
		value: country.value,
	}));

	const mapData = [
		{
			country: formData.country,
			color: '#EA382E',
			coordinates:
				countries.find((c: Country) => c.name === formData.country)
					?.coordinates || [],
		},
	];

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setLoading(true);

		if (
			!formData.country ||
			!formData.travelStyle ||
			!formData.interest ||
			!formData.budget ||
			!formData.groupType
		) {
			setError('Please fill in all fields');
			setLoading(false);
			return;
		}

		if (formData.duration < 1 || formData.duration > 10) {
			setError('Duration must be between 1 and 10 days');
			setLoading(false);
			return;
		}

		const user = await account.get();

		if (!user.$id) {
			setError('User is not authenticated');
			setLoading(false);
			return;
		}

		try {
			console.log({ user, formData });
		} catch (error) {
			console.error('Error creating trip:', error);
		} finally {
			setLoading(false);
		}
	};
	function handleChange(key: keyof TripFormData, value: string | number) {
		setFormData({
			...formData,
			[key]: value,
		});
	}

	return (
		<main className='flex flex-col gap-10 pb-20 wrapper'>
			<Header
				title='Add a New Trip'
				description='View and edit AI-generated travel plans'
			/>
			<section className='mt-2.5 wrapper-md'>
				<form className='trip-form' onSubmit={handleSubmit}>
					<div>
						<label htmlFor='country'>Country</label>
						<ComboBoxComponent
							id='country'
							placeholder='Select a country'
							dataSource={countryData}
							fields={{ text: 'name', value: 'value' }}
							className='combo-box'
							change={(e: { value: string | undefined }) => {
								if (e.value) {
									handleChange('country', e.value);
								}
							}}
							allowFiltering
							filtering={(e: any) => {
								const query = e.text.toLowerCase();
								const filteredData = countries.filter((item) =>
									item.name.toLowerCase().includes(query)
								);
								e.updateData(filteredData);
							}}
						/>
					</div>
					<div>
						<label htmlFor='duration'>Duration</label>
						<input
							id='duration'
							name='duration'
							type='number'
							placeholder='Enter a number of days'
							className='form-input placeholder:text-gray-100'
							onChange={(e) =>
								handleChange('duration', Number(e.target.value))
							}
						/>
					</div>
					{selectItems.map((key) => (
						<div key={key}>
							<label htmlFor={key}>{formatKey(key)}</label>
							<ComboBoxComponent
								id={key}
								dataSource={comboBoxItems[key].map((item) => ({
									name: item,
									value: item,
								}))}
								fields={{ text: 'name', value: 'value' }}
								placeholder={`Select ${formatKey(key)}`}
								className='combo-box'
								change={(e: { value: string | undefined }) => {
									if (e.value) {
										handleChange(key, e.value);
									}
								}}
								allowFiltering
								filtering={(e: any) => {
									const query = e.text.toLowerCase();
									const filteredData = comboBoxItems[
										key
									].filter((item) =>
										item.toLowerCase().includes(query)
									);
									e.updateData(filteredData);
								}}
							/>
						</div>
					))}
					<div>
						<label htmlFor='location'>
							Location on the world map
						</label>
						<MapsComponent>
							<LayersDirective>
								<LayerDirective
									shapeData={world_map}
									dataSource={mapData}
									shapePropertyPath='name'
									shapeDataPath='country'
									shapeSettings={{
										colorValuePath: 'color',
										fill: '#E5E5E5',
									}}
								/>
							</LayersDirective>
						</MapsComponent>
					</div>
					<div className='bg-gray-200 h-px w-full' />
					{error && (
						<div className='error'>
							<p>{error}</p>
						</div>
					)}

					<footer className='px-6 w-full'>
						<ButtonComponent
							type='submit'
							className='button-class !h-12 !w-full'
							disabled={loading}
						>
							<img
								src={`/assets/icons/${
									loading ? 'loader' : 'magic-star'
								}.svg`}
								className={cn('size-5', {
									'animate-spin': loading,
								})}
							/>
							<span className='p-16-semibold text-white'>
								{loading ? 'Generating...' : 'Generate Trip'}
							</span>
						</ButtonComponent>
					</footer>
				</form>
			</section>
		</main>
	);
};

export default CreateTrip;
