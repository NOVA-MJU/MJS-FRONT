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

// 새로운 캐로셀 컴포넌트들
import MainCarousel from '@/components/organisms/MainCarousel';
import MainSearchSection from '@/components/molecules/MainSearchSection';
import SectionSlide from '@/components/molecules/SectionSlide';

/**
 * 메인 페이지
 *
 * **데스크톱**: 기존 2열 레이아웃 유지
 * - 좌측: 식단, 공지사항, 명대신문, 명대방송
 * - 우측: 프로필, 날씨, 광고, 실시간 랭킹 등
 *
 * **모바일**: 좌우 스와이프 캐로셀 방식 (V3 디자인)
 * - 슬라이드 1: 검색 메인 화면 (추천 카테고리)
 * - 슬라이드 2: 식단표
 * - 슬라이드 3: 공지사항
 * - 슬라이드 4: 학사일정
 * - 슬라이드 5: 게시판
 * - 슬라이드 6: 명대신문
 * - 슬라이드 7: 명대뉴스
 *
 * 사용자 인터랙션:
 * - 터치/마우스 드래그로 슬라이드 전환
 * - 좌우 화살표 버튼으로 이동
 * - 하단 인디케이터로 현재 위치 확인
 */
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
   * 좌우 스와이프 캐로셀 방식
   */
  return (
    <div className='max-h-[calc(100vh-180px)] w-full'>
      <MainCarousel
        slides={[
          // 슬라이드 1: 메인 검색 화면 : 최원빈 작업
          <MainSearchSection key='search' />,

          // 슬라이드 2: 식단표
          <SectionSlide key='meal' title='오늘의 식단' backgroundColor='bg-blue-05'>
            <MealSection />
          </SectionSlide>,

          // 슬라이드 3: 공지사항
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

          // 슬라이드 4: 학사일정
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

          // 슬라이드 5: 게시판
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

          // 슬라이드 6: 명대신문
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

          // 슬라이드 7: 명대뉴스
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
