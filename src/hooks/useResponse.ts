import { useState, useEffect } from 'react';

/**
 * 화면의 brake point 를 지정하세요. 'md' 기본 값은 768입니다.
 */
const DESKTOP_MIN_WIDTH = 768;

/**
 * 사용 예제: `const { isDesktop } = useResponsive();`
 * @returns 화면의 너비가 brake point보가 큰 경우 true, 작은 경우 false를 return합니다.
 */
export const useResponsive = () => {
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= DESKTOP_MIN_WIDTH);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= DESKTOP_MIN_WIDTH);
    };

    window.addEventListener('resize', handleResize);

    // 컴포넌트가 언마운트될 때 이벤트 리스너를 정리합니다.
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return { isDesktop };
};
