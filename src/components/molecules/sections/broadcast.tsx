import { fetchBroadCastInfo, type BroadcastItem } from '@/api/main/broadcast-api';
import { Skeleton } from '@/components/atoms/Skeleton';
import { formatToLocalDate } from '@/utils';
import { useEffect, useState } from 'react';

export default function BroadcastSection() {
  const [broadcasts, setBroadcasts] = useState<BroadcastItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const page = 0;
  const size = 9;

  /**
   * 명대방송 데이터를 불러옵니다.
   */
  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const data = await fetchBroadCastInfo(page, size);
        setBroadcasts(data.content);
      } catch (err) {
        console.error('BroadcastSection.tsx::fetch broadcast data', err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <section>
      <div className='w-full min-w-0 flex flex-col gap-3'>
        <div className='p-3 rounded-xl bg-grey-05 overflow-x-auto flex gap-3'>
          {isLoading &&
            [...Array(5)].map((_, index) => (
              <Skeleton key={index} className='w-95 h-80 bg-white flex-shrink-0' />
            ))}
          {!isLoading &&
            broadcasts.map((item, index) => (
              <div
                key={index}
                className='w-95 h-80 flex flex-col bg-white rounded-xl flex-shrink-0'
              >
                <iframe
                  className='h-54 rounded-t-xl'
                  src={`https://www.youtube.com/embed/${extractYoutubeId(item.url)}`}
                  title={item.title}
                  allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                  allowFullScreen
                />
                <div className='p-3 flex flex-col gap-2 justify-between'>
                  <h3 className='text-title02 line-clamp-1'>{item.title}</h3>
                  <p className='text-caption02 text-grey-40 text-end'>
                    {formatToLocalDate(item.publishedAt)}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}

const extractYoutubeId = (url: string): string => {
  const match = url.match(/v=([^&]+)/);
  return match ? match[1] : '';
};
