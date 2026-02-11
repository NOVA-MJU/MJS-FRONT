interface MainCarouselProps {
  slides: React.ReactNode[];
}

export default function MainCarousel({ slides }: MainCarouselProps) {
  // 현재는 메인 검색 슬라이드만 사용하므로, 슬라이드 내용만 렌더링
  return <div className='h-full w-full overflow-hidden'>{slides[0]}</div>;
}
