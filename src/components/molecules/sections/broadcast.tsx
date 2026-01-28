import { fetchBroadcasts, type BroadcastItem } from '@/api/main/broadcast-api';
import { Skeleton } from '@/components/atoms/Skeleton';
import { formatToLocalDate } from '@/utils';
import { useEffect, useState } from 'react';
import { BROADCAST_PAGE_SIZE } from '@/constants/common';
import { handleError } from '@/utils/error';

export default function BroadcastSection() {
  const [broadcasts, setBroadcasts] = useState<BroadcastItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const page = 0;
  const size = BROADCAST_PAGE_SIZE;

  /**
   * 명대방송 데이터를 불러옵니다.
   */
  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const data = await fetchBroadcasts(page, size);
        setBroadcasts(data.content);
      } catch (err) {
        handleError(err, '방송 정보를 불러오는 중 오류가 발생했습니다.', { showToast: false });
      } finally {
        setIsLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section>
      <div className='flex gap-4 overflow-x-auto'>
        {isLoading &&
          [...Array(5)].map((_, index) => (
            <Skeleton key={index} className='w-95 h-80 bg-white flex-shrink-0' />
          ))}
        {!isLoading &&
          broadcasts.map((item, index) => (
            <div key={index} className='w-60 flex flex-col gap-1 flex-shrink-0'>
              <iframe
                className='h-40 rounded-lg'
                src={`https://www.youtube.com/embed/${extractYoutubeId(item.url)}`}
                title={item.title}
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                allowFullScreen
              />
              <div className='px-4 py-2 flex flex-col rounded-lg border-1 border-grey-10 bg-white'>
                <span className='text-body04 text-black line-clamp-1'>{item.title}</span>
                {item.playlistTitle && (
                  <span className='text-caption01 text-grey-40 line-clamp-1'>
                    {item.playlistTitle}
                  </span>
                )}
                <span className='text-caption04 text-grey-40 mt-1'>
                  {formatToLocalDate(item.publishedAt)}
                </span>
              </div>
            </div>
          ))}
      </div>
    </section>
  );
}

const extractYoutubeId = (url: string): string => {
  const match = url.match(/v=([^&]+)/);
  return match ? match[1] : '';
};
