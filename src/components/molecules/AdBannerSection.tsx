import { useEffect, useState } from 'react';

export default function AdBannerSection() {
  const banners = ['/main/adBanner.svg', '/main/adBanner2.svg'];
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [banners.length]);

  return (
    <div className='w-full overflow-hidden'>
      <div
        className='flex transition-transform duration-500 ease-out'
        style={{ transform: `translateX(-${activeIndex * 100}%)` }}
      >
        {banners.map((src) => (
          <div key={src} className='min-w-full shrink-0'>
            <img src={src} alt='광고 배너' className='h-auto w-full' />
          </div>
        ))}
      </div>
    </div>
  );
}
