import { useResponsive } from '@/hooks/useResponse';
import Main from '@/pages';
import Slides from './slides';
import DepartmentMainPage from './main/department';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

/**
 * 메인 페이지와 슬라이드 페이지를 가로 스크롤로 연결하는 스위퍼 컴포넌트
 */
const HomeSlider = () => {
  const { isDesktop } = useResponsive();
  const slideNames = ['department', 'main', 'slides'] as const;

  // 데스크톱에서는 슬라이드 기능 없이 각각의 페이지로 작동하게 할 수도 있지만
  // 모바일 중심의 기능이므로 모바일에서만 활성화하거나 구조를 맞춥니다.
  if (isDesktop) {
    return <Main />;
  }

  return (
    <Swiper
      className='h-full w-full'
      slidesPerView={1}
      threshold={5}
      initialSlide={1}
      onSlideChange={(s) => {
        if (import.meta.env.DEV) {
          console.log('[home-slider] swipe change', {
            activeIndex: s.activeIndex,
            page: slideNames[s.activeIndex] ?? 'unknown',
          });
        }
      }}
    >
      {/* 1. 학과 페이지 (좌측 슬라이드) */}
      <SwiperSlide className='h-full w-full overflow-y-auto'>
        <DepartmentMainPage />
      </SwiperSlide>

      {/* 2. 메인 홈 화면 */}
      <SwiperSlide className='h-full w-full overflow-y-auto'>
        <Main />
      </SwiperSlide>

      {/* 3. 명지도/공지 등 슬라이드 페이지 */}
      <SwiperSlide className='h-full w-full overflow-x-hidden overflow-y-auto'>
        <Slides />
      </SwiperSlide>
    </Swiper>
  );
};

export default HomeSlider;
