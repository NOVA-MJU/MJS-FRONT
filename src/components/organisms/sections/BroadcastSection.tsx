import { useEffect, useState } from 'react';
import { fetchBroadCastInfo } from '../../../api/main/broadcast-api';
import type { BroadcastContent } from '../../../types/broadcast/broadcastInfo';
import { FiPlus } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const BroadcastSection = () => {
  const [broadcasts, setBroadcasts] = useState<BroadcastContent[]>([]);
  const [loading, setLoading] = useState(true);
  const navigator = useNavigate();

  const handlePlusClick = () => {
    navigator('/broadcast');
  };

  const page = 0;
  const size = 9;

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchBroadCastInfo(page, size);
        console.log('mbs 관련 data', data.data.content);
        setBroadcasts(data.data.content);
      } catch (err) {
        console.error('방송 데이터를 불러오는 데 실패했습니다.', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <section className='p-4'>
      <div className='flex justify-between'>
        <h2 className='text-xl text-mju-primary font-bold mb-4'>명대방송</h2>
        <span>
          <FiPlus onClick={handlePlusClick} size={20} />
        </span>
      </div>

      {loading ? (
        <p className='text-sm text-gray-500'>로딩 중...</p>
      ) : (
        <div className='flex gap-4 overflow-x-auto mt-4'>
          {broadcasts.map((item, index) => (
            <div key={index} className='min-w-[320px] bg-white rounded-lg shadow-sm border p-2'>
              <iframe
                className='w-full h-48 rounded'
                src={`https://www.youtube.com/embed/${extractYoutubeId(item.url)}`}
                title={item.title}
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                allowFullScreen
              ></iframe>

              <div className='mt-2 px-2'>
                <h3 className='text-sm font-semibold truncate'>{item.title}</h3>
                <p className='text-xs text-gray-500 truncate'>
                  유튜브내에 적힌 설명이 어쩌구저쩌구
                </p>
                <p className='text-[10px] text-gray-400 mt-1'>{formatDate(item.publishedAt)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default BroadcastSection;

const extractYoutubeId = (url: string): string => {
  const match = url.match(/v=([^&]+)/);
  return match ? match[1] : '';
};

const formatDate = (isoDate: string): string => {
  const date = new Date(isoDate);
  return `${date.getFullYear()}.${(date.getMonth() + 1)
    .toString()
    .padStart(2, '0')}.${date.getDate().toString().padStart(2, '0')}`;
};
