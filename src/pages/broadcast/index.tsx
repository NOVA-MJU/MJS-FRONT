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
  return `${date.getFullYear()}.${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')}`;
};

const Broadcast = () => {
  const { id } = useParams<{ id: string }>();
  const [broadcast, setBroadcast] = useState<BroadcastContent | null>(null);
  const [totalPage, setTotalPage] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);

  const PAGE_SIZE = 9;

  useEffect(() => {
    const loadBroadcast = async () => {
      try {
        const broadcastInfo = await fetchBroadCastInfo(currentPage, PAGE_SIZE); // 모든 데이터 중 id로 찾음
        const fetchedTotalPages = broadcastInfo.data.totalPages;

        console.log(fetchedTotalPages);
        setTotalPage(fetchedTotalPages);
        console.log(broadcastInfo.data.content);
        setBroadcast(broadcastInfo.data.content);
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

  if (!broadcast) {
    return <div className='p-6 text-red-500 text-sm'>해당 방송을 찾을 수 없습니다.</div>;
  }

  return (
    <div className=' w-[1280px] min-h-screen flex flex-col mx-auto p-12'>
      <p className='text-4xl font-bold text-mju-primary'>명대방송</p>
      <main className='max-w-5xl mx-auto px-6 py-12'>
        <section className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
          {broadcast.map((item) => {
            const vid = extractYoutubeId(item.url);
            return (
              <article key={vid} className='border rounded-md overflow-hidden'>
                <iframe
                  className='w-full aspect-video'
                  src={`https://www.youtube.com/embed/${vid}`}
                  title={item.title}
                  allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                  allowFullScreen
                />
                <div className='p-3'>
                  <h2 className='text-sm font-semibold line-clamp-2'>{item.title}</h2>
                  <p className='text-xs text-gray-500'>{formatDate(item.publishedAt)}</p>
                </div>
              </article>
            );
          })}
        </section>
        <div className='mt-6'>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPage}
            onChange={(p) => setCurrentPage(p)}
            window={10} // 가운데 점의 갯수.
          />
        </div>
      </main>
    </div>
  );
};

export default Broadcast;
