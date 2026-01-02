import clsx from 'clsx';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

const Pagination = ({ page, totalPages, onChange }: PaginationProps) => {
  const visibleCount = Math.min(5, totalPages);
  const startPage = Math.floor(page / visibleCount) * visibleCount;
  return (
    <nav className='flex items-center justify-center gap-4 text-xs md:text-sm text-grey-40'>
      <button
        disabled={page === 0}
        onClick={() => {
          onChange(page - 1);
          window.scrollTo(0, 0);
        }}
        className={clsx(
          'flex items-center gap-1 rounded-lg px-3 py-2',
          'transition-colors duration-200',
          'hover:bg-grey-05 cursor-pointer',
          'disabled:opacity-50 disabled:hover:bg-transparent',
        )}
      >
        <IoIosArrowBack />
        이전
      </button>
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
            className={clsx(
              isCurrentPage ? 'text-blue-10 font-semibold text-base' : 'cursor-pointer',
            )}
            disabled={isCurrentPage}
          >
            {pageIndex + 1}
          </button>
        );
      })}
      <button
        disabled={page === totalPages - 1}
        onClick={() => {
          onChange(page + 1);
          window.scrollTo(0, 0);
        }}
        className={clsx(
          'flex items-center gap-1 rounded-lg px-3 py-2',
          'transition-colors duration-200',
          'hover:bg-grey-05 cursor-pointer',
          'disabled:opacity-50 disabled:hover:bg-transparent',
        )}
      >
        다음
        <IoIosArrowForward />
      </button>
    </nav>
  );
};

export default Pagination;
