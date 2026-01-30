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

export default function Main() {
  const { isDesktop } = useResponsive();

  const ANNOUNCEMENT_TEXT = '현재 Version2 작업중입니다! -MJS 일동-';

  /**
   * 데스크톱 레이아웃
   * 기존 2열 구조 유지
   */
  if (isDesktop) {
    return (
      <div className='flex w-full flex-1 gap-6 px-7 py-12'>
        {/* 좌측 메인 컨텐츠 영역 */}
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

        {/* 우측 사이드바 영역 */}
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

  /**
   * 모바일 레이아웃 (V3 디자인)
   */
  return (
    <div className='max-h-[calc(100vh-180px)] w-full'>
      <MainCarousel
        slides={[
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
        ]}
      />
    </div>
  );
}
