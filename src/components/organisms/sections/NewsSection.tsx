import { useEffect, useState } from 'react';
import { fetchNewsInfo } from '../../../api/news/newsApi';
import type { NewsInfo } from '../../../types/news/newsInfo';

const NewsSection = () => {
  const [categoryTab, setCategoryTab] = useState<CategoryTab>('REPORT');
  const [fetchedNews, setFetchedNews] = useState<NewsInfo[]>([]);
  type CategoryTab = 'REPORT' | 'SOCIETY';

  const categoryLabel = {
    REPORT: '보도',
    SOCIETY: '사회',
  } as const;

  useEffect(() => {
    const fetchingNews = async () => {
      try {
        const response = await fetchNewsInfo(categoryTab);
        setFetchedNews(response.data.content);
      } catch (e) {
        console.log('뉴스 가져오는데 오류 발생', e);
      }
    };
    fetchingNews();
  });
  return (
    <section className='w-full mt-5 '>
      <div className='flex justify-between'>
        <h1 className='text-xl font-bold text-mju-primary mb-4'>명대신문</h1>
        <span>더보기</span>
      </div>
      <div className='flex space-x-6 border-b border-gray-200 mb-6'>
        {(['REPORT', 'SOCIETY'] as CategoryTab[]).map((category) => (
          <button
            key={category}
            onClick={() => setCategoryTab(category)}
            className={`pb-2 w-full font-semibold ${
              categoryTab === category
                ? 'text-blue-15 border-b-2 border-b-blue-15'
                : 'text-gray-400'
            }`}
          >
            {categoryLabel[category]}
          </button>
        ))}
      </div>
      <div className='space-y-6'>
        {fetchedNews.slice(0, 5).map((news) => (
          <a
            key={news.title + news.date}
            href={news.link}
            target='_blank'
            rel='noopener noreferrer'
            className='flex gap-4 rounded-xl border border-gray-200 p-4 hover:shadow transition'
          >
            <div className='min-w-[130px] max-w-[130px] h-[100px] overflow-hidden rounded-md bg-gray-100'>
              {news.imageUrl ? (
                <img src={news.imageUrl} alt={news.title} className='w-full h-full object-cover' />
              ) : (
                <div className='w-full h-full flex items-center justify-center text-sm text-gray-400'>
                  No Image
                </div>
              )}
            </div>

            <div className='flex flex-col justify-between w-full overflow-hidden'>
              <h2 className='text-base font-semibold text-gray-900 line-clamp-1'>{news.title}</h2>
              <p className='text-sm text-gray-500 mt-2 line-clamp-2'>{news.summary}</p>
              <span className='text-xs text-gray-400 mt-1 font-bold'>
                {news.reporter} · {news.date.split('T')[0]}
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default NewsSection;
