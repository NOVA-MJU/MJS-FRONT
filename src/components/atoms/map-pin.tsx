import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface MapPinProps {
  /** 핀의 크기 및 형태: 'large' (물방울형), 'small' (원형) */
  size?: 'large' | 'small';
  /** 핀의 내용 타입: 'number' (숫자), 'icon' (아이콘), 'default' (빈 원/모양) */
  variant?: 'number' | 'icon' | 'default';
  /** 노출할 숫자나 텍스트 */
  value?: string | number;
  /** 추가 스타일 클래스 */
  className?: string;
  /** 클릭 핸들러 */
  onClick?: () => void;
}

/**
 * 지도 위에 노출되는 핀 컴포넌트 (4가지 스타일 지원)
 */
export const MapPin = ({
  size = 'large',
  variant = 'default',
  value,
  className,
  onClick,
}: MapPinProps) => {
  if (size === 'large') {
    return (
      <button
        onClick={onClick}
        className={cn(
          'relative flex h-[50px] w-[37px] items-start justify-center transition-transform active:scale-95',
          className,
        )}
      >
        {/* 물방울 모양 배경 SVG */}
        <svg
          width='37'
          height='50'
          viewBox='0 0 37 50'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          className='absolute inset-0'
        >
          <path
            fillRule='evenodd'
            clipRule='evenodd'
            d='M18.5 50C18.5 50 37 34.0244 37 18.2927C37 8.18987 28.7173 0 18.5 0C8.28273 0 0 8.18987 0 18.2927C0 34.0244 18.5 50 18.5 50Z'
            fill='#2587FF'
          />
          {variant === 'default' && <circle cx='18.5' cy='18' r='7.5' fill='white' />}
        </svg>

        {/* 숫자 노출 영역 */}
        {variant === 'number' && (
          <span className='z-10 mt-[8px] flex h-5 w-5 items-center justify-center text-[16px] leading-none font-semibold text-white'>
            {value}
          </span>
        )}
      </button>
    );
  }

  // Small (원형) 타입
  return (
    <button
      onClick={onClick}
      className={cn(
        'bg-blue-35 flex h-6 w-6 items-center justify-center rounded-full shadow-sm transition-transform active:scale-95',
        className,
      )}
    >
      {variant === 'number' && (
        <span className='text-[11px] leading-none font-semibold text-white'>{value}</span>
      )}
      {variant === 'icon' && <img src='/assets/sign-icon.svg' alt='출입구' className='h-4 w-4' />}
    </button>
  );
};
