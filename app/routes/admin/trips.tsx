import { Header, TripCard } from 'components';
import { useSearchParams, type LoaderFunctionArgs } from 'react-router';
import { getAllTrips } from '~/appwrite/trips';
import { parseTripData } from '~/lib/utils';
import type { Route } from './+types/trips';
import { useState } from 'react';
import { PagerComponent } from '@syncfusion/ej2-react-grids';

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const limit = 8;
	const url = new URL(request.url);
	const page = parseInt(url.searchParams.get('page') || '1', 10);
	const offset = (page - 1) * limit;

	const { allTrips, total } = await getAllTrips(limit, offset);

	return {
		trips: allTrips.map(({ $id, tripDetail, imageUrls }) => ({
			id: $id,
			...parseTripData(tripDetail),
			imageUrls: imageUrls ?? [],
		})),
		total,
	};
};

const Trips = ({ loaderData }: Route.ComponentProps) => {
	const trips = loaderData.trips as Trip[] | [];

	const [searchParams] = useSearchParams();
	const initialPage = parseInt(searchParams.get('page') || '1', 10);

	const [currentPage, setCurrentPage] = useState(initialPage);

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
		window.location.search = `?page=${page}`;
	};

	return (
		<main className='all-users wrapper'>
			<Header
				title='Trips'
				description='View and edit AI-generated travel plans'
				ctaText='Create Trip'
				ctaUrl='/trips/create'
			/>
			<section>
				<h1 className='p-24-semibold text-dark-100'>
					Manage Created Trip
				</h1>
				<div className='trip-grid mb-4'>
					{trips.map(
						({
							id,
							name,
							imageUrls,
							itinerary,
							interests,
							travelStyle,
							estimatedPrice,
						}) => (
							<TripCard
								key={id}
								id={id}
								name={name}
								imageUrl={imageUrls[0]}
								location={itinerary?.[0]?.location ?? ''}
								tags={[interests, travelStyle]}
								price={estimatedPrice}
							/>
						)
					)}
				</div>
			</section>

			<PagerComponent
				currentPage={currentPage}
				totalRecordsCount={loaderData.total}
				pageSize={8}
				click={(args) => handlePageChange(args.currentPage)}
				cssClass='!mb-4'
			/>
		</main>
	);
};

export default Trips;
