import { clsx, type ClassValue } from 'clsx';
import { useState, useEffect, useRef } from 'react';
import { twMerge } from 'tailwind-merge';
import AcademicScheduleWidget from '@/components/molecules/sections/academic-schedule-widget';
import BoardSection from '@/components/molecules/sections/board';
import BroadcastSection from '@/components/molecules/sections/broadcast';
import CampusMap from '@/components/molecules/sections/campus-map';
import MealSection from '@/components/molecules/sections/meal';
import NewsSection from '@/components/molecules/sections/news';
import { NoticeSlideSection } from '@/components/molecules/sections/notice';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperClass } from 'swiper';
import 'swiper/css';
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

interface TabBarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  /** 패널이 보일 때만 scrollIntoView 실행 (메인/학과 슬라이드에선 미실행) */
  isPanelVisible?: boolean;
}

const TabBar = ({ activeTab, onTabChange, isPanelVisible = true }: TabBarProps) => {
  const tabRefs = useRef<Partial<Record<TabType, HTMLButtonElement | null>>>({});

  useEffect(() => {
    if (!isPanelVisible) return;
    const el = tabRefs.current[activeTab];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    }
  }, [activeTab, isPanelVisible]);

  return (
    <div className='border-grey-10 no-scrollbar swiper-no-swiping sticky top-0 z-10 w-full overflow-x-auto scroll-smooth border-b bg-white'>
      <div className='flex h-[39px] min-w-max items-center px-5'>
        {TABS.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              ref={(el) => {
                tabRefs.current[tab] = el;
              }}
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
  <div className='bg-grey-02 flex flex-col gap-2'>
    {/* 식단 섹션 */}
    <div className='flex flex-col gap-4 bg-white py-4'>
      <MealSection all={true} />
    </div>

    {/* 공지사항 섹션 */}
    <div className='flex flex-col gap-4 bg-white py-4'>
      <NoticeSlideSection all={true} />
    </div>

    {/* 학사일정 섹션 */}
    <div className='flex flex-col gap-4 bg-white py-4'>
      <AcademicScheduleWidget all={true} />
    </div>

    {/* 게시판 섹션 */}
    <div className='flex flex-col gap-4 bg-white py-4'>
      <BoardSection all={true} />
    </div>

    {/* 명대신문 섹션 */}
    <div className='flex flex-col gap-4 bg-white pt-4'>
      <NewsSection all={true} />
    </div>

    {/* 명대뉴스 섹션 */}
    <div className='flex flex-col gap-4 bg-white py-4'>
      <BroadcastSection all={true} />
    </div>
  </div>
);

/**
 * 개별 탭 컨텐츠를 위한 공통 래퍼 컴포넌트
 */
const TabWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className='flex h-full flex-col gap-2 p-2'>{children}</div>
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
  게시판: () => <BoardSection />,
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
 * 탭 상태는 Slides 내부에서만 관리. 패널이 보일 때만 푸터/탭 스크롤 적용(IntersectionObserver).
 */
const Slides = () => {
  // 현재 활성화된 탭 상태 관리
  const [activeTab, setActiveTab] = useState<TabType>('ALL');
  const [swiper, setSwiper] = useState<SwiperClass | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const [isPanelVisible, setIsPanelVisible] = useState(false);

  // 이 패널이 뷰포트에 보일 때만 true → 메인/학과 슬라이드에선 side effect 미적용
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsPanelVisible(entry.isIntersecting),
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // 탭 변경 시 스위퍼 슬라이드 이동
  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    if (swiper) {
      const index = TABS.indexOf(tab);
      swiper.slideTo(index);
    }
  };

  // 명지도 탭 활성화 시 전역 푸터 숨기기 및 스크롤 방지
  useEffect(() => {
    const footer = document.querySelector('footer');
    if (!isPanelVisible) {
      if (footer) footer.style.display = 'block';
      document.body.style.overflow = 'auto';
      return;
    }
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
  }, [activeTab, isPanelVisible]);

  return (
    <div
      ref={rootRef}
      className={cn('flex h-[calc(100dvh-39px)] flex-col overflow-hidden bg-white')}
    >
      <TabBar activeTab={activeTab} onTabChange={handleTabChange} isPanelVisible={isPanelVisible} />

      {/* 탭 메인 컨텐츠 영역 */}
      <main className='flex-1 overflow-hidden'>
        <Swiper
          initialSlide={TABS.indexOf(activeTab)}
          onSwiper={setSwiper}
          onSlideChange={(s) => setActiveTab(TABS[s.activeIndex])}
          className='h-full w-full'
          nested={true}
          resistance={true}
          resistanceRatio={0}
        >
          {TABS.map((tab) => {
            const Content = TAB_CONTENT[tab];
            return (
              <SwiperSlide key={tab} className='h-full w-full overflow-y-auto'>
                {tab === '게시판' ? (
                  <BoardSection showWriteButton={activeTab === '게시판'} />
                ) : (
                  <Content />
                )}
              </SwiperSlide>
            );
          })}
        </Swiper>
      </main>
    </div>
  );
};

export default Slides;
