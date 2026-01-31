import { fetchBroadcasts, type BroadcastItem } from '@/api/main/broadcast-api';
import { Skeleton } from '@/components/atoms/Skeleton';
import { BROADCAST_PAGE_SIZE } from '@/constants/common';
import { formatToLocalDate } from '@/utils';
import { handleError } from '@/utils/error';
import { useEffect, useState } from 'react';

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
    <section className='px-3'>
      <div className='flex flex-col gap-4'>
        {isLoading &&
          [...Array(5)].map((_, index) => (
            <Skeleton key={index} className='h-80 w-full bg-white' />
          ))}
        {!isLoading &&
          broadcasts.map((item, index) => (
            <div
              key={index}
              className='border-grey-10 flex flex-col gap-3 rounded-lg border bg-white p-4'
            >
              <iframe
                className='h-52 w-full rounded-lg'
                src={`https://www.youtube.com/embed/${extractYoutubeId(item.url)}`}
                title={item.title}
                allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                allowFullScreen
              />
              <div className='flex flex-col gap-1'>
                <span className='text-body04 line-clamp-2 text-black'>{item.title}</span>
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
