import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchBroadCastInfo } from '../../../api/main/broadcast-api';
import type { BroadcastContent } from '../../../types/broadcast/broadcastInfo';

const PAGE_SIZE = 9;

const extractYoutubeId = (url: string = ''): string => {
  try {
    const u = new URL(url);
    if (u.hostname.includes('youtu.be')) return u.pathname.slice(1);
    const v = u.searchParams.get('v');
    if (v) return v;
    const m = u.pathname.match(/\/(embed|shorts)\/([^/?]+)/);
    return m ? m[2] : '';
  } catch {
    return '';
  }
};

export default function BroadcastList() {
  const [items, setItems] = useState<BroadcastContent[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await fetchBroadCastInfo(currentPage, PAGE_SIZE);
        setItems(data.content);
        setTotalPages(data.totalPages);
      } finally {
        setLoading(false);
      }
    })();
  }, [currentPage]);

  if (loading) return <div className='p-6 text-sm text-gray-500'>로딩 중...</div>;

  return (
    <main className='max-w-5xl mx-auto px-6 py-12'>
      <section className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
        {items.map((it) => {
          const vid = extractYoutubeId(it.url);
          return (
            <Link
              to={`/broadcast/${vid}`}
              key={vid}
              className='border rounded-lg overflow-hidden hover:shadow'
            >
              <img
                src={it.thumbnailUrl}
                alt={it.title}
                className='w-full aspect-video object-cover'
              />
              <div className='p-3'>
                <h3 className='text-sm font-semibold line-clamp-2'>{it.title}</h3>
                <p className='text-xs text-gray-500'>
                  {new Date(it.publishedAt).toLocaleDateString()}
                </p>
              </div>
            </Link>
          );
        })}
      </section>

      <div className='mt-8 flex justify-center gap-2'>
        <button
          className='px-3 py-1 border rounded disabled:opacity-50'
          onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
          disabled={currentPage === 0}
        >
          이전
        </button>
        <span className='px-2 text-sm'>
          {currentPage + 1} / {totalPages}
        </span>
        <button
          className='px-3 py-1 border rounded disabled:opacity-50'
          onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
          disabled={currentPage >= totalPages - 1}
        >
          다음
        </button>
      </div>
    </main>
  );
}
