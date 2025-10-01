import BroadcastSection from '@/components/molecules/sections/broadcast';
import MealSection from '@/components/molecules/sections/meal';
import NewsSection from '@/components/molecules/sections/news';
import NoticeSection from '@/components/molecules/sections/notice';
import SearchBar from '@/components/atoms/SearchBar';
import ProfileSection from '@/components/molecules/sections/profile';
import WeatherComponent from '@/components/molecules/sections';
import AdCarousel from '@/components/molecules/sections/advertise';
import RealtimeRank from '@/components/molecules/sections/rank';
import HotBoardList from '@/components/molecules/sections/board';
import { useResponsive } from '@/hooks/useResponse';
import { FaBullhorn } from 'react-icons/fa';
import AcademicCalendarSection from '@/components/molecules/sections/calendar';

export default function Main() {
  const { isDesktop } = useResponsive();

  const ANNOUNCEMENT_TEXT = '현재 Version2 작업중입니다! -MJS 일동-';

  /**
   * 데스크탑 화면
   */
  if (isDesktop)
    return (
      <div className='w-full flex-1 px-7 py-12 flex gap-6'>
        <div className='min-w-0 flex-2/3 flex flex-col gap-12'>
          <div className='flex flex-col gap-3'>
            <SearchBar />
            <div className='px-3 flex items-center gap-2 text-body03 text-mju-secondary line-clamp-1'>
              <FaBullhorn />
              <span>{ANNOUNCEMENT_TEXT}</span>
            </div>
          </div>
          <MealSection />
          <NoticeSection />
          <NewsSection />
          <BroadcastSection />
        </div>
        <div className='min-w-0 flex-1/3 flex flex-col gap-12'>
          <ProfileSection />
          <WeatherComponent />
          <AdCarousel />
          <RealtimeRank />
          <AcademicCalendarSection />
          <HotBoardList />
        </div>
      </div>
    );

  /**
   * 모바일 화면
   */
  if (!isDesktop)
    return (
      <div className='flex-1 px-5 py-6 flex flex-col gap-10'>
        <section>
          <div className='px-3 py-2 rounded-sm bg-blue-05'>
            <div className='flex items-center justify-center gap-2 text-body04 text-[#2254F5] line-clamp-1'>
              <FaBullhorn />
              <span>{ANNOUNCEMENT_TEXT}</span>
            </div>
          </div>
        </section>
        <MealSection />
        <NoticeSection />
      </div>
      // <main className='flex-1 w-full md:w-[1280px] mx-auto flex flex-col px-7 py-12 md:px-0'>
      //   <div className='flex flex-col md:flex-row gap-6'>
      //     {/* 좌 컬럼: 검색 + 메인 콘텐츠 */}
      //     <div className='min-w-0 w-full md:w-2/3 flex flex-col gap-12 mb-12'>
      //       <div className='hidden md:flex flex-col gap-3'></div>
      //       <div className='hidden'></div>
      //       <div className='hidden md:block md:order-1'></div>
      //       <div className='order-1 md:order-2'></div>
      //       <div className='order-3 md:order-3'></div>
      //       <div className='hidden md:block md:order-4'></div>
      //       <div className='order-2 md:hidden'>
      //         <AcademicCalendar />
      //       </div>
      //     </div>
      //     <div className='min-w-0 w-full md:w-1/3 flex flex-col gap-12 mb-12'>
      //       <div className='hidden md:block'>
      //         <ProfileComponent />
      //       </div>
      //       <div className='hidden md:block'></div>
      //       <div className='hidden md:block'></div>
      //       <div className='hidden md:block '></div>
      //       <div className='hidden md:block'>
      //         <HotBoardList />
      //       </div>
      //     </div>
      //   </div>
      // </main>
    );
}
