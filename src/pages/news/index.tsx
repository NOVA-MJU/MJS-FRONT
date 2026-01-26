import { useState, useEffect } from 'react';
import SearchBar from '../../components/atoms/SearchBar';
import Pagination from '../../components/molecules/common/Pagination';
import CategoryFilter from '../../components/molecules/common/CategoryFilter';
import { NewsCategory } from '../../constants/news';
import { fetchNewsInfo } from '../../api/news';
import type { NewsInfo } from '../../types/news/newsInfo';
import NewsCard from './NewsCard';
import { Link, useSearchParams } from 'react-router-dom';
import { getSearchResult } from '../../api/search';
import GlobalErrorPage from '../error';
import { useResponsive } from '@/hooks/useResponse';

const MOBILE_ITEMS_PER_PAGE = 5;
const DESKTOP_ITEMS_PER_PAGE = 8;

const News = () => {
  // 반응형 처리: useResponsive 훅으로 화면 크기 분기점 관리
  const { isDesktop } = useResponsive();

  /**
   * search parameter를 이용해서 검색 키워드 초기값을 불러옵니다
   */
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('keyword');
  const [initialContent, setInitialContent] = useState('');

  /**
   * 주소에 search parameter 값이 있으면 검색바에 반영합니다
   */
  useEffect(() => {
    (async () => {
      if (!keyword) return;
      setInitialContent(keyword);
      try {
        // await handleSearch(keyword);
      } catch (e) {
        console.error(e);
      }
    })();
  }, [keyword]);

  const [page, setPage] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [newsList, setNewsList] = useState<NewsInfo[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isError, setIsError] = useState(false);

  const ITEMS_PER_PAGE = isDesktop ? DESKTOP_ITEMS_PER_PAGE : MOBILE_ITEMS_PER_PAGE;

  useEffect(() => {
    /**
     * search parameter가 있는 경우 검색을 수행합니다
     */
    if (keyword)
      (async () => {
        try {
          const res = await getSearchResult(keyword, 'NEWS', 'relevance', page, ITEMS_PER_PAGE);
          const parsed: NewsInfo[] = res.content.map((item) => ({
            title: item.highlightedTitle,
            date: item.date,
            reporter: item.type,
            imageUrl: item.imageUrl,
            summary: item.highlightedContent,
            link: item.link,
            category: item.category as NewsInfo['category'],
          }));

          setNewsList(parsed);
          setTotalPages(res.totalPages);
        } catch (e) {
          console.error(e);
          setIsError(true);
        }
      })();
    /**
     * search parameter가 없는 경우 모든 결과를 출력합니다
     */ else
      (async () => {
        try {
          const categoryParam = NewsCategory[selectedCategory] ?? 'REPORT';
          const data = await fetchNewsInfo(categoryParam, page, ITEMS_PER_PAGE);
          setNewsList(data.data.content);
          setTotalPages(data.data.totalPages);
        } catch (e) {
          console.error(e);
          setIsError(true);
        }
      })();
  }, [keyword, selectedCategory, page, ITEMS_PER_PAGE]);

  if (isError) return <GlobalErrorPage />;

  return (
    <div className='flex-1 p-4 md:p-8 flex flex-col gap-4 md:gap-6'>
      <Link to='/news'>
        <p className='text-blue-35 text-heading02 md:text-heading01'>명대신문</p>
      </Link>
      <SearchBar domain='news' initialContent={initialContent} />
      <div className='no-scrollbar -mx-2 overflow-x-auto px-2 md:overflow-visible'>
        <CategoryFilter
          categories={Object.keys(NewsCategory)}
          current={selectedCategory}
          onChange={(category) => {
            setSelectedCategory(category);
            setPage(0);
          }}
        />
      </div>
      <div className='flex-1 flex flex-col'>
        <div className='grid grid-cols-1 gap-4 md:gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {newsList.map((news, index) => (
            <NewsCard key={index} news={news} />
          ))}
        </div>
        {/**
         * 키워드를 입력했는데 검색 결과가 없는 경우
         */}
        {keyword && newsList.length === 0 && (
          <div className='flex-1 text-center content-center'>
            <p className='text-title02'>검색 결과가 없습니다</p>
          </div>
        )}
      </div>
      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  );
};

export default News;
