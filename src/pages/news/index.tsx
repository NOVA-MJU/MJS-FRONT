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
import { NEWS_MOBILE_PAGE_SIZE, NEWS_DESKTOP_PAGE_SIZE } from '@/constants/common';
import { handleError } from '@/utils/error';

const News = () => {
  const { isDesktop } = useResponsive();
  const ITEMS_PER_PAGE = isDesktop ? NEWS_DESKTOP_PAGE_SIZE : NEWS_MOBILE_PAGE_SIZE;

  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = searchParams.get('keyword');
  const categoryParam = searchParams.get('category') ?? 'ALL';
  const pageParam = Number(searchParams.get('page') ?? '1');
  const initialPage = pageParam > 0 ? pageParam - 1 : 0;

  const translateCategory = (serverValue: string): string => {
    const entries = Object.entries(NewsCategory);
    const entry = entries.find(([, value]) => value === serverValue);
    return entry ? entry[0] : '전체';
  };
  const initialSelectedCategory = translateCategory(categoryParam);

  const [initialContent, setInitialContent] = useState('');

  useEffect(() => {
    if (!keyword) return;
    setInitialContent(keyword);
  }, [keyword]);

  const [page, setPage] = useState(initialPage);
  const [selectedCategory, setSelectedCategory] = useState(initialSelectedCategory);
  const [newsList, setNewsList] = useState<NewsInfo[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
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
          handleError(e, '검색 결과를 불러오는 중 오류가 발생했습니다.', { showToast: false });
          setIsError(true);
        }
      })();
    else
      (async () => {
        try {
          const categoryParam = NewsCategory[selectedCategory] ?? 'REPORT';
          const data = await fetchNewsInfo(categoryParam, page, ITEMS_PER_PAGE);
          setNewsList(data.data.content);
          setTotalPages(data.data.totalPages);
        } catch (e) {
          handleError(e, '뉴스를 불러오는 중 오류가 발생했습니다.', { showToast: false });
          setIsError(true);
        }
      })();
  }, [keyword, selectedCategory, page, ITEMS_PER_PAGE]);

  if (isError) return <GlobalErrorPage />;

  return (
    <div className='flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-8'>
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
            const nextParams = new URLSearchParams(searchParams);
            nextParams.set('category', NewsCategory[category] ?? 'ALL');
            nextParams.set('page', '1');
            setSearchParams(nextParams);
          }}
        />
      </div>
      <div className='flex flex-1 flex-col'>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4'>
          {newsList.map((news, index) => (
            <NewsCard key={index} news={news} />
          ))}
        </div>
        {keyword && newsList.length === 0 && (
          <div className='flex-1 content-center text-center'>
            <p className='text-title02'>검색 결과가 없습니다</p>
          </div>
        )}
      </div>
      <Pagination
        page={page}
        totalPages={totalPages}
        onChange={(newPage) => {
          setPage(newPage);
          const nextParams = new URLSearchParams(searchParams);
          nextParams.set('page', String(newPage + 1));
          setSearchParams(nextParams);
        }}
      />
    </div>
  );
};

export default News;
