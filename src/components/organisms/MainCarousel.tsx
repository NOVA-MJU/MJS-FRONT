interface MainCarouselProps {
  slides: React.ReactNode[];
}

export default function MainCarousel({ slides }: MainCarouselProps) {
  return (
    <div className='relative h-full w-full overflow-hidden'>
      {/* 첫 번째 슬라이드만 표시 */}
      {slides[0]}

      {/* 하단 블러 그라데이션 (파란색 흐릿하게) */}
      <div className='pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-blue-100/40 to-transparent' />

      {/* 하단 UI: 슬라이드 위에 오버레이 (absolute) */}
      <div className='pointer-events-none absolute inset-x-0 bottom-8 flex flex-col gap-3 px-4'>
        {/* 말풍선 (오른쪽 정렬) - 떠오르는 애니메이션 */}
        <div className='pointer-events-auto flex justify-end'>
          <div className='relative'>
            <div className='bg-blue-35 text-caption01 rounded-full px-4 py-2 whitespace-nowrap text-white shadow-md'>
              옆으로 슬라이드
            </div>
            <div className='bg-blue-35 absolute right-6 -bottom-1 h-3 w-3 rotate-45' />
          </div>
        </div>

        {/* 화살표 좌우 */}
        <div className='pointer-events-auto flex items-center justify-between'>
          <div>
            <img src='/main/leftArrow.png' alt='이전' className='h-auto w-8' />
          </div>

          <div>
            <img src='/main/rightArrow.png' alt='다음' className='h-auto w-8' />
          </div>
        </div>
      </div>
    </div>
  );
}
