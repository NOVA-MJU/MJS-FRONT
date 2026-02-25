import BroadcastSection from '@/components/molecules/sections/broadcast';
import MealSection from '@/components/molecules/sections/meal';
import NewsSection from '@/components/molecules/sections/news';
import NoticeSection from '@/components/molecules/sections/notice';
import SearchBar from '@/components/atoms/SearchBar';
import ProfileSection from '@/components/molecules/sections/profile';
import WeatherComponent from '@/components/molecules/sections/weather';
import AdCarousel from '@/components/molecules/sections/advertise';
import RealtimeRank from '@/components/molecules/sections/rank';
import HotBoardList from '@/components/molecules/sections/hot-board';
import AcademicScheduleWidget from '@/components/molecules/sections/academic-schedule-widget';
import BoardSection from '@/components/molecules/sections/board';
import { useResponsive } from '@/hooks/useResponse';
import { FaBullhorn } from 'react-icons/fa';
import { Link } from 'react-router-dom';

import MainCarousel from '@/components/organisms/MainCarousel';
import MainSearchSection from '@/components/molecules/MainSearchSection';
import SectionSlide from '@/components/molecules/SectionSlide';
import AdBannerSection from '@/components/molecules/AdBannerSection';
import Footer from '@/components/organisms/Footer';

export default function Main() {
  const { isDesktop } = useResponsive();

  const ANNOUNCEMENT_TEXT = '현재 Version2 작업중입니다! -MJS 일동-';

  if (isDesktop) {
    return (
      <div className='flex w-full flex-1 gap-6 px-7 py-12'>
        <div className='flex min-w-0 flex-2/3 flex-col gap-12'>
          <div className='flex flex-col gap-3'>
            <SearchBar />
            <div className='text-body03 text-mju-secondary line-clamp-1 flex items-center gap-2 px-3'>
              <FaBullhorn />
              <span>{ANNOUNCEMENT_TEXT}</span>
            </div>
          </div>
          <MealSection />
          <NoticeSection />
          <NewsSection />
          <BroadcastSection />
        </div>

        <div className='flex min-w-0 flex-1/3 flex-col gap-12'>
          <ProfileSection />
          <WeatherComponent />
          <AdCarousel />
          <RealtimeRank />
          <AcademicScheduleWidget />
          <HotBoardList />
        </div>
      </div>
    );
  }

  const mobileSlides = [
    <MainSearchSection key='search' />,

    <SectionSlide key='meal' title='오늘의 식단' backgroundColor='bg-blue-05'>
      <MealSection />
    </SectionSlide>,

    <SectionSlide key='notice' title='공지사항' backgroundColor='bg-white'>
      <div className='flex flex-col gap-4'>
        <NoticeSection />
        <Link
          to='/notice'
          className='bg-blue-35 text-caption01 hover:bg-blue-40 mx-auto rounded-full px-6 py-3 text-white transition-all'
        >
          공지사항 전체보기
        </Link>
      </div>
    </SectionSlide>,

    <SectionSlide key='schedule' title='학사일정' backgroundColor='bg-blue-05'>
      <div className='flex flex-col gap-4'>
        <AcademicScheduleWidget />
        <Link
          to='/academic-calendar'
          className='bg-blue-35 text-caption01 hover:bg-blue-40 mx-auto rounded-full px-6 py-3 text-white transition-all'
        >
          학사일정 전체보기
        </Link>
      </div>
    </SectionSlide>,

    <SectionSlide key='board' title='게시판' backgroundColor='bg-white'>
      <div className='flex flex-col gap-4'>
        <BoardSection />
        <Link
          to='/board'
          className='bg-blue-35 text-caption01 hover:bg-blue-40 mx-auto rounded-full px-6 py-3 text-white transition-all'
        >
          게시판 전체보기
        </Link>
      </div>
    </SectionSlide>,

    <SectionSlide key='news' title='명대신문' backgroundColor='bg-blue-05'>
      <div className='flex flex-col gap-4'>
        <NewsSection />
        <Link
          to='/news'
          className='bg-blue-35 text-caption01 hover:bg-blue-40 mx-auto rounded-full px-6 py-3 text-white transition-all'
        >
          명대신문 전체보기
        </Link>
      </div>
    </SectionSlide>,

    <SectionSlide key='broadcast' title='명대뉴스' backgroundColor='bg-white'>
      <div className='flex flex-col gap-4'>
        <BroadcastSection />
        <Link
          to='/broadcast'
          className='bg-blue-35 text-caption01 hover:bg-blue-40 mx-auto rounded-full px-6 py-3 text-white transition-all'
        >
          명대뉴스 전체보기
        </Link>
      </div>
    </SectionSlide>,
  ];

  return (
    <div className='w-full'>
      {/* 첫 화면: White(MainCarousel) + Grey(Banner) = 한 뷰포트, Footer는 스크롤 이후 노출 */}
      <section className='h-[calc(100svh-3.5rem)] w-full overflow-hidden'>
        <div className='flex h-full min-h-0 flex-col'>
          {/* White: MainCarousel 영역 (인디케이터는 이 영역 맨 아래에 absolute 고정) */}
          <div className='min-h-[420px] flex-1 overflow-y-auto bg-white'>
            <MainCarousel slides={mobileSlides} />
          </div>

          {/* Grey: AdBanner 영역 (항상 첫 화면 하단에 고정, 양옆 여백 없이 전체 폭 사용) */}
          <div className='w-full shrink-0'>
            <AdBannerSection />
          </div>
        </div>
      </section>

      {/* Blue: Footer 영역 (첫 화면 아래에서 스크롤 시 노출) */}
      <Footer />
    </div>
  );
}
