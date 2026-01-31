import { useState, useRef } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

interface MainCarouselProps {
  slides: React.ReactNode[];
}

export default function MainCarousel({ slides }: MainCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);

  const handleSlideChange = (swiper: SwiperType) => {
    setActiveIndex(swiper.activeIndex);
  };

  return (
    <div className='flex h-full w-full flex-col'>
      {/* 슬라이드 영역: 남은 높이를 채우고, 레이아웃 리사이즈에 따라 유기적으로 줄어듦 */}
      <div className='min-h-0 flex-1'>
        <Swiper
          modules={[Navigation, Pagination]}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          onSlideChange={handleSlideChange}
          spaceBetween={0}
          slidesPerView={1}
          speed={400}
          grabCursor={true}
          keyboard={{ enabled: true }}
          allowTouchMove={false}
          className='h-full w-full'
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index} className='h-full w-full'>
              {slide}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className='flex shrink-0 justify-center gap-2 py-4'>
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
