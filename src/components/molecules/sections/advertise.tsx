import { useEffect, useMemo, useRef, useState } from 'react';
import { AD_CAROUSEL_INTERVAL_MS } from '@/constants/common';

type AdCarouselProps = {
  images?: { src: string; alt?: string; href?: string; caption?: string }[];
  intervalMs?: number;
};

const DEFAULT_IMAGES = [
  {
    src: '/ad/ad1.jpg',
    alt: 'COW 중앙동아리 모집',
    href: '#',
    caption: '광고1',
  },
  {
    src: '/ad/ad2.jpg',
    alt: '밴드 공연 포스터',
    href: '#',
    caption: '광고2',
  },
];

export default function AdCarousel({
  images,
  intervalMs = AD_CAROUSEL_INTERVAL_MS,
}: AdCarouselProps) {
  const slides = useMemo(() => (images?.length ? images : DEFAULT_IMAGES), [images]);
  const [index, setIndex] = useState(0);
  const timerRef = useRef<number | null>(null);
  const hoverRef = useRef(false);

  const go = (dir: 1 | -1) => setIndex((i) => (i + dir + slides.length) % slides.length);
  const goTo = (i: number) => setIndex(i);

  useEffect(() => {
    if (hoverRef.current) return;
    timerRef.current = window.setTimeout(() => go(1), intervalMs);
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [index, intervalMs, slides.length, go]);

  return (
    <section
      className='relative aspect-[98/55] w-full rounded-xl overflow-hidden bg-white'
      aria-label='홍보 캐러셀'
      onMouseEnter={() => (hoverRef.current = true)}
      onMouseLeave={() => {
        hoverRef.current = false;
        setIndex((i) => i);
      }}
    >
      <div
        className='h-full flex transition-transform duration-500'
        style={{ transform: `translateX(-${index * 100}%)`, width: `${slides.length * 100}%` }}
      >
        {slides.map((s, i) => (
          <a
            key={i}
            href={s.href || '#'}
            className='w-full h-full shrink-0 relative group'
            aria-label={s.alt || '홍보 이미지'}
          >
            <img src={s.src} alt={s.alt || ''} className='w-full h-full object-cover' />
            {s.caption && (
              <div className='absolute bottom-0 left-0 right-0 bg-transparent text-white text-sm md:text-base px-3 py-2 backdrop-blur-sm'>
                {s.caption}
              </div>
            )}
          </a>
        ))}
      </div>

      {/* 컨트롤 */}
      <button
        className='absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white shadow p-2'
        onClick={() => go(-1)}
        aria-label='이전 슬라이드'
      >
        ‹
      </button>
      <button
        className='absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 hover:bg-white shadow p-2'
        onClick={() => go(1)}
        aria-label='다음 슬라이드'
      >
        ›
      </button>

      {/* 인디케이터 */}
      <div className='absolute bottom-2 left-0 right-0 flex justify-center gap-2'>
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-2.5 w-2.5 rounded-full border border-white transition ${
              i === index ? 'bg-white' : 'bg-white/40'
            }`}
            aria-label={`슬라이드 ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
