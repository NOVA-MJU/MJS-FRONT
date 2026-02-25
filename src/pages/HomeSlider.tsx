import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useResponsive } from '@/hooks/useResponse';
import Main from '@/pages';
import Slides from './slides';
import DepartmentMainPage from './main/department';
import { useHeaderStore } from '@/store/useHeaderStore';

export const HOME_SLIDER_STORAGE_KEY = 'homeSliderSlide';
// const STORAGE_KEY = HOME_SLIDER_STORAGE_KEY;
type SlideIndex = 0 | 1 | 2;

// function getStoredSlideIndex(): SlideIndex {
//   if (typeof window === 'undefined') return 1;
//   const raw = sessionStorage.getItem(STORAGE_KEY);
//   if (raw === '0') return 0;
//   if (raw === '2') return 2;
//   return 1;
// }

// function setStoredSlideIndex(index: SlideIndex) {
//   try {
//     sessionStorage.setItem(STORAGE_KEY, String(index));
//   } catch {
//     // ignore
//   }
// }

/** 로고 클릭 시 호출 → 무조건 메인(1)으로 가도록 저장 */
export function setHomeSliderToMain() {
  sessionStorage.setItem(HOME_SLIDER_STORAGE_KEY, '1');
}

/**
 * 전역 클래스 통합 유틸리티
 */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 메인 페이지와 슬라이드 페이지를 가로 스크롤로 연결
 * 뒤로가기로 / 에 돌아오면 sessionStorage에 저장된 슬라이드(학과/메인/슬라이드)로 복원
 */
const HomeSlider = () => {
  const location = useLocation();
  const { isDesktop } = useResponsive();
  const { activeMainSlide, setActiveMainSlide, setSelectedTab } = useHeaderStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const isInitialJump = useRef(true);
  /** 마운트 시 읽은 복원 인덱스 (한 번만 사용) */
  // const restoreIndexRef = useRef<SlideIndex | null>(null);

  // / 에 진입할 때마다(마운트·뒤로가기) sessionStorage 기준으로 복원할 인덱스 결정
  useEffect(() => {
    if (location.pathname !== '/') return;
    setMounted(true);
  }, [location.pathname]);

  useEffect(() => {
    if (!mounted || initialized || !containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    if (width <= 0) return;

    let initialIndex = 1;
    let initialTab: string | null = null;

    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const tabParam = searchParams.get('tab');

      if (tabParam) {
        if (tabParam === 'department') {
          initialIndex = 0;
        } else {
          initialIndex = 2;
          // URL 파라미터와 실제 앱 내 탭 이름 매핑
          const tabMap: Record<string, string> = {
            map: '명지도',
            notice: '공지사항',
            schedule: '학사일정',
            calendar: '학사일정',
            meal: '학식',
            board: '게시판',
            news: '명대신문',
            broadcast: '명대뉴스',
          };
          initialTab = tabMap[tabParam] || tabParam;
        }
      } else {
        const saved = window.sessionStorage.getItem('main-active-slide');
        const parsed = saved !== null ? Number(saved) : NaN;
        if (!Number.isNaN(parsed) && parsed >= 0 && parsed <= 2) {
          initialIndex = Math.round(parsed);
        }
      }
    }

    const timer = setTimeout(() => {
      if (!containerRef.current) return;
      const c = containerRef.current;
      const w = c.clientWidth;
      if (w > 0) {
        c.scrollLeft = w * initialIndex;
        setActiveMainSlide(initialIndex);
        if (initialTab) {
          setSelectedTab(initialTab);
        }
        isInitialJump.current = false;
        setInitialized(true);
      }
    }, 30);
    return () => clearTimeout(timer);
  }, [mounted, initialized, setActiveMainSlide, setSelectedTab]);

  useEffect(() => {
    if (!initialized || typeof window === 'undefined') return;
    window.sessionStorage.setItem('main-active-slide', String(activeMainSlide));
  }, [activeMainSlide, initialized]);

  useEffect(() => {
    if (!initialized || !containerRef.current || isInitialJump.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    const targetScroll = width * activeMainSlide;
    if (Math.abs(container.scrollLeft - targetScroll) > 20) {
      container.scrollTo({ left: targetScroll, behavior: 'smooth' });
    }
  }, [activeMainSlide, initialized]);

  const handleScroll = () => {
    if (!containerRef.current || !initialized || isInitialJump.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    if (width === 0) return;
    const index = Math.round(container.scrollLeft / width) as SlideIndex;
    if (index !== activeMainSlide) {
      setActiveMainSlide(index);
    }
  };

  if (isDesktop) return <Main />;
  if (!mounted) return null;

  return (
    <div
      ref={containerRef}
      onScroll={handleScroll}
      className={cn(
        'no-scrollbar flex h-full w-full overflow-x-auto overflow-y-hidden transition-opacity duration-300 select-none',
        initialized ? 'snap-x snap-mandatory opacity-100' : 'opacity-0',
      )}
    >
      {/* Index 0: 학과 */}
      <div className='h-full min-w-full snap-center overflow-y-auto'>
        <DepartmentMainPage />
      </div>

      {/* Index 1: 메인 홈 */}
      <div className='h-full min-w-full snap-center overflow-y-auto'>
        <Main />
      </div>

      {/* Index 2: 슬라이드 */}
      <div className='h-full min-w-full snap-center overflow-hidden'>
        <Slides />
      </div>
    </div>
  );
};

export default HomeSlider;
