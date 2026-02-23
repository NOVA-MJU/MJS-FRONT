import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { useResponsive } from '@/hooks/useResponse';
import Main from '@/pages';
import Slides from './slides';
import DepartmentMainPage from './main/department';
import { useHeaderStore } from '@/store/useHeaderStore';

export const HOME_SLIDER_STORAGE_KEY = 'homeSliderSlide';
const STORAGE_KEY = HOME_SLIDER_STORAGE_KEY;
type SlideIndex = 0 | 1 | 2;

function getStoredSlideIndex(): SlideIndex {
  if (typeof window === 'undefined') return 1;
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (raw === '0') return 0;
  if (raw === '2') return 2;
  return 1;
}

function setStoredSlideIndex(index: SlideIndex) {
  sessionStorage.setItem(STORAGE_KEY, String(index));
}

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
  const { activeMainSlide, setActiveMainSlide } = useHeaderStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const isInitialJump = useRef(true);
  /** 마운트 시 읽은 복원 인덱스 (한 번만 사용) */
  const restoreIndexRef = useRef<SlideIndex | null>(null);

  // / 에 진입할 때마다(마운트·뒤로가기) sessionStorage 기준으로 복원할 인덱스 결정
  useEffect(() => {
    if (location.pathname !== '/') return;
    setMounted(true);
    const stored = getStoredSlideIndex();
    restoreIndexRef.current = stored;
    setActiveMainSlide(stored);
  }, [location.pathname, setActiveMainSlide]);

  const jumpToStored = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const width = container.clientWidth;
    if (width <= 0) return;
    const index = restoreIndexRef.current ?? getStoredSlideIndex();
    restoreIndexRef.current = null;
    container.scrollLeft = width * index;
    setActiveMainSlide(index);
    isInitialJump.current = false;
    setInitialized(true);
  }, [setActiveMainSlide]);

  // 1. 초기 로드 시 저장된 슬라이드로 점프
  useEffect(() => {
    if (!mounted || initialized) return;
    const timer = setTimeout(jumpToStored, 50);
    return () => clearTimeout(timer);
  }, [mounted, initialized, jumpToStored]);

  // 2. bfcache(뒤로가기로 페이지 복원) 시 스크롤 복원
  useEffect(() => {
    const onPageShow = (e: PageTransitionEvent) => {
      if (!e.persisted || location.pathname !== '/') return;
      const container = containerRef.current;
      if (!container || !initialized) return;
      const stored = getStoredSlideIndex();
      const width = container.clientWidth;
      if (width > 0) {
        container.scrollLeft = width * stored;
        setActiveMainSlide(stored);
      }
    };
    window.addEventListener('pageshow', onPageShow);
    return () => window.removeEventListener('pageshow', onPageShow);
  }, [location.pathname, initialized, setActiveMainSlide]);

  // 3. 슬라이드가 바뀔 때마다 sessionStorage에 저장 (스와이프·헤더 클릭 모두)
  useEffect(() => {
    if (!initialized) return;
    setStoredSlideIndex(activeMainSlide as SlideIndex);
  }, [activeMainSlide, initialized]);

  // 4. 외부 상태 변경 (로고 클릭 등) 대응
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
        'no-scrollbar flex h-full w-full overflow-x-auto overflow-y-hidden transition-opacity duration-300',
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
