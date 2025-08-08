type Props = {
  currentPage: number; // 0-based
  totalPages: number; // 전체 페이지 수
  onChange: (page: number) => void;
  window?: number; // 가운데에 보여줄 점 개수(기본 5)
};

export default function Pagination({ currentPage, totalPages, onChange, window = 5 }: Props) {
  if (totalPages <= 1) return null;

  const half = Math.floor(window / 2);
  let start = Math.max(0, currentPage - half);
  const end = Math.min(totalPages - 1, start + window - 1);
  // 좌우 균형 맞추기
  start = Math.max(0, Math.min(start, end - window + 1));

  const pages = [];
  for (let p = start; p <= end; p++) pages.push(p);

  return (
    <div className='w-full flex items-center justify-center gap-4 py-6'>
      <button
        className='text-grey-10 disabled:text-grey-20 flex items-center gap-1'
        onClick={() => onChange(currentPage - 1)}
        disabled={currentPage === 0}
        aria-label='이전'
      >
        ‹ 이전
      </button>

      <div className='flex items-center gap-3'>
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => onChange(p)}
            className={`w-2.5 h-2.5 rounded-full ${
              p === currentPage ? 'bg-blue-10' : 'bg-grey-10 hover:bg-grey-20'
            }`}
            aria-label={`${p + 1}페이지`}
          />
        ))}
      </div>

      <button
        className='text-gray-500 disabled:text-grey-20 flex items-center gap-1'
        onClick={() => onChange(currentPage + 1)}
        disabled={currentPage >= totalPages - 1}
        aria-label='다음'
      >
        다음 ›
      </button>
    </div>
  );
}
