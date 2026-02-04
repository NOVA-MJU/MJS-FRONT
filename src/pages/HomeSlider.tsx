import { useResponsive } from '@/hooks/useResponse';
import Main from '@/pages';
import Slides from './slides';

/**
 * 메인 페이지와 슬라이드 페이지를 가로 스크롤로 연결하는 스위퍼 컴포넌트
 */
const HomeSlider = () => {
  const { isDesktop } = useResponsive();

  // 데스크톱에서는 슬라이드 기능 없이 각각의 페이지로 작동하게 할 수도 있지만
  // 모바일 중심의 기능이므로 모바일에서만 활성화하거나 구조를 맞춥니다.
  if (isDesktop) {
    return <Main />;
  }

  return (
    <div className='no-scrollbar flex h-full w-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden scroll-smooth'>
      {/* 1. 메인 홈 화면 */}
      <section className='content-scroll h-full w-full shrink-0 snap-center overflow-x-hidden overflow-y-auto'>
        <Main />
      </section>

      {/* 2. 명지도/공지 등 슬라이드 페이지 */}
      <section className='content-scroll h-full w-full shrink-0 snap-center overflow-x-hidden overflow-y-auto'>
        <Slides />
      </section>
    </div>
  );
};

export default HomeSlider;
