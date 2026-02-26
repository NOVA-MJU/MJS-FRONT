import { useEffect, useState } from 'react';

const BANNERS = [
  '/main/banners/Banner1.svg',
  '/main/banners/Banner2.svg',
  '/main/banners/Banner3.svg',
];

export default function AdBannerSection() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % BANNERS.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className='main-ad-banner'>
      <img
        src={BANNERS[activeIndex]}
        alt='광고 배너'
        className='main-ad-banner__image'
        fetchPriority='high'
      />
    </div>
  );
}
