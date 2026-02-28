import { useEffect, useState } from 'react';

const BANNERS = [
  '/main/bannersJpg/JpgBanner1.jpg',
  '/main/bannersJpg/JpgBanner2.jpg',
  '/main/bannersJpg/JpgBanner3.jpg',
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
