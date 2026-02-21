import { fetchBroadcasts, type BroadcastItem } from '@/api/main/broadcast-api';
import { CardHeader } from '@/components/atoms/Card';
import { Skeleton } from '@/components/atoms/Skeleton';
import { BROADCAST_PAGE_SIZE } from '@/constants/common';
import { formatToLocalDate } from '@/utils';
import { handleError } from '@/utils/error';
import { useEffect, useState } from 'react';
import { IoMdPlay } from 'react-icons/io';
import { MdChevronRight } from 'react-icons/md';
import { Link } from 'react-router-dom';
import Pagination from '../common/Pagination';

export default function BroadcastSection({
  all = false,
  onSeeMoreClick,
}: {
  all?: boolean;
  /** 제공 시 더보기 클릭으로 호출(예: 슬라이드 명대뉴스 탭으로 이동), 미제공 시 /broadcast로 이동 */
  onSeeMoreClick?: () => void;
}) {
  const [broadcasts, setBroadcasts] = useState<BroadcastItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const size = BROADCAST_PAGE_SIZE;

  /**
   * 명대방송 데이터 조회
   */
  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        // 클라이언트 측 가공 혹은 API 파라미터 연동 (현재는 전체 데이터 최신순 위주)
        const data = await fetchBroadcasts(page, size);
        const items = data.content as unknown as BroadcastItem[];
        setTotalPages(data.totalPages);

        const toTS = (d?: string) => {
          const t = d ? Date.parse(d) : NaN;
          return Number.isNaN(t) ? 0 : t;
        };

        const sorted = [...items];
        sorted.sort((a, b) => toTS(b.publishedAt) - toTS(a.publishedAt));

        if (all) setBroadcasts(sorted.slice(0, 5));
        else setBroadcasts(sorted);
      } catch (err) {
        handleError(err, '방송 정보를 불러오는 중 오류가 발생했습니다.', { showToast: false });
      } finally {
        setIsLoading(false);
      }
    })();
  }, [page, size]);

  return (
    <section className='mb-4 flex flex-col bg-white'>
      {all && (
        <CardHeader className='px-3'>
          <h2 className='text-title03 px-2 font-bold text-black'>명대뉴스</h2>
          {onSeeMoreClick ? (
            <button
              type='button'
              onClick={onSeeMoreClick}
              className='text-grey-30 p-2'
              aria-label='명대뉴스 탭으로 이동'
            >
              <MdChevronRight size={24} className='text-grey-60' />
            </button>
          ) : (
            <Link to='/broadcast' className='text-grey-30 p-2'>
              <MdChevronRight size={24} className='text-grey-60' />
            </Link>
          )}
        </CardHeader>
      )}

      <div className='flex flex-col'>
        {/* 방송 리스트 컨텐츠 */}
        <div className='flex w-full flex-col gap-4 px-5 pt-4'>
          {isLoading &&
            [...Array(3)].map((_, index) => (
              <div key={index} className='flex flex-col gap-2'>
                <Skeleton className='h-[198px] rounded-t-xl' />
                <Skeleton className='h-[60px] rounded-b-xl' />
              </div>
            ))}

          {!isLoading &&
            broadcasts.map((item, index) => (
              <a
                key={index}
                href={item.url}
                target='_blank'
                rel='noopener noreferrer'
                className='border-grey-20 flex shrink-0 flex-col overflow-hidden rounded-xl border bg-white transition-transform'
              >
                {/* 썸네일 영역 */}
                <div className='relative h-[198px] w-full overflow-hidden bg-black'>
                  <img
                    src={item.thumbnailUrl || '/default-thumbnail.png'}
                    alt={item.title}
                    className='h-full w-full object-cover'
                  />
                  <div className='absolute inset-0 flex items-center justify-center bg-black/10'>
                    <div className='flex h-12 w-12 items-center justify-center rounded-full bg-red-600 text-white shadow-lg'>
                      <IoMdPlay size={24} className='ml-1' />
                    </div>
                  </div>
                </div>

                {/* 텍스트 정보 영역 */}
                <div className='flex flex-col gap-1 px-4 py-3'>
                  <div className='flex flex-col'>
                    <h3 className='text-body02 line-clamp-2 font-semibold text-black'>
                      {item.title}
                    </h3>
                  </div>
                  <span className='text-caption04 text-grey-30'>
                    {formatToLocalDate(item.publishedAt)}
                  </span>
                </div>
              </a>
            ))}

          {!isLoading && broadcasts.length === 0 && (
            <div className='flex items-center justify-center py-20'>
              <span className='text-body05 text-grey-20'>등록된 뉴스가 없습니다.</span>
            </div>
          )}
        </div>

        {/* 페이지네이션 */}
        {!isLoading && broadcasts.length > 0 && !all && (
          <div className='pb-4'>
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </div>
        )}
      </div>
    </section>
  );
}
