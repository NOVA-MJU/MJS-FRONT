import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchBroadCastInfo } from '../../api/main/broadcast-api';
import type { BroadcastContent } from '../../types/broadcast/broadcastInfo';
import Pagination from '../../components/molecules/pagination';

const extractYoutubeId = (url: string): string => {
  let match = url.match(/v=([^&]+)/);
  if (match) return match[1];
  match = url.match(/youtu\.be\/([^?]+)/);
  if (match) return match[1];
  return '';
};

const formatDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  return `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date
    .getDate()
    .toString()
    .padStart(2, '0')}`;
};

const PAGE_SIZE = 9;

const Broadcast = () => {
  const { id } = useParams<{ id: string }>();
  const [broadcast, setBroadcast] = useState<BroadcastContent | null>(null);
  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState<string | null>(null); // ✅ 클릭 시 해당 카드만 임베드

  useEffect(() => {
    const loadBroadcast = async () => {
      try {
        setLoading(true);
        const res = await fetchBroadCastInfo(currentPage, PAGE_SIZE);
        setTotalPage(res.data.totalPages);
        setBroadcast(res.data.content);
        setPlayingId(null); // 페이지 바뀌면 재생 초기화
      } catch (err) {
        console.error('방송 데이터를 불러오는 데 실패했습니다.', err);
      } finally {
        setLoading(false);
      }
    };
    loadBroadcast();
  }, [id, currentPage]);

  if (loading) {
    return <div className='p-6 text-gray-500 text-sm'>로딩 중...</div>;
  }

  if (!broadcast || broadcast.length === 0) {
    return <div className='p-6 text-red-500 text-sm'>해당 방송을 찾을 수 없습니다.</div>;
  }

  return (
    <div className='w-full max-w-[1280px] min-h-screen flex flex-col mx-auto px-4 md:px-6 py-8'>
      <p className='text-2xl md:text-4xl font-bold text-mju-primary'>명대방송</p>

      <main className='mx-auto w-full'>
        <section className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3  gap-3 md:gap-6 mt-6'>
          {broadcast.map((item) => {
            const vid = extractYoutubeId(item.url);
            const key = vid || item.url;
            const isPlaying = playingId === vid;

            return (
              <article
                key={key}
                className='border rounded-md overflow-hidden bg-white shadow-sm hover:shadow transition-shadow'
              >
                <div className='w-full aspect-video relative'>
                  {isPlaying && vid ? (
                    <iframe
                      className='absolute inset-0 w-full h-full'
                      src={`https://www.youtube.com/embed/${vid}?autoplay=1`}
                      title={item.title}
                      allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                      allowFullScreen
                      loading='lazy'
                    />
                  ) : (
                    <button
                      type='button'
                      aria-label={`${item.title} 재생`}
                      onClick={() => vid && setPlayingId(vid)}
                      className='absolute inset-0 w-full h-full'
                    >
                      <img
                        src={vid ? `https://img.youtube.com/vi/${vid}/hqdefault.jpg` : ''}
                        alt={item.title}
                        className='w-full h-full object-cover'
                        loading='lazy'
                      />
                      {/* 플레이 버튼 오버레이 */}
                      <span className='absolute inset-0 grid place-items-center'>
                        <span className='h-14 w-14 rounded-full bg-black/60 grid place-items-center'>
                          <svg
                            width='22'
                            height='22'
                            viewBox='0 0 24 24'
                            fill='white'
                            aria-hidden='true'
                          >
                            <path d='M8 5v14l11-7z' />
                          </svg>
                        </span>
                      </span>
                    </button>
                  )}
                </div>

                <div className='p-3'>
                  <h2 className='text-sm md:text-base font-semibold line-clamp-2'>{item.title}</h2>
                  <p className='mt-1 text-xs text-gray-500'>{formatDate(item.publishedAt)}</p>
                </div>
              </article>
            );
          })}
        </section>

        <div className='mt-4 md:mt-6'>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPage}
            onChange={(p) => setCurrentPage(p)}
            window={6} // 모바일에서 더 컴팩트하게
          />
        </div>
      </main>
    </div>
  );
};

export default Broadcast;
