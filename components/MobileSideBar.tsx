// @ts-nocheck

import { SidebarComponent } from '@syncfusion/ej2-react-navigations';
import { Link } from 'react-router';
import { NavItems } from 'components';

const MobileSideBar = () => {
	let sidebar: SidebarComponent;

	const toggleSidebar = () => sidebar.toggle();

	return (
		<div className='mobile-sidebar wrapper'>
			<header>
				<Link to='/'>
					<img
						src='/assets/icons/logo.svg'
						alt='logo'
						className='size-30px'
					/>
					<h1>Tourvisto</h1>
				</Link>

				<button
					title='toggle sidebar'
					onClick={toggleSidebar}
					className='cursor-pointer'
				>
					<img
						src='/assets/icons/menu.svg'
						alt='menu'
						className='size-7'
					/>
				</button>

				<SidebarComponent
					width={270}
					ref={(Sidebar) => {
						sidebar = Sidebar;
					}}
					created={() => sidebar.hide()}
					closeOnDocumentClick={true}
					showBackdrop={true}
					type='over'
				>
					<NavItems handleClick={toggleSidebar} />
				</SidebarComponent>
			</header>
		</div>
	);
};

export default MobileSideBar;
