import { fetchBroadcasts, type BroadcastItem } from '@/api/main/broadcast-api';
import { CardHeader } from '@/components/atoms/Card';
import { Skeleton } from '@/components/atoms/Skeleton';
import { BROADCAST_PAGE_SIZE } from '@/constants/common';
import { formatToLocalDate } from '@/utils';
import { handleError } from '@/utils/error';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import { IoIosArrowBack, IoIosArrowForward, IoMdPlay } from 'react-icons/io';
import { MdChevronRight } from 'react-icons/md';
import { Link } from 'react-router-dom';

const tabNameMap: Record<string, string> = {
  ALL: '전체',
  REPORT: '보도',
  SOCIETY: '사회',
};

type SortType = 'LATEST' | 'HOT' | 'PAST';

export default function BroadcastSection({ all = false }: { all?: boolean }) {
  const [categoryTab, setCategoryTab] = useState<string>('ALL');
  const [broadcasts, setBroadcasts] = useState<BroadcastItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortType, setSortType] = useState<SortType>('LATEST');
  const [page, setPage] = useState(0);

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
        const items = data.content ?? [];

        const toTS = (d?: string) => {
          const t = d ? Date.parse(d) : NaN;
          return Number.isNaN(t) ? 0 : t;
        };

        const sorted = [...items];
        if (sortType === 'LATEST') {
          sorted.sort((a, b) => toTS(b.publishedAt) - toTS(a.publishedAt));
        } else if (sortType === 'PAST') {
          sorted.sort((a, b) => toTS(a.publishedAt) - toTS(b.publishedAt));
        }

        if (all) setBroadcasts(sorted.slice(0, 5));
        else setBroadcasts(sorted);
      } catch (err) {
        handleError(err, '방송 정보를 불러오는 중 오류가 발생했습니다.', { showToast: false });
      } finally {
        setIsLoading(false);
      }
    })();
  }, [page, size, sortType, categoryTab]);

  const CATEGORIES = Object.entries(tabNameMap);

  return (
    <section className='flex flex-col bg-white'>
      {all && (
        <CardHeader className='px-3'>
          <h2 className='text-title03 px-2 font-bold text-black'>명대뉴스</h2>
          <Link to='/broadcast' className='text-grey-30 p-2'>
            <MdChevronRight size={24} className='text-grey-60' />
          </Link>
        </CardHeader>
      )}
      {/* 가로 스크롤 칩 메뉴 */}
      {!all && (
        <div className='no-scrollbar swiper-no-swiping flex items-center gap-2 overflow-x-auto px-5 py-4'>
          {CATEGORIES.map(([key, label]) => {
            const isSelected = categoryTab === key;
            return (
              <button
                key={key}
                onClick={() => {
                  setCategoryTab(key);
                  setPage(0);
                }}
                className={clsx(
                  'flex shrink-0 items-center justify-center rounded-full px-3 py-1.5 transition-colors',
                  isSelected
                    ? 'bg-mju-primary font-semibold text-white'
                    : 'border-grey-10 text-grey-40 border bg-white font-normal',
                )}
              >
                <span className='text-[14px] leading-tight'>{label}</span>
              </button>
            );
          })}
        </div>
      )}

      <div className='flex flex-col'>
        {/* 정렬 필터 */}
        {!all && (
          <div className='flex items-center justify-between px-5 pb-1'>
            <div className='flex items-center gap-3'>
              {[
                { label: '추천순', type: 'HOT' as SortType },
                { label: '최신순', type: 'LATEST' as SortType },
                { label: '과거순', type: 'PAST' as SortType },
              ].map((item, idx) => {
                const isActive = sortType === item.type;
                return (
                  <button
                    key={idx}
                    onClick={() => setSortType(item.type)}
                    className='flex items-center gap-1 transition-opacity active:opacity-60'
                  >
                    <div
                      className={clsx(
                        'h-[3px] w-[3px] rounded-full',
                        isActive ? 'bg-grey-80' : 'bg-grey-20',
                      )}
                    />
                    <span
                      className={clsx(
                        'text-[12px] leading-[1.5]',
                        isActive ? 'text-grey-80 font-medium' : 'text-grey-20',
                      )}
                    >
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
            <IoIosArrowForward className='text-grey-20' size={16} />
          </div>
        )}

        {/* 방송 리스트 컨텐츠 */}
        <div
          className={clsx(
            'no-scrollbar flex flex-row flex-nowrap gap-4 overflow-x-auto px-5 py-4',
            !all && 'flex-col',
          )}
        >
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
                className={clsx(
                  'border-grey-10 flex shrink-0 flex-col overflow-hidden rounded-xl border bg-white shadow-sm transition-transform active:scale-[0.98]',
                  all && 'w-[320px]',
                )}
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
                    <h3 className='text-body02 line-clamp-1 font-semibold text-black'>
                      {item.title}
                    </h3>
                    <p className='text-body05 text-grey-60 line-clamp-1 leading-tight'>
                      {item.playlistTitle || '명대뉴스'}
                    </p>
                  </div>
                  <span className='text-caption02 text-grey-40'>
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
          <div className='flex items-center justify-center gap-4 py-8'>
            <button
              disabled={page === 0}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              className='text-caption02 text-grey-20 flex items-center gap-1 disabled:opacity-30'
            >
              <IoIosArrowBack size={14} />
              이전
            </button>
            <div className='flex items-center gap-3'>
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  onClick={() => setPage(num - 1)}
                  className={clsx(
                    'flex h-6 w-6 items-center justify-center text-[12px] transition-colors',
                    page === num - 1 ? 'text-blue-10 font-semibold' : 'text-grey-20',
                  )}
                >
                  {num}
                </button>
              ))}
            </div>
            <button
              onClick={() => setPage((p) => p + 1)}
              className='text-caption02 text-grey-20 flex items-center gap-1'
            >
              다음
              <IoIosArrowForward size={14} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
