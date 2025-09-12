import { useEffect, useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
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

/** 카테고리 매핑 */
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
const Notice: React.FC = () => {
  /** 검색  */
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('keyword');
  const [initialContent, setInitialContent] = useState('');

  /** 카테고리 */
  const CATEGORY_LIST = useMemo(() => Notices, []);
  const [selectedCategory, setSelectedCategory] = useState(CATEGORY_LIST[0] ?? '전체');

  /** 리스트 */
  const [items, setItems] = useState<ListItemProps[]>([]);

  /** 페이지  */
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  /** 검색어 변경 시 검색창 초기화 */
  useEffect(() => {
    if (keyword) setInitialContent(keyword);
  }, [keyword]);

  /** 데이터 fetch (검색 / 목록) */
  useEffect(() => {
    if (keyword) {
      // --- 검색 모드 ---
      (async () => {
        try {
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
        } catch (e) {
          console.error('검색 결과 fetch 실패:', e);
        }
      })();
    } else {
      // --- 목록 모드 ---
      (async () => {
        try {
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
        } catch (e) {
          console.error('공지사항 fetch 실패:', e);
        }
      })();
    }
  }, [keyword, selectedCategory, page]);

  return (
    <div className='w-full md:w-[1280px] flex-1 flex flex-col p-4 md:p-12 gap-6 mx-auto'>
      <Link to='/notice'>
        <Typography variant='heading01' className='text-mju-primary'>
          공지사항
        </Typography>
      </Link>
      <SearchBar domain='notice' initialContent={initialContent} />
      <CategoryFilter
        categories={CATEGORY_LIST}
        current={selectedCategory}
        onChange={(category) => {
          setSelectedCategory(category);
          setPage(0); // 카테고리 전환 시 첫 페이지로 이동
        }}
      />

      <hr className='w-full border-blue-05 border-2' />
      <div className='flex-1 flex flex-col'>
        <NoticeList items={items} category='notice' page={page + 1} itemsPerPage={ITEMS_PER_PAGE} />
        {keyword && items.length === 0 && (
          <div className='flex-1 text-center content-center'>
            <Typography variant='title02'>검색 결과가 없습니다</Typography>
          </div>
        )}
      </div>
      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  );
};

export default Notice;
