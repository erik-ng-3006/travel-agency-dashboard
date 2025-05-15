import React from 'react';
import { useNavigate } from 'react-router';
import { logoutUser } from '~/appwrite/auth';

const PageLayout = () => {
	const navigate = useNavigate();

	const handleLogout = () => {
		logoutUser();
		navigate('/sign-in');
	};

	return (
		<div>
			<button
				type='button'
				className='cursor-pointer'
				onClick={handleLogout}
			>
				<img
					src='/assets/icons/logout.svg'
					alt='logout'
					className='size-6'
				/>
			</button>

			<button
				type='button'
				onClick={() => navigate('/dashboard')}
				className='cursor-pointer'
			>
				Dashboard
			</button>
		</div>
	);
};

export default PageLayout;
