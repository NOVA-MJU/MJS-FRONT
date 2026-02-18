import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useResponsive } from '@/hooks/useResponse';
import Main from '@/pages';
import Slides from './slides';
import DepartmentMainPage from './main/department';
import { useHeaderStore } from '@/store/useHeaderStore';

/**
 * 전역 클래스 통합 유틸리티
 */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 메인 페이지와 슬라이드 페이지를 가로 스크롤로 연결하는 컴포넌트
 * Swiper 대신 Native CSS Scroll Snap을 사용하여 초기화 이슈 해결
 */
const HomeSlider = () => {
  const { isDesktop } = useResponsive();
  const { activeMainSlide, setActiveMainSlide } = useHeaderStore();
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const location = useLocation();
  const isInitialJump = useRef(true);

  // 클라이언트 마운트 후 렌더링
  useEffect(() => {
    setMounted(true);
    setActiveMainSlide(1);
  }, [setActiveMainSlide]);

  const forceJumpToMain = () => {
    if (containerRef.current) {
      const container = containerRef.current;
      const width = container.clientWidth;
      if (width > 0) {
        // 즉시 스크롤 위치 고정 (smooth 주지 않음)
        container.scrollLeft = width * 1;
        isInitialJump.current = false;
        // 위치를 잡은 후 스냅과 가시성을 활성화
        setInitialized(true);
      }
    }
  };

  // 1. 초기 로드 시 메인 화면 점프
  useEffect(() => {
    if (mounted && !initialized) {
      // 렌더링 주기가 보장되도록 아주 짧은 지연 후 실행
      const timer = setTimeout(forceJumpToMain, 30);
      return () => clearTimeout(timer);
    }
  }, [mounted, initialized]);

  // 2. 외부 상태 변경 (로고 클릭 등) 대응
  useEffect(() => {
    if (initialized && containerRef.current && !isInitialJump.current) {
      const container = containerRef.current;
      const width = container.clientWidth;
      const targetScroll = width * activeMainSlide;

      if (Math.abs(container.scrollLeft - targetScroll) > 20) {
        container.scrollTo({ left: targetScroll, behavior: 'smooth' });
      }
    }
  }, [activeMainSlide, initialized]);

  // 3. 경로 이동 시 리셋 ('/' 인 경우)
  useEffect(() => {
    if (location.pathname === '/' && initialized) {
      // 로고 클릭 등을 통해 다시 '/'로 올 때 초기화 상태로 돌림
      setInitialized(false);
      isInitialJump.current = true;
      setActiveMainSlide(1);
    }
  }, [location.pathname, setActiveMainSlide]);

  const handleScroll = () => {
    if (!containerRef.current || !initialized || isInitialJump.current) return;
    const container = containerRef.current;
    const scrollLeft = container.scrollLeft;
    const width = container.clientWidth;

    if (width === 0) return;
    const index = Math.round(scrollLeft / width);

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
      <div className='h-full min-w-full snap-center overflow-x-hidden overflow-y-auto'>
        <Slides />
      </div>
    </div>
  );
};

export default HomeSlider;
