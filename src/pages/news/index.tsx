import { useState, useEffect } from 'react';
import SearchBar from '../../components/molecules/common/SearchBar';
import Pagination from '../../components/molecules/common/Pagination';
import CategoryFilter from '../../components/molecules/common/CategoryFilter';
import { NewsCategory } from '../../constants/news';
import { fetchNewsInfo } from '../../api/news';
import type { NewsInfo } from '../../types/news/newsInfo';
import NewsCard from './NewsCard';
import SkeletonCard from './SkeletonCard';
const ITEMS_PER_PAGE = 8;

const News: React.FC = () => {
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [newsList, setNewsList] = useState<NewsInfo[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const loadNews = async () => {
    try {
      setLoading(true);
      const categoryParam = NewsCategory[selectedCategory] ?? 'REPORT';
      const data = await fetchNewsInfo(categoryParam, page - 1, ITEMS_PER_PAGE);
      setNewsList(data.data.content);
      setTotalPages(data.data.totalPages || 1);
    } catch (error) {
      console.error('[news page API 오류]', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory, page]);

  return (
    <div className='mx-auto w-full max-w-[1280px] min-h-screen px-4 pb-16 pt-6 md:px-6 lg:px-8 lg:pt-10'>
      <header className='mb-4 flex flex-col gap-3 md:mb-6 md:flex-row md:items-end md:justify-between'>
        <h1 className='text-2xl font-extrabold tracking-tight text-mju-primary md:text-3xl lg:text-4xl'>
          명대신문
        </h1>
        <div className='md:w-1/2 lg:w-2/5'>
          <SearchBar />
        </div>
      </header>

      <div className='sticky top-0 z-10 -mx-4 mb-4 border-grey-10 bg-white/80 px-4 py-2 backdrop-blur md:static md:z-auto md:mx-0 md:mb-6 md:border-0 md:bg-transparent md:p-0 md:backdrop-blur-0'>
        <div className='no-scrollbar -mx-2 overflow-x-auto px-2 md:overflow-visible'>
          <CategoryFilter
            categories={Object.keys(NewsCategory)}
            current={selectedCategory}
            onChange={(category) => {
              setSelectedCategory(category);
              setPage(1);
            }}
          />
        </div>
      </div>

      {/* 그리드 영역 */}
      {loading ? (
        <section
          aria-label='뉴스 로딩 중'
          className='grid grid-cols-1 gap-4 md:gap-6
                     md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
        >
          {Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </section>
      ) : newsList.length === 0 ? (
        <p className='py-24 text-center text-gray-500'>표시할 뉴스가 없습니다.</p>
      ) : (
        <section
          aria-label='뉴스 목록'
          className='grid grid-cols-1 gap-4 md:gap-6
                     md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
        >
          {newsList.map((news, idx) => (
            <NewsCard key={news.link ?? idx} news={news} index={idx} page={page} />
          ))}
        </section>
      )}

      <div className='mt-8 flex justify-center md:mt-10'>
        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      </div>
    </div>
  );
};

export default News;
