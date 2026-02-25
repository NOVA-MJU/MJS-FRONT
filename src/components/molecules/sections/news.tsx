import { fetchNewsInfo } from '@/api/news';
import { CardHeader } from '@/components/atoms/Card';
import { Skeleton } from '@/components/atoms/Skeleton';
import { ICON_SIZE_LG } from '@/constants/common';
import { useResponsive } from '@/hooks/useResponse';
import type { NewsInfo } from '@/types/news/newsInfo';
import { formatToLocalDate } from '@/utils';
import { handleError } from '@/utils/error';
import { useEffect, useState } from 'react';
import { IoIosArrowForward } from 'react-icons/io';
import { MdChevronRight } from 'react-icons/md';
import { Link } from 'react-router-dom';
import Pagination from '../common/Pagination';
import { ChipTabs } from '@/components/atoms/Tabs';

const tabNameMap: Record<string, string> = {
  ALL: '전체',
  REPORT: '보도',
  SOCIETY: '사회',
};

export default function NewsSection({
  all = false,
  onSeeMoreClick,
}: {
  all?: boolean;
  /** 제공 시 더보기 클릭으로 호출(예: 슬라이드 명대신문 탭으로 이동), 미제공 시 /news로 이동 */
  onSeeMoreClick?: () => void;
}) {
  const [categoryTab, setCategoryTab] = useState<string>('ALL');
  const [fetchedNews, setFetchedNews] = useState<NewsInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
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
        setTotalPages(response.data.totalPages);

        // 정렬 로직 (클라이언트 측 혹은 API 연동 확인 필요 - 현재 API 파라미터에 sortBy가 없으므로 클라이언트 정렬)
        const toTS = (d?: string) => {
          const t = d ? Date.parse(d) : NaN;
          return Number.isNaN(t) ? 0 : t;
        };

        const sorted = [...items];
        sorted.sort((a, b) => toTS(b.date) - toTS(a.date));

        if (all) setFetchedNews(sorted.slice(0, 5));
        else setFetchedNews(sorted);
      } catch (e) {
        handleError(e, '뉴스를 불러오는 중 오류가 발생했습니다.', { showToast: false });
      } finally {
        setIsLoading(false);
      }
    })();
  }, [categoryTab, page, isDesktop]);

  return (
    <section className='mb-4 flex flex-col bg-white'>
      {all && (
        <CardHeader className='px-3'>
          <h2 className='text-title03 px-2 font-bold text-black'>명대신문</h2>
          {onSeeMoreClick ? (
            <button
              type='button'
              onClick={onSeeMoreClick}
              className='text-grey-30 p-2'
              aria-label='명대신문 탭으로 이동'
            >
              <MdChevronRight size={24} className='text-grey-60' />
            </button>
          ) : (
            <Link to='/news' className='text-grey-30 p-2'>
              <MdChevronRight size={24} className='text-grey-60' />
            </Link>
          )}
        </CardHeader>
      )}
      {/* 데스크탑 헤더 */}
      {isDesktop && (
        <div className='mb-3 flex items-center justify-between px-3'>
          <h2 className='text-heading02 text-mju-primary'>명대신문</h2>
          {onSeeMoreClick ? (
            <button
              type='button'
              onClick={onSeeMoreClick}
              className='text-grey-30 p-0'
              aria-label='명대신문 탭으로 이동'
            >
              <IoIosArrowForward className='text-blue-10' size={ICON_SIZE_LG} />
            </button>
          ) : (
            <Link to='/news'>
              <IoIosArrowForward className='text-blue-10' size={ICON_SIZE_LG} />
            </Link>
          )}
        </div>
      )}

      {/* 가로 스크롤 칩 메뉴 */}
      <div className='no-scrollbar swiper-no-swiping flex items-center gap-2 overflow-x-auto px-5 py-4'>
        <ChipTabs tabs={tabNameMap} currentTab={categoryTab} setCurrentTab={setCategoryTab} />
      </div>

      <div className='flex flex-col'>
        {/* 뉴스 리스트 컨텐츠 */}
        <div className='border-grey-02 flex flex-col border-t'>
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
                    <span className='text-caption01 text-grey-30 line-clamp-1 font-semibold'>
                      {news.reporter}
                    </span>
                    <span className='text-caption04 text-grey-30 font-normal'>
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
        {!isLoading && fetchedNews.length > 0 && !all && (
          <div className='pb-4'>
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </div>
        )}
      </div>
    </section>
  );
}
