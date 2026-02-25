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
    <div className='relative h-[clamp(140px,18vh,200px)] w-full overflow-hidden'>
      {banners.map((src, index) => (
        <img
          key={src}
          src={src}
          alt='광고 배너'
          className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${
            index === activeIndex ? 'opacity-100' : 'opacity-0'
          }`}
        />
      ))}
    </div>
  );
}
