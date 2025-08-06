import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchBroadCastInfo } from '../../api/main/broadcast-api';
import type { BroadcastContent } from '../../types/broadcast/broadcastInfo';

const Broadcast = () => {
  const { id } = useParams<{ id: string }>();
  const [broadcast, setBroadcast] = useState<BroadcastContent | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBroadcast = async () => {
      try {
        const data = await fetchBroadCastInfo(0, 100); // 모든 데이터 중 id로 찾음
        const found = data.data.content.find((item) => item.id?.toString() === id);
        setBroadcast(found || null);
      } catch (err) {
        console.error('방송 데이터를 불러오는 데 실패했습니다.', err);
      } finally {
        setLoading(false);
      }
    };

    loadBroadcast();
  }, [id]);

  if (loading) {
    return <div className='p-6 text-gray-500 text-sm'>로딩 중...</div>;
  }

  if (!broadcast) {
    return <div className='p-6 text-red-500 text-sm'>해당 방송을 찾을 수 없습니다.</div>;
  }

  return (
    <main className='max-w-3xl mx-auto px-6 py-12'>
      <section className='space-y-6'>
        <h1 className='text-2xl font-bold text-mju-primary'>{broadcast.title}</h1>

        <iframe
          className='w-full aspect-video rounded-md'
          src={`https://www.youtube.com/embed/${extractYoutubeId(broadcast.url)}`}
          title={broadcast.title}
          allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
          allowFullScreen
        />

        <p className='text-sm text-gray-500'>{formatDate(broadcast.publishedAt)}</p>

        <div className='mt-4 text-sm text-gray-700 leading-relaxed'>
          유튜브 내에 적힌 설명이 어쩌구저쩌구 들어갑니다. (실제 설명이 있으면 여기에 넣을 수 있음)
        </div>
      </section>
    </main>
  );
};

export default Broadcast;

const extractYoutubeId = (url: string): string => {
  const match = url.match(/v=([^&]+)/);
  return match ? match[1] : '';
};

// 날짜 포맷
const formatDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  return `${date.getFullYear()}.${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')}`;
};
