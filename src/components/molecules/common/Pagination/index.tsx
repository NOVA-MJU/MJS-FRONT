import React from 'react';

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}
const Pagination: React.FC<PaginationProps> = ({ page, totalPages, onChange }) => {
  const visibleCount = 5;
  const numberIndex = (page - 1) % visibleCount;
  return (
    <nav className='flex items-center justify-center gap-2 text-sm text-grey-40'>
      <button disabled={page === 1} onClick={() => onChange(page - 1)} className='cursor-pointer'>
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
          {i === numberIndex ? page : ''}
        </button>
      ))}

      <button
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
        className='cursor-pointer'
      >
        다음 &gt;
      </button>
    </nav>
  );
};

export default Pagination;
