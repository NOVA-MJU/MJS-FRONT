import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

const Pagination = ({ page, totalPages, onChange }: PaginationProps) => {
  const visibleCount = Math.min(5, totalPages);
  const startPage = Math.floor(page / 5) * 5;

  return (
    <nav className='flex items-center justify-center gap-3 py-10' data-name='pagination'>
      {/* 이전 버튼 */}
      <button
        disabled={page === 0}
        onClick={() => {
          onChange(page - 1);
          window.scrollTo(0, 0);
        }}
        className='text-grey-30 flex items-center gap-0.5 transition-opacity active:opacity-60 disabled:opacity-30'
      >
        <IoIosArrowBack size={18} />
        <span className='text-[12px] leading-[1.5] font-normal'>이전</span>
      </button>

      {/* 페이지 번호 & 도트 */}
      <div className='flex items-center justify-center gap-[12px] px-1'>
        {Array.from({ length: visibleCount }).map((_, i) => {
          const pageIndex = startPage + i;
          const isCurrentPage = page === pageIndex;

          if (pageIndex >= totalPages) {
            return null;
          }

          return (
            <button
              key={pageIndex}
              onClick={() => onChange(pageIndex)}
              className='flex h-6 w-6 items-center justify-center transition-colors'
              disabled={isCurrentPage}
            >
              {isCurrentPage ? (
                <span className='text-blue-20 text-[12px] leading-[1.5] font-semibold'>
                  {pageIndex + 1}
                </span>
              ) : (
                <div className='bg-grey-30 h-[6px] w-[6px] rounded-full' />
              )}
            </button>
          );
        })}
      </div>

      {/* 다음 버튼 */}
      <button
        disabled={page === totalPages - 1}
        onClick={() => {
          onChange(page + 1);
          window.scrollTo(0, 0);
        }}
        className='text-grey-30 flex items-center gap-0.5 transition-opacity active:opacity-60 disabled:opacity-30'
      >
        <span className='text-[12px] leading-[1.5] font-normal'>다음</span>
        <IoIosArrowForward size={18} />
      </button>
    </nav>
  );
};

export default Pagination;
