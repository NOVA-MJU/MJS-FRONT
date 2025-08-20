import React from 'react';

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

/**
 * 페이지네이션 인디케이터 컴포넌트입니다.
 * @param page 현재 페이지 번호를 입력하세요. page는 0부터 시작합니다.
 * @param totalPages 마지막 페이지 번호를 입력하세요. totalPages는 1부터 시작합니다. 조회 결과가 없는 경우에도 totalPages는 반드시 1이어야합니다.
 * @param onChange setPage hook을 입력하세요.
 * @returns
 */
const Pagination: React.FC<PaginationProps> = ({ page, totalPages, onChange }) => {
  const visibleCount = 5;
  const numberIndex = page % visibleCount;
  return (
    <nav className='flex items-center justify-center gap-2 text-xs md:text-sm text-grey-40'>
      <button disabled={page === 0} onClick={() => onChange(page - 1)} className='cursor-pointer'>
        &lt; 이전
      </button>
      {Array.from({ length: visibleCount }).map((_, i) => (
        <button
          key={i}
          className={`flex items-center justify-center rounded-full
                      ${
                        i === numberIndex
                          ? 'text-blue-10 font-semibold text-base w-5 h-5'
                          : 'bg-blue-10 w-2 h-2'
                      }`}
        >
          {i === numberIndex ? page + 1 : ''}
        </button>
      ))}

      <button
        disabled={page === totalPages - 1}
        onClick={() => onChange(page + 1)}
        className='cursor-pointer'
      >
        다음 &gt;
      </button>
    </nav>
  );
};

export default Pagination;
