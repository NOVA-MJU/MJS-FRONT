import { useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

// Swiper 스타일 import
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

/**
 * 메인 캐로셀 Props
 */
interface MainCarouselProps {
  /** 각 슬라이드에 표시될 컴포넌트들 */
  slides: React.ReactNode[];
}

/**
 * 메인 페이지 캐로셀 컨테이너
 *
 * 좌우 스와이프로 전환되는 메인 캐로셀입니다.
 *
 * 주요 기능:
 * - 터치/마우스 드래그로 슬라이드 전환
 * - 좌우 네비게이션 버튼
 * - 하단 페이지네이션 인디케이터
 * - 키보드 방향키 지원
 * - 첫/마지막 슬라이드에서 순환 방지
 *
 * 사용된 라이브러리:
 * - Swiper.js: 모바일 친화적인 터치 슬라이더
 *
 * @example
 * <MainCarousel slides={[
 *   <MainSearchSection />,
 *   <SectionSlide title="공지사항"><NoticeSection /></SectionSlide>,
 *   <SectionSlide title="식단"><MealSection /></SectionSlide>,
 * ]} />
 */
export default function MainCarousel({ slides }: MainCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);

  /**
   * 슬라이드 변경 이벤트 핸들러
   */
  const handleSlideChange = (swiper: SwiperType) => {
    setActiveIndex(swiper.activeIndex);
  };

  return (
    <div className='relative h-full w-full'>
      {/* Swiper 캐로셀 */}
      <Swiper
        modules={[Navigation, Pagination]}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        onSlideChange={handleSlideChange}
        spaceBetween={0}
        slidesPerView={1}
        speed={400}
        grabCursor={true}
        keyboard={{ enabled: true }}
        className='h-full w-full'
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index} className='h-full w-full'>
            {slide}
          </SwiperSlide>
        ))}
      </Swiper>

      {/* 페이지네이션 인디케이터 */}
      <div className='absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 gap-2'>
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => swiperRef.current?.slideTo(index)}
            className={`h-2 rounded-full transition-all ${
              index === activeIndex ? 'bg-blue-35 w-8' : 'bg-grey-20 hover:bg-grey-30 w-2'
            }`}
            aria-label={`${index + 1}번 슬라이드로 이동`}
          />
        ))}
      </div>
    </div>
  );
}
