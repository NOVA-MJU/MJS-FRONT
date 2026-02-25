import BroadcastSection from '@/components/molecules/sections/broadcast';
import MealSection from '@/components/molecules/sections/meal';
import NewsSection from '@/components/molecules/sections/news';
import NoticeSection from '@/components/molecules/sections/notice';
import AcademicScheduleWidget from '@/components/molecules/sections/academic-schedule-widget';
import BoardSection from '@/components/molecules/sections/board';
import { Link } from 'react-router-dom';

import MainCarousel from '@/components/organisms/MainCarousel';
import MainSearchSection from '@/components/molecules/MainSearchSection';
import SectionSlide from '@/components/molecules/SectionSlide';
import AdBannerSection from '@/components/molecules/AdBannerSection';
import Footer from '@/components/organisms/Footer';

export default function Main() {
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
      {/* 첫 화면: White(MainCarousel) + Grey(Banner) + Blue(Footer) = 한 뷰포트 */}
      <section className='h-[calc(100svh-3.5rem)] w-full overflow-hidden'>
        <div className='flex h-full min-h-0 flex-col'>
          {/* White: MainCarousel 영역 (인디케이터는 이 영역 맨 아래에 absolute 고정) */}
          <div className='min-h-0 flex-1 overflow-hidden bg-white'>
            <MainCarousel slides={mobileSlides} />
          </div>

          <div className='w-full shrink'>
            <AdBannerSection />
          </div>

          {/* Blue: Footer 영역 (항상 첫 화면 내에서 보이도록 고정 높이) */}
          <div className='shrink-0'>
            <Footer />
          </div>
        </div>
      </section>
    </div>
  );
}
