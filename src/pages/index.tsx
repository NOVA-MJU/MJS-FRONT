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
import { useResponsive } from '@/hooks/useResponse';
import { FaBullhorn } from 'react-icons/fa';
import AcademicScheduleWidget from '@/components/molecules/sections/academic-schedule-widget';
import { Link } from 'react-router-dom';
import BoardSection from '@/components/molecules/sections/board';
import { Card, CardHeader } from '@/components/atoms/Card';

export default function Main() {
  const { isDesktop } = useResponsive();

  const ANNOUNCEMENT_TEXT = '현재 Version2 작업중입니다! -MJS 일동-';

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
          <AcademicScheduleWidget />
          <HotBoardList />
        </div>
      </div>
    );

  if (!isDesktop)
    return (
      <div className='flex-1 py-2 flex flex-col gap-2 bg-blue-05'>
        {/* 확성기 위젯 */}
        <section>
          <div className='px-5 py-1 rounded-xl bg-blue-05'>
            <div className='flex items-center gap-2 text-body04 text-[#2254F5] line-clamp-1'>
              <FaBullhorn />
              <span>{ANNOUNCEMENT_TEXT}</span>
            </div>
          </div>
        </section>

        {/* 식단표 위젯 */}
        <Card>
          <MealSection />
        </Card>

        {/* 공지사항 위젯 */}
        <Card>
          <CardHeader>
            <h2 className='text-title01 text-blue-35'>공지사항</h2>
            <Link to='/notice' className='text-caption01 text-grey-20'>
              더보기
            </Link>
          </CardHeader>
          <NoticeSection />
        </Card>

        {/* 학사일정 위젯 */}
        <Card>
          <CardHeader>
            <h3 className='text-title01 text-blue-35'>학사일정</h3>
            <Link to='/academic-calendar' className='text-caption01 text-grey-20'>
              더보기
            </Link>
          </CardHeader>
          <AcademicScheduleWidget />
        </Card>

        {/* 게시판 위젯 */}
        <Card>
          <CardHeader>
            <h3 className='text-title01 text-blue-35'>게시판</h3>
            <Link to='/board' className='text-caption01 text-grey-20'>
              더보기
            </Link>
          </CardHeader>
          <BoardSection />
        </Card>

        {/* 명대신문 위젯 */}
        <Card>
          <CardHeader>
            <h3 className='text-title01 text-blue-35'>명대신문</h3>
            <Link to='/news' className='text-caption01 text-grey-20'>
              더보기
            </Link>
          </CardHeader>
          <NewsSection />
        </Card>

        {/* 명대뉴스 위젯 */}
        <Card>
          <CardHeader>
            <h3 className='text-title01 text-blue-35'>명대뉴스</h3>
            <Link to='/broadcast' className='text-caption01 text-grey-20'>
              더보기
            </Link>
          </CardHeader>
          <BroadcastSection />
        </Card>
      </div>
    );
}
