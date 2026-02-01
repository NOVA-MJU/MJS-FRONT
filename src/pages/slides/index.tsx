import { clsx, type ClassValue } from 'clsx';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { twMerge } from 'tailwind-merge';
import { Card, CardHeader } from '@/components/atoms/Card';
import AcademicScheduleWidget from '@/components/molecules/sections/academic-schedule-widget';
import BoardSection from '@/components/molecules/sections/board';
import BroadcastSection from '@/components/molecules/sections/broadcast';
import CampusMap from '@/components/molecules/sections/campus-map';
import MealSection from '@/components/molecules/sections/meal';
import NewsSection from '@/components/molecules/sections/news';
import NoticeSection from '@/components/molecules/sections/notice';

/**
 * 전역 클래스 통합 유틸리티
 */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 8개 주요 카테고리(탭) 정의
 */
const TABS = [
  'ALL',
  '명지도',
  '공지사항',
  '학사일정',
  '학식',
  '게시판',
  '명대신문',
  '명대뉴스',
] as const;

type TabType = (typeof TABS)[number];

/**
 * 상단 탭 바 컴포넌트
 */
const TabBar = ({
  activeTab,
  onTabChange,
}: {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}) => {
  return (
    <div className='border-grey-10 no-scrollbar sticky top-0 z-10 w-full overflow-x-auto border-b bg-white'>
      <div className='flex h-[39px] min-w-max items-center px-5'>
        {TABS.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={cn(
                'relative flex h-full items-center justify-center px-3 transition-colors outline-none',
                isActive ? 'text-mju-primary font-semibold' : 'text-grey-40 font-medium',
              )}
            >
              <span className='text-body05 whitespace-nowrap'>{tab}</span>
              {/* 활성화된 탭 하단의 파란색 바 */}
              {isActive && (
                <div className='bg-mju-primary absolute right-0 bottom-0 left-0 h-[2px]' />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

/**
 * 'ALL' 탭 컨텐츠 컴포넌트
 */
const AllTab = () => (
  <div className='bg-grey-02 flex flex-col gap-2 p-2'>
    {/* 식단 섹션 */}
    <Card>
      <MealSection />
    </Card>

    {/* 공지사항 섹션 */}
    <Card>
      <CardHeader>
        <h2 className='text-title01 text-blue-35'>공지사항</h2>
        <Link to='/notice' className='text-caption01 text-grey-20'>
          더보기
        </Link>
      </CardHeader>
      <NoticeSection />
    </Card>

    {/* 학사일정 섹션 */}
    <Card>
      <CardHeader>
        <h3 className='text-title01 text-blue-35'>학사일정</h3>
        <Link to='/academic-calendar' className='text-caption01 text-grey-20'>
          더보기
        </Link>
      </CardHeader>
      <AcademicScheduleWidget />
    </Card>

    {/* 게시판 섹션 */}
    <Card>
      <CardHeader>
        <h3 className='text-title01 text-blue-35'>게시판</h3>
        <Link to='/board' className='text-caption01 text-grey-20'>
          더보기
        </Link>
      </CardHeader>
      <BoardSection />
    </Card>

    {/* 명대신문 섹션 */}
    <Card>
      <CardHeader>
        <h3 className='text-title01 text-blue-35'>명대신문</h3>
        <Link to='/news' className='text-caption01 text-grey-20'>
          더보기
        </Link>
      </CardHeader>
      <NewsSection />
    </Card>

    {/* 명대뉴스 섹션 */}
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

/**
 * 개별 탭 컨텐츠를 위한 공통 래퍼 컴포넌트
 */
const TabWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className='flex flex-col gap-2 p-2'>{children}</div>
);

/**
 * 탭 타입별 렌더링 컴포넌트 매핑 객체
 * 컴포넌트들을 미리 정의 (Lazy Loading으로 성능 최적화)
 */
const TAB_CONTENT: Record<TabType, React.ComponentType> = {
  ALL: AllTab,
  명지도: () => <CampusMap />,
  공지사항: () => (
    <TabWrapper>
      <NoticeSection />
    </TabWrapper>
  ),
  학사일정: () => (
    <div>
      <AcademicScheduleWidget />
    </div>
  ),
  학식: () => (
    <TabWrapper>
      <MealSection />
    </TabWrapper>
  ),
  게시판: () => (
    <TabWrapper>
      <BoardSection />
    </TabWrapper>
  ),
  명대신문: () => (
    <TabWrapper>
      <NewsSection />
    </TabWrapper>
  ),
  명대뉴스: () => (
    <TabWrapper>
      <BroadcastSection />
    </TabWrapper>
  ),
};

/**
 * 슬라이드 메인 페이지 컴포넌트
 */
const Slides = () => {
  // 현재 활성화된 탭 상태 관리
  const [activeTab, setActiveTab] = useState<TabType>('ALL');

  // 현재 선택된 탭에 대응하는 컴포넌트 매핑 데이터
  const ActiveContent = TAB_CONTENT[activeTab];

  // 명지도 탭 활성화 시 전역 푸터 숨기기 및 스크롤 방지
  useEffect(() => {
    const footer = document.querySelector('footer');
    if (activeTab === '명지도') {
      if (footer) footer.style.display = 'none';
      document.body.style.overflow = 'hidden';
    } else {
      if (footer) footer.style.display = 'block';
      document.body.style.overflow = 'auto';
    }
    return () => {
      if (footer) footer.style.display = 'block';
      document.body.style.overflow = 'auto';
    };
  }, [activeTab]);

  return (
    <div
      className={cn(
        'flex flex-col overflow-hidden bg-white',
        activeTab === '명지도' ? 'h-[calc(100dvh-39px)]' : 'min-h-screen',
      )}
    >
      {/* 상단 통합 탭 바 */}
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />

      {/* 탭 메인 컨텐츠 영역 */}
      <main className='flex-1 overflow-hidden'>
        <ActiveContent />
      </main>
    </div>
  );
};

export default Slides;
