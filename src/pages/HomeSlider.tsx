import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useState, useEffect, useRef } from 'react';
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
  const isInitialJump = useRef(true);

  // 클라이언트 마운트 후 렌더링
  useEffect(() => {
    setMounted(true);
  }, []);

  // 1. 초기 로드 시: 세션에서 읽어 해당 슬라이드로 점프 (store보다 세션을 우선 사용)
  useEffect(() => {
    if (!mounted || initialized || !containerRef.current) return;
    const container = containerRef.current;
    const width = container.clientWidth;
    if (width <= 0) return;

    let initialIndex = 1;
    if (typeof window !== 'undefined') {
      const saved = window.sessionStorage.getItem('main-active-slide');
      const parsed = saved !== null ? Number(saved) : NaN;
      if (!Number.isNaN(parsed) && parsed >= 0 && parsed <= 2) {
        initialIndex = Math.round(parsed);
      }
    }

    const timer = setTimeout(() => {
      if (!containerRef.current) return;
      const c = containerRef.current;
      const w = c.clientWidth;
      if (w > 0) {
        c.scrollLeft = w * initialIndex;
        setActiveMainSlide(initialIndex);
        isInitialJump.current = false;
        setInitialized(true);
      }
    }, 30);
    return () => clearTimeout(timer);
  }, [mounted, initialized, setActiveMainSlide]);

  // activeMainSlide 변경 시 세션 스토리지에 저장 (초기화 완료 후에만, 복원 시 덮어쓰지 않도록)
  useEffect(() => {
    if (!initialized || typeof window === 'undefined') return;
    window.sessionStorage.setItem('main-active-slide', String(activeMainSlide));
  }, [activeMainSlide, initialized]);

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
      <div className='h-full min-w-full snap-center overflow-hidden'>
        <Slides />
      </div>
    </div>
  );
};

export default HomeSlider;
