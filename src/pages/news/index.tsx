import { useState, useEffect } from 'react';
import SearchBar from '../../components/molecules/common/SearchBar';
import Pagination from '../../components/molecules/common/Pagination';
import CategoryFilter from '../../components/molecules/common/CategoryFilter';
import { NewsCategory } from '../../constants/news';
import { fetchNewsInfo } from '../../api/news';
import NewsList from '../../components/organisms/CommonList';
import type { NewsInfo } from '../../types/news/newsInfo';

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
  }, [selectedCategory, page]);

  return (
    <div className='w-[1280px] min-h-screen flex flex-col p-12 gap-6 mx-auto'>
      <p className='text-4xl font-bold text-mju-primary'>명대신문</p>
      <SearchBar />
      <CategoryFilter
        categories={Object.keys(NewsCategory)}
        current={selectedCategory}
        onChange={(category) => {
          setSelectedCategory(category);
          setPage(1);
        }}
      />
      {loading ? (
        <p className='text-center mt-20'>로딩 중...</p>
      ) : (
        <NewsList
          items={newsList.map((news, index) => ({
            id: (page - 1) * ITEMS_PER_PAGE + index + 1,
            category: news.category,
            title: news.title,
            content: news.summary,
            date: news.date,
            link: news.link,
            imgSrc: news.imageUrl?.trim() || '/default-thumbnail.png',
            variant: 'news',
            onError: (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
              e.currentTarget.src = '/default-thumbnail.png';
            },
          }))}
          category='news'
          page={page}
          itemsPerPage={ITEMS_PER_PAGE}
        />
      )}
      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  );
};

export default News;
