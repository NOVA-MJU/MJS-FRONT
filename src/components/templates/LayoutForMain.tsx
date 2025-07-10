import { useLocation } from 'react-router-dom';

import Footer from '../organisms/Footer';
import Navbar from '../organisms/Navbar';
import Header from '../organisms/Header';
import SearchBar from '../atoms/SearchBar';
import ProfileComponent from '../organisms/ProfileComponent';
import WeatherComponent from '../molecules/mainpage/Weather';
import type { ReactNode } from 'react';
interface LayoutProps {
  children: ReactNode;
}
const LayoutForMain = ({ children }: LayoutProps) => {
  const location = useLocation();
  const hideHeaderRoutes = ['/login', '/register', '/notice', '/news'];
  const shouldShowHeader = !hideHeaderRoutes.includes(location.pathname);

  return (
    <div className='flex flex-col w-screen min-h-screen items-center'>
      <Navbar />

      <main className='flex-1 w-[1280px] mx-auto flex flex-col'>
        {shouldShowHeader && <Header />}

        <div className='flex flex-col md:flex-row gap-4 mt-6'>
          <div className='w-full md:w-2/3 flex flex-col gap-3'>
            <SearchBar />
            {children}
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

export default LayoutForMain;
