import { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import SearchBar from '../../components/atoms/SearchBar';
import Pagination from '../../components/molecules/common/Pagination';
import CategoryFilter from '../../components/molecules/common/CategoryFilter';
import { Notices } from '../../constants/notices';
import NoticeList from '../../components/organisms/CommonList';
import { fetchNotionInfo } from '../../api/main/notice-api';
import { getSearchResult, type GetSearchResultRes } from '../../api/search';
import { Typography } from '../../components/atoms/Typography';
import type { ListItemProps } from '../../components/organisms/DetailItem/idex';
import type { NoticeItem } from '../../types/notice/noticeInfo';
import GlobalErrorPage from '../error';

/**
 * 카테고리 매핑
 */
const categoryMapping: Record<string, string> = {
  전체: 'all',
  일반공지: 'general',
  학사공지: 'academic',
  장학공지: 'scholarship',
  진로공지: 'career',
  학생활동: 'activity',
  학칙개정: 'rule',
};

const ITEMS_PER_PAGE = 8;

/**
 * Notice (공지사항 페이지)
 *
 * - 검색어(keyword)가 있으면 검색 API(getSearchResult) 호출
 * - 검색어가 없으면 카테고리별 공지사항 API(fetchNotionInfo) 호출
 * - "전체" 탭 선택 시 category=all 로 모든 공지를 최신순 조회
 * - Pagination 은 0-base 로 동작 (백엔드 스펙)
 */
export default function Notice() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = searchParams.get('keyword');
  const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);
  const page = pageFromUrl > 0 ? pageFromUrl - 1 : 0;
  const [initialContent, setInitialContent] = useState('');
  const CATEGORY_LIST = useMemo(() => Notices, []);
  const [selectedCategory, setSelectedCategory] = useState(CATEGORY_LIST[0] ?? '전체');
  const [items, setItems] = useState<ListItemProps[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (keyword) setInitialContent(keyword);
  }, [keyword]);

  useEffect(() => {
    if (keyword) {
      /**
       * 검색 결과 조회
       */
      (async () => {
        try {
          setIsLoading(true);
          const res = await getSearchResult(keyword, 'NOTICE', 'relevance', page, ITEMS_PER_PAGE);
          const parsed: ListItemProps[] = res.content.map(
            (item: GetSearchResultRes, idx: number) => ({
              id: idx,
              category: item.category as
                | 'general'
                | 'academic'
                | 'scholarship'
                | 'career'
                | 'activity'
                | 'rule',
              title: item.highlightedTitle ?? '',
              content: item.highlightedContent ?? '',
              date: item.date ?? '',
              link: item.link,
              imgSrc: item.imageUrl,
              variant: 'notice',
            }),
          );
          setItems(parsed);
          setTotalPages(res.totalPages);
          setIsError(false);
        } catch (e) {
          setIsError(true);
          console.error('/src/pages/notice/index.tsx::Notice()', e);
        } finally {
          setIsLoading(false);
        }
      })();
    } else {
      /**
       * 목록 조회
       */
      (async () => {
        try {
          setIsLoading(true);
          const categoryKey = categoryMapping[selectedCategory] ?? 'general';
          const data = await fetchNotionInfo(categoryKey, undefined, page, ITEMS_PER_PAGE, 'desc');

          const parsed: ListItemProps[] = (data?.content ?? []).map(
            (item: NoticeItem, idx: number) => ({
              id: idx,
              category: item.category,
              title: item.title ?? '',
              content: '',
              date: item.date ?? '',
              link: item.link,
              variant: 'notice',
            }),
          );
          setItems(parsed);
          setTotalPages(data?.totalPages ?? 1);
          setIsError(false);
        } catch (e) {
          setIsError(true);
          console.error('/src/pages/notice/index.tsx::Notice()', e);
        } finally {
          setIsLoading(false);
        }
      })();
    }
  }, [keyword, selectedCategory, page]);

  /**
   * 페이지 변경 시 url과 함께 반영
   */
  const handlePageChange = (newPage: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', String(newPage + 1));
    setSearchParams(newParams);
  };

  if (isError) return <GlobalErrorPage />;

  return (
    <div className='w-full md:w-[1280px] flex-1 flex flex-col p-4 md:p-12 gap-6 mx-auto'>
      <Link to='/notice'>
        <Typography variant='heading01' className='text-mju-primary'>
          공지사항
        </Typography>
      </Link>
      <SearchBar domain='notice' initialContent={initialContent} />
      {!keyword && (
        <>
          <CategoryFilter
            categories={CATEGORY_LIST}
            current={selectedCategory}
            onChange={(category) => {
              setSelectedCategory(category);
              navigate('/notice');
            }}
          />
          <hr className='w-full border-blue-05 border-2' />
        </>
      )}
      <div className='flex-1 flex flex-col'>
        <NoticeList items={items} category='notice' page={page + 1} itemsPerPage={ITEMS_PER_PAGE} />
        {!isLoading && keyword && items.length === 0 && (
          <div className='flex-1 text-center content-center'>
            <Typography variant='title02'>검색 결과가 없습니다</Typography>
          </div>
        )}
      </div>
      <Pagination page={page} totalPages={totalPages} onChange={handlePageChange} />
    </div>
  );
}
