import { fetchNewsInfo } from '@/api/news';
import Divider from '@/components/atoms/Divider';
import { Skeleton } from '@/components/atoms/Skeleton';
import { Tabs } from '@/components/atoms/Tabs';
import { useResponsive } from '@/hooks/useResponse';
import type { NewsInfo } from '@/types/news/newsInfo';
import { formatToLocalDate } from '@/utils';
import React from 'react';
import { useEffect, useState } from 'react';
import { IoIosArrowForward } from 'react-icons/io';
import { Link } from 'react-router-dom';

const tabNameMap: Record<string, string> = {
  REPORT: '보도',
  SOCIETY: '사회',
};

export default function NewsSection() {
  const [categoryTab, setCategoryTab] = useState<string>('REPORT');
  const [fetchedNews, setFetchedNews] = useState<NewsInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isDesktop } = useResponsive();

  /**
   * 뉴스 데이터 조회
   */
  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        const response = await fetchNewsInfo(categoryTab);
        const items = response.data.content ?? [];
        const toTS = (d?: string) => {
          const t = d ? Date.parse(d) : NaN;
          return Number.isNaN(t) ? 0 : t;
        };
        const sorted = [...items].sort((a: NewsInfo, b: NewsInfo) => toTS(b.date) - toTS(a.date));
        setFetchedNews(sorted);
      } catch (e) {
        handleError(e, '뉴스를 불러오는 중 오류가 발생했습니다.', { showToast: false });
      } finally {
        setIsLoading(false);
      }
    })();
  }, [categoryTab]);

  if (isDesktop)
    return (
      <section className='flex flex-col gap-3'>
        <div className='px-3 flex justify-between items-center'>
          <h2 className='text-heading02 text-mju-primary'>명대신문</h2>
          <Link to='/news'>
            <IoIosArrowForward className='text-blue-10' size={ICON_SIZE_LG} />
          </Link>
        </div>
        <div className='px-3'>
          <Tabs tabs={tabNameMap} currentTab={categoryTab} setCurrentTab={setCategoryTab} />
        </div>
        <div className='p-3 flex flex-col gap-3 rounded-xl border-2 border-grey-05'>
          {isLoading &&
            [...Array(5)].map((_, index) => (
              <React.Fragment key={index}>
                <Skeleton className='h-40' />
                {index < 4 && <Divider variant='thin' />}
              </React.Fragment>
            ))}
          {!isLoading &&
            fetchedNews.slice(0, 5).map((news, index) => (
              <React.Fragment key={index}>
                <a
                  href={news.link}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='w-full p-3 flex gap-6 rounded-xl cursor-pointer hover:bg-blue-05 transition'
                >
                  <img
                    src={news.imageUrl?.trim() || '/default-thumbnail.png'}
                    alt={news.title}
                    className='w-46 h-34 object-cover rounded-xl'
                    onError={(e) => {
                      e.currentTarget.src = '/default-thumbnail.png';
                    }}
                  />
                  <div className='flex-1 flex flex-col gap-3 justify-center'>
                    <h2 className='text-title02 text-black line-clamp-1'>{news.title}</h2>
                    <p className='text-body03 text-black line-clamp-3'>{news.summary}</p>
                  </div>
                </a>
                {index < 4 && <Divider variant='thin' />}
              </React.Fragment>
            ))}
        </div>
      </section>
    );

  if (!isDesktop)
    return (
      <section>
        <div className='flex flex-col gap-4'>
          <Tabs tabs={tabNameMap} currentTab={categoryTab} setCurrentTab={setCategoryTab} />
          <div className='flex flex-col gap-2'>
            {isLoading &&
              [...Array(5)].map((_, index) => <Skeleton key={index} className='h-32' />)}
            {!isLoading &&
              fetchedNews.slice(0, 5).map((news, index) => (
                <a
                  key={index}
                  href={news.link}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='w-full h-32 px-2.5 py-4 flex gap-2.5 rounded-sm border-1 border-blue-05 hover:bg-blue-05 cursor-pointer transition hover:duration-0'
                >
                  <img
                    src={news.imageUrl?.trim() || '/default-thumbnail.png'}
                    alt={news.title}
                    className='w-26 h-26 object-cover rounded-sm border-1 border-grey-10'
                    onError={(e) => {
                      e.currentTarget.src = '/default-thumbnail.png';
                    }}
                  />
                  <div className='flex-1 flex flex-col gap-2'>
                    <div className='flex-1 flex flex-col gap-1'>
                      <h3 className='text-body04 line-clamp-1'>{news.title}</h3>
                      <p className='text-caption01 text-grey-40 line-clamp-2'>{news.summary}</p>
                    </div>
                    <div className='flex flex-col gap-0.5'>
                      <p className='text-caption03 text-grey-20'>{news.reporter}</p>
                      <p className='text-caption03 text-grey-10'>{formatToLocalDate(news.date)}</p>
                    </div>
                  </div>
                </a>
              ))}
          </div>
        </div>
      </section>
    );
}
