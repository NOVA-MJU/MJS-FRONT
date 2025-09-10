import { useLocation } from 'react-router-dom';
import Footer from '../organisms/Footer';
import Navbar from '../organisms/Navbar';
import Header from '../organisms/Header';
import SearchBar from '../atoms/SearchBar';
import ProfileComponent from '../organisms/ProfileComponent';
import WeatherComponent from '../molecules/mainpage/Weather';
import type { ReactNode } from 'react';
import AdCarousel from '../molecules/mainpage/Advertise';
import RealtimeRank from '../molecules/mainpage/RealTimeRank';
import AcademicSchedulePanel from '../molecules/mainpage/AcademicSchedulePanel/index.tsx';
import HotBoardList from '../molecules/mainpage/HotBoardList.tsx';

interface LayoutProps {
  children: ReactNode;
}

const LayoutForMain = ({ children }: LayoutProps) => {
  const location = useLocation();
  const hideHeaderRoutes = ['/login', '/register', '/notice', '/news'];
  const shouldShowHeader = !hideHeaderRoutes.includes(location.pathname);

  return (
    <div className='flex flex-col w-screen min-h-screen'>
      <Navbar />

      <main className='flex-1 w-full max-w-[1280px] mx-auto flex flex-col px-4 md:px-0'>
        <div className='hidden md:block'>{shouldShowHeader && <Header />}</div>

        <div className='flex flex-col md:flex-row gap-4 mt-6'>
          {/* 좌 컬럼: 검색 + 메인 콘텐츠 */}

          <div className='min-w-0 w-full md:w-2/3 flex flex-col gap-3'>
            <div className='hidden'>
              <SearchBar />
            </div>
            <div className='md:hidden'>
              <ProfileComponent />
            </div>

            {children}
          </div>

          <div className='min-w-0 w-full md:w-1/3 flex flex-col gap-5'>
            <div className='hidden md:block'>
              <ProfileComponent />
            </div>
            <div className='hidden md:block'>
              <AcademicSchedulePanel />
            </div>
            <div className='hidden md:block'>
              <AdCarousel />
            </div>
            <div className='hidden md:block'>
              <RealtimeRank />
            </div>
            <div className='hidden md:block '>
              <WeatherComponent />
            </div>
            <div className='hidden md:block'>
              <HotBoardList />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default LayoutForMain;
