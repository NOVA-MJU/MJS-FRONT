import { Outlet, useLocation } from 'react-router-dom';

import Footer from './Footer';
import Navbar from './Navbar';
import Header from './Header';
import SearchBar from './SearchBar';
import ProfileComponent from './ProfileComponent';
import WeatherComponent from '../../molecules/mainpage/weatherComponent';

const Layout = () => {
  const location = useLocation();
  const hideHeaderRoutes = ['/login', '/register'];
  const shouldShowHeader = !hideHeaderRoutes.includes(location.pathname);

  return (
    <div className='flex flex-col w-screen min-h-screen items-center'>
      <Navbar />

      <main className='flex-1 w-[1280px] mx-auto flex flex-col'>
        {shouldShowHeader && <Header />}

        <div className='flex flex-col md:flex-row gap-4 mt-6'>
          <div className='w-full md:w-2/3 flex flex-col gap-3'>
            <SearchBar />
            <Outlet />
          </div>

          <div className='w-full md:w-1/3 flex flex-col gap-3'>
            <ProfileComponent />
            <WeatherComponent />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
