import { Header, StatsCard, TripCard } from 'components';
import { getAllUsers, getUser } from '~/appwrite/auth';
import type { Route } from './+types/dashboard';
import {
	getTripsByTravelStyle,
	getUserGrowthPerDay,
	getUsersAndTripsStats,
} from '~/appwrite/dashboard';
import { getAllTrips } from '~/appwrite/trips';
import { parseTripData } from '~/lib/utils';
import {
	Category,
	ChartComponent,
	ColumnsDirective,
	ColumnSeries,
	DataLabel,
	Inject,
	SeriesCollectionDirective,
	SeriesDirective,
	SplineAreaSeries,
	Tooltip,
} from '@syncfusion/ej2-react-charts';
import { tripXAxis, tripYAxis, userXAxis, userYAxis } from '~/constants';
import { ColumnDirective, GridComponent } from '@syncfusion/ej2-react-grids';

export const clientLoader = async () => {
	const [
		user,
		dashboardStats,
		trips,
		userGrowth,
		tripByTravelStyle,
		allUsers,
	] = await Promise.all([
		await getUser(),
		await getUsersAndTripsStats(),
		await getAllTrips(4, 0),
		await getUserGrowthPerDay(),
		await getTripsByTravelStyle(),
		await getAllUsers(4, 0),
	]);

	const allTrips = trips.allTrips.map(({ $id, tripDetail, imageUrls }) => ({
		id: $id,
		...parseTripData(tripDetail),
		imageUrls: imageUrls ?? [],
	}));

	const mappedUsers: UsersItineraryCount[] = allUsers.users.map((user) => ({
		imageUrl: user.imageUrl,
		name: user.name,
		count: user.itineraryCount ?? Math.floor(Math.random() * 10),
	}));

	return {
		user,
		dashboardStats,
		allTrips,
		userGrowth,
		tripByTravelStyle,
		allUsers: mappedUsers,
	};
};
const Dashboard = ({ loaderData }: Route.ComponentProps) => {
	const user = loaderData.user as User | null;
	const {
		dashboardStats,
		allTrips,
		userGrowth,
		tripByTravelStyle,
		allUsers,
	} = loaderData;

	const trips = allTrips.map((trip) => ({
		imageUrl: trip.imageUrls[0],
		name: trip.name,
		interest: trip.interests,
	}));

	const usersAndTrips = [
		{
			title: 'Last user signups',
			dataSource: allUsers,
			field: 'count',
			headerText: 'Trip created',
		},
		{
			title: 'Trip based on interests',
			dataSource: trips,
			field: 'interest',
			headerText: 'Interests',
		},
	];

	return (
		<main className='dashboard wrapper'>
			<Header
				title={`Welcome ${user?.name ?? 'Guest'} 👋`}
				description='Track activity, trend and popular destination in real time'
			/>
			<section className='flex flex-col gap-6'>
				<div className='grid grid-cols-1 md:grid-cols-3 gap-6 w-full'>
					<StatsCard
						headerTitle='Total Users'
						total={dashboardStats.totalUsers}
						currentMonthCount={
							dashboardStats.usersJoined.currentMonth
						}
						lastMonthCount={dashboardStats.usersJoined.lastMonth}
					/>
					<StatsCard
						headerTitle='Total Trips'
						total={dashboardStats.totalTrips}
						currentMonthCount={
							dashboardStats.tripsCreated.currentMonth
						}
						lastMonthCount={dashboardStats.tripsCreated.lastMonth}
					/>
					<StatsCard
						headerTitle='Active Users'
						total={dashboardStats.userRole.total}
						currentMonthCount={dashboardStats.userRole.currentMonth}
						lastMonthCount={dashboardStats.userRole.lastMonth}
					/>
				</div>
			</section>
			<section className='container'>
				<h1 className='text-xl font-semibold text-dark-100'>
					Created Trips
				</h1>
				<div className='trip-grid'>
					{allTrips.slice(0, 4).map((trip) => (
						<TripCard
							key={trip.id}
							id={trip.id.toString()}
							name={trip.name!}
							imageUrl={trip.imageUrls[0]}
							location={trip.itinerary?.[0]?.location ?? ''}
							tags={[trip.interests!, trip.travelStyle!]}
							price={trip.estimatedPrice!}
						/>
					))}
				</div>
			</section>
			<section className='grid grid-cols-1 lg:grid-cols-2 gap-5'>
				<ChartComponent
					id='chart-1'
					primaryXAxis={userXAxis}
					primaryYAxis={userYAxis}
					title='User Growth'
					tooltip={{ enable: true }}
				>
					<Inject
						services={[
							ColumnSeries,
							SplineAreaSeries,
							Category,
							DataLabel,
							Tooltip,
						]}
					/>

					<SeriesCollectionDirective>
						<SeriesDirective
							dataSource={userGrowth}
							xName='day'
							yName='count'
							type='Column'
							name='Column'
							columnWidth={0.3}
							cornerRadius={{ topLeft: 10, topRight: 10 }}
						/>

						<SeriesDirective
							dataSource={userGrowth}
							xName='day'
							yName='count'
							type='SplineArea'
							name='Wave'
							fill='rgba(71,132,238,0.3)'
							border={{
								color: '#4784ee',
								width: 2,
							}}
						/>
					</SeriesCollectionDirective>
				</ChartComponent>

				<ChartComponent
					id='chart-2'
					primaryXAxis={tripXAxis}
					primaryYAxis={tripYAxis}
					title='Trip Trends'
					tooltip={{ enable: true }}
				>
					<Inject
						services={[
							ColumnSeries,
							SplineAreaSeries,
							Category,
							DataLabel,
							Tooltip,
						]}
					/>

					<SeriesCollectionDirective>
						<SeriesDirective
							dataSource={tripByTravelStyle}
							xName='travelStyle'
							yName='count'
							type='Column'
							name='day'
							columnWidth={0.3}
							cornerRadius={{ topLeft: 10, topRight: 10 }}
						/>
					</SeriesCollectionDirective>
				</ChartComponent>
			</section>

			<section className='user-trip wrapper'>
				{usersAndTrips.map(
					({ title, dataSource, field, headerText }, i) => (
						<div key={i} className='flex flex-col gap-5'>
							<h3 className='p-20-semibold text-dark-100'>
								{title}
							</h3>

							<GridComponent
								dataSource={dataSource}
								gridLines='None'
							>
								<ColumnsDirective>
									<ColumnDirective
										field='name'
										headerText='Name'
										width='200'
										textAlign='Left'
										template={(props: UserData) => (
											<div className='flex items-center gap-1.5 px-4'>
												<img
													className='size-8 rounded-full aspect-square'
													src={props.imageUrl}
													alt='user'
													referrerPolicy='no-referrer'
												/>
												<span>{props.name}</span>
											</div>
										)}
									/>

									<ColumnDirective
										field={field}
										headerText={headerText}
										width='150'
										textAlign='Left'
									/>
								</ColumnsDirective>
							</GridComponent>
						</div>
					)
				)}
			</section>
		</main>
	);
};

export default Dashboard;
