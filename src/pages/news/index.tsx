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
  /**
   * search parameter를 이용해서 검색 키워드 초기값을 불러옵니다
   * setter 를 추가하여, 카테고리가 바뀌면 url에 쿼리가 찍히도록 합니다.
   */
  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = searchParams.get('keyword');
  const [initialContent, setInitialContent] = useState('');

  /**
   * 서버에서 내려온 카테고리 값을 탭 이름(한글)으로 변환합니다.
   */
  const translateCategory = (serverValue: string): string => {
    const entries = Object.entries(NewsCategory);
    const entry = entries.find((entryItem) => {
      const value = entryItem[1];
      return value === serverValue;
    });

    if (entry) {
      const key = entry[0]; //한국어 탭 이름
      return key;
    }
    return '전체';
  };

  const categoryParam = searchParams.get('category') ?? 'ALL';
  const initialSelectedCategory = translateCategory(categoryParam);
  const pageParam = Number(searchParams.get('page') ?? '1');
  const initialPage = pageParam > 0 ? pageParam - 1 : 0;

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
        handleError(e, '검색 중 오류가 발생했습니다.', { showToast: false });
      }
    })();
  }, [keyword]);

  const [page, setPage] = useState(initialPage);
  const [selectedCategory, setSelectedCategory] = useState(initialSelectedCategory);
  const [newsList, setNewsList] = useState<NewsInfo[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isError, setIsError] = useState(false);
  const { isDesktop } = useResponsive();
  const ITEMS_PER_PAGE = isDesktop ? NEWS_DESKTOP_PAGE_SIZE : NEWS_MOBILE_PAGE_SIZE;

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
          handleError(e, '검색 결과를 불러오는 중 오류가 발생했습니다.', { showToast: false });
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
            const serverCategory = NewsCategory[category]; //서버 enum 값으로

            nextParams.set('category', serverCategory ?? 'ALL');
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
        {/**
         * 키워드를 입력했는데 검색 결과가 없는 경우
         */}
        {keyword && newsList.length === 0 && (
          <div className='flex-1 content-center text-center'>
            <p className='text-title02'>검색 결과가 없습니다</p>
          </div>
        )}
      </div>
      <Pagination
        page={page}
        totalPages={totalPages}
        onChange={(page) => {
          setPage(page);
          const nextParams = new URLSearchParams(searchParams);
          const appPage = page + 1;
          nextParams.set('page', appPage.toString());
          setSearchParams(nextParams);
        }}
      />
    </div>
  );
};

export default News;
