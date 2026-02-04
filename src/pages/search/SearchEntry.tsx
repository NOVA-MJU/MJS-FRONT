import { useEffect, useState } from 'react';
import Search from '@/pages/search';
import SearchDetailOverlay from '@/pages/search/SearchDetailOverlay';

const MOBILE_BREAKPOINT = 768;

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
    setIsMobile(media.matches);

    const listener = () => setIsMobile(media.matches);
    media.addEventListener('change', listener);
    return () => media.removeEventListener('change', listener);
  }, []);

  return isMobile;
}

/**
 * /search 라우트 진입 시 뷰포트에 따라 렌더링할 컴포넌트를 결정
 * - 모바일(768px 이하): SearchDetailOverlay
 * - 데스크톱(769px 이상): Search
 */
export default function SearchEntry() {
  const isMobile = useIsMobile();
  return isMobile ? <SearchDetailOverlay /> : <Search />;
}
