import { fetchNewsInfo } from '@/api/news';
import { Skeleton } from '@/components/atoms/Skeleton';
import { ICON_SIZE_LG } from '@/constants/common';
import { useResponsive } from '@/hooks/useResponse';
import type { NewsInfo } from '@/types/news/newsInfo';
import { formatToLocalDate } from '@/utils';
import { handleError } from '@/utils/error';
import clsx from 'clsx';
import { useEffect, useState } from 'react';
import Pagination from '@/components/molecules/common/Pagination';
import { IoIosArrowForward } from 'react-icons/io';
import { Link } from 'react-router-dom';

const tabNameMap: Record<string, string> = {
  ALL: '전체',
  REPORT: '보도',
  SOCIETY: '사회',
};

type SortType = 'LATEST' | 'HOT' | 'PAST';

interface NewsSectionProps {
  hideSort?: boolean;
}

export default function NewsSection({ hideSort = false }: NewsSectionProps) {
  const [categoryTab, setCategoryTab] = useState<string>('ALL');
  const [fetchedNews, setFetchedNews] = useState<NewsInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortType, setSortType] = useState<SortType>('LATEST');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const { isDesktop } = useResponsive();

  /**
   * 뉴스 데이터 조회
   */
  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const response = await fetchNewsInfo(categoryTab, page, isDesktop ? 5 : 10);
        const items = response.data.content ?? [];

        // 정렬 로직 (클라이언트 측 혹은 API 연동 확인 필요 - 현재 API 파라미터에 sortBy가 없으므로 클라이언트 정렬)
        const toTS = (d?: string) => {
          const t = d ? Date.parse(d) : NaN;
          return Number.isNaN(t) ? 0 : t;
        };

        const sorted = [...items];
        if (sortType === 'LATEST') {
          sorted.sort((a, b) => toTS(b.date) - toTS(a.date));
        } else if (sortType === 'PAST') {
          sorted.sort((a, b) => toTS(a.date) - toTS(b.date));
        }
        // HOT (추천순)의 경우 NewsInfo에 likeCount 등의 필드가 없으므로 현재는 최신순과 동일하게 처리하거나 임의 가공

        setFetchedNews(sorted);
        setTotalPages(response.data.totalPages || 0);
      } catch (e) {
        handleError(e, '뉴스를 불러오는 중 오류가 발생했습니다.', { showToast: false });
      } finally {
        setIsLoading(false);
      }
    })();
  }, [categoryTab, page, sortType, isDesktop]);

  const CATEGORIES = Object.entries(tabNameMap);

  return (
    <section className='flex flex-col bg-white'>
      {/* 데스크탑 헤더 */}
      {isDesktop && (
        <div className='mb-3 flex items-center justify-between px-3'>
          <h2 className='text-heading02 text-mju-primary'>명대신문</h2>
          <Link to='/news'>
            <IoIosArrowForward className='text-blue-10' size={ICON_SIZE_LG} />
          </Link>
        </div>
      )}

      {/* 가로 스크롤 칩 메뉴 */}
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

      <div className='flex flex-col'>
        {/* 정렬 필터 */}
        {!hideSort && (
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

        {/* 뉴스 리스트 컨텐츠 */}
        <div className={clsx('flex flex-col', hideSort && 'pt-3')}>
          {isLoading &&
            [...Array(5)].map((_, index) => (
              <div key={index} className='px-5 py-4'>
                <Skeleton className='h-[130px] rounded-lg' />
              </div>
            ))}

          {!isLoading &&
            fetchedNews.map((news, index) => (
              <a
                key={index}
                href={news.link}
                target='_blank'
                rel='noopener noreferrer'
                className='border-grey-02 hover:bg-blue-05 flex items-center gap-4 border-b px-5 py-4 transition-colors'
              >
                {/* 썸네일 */}
                <div className='border-grey-10 relative h-[103px] w-[110px] shrink-0 overflow-hidden rounded-[4px] border'>
                  <img
                    src={news.imageUrl?.trim() || '/default-thumbnail.png'}
                    alt={news.title}
                    className='h-full w-full object-cover'
                    onError={(e) => {
                      e.currentTarget.src = '/default-thumbnail.png';
                    }}
                  />
                </div>

                {/* 텍스트 정보 */}
                <div className='flex flex-1 flex-col justify-between self-stretch py-1'>
                  <div className='flex flex-col gap-1'>
                    <h3 className='text-body02 line-clamp-1 font-semibold text-black'>
                      {news.title}
                    </h3>
                    <p className='text-body05 line-clamp-2 leading-tight text-black'>
                      {news.summary}
                    </p>
                  </div>
                  <div className='flex flex-col'>
                    <span className='text-caption01 text-grey-20 line-clamp-1 font-semibold'>
                      {news.reporter}
                    </span>
                    <span className='text-caption02 text-grey-10 font-normal'>
                      {formatToLocalDate(news.date)}
                    </span>
                  </div>
                </div>
              </a>
            ))}

          {!isLoading && fetchedNews.length === 0 && (
            <div className='flex items-center justify-center py-20'>
              <span className='text-body05 text-grey-20'>등록된 뉴스가 없습니다.</span>
            </div>
          )}
        </div>

        {/* 페이지네이션 */}
        {!isLoading && totalPages > 1 && (
          <div className='pb-4'>
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </div>
        )}
      </div>
    </section>
  );
}
