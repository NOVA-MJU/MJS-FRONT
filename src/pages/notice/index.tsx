import { fetchNotionInfo } from '@/api/main/notice-api';
import { getSearchResult, type GetSearchResultRes } from '@/api/search';
import type { ListItemProps } from '@/components/organisms/DetailItem/idex';
import { useResponsive } from '@/hooks/useResponse';
import type { NoticeItem } from '@/types/notice/noticeInfo';
import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import GlobalErrorPage from '../error';
import SearchBar from '@/components/atoms/SearchBar';
import Pagination from '@/components/molecules/common/Pagination';
import NoticeList from '@/components/organisms/CommonList';
import { ChipTabs } from '@/components/atoms/Tabs';
import { formatToDotDate } from '@/utils';
import { HighlightedText } from '@/components/atoms/HighlightedText';

/**
 * 카테고리 매핑
 */
const categoryMap: Record<string, string> = {
  all: '전체',
  general: '일반공지',
  academic: '학사공지',
  scholarship: '장학공지',
  career: '진로공지',
  activity: '학생활동',
  rule: '학칙개정',
};

const ITEMS_PER_PAGE = 10;

export default function Notice() {
  const { isDesktop } = useResponsive();

  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = searchParams.get('keyword');
  const pageFromUrl = parseInt(searchParams.get('page') || '1', 10);
  const page = pageFromUrl > 0 ? pageFromUrl - 1 : 0;
  const [initialContent, setInitialContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
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
          const data = await fetchNotionInfo(
            selectedCategory,
            undefined,
            page,
            ITEMS_PER_PAGE,
            'desc',
          );

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

  /**
   * 오류 페이지 렌더링
   */
  if (isError) return <GlobalErrorPage />;

  /**
   * 데스크톱 페이지 렌더링
   */
  if (isDesktop)
    return (
      <div className='mx-auto flex w-[1280px] flex-1 flex-col gap-6 p-12'>
        <Link to='/notice'>
          <h2 className='text-heading01 text-mju-primary'>공지사항</h2>
        </Link>
        <SearchBar domain='notice' initialContent={initialContent} />
        {!keyword && (
          <>
            <ChipTabs
              tabs={categoryMap}
              currentTab={selectedCategory}
              setCurrentTab={setSelectedCategory}
            />
            <hr className='border-blue-05 w-full border-2' />
          </>
        )}
        <div className='flex flex-1 flex-col'>
          <NoticeList
            items={items}
            category='notice'
            page={page + 1}
            itemsPerPage={ITEMS_PER_PAGE}
          />
          {!isLoading && keyword && items.length === 0 && (
            <div className='flex-1 content-center text-center'>
              <span className='text-title02'>검색 결과가 없습니다</span>
            </div>
          )}
        </div>
        <Pagination page={page} totalPages={totalPages} onChange={handlePageChange} />
      </div>
    );

  /**
   * 모바일 페이지 렌더링
   */
  if (!isDesktop)
    return (
      <div className='flex flex-1 flex-col gap-5 p-5'>
        <div className='flex flex-col gap-3'>
          <Link to='/notice' className='w-fit'>
            <h2 className='text-title01 text-blue-35'>공지사항</h2>
          </Link>
          <SearchBar domain='notice' initialContent={initialContent} />
          {/* 검색하지 않는 경우에만 카테고리 칩 화면에 표시 */}
          {!keyword && (
            <ChipTabs
              tabs={categoryMap}
              currentTab={selectedCategory}
              setCurrentTab={setSelectedCategory}
            />
          )}
        </div>

        {/* 공지사항 데이터 표시 */}
        <div className='flex flex-1 flex-col'>
          {items.map((item, index) => {
            const isEnd = items.length - 1 === index;

            return (
              <a key={item.id} href={item.link} target='_blank' rel='noopener noreferrer'>
                <div className={`h-fit w-full p-2.5 ${!isEnd && 'border-blue-05 border-b'} `}>
                  <div className='flex flex-col gap-0.5'>
                    <span className='text-caption03 text-blue-10'>
                      {categoryMap[item.category] ?? item.category}
                    </span>
                    <HighlightedText className='text-body05 line-clamp-2 text-black'>
                      {item.title}
                    </HighlightedText>
                    {item.date && (
                      <span className='text-caption04 text-grey-20'>
                        {formatToDotDate(item.date)}
                      </span>
                    )}
                  </div>
                </div>
              </a>
            );
          })}

          {/* 검색 결과 없음 페이지 */}
          {!isLoading && keyword && items.length === 0 && (
            <div className='flex flex-1 items-center justify-center'>
              <span className='font-bold'>{keyword}</span>
              <span>{`에 대한 검색 결과가 없습니다`}</span>
            </div>
          )}
        </div>

        {/* 페이지네이션 */}
        <Pagination page={page} totalPages={totalPages} onChange={handlePageChange} />
      </div>
    );
}
