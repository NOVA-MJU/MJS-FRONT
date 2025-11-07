import { Link, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { formatToLocalDate } from '@/utils';
import { fetchBroadCastInfo, type BroadcastItem } from '@/api/main/broadcast-api';
import LoadingIndicator from '@/components/atoms/LoadingIndicator';
import Pagination from '@/components/molecules/common/Pagination';
import { useResponsive } from '@/hooks/useResponse';

/**
 *
 * @param url
 * @returns
 */
const extractYoutubeId = (url: string): string => {
  let match = url.match(/v=([^&]+)/);
  if (match) return match[1];
  match = url.match(/youtu\.be\/([^?]+)/);
  if (match) return match[1];
  return '';
};

const PAGE_SIZE = 9;

/**
 *
 */
export default function Broadcast() {
  const { id } = useParams<{ id: string }>();
  const [totalPage, setTotalPage] = useState(1);
  const [page, setPage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [contents, setContents] = useState<BroadcastItem[]>([]);
  const { isDesktop } = useResponsive();

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const res = await fetchBroadCastInfo(page, PAGE_SIZE);
        setTotalPage(res.totalPages);
        setContents(res.content);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [id, page]);

  if (isLoading) return <LoadingIndicator />;

  if (isDesktop)
    return (
      <div className='flex-1 flex flex-col gap-4 md:gap-8 p-4 md:p-8'>
        <Link to='/broadcast'>
          <h2 className='text-heading01 text-mju-primary'>명대방송</h2>
        </Link>
        <main className='flex-1 w-full'>
          <section className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6'>
            {contents.map((content) => (
              <article
                key={content.url}
                className='border rounded-md overflow-hidden bg-white shadow-sm hover:shadow transition-shadow'
              >
                <div className='w-full aspect-video relative'>
                  <iframe
                    className='w-full h-54 rounded-t-xl'
                    src={`https://www.youtube.com/embed/${extractYoutubeId(content.url)}`}
                    title={content.title}
                    allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                    allowFullScreen
                  />
                </div>
                <div className='p-3'>
                  <h2 className='text-sm md:text-base font-semibold line-clamp-2'>
                    {content.title}
                  </h2>
                  <p className='mt-1 text-xs text-gray-500'>
                    {formatToLocalDate(content.publishedAt)}
                  </p>
                </div>
              </article>
            ))}
          </section>
        </main>
        <Pagination page={page} totalPages={totalPage} onChange={setPage} />
      </div>
    );
}
