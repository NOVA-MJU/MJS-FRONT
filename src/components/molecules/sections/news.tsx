import { useEffect, useState } from 'react';
import { fetchNewsInfo } from '../../../api/news';
import type { NewsInfo } from '../../../types/news/newsInfo';
import { Link } from 'react-router-dom';
import { IoIosArrowForward } from 'react-icons/io';
import Tab from '../../atoms/Tab';
import Divider from '../../atoms/Divider';
import { Skeleton } from '@/components/atoms/Skeleton';
import React from 'react';

const tabNameMap: Record<string, string> = {
  보도: 'REPORT',
  사회: 'SOCIETY',
};

export default function NewsSection() {
  const [categoryTab, setCategoryTab] = useState<string>('REPORT');
  const [fetchedNews, setFetchedNews] = useState<NewsInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
        console.error('NewsSection.tsx::fetch news data', e);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [categoryTab]);

  return (
    <section className='flex flex-col gap-3'>
      <div className='px-3 flex justify-between items-center'>
        <h2 className='text-heading02 text-mju-primary'>명대신문</h2>
        <Link to='/news'>
          <IoIosArrowForward className='text-blue-10' size={20} />
        </Link>
      </div>
      <div className='px-3'>
        <Tab tabs={tabNameMap} currentTab={categoryTab} setCurrentTab={setCategoryTab} />
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
}
