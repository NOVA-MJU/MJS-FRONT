type Props = {
  currentPage: number; // 0-based
  totalPages: number;
  onChange: (page: number) => void;
  window?: number;
};

/**
 * @deprecated components/molecules/common/pagination을 사용하세요
 */
export default function Pagination({ currentPage, totalPages, onChange, window = 5 }: Props) {
  if (totalPages <= 1) return null;

  const windowIndex = Math.floor(currentPage / window);
  const start = windowIndex * window;
  const end = Math.min(start + window - 1, totalPages - 1);

  const pages: number[] = [];
  for (let p = start; p <= end; p++) pages.push(p);

  const go = (p: number) => {
    if (p < 0 || p > totalPages - 1 || p === currentPage) return;
    onChange(p);
  };

  return (
    <div className='w-full flex items-center justify-center gap-4 py-6'>
      <button
        type='button'
        className='text-grey-40 disabled:text-grey-20 flex items-center gap-1'
        onClick={() => go(currentPage - 1)}
        disabled={currentPage === 0}
        aria-label='이전'
      >
        ‹ 이전
      </button>

      <div className='flex items-center gap-3'>
        {pages.map((p) => (
          <button
            type='button'
            key={p}
            onClick={() => go(p)}
            className={`w-2.5 h-2.5 rounded-full ${
              p === currentPage ? 'bg-blue-10' : 'bg-grey-10 hover:bg-grey-20'
            }`}
            aria-label={`${p + 1}페이지`}
            aria-current={p === currentPage ? 'page' : undefined}
          />
        ))}
      </div>

      <button
        type='button'
        className='text-grey-40 disabled:text-grey-20 flex items-center gap-1'
        onClick={() => go(currentPage + 1)}
        disabled={currentPage >= totalPages - 1}
        aria-label='다음'
      >
        다음 ›
      </button>
    </div>
  );
}
