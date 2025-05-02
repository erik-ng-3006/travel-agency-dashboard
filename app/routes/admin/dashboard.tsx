import { Header } from 'components';

const Dashboard = () => {
	const user = {
		name: 'Erik',
	};
	return (
		<main className='dashboard wrapper'>
			<Header
				title={`Welcome ${user?.name ?? 'Guest'} 👋`}
				description='Track activity, trend and popular destination in real time'
			/>
			Dashboard Page Contents
		</main>
	);
};

export default Dashboard;
