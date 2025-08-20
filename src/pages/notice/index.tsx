import SearchBar from '../../components/atoms/SearchBar';
import Pagination from '../../components/molecules/common/Pagination';
import { useEffect, useState, useMemo } from 'react';
import CategoryFilter from '../../components/molecules/common/CategoryFilter';
import { Notices } from '../../constants/notices';
import NoticeList from '../../components/organisms/CommonList';
import { fetchNotices } from '../../api/notice';
import type { ListItemProps } from '../../components/organisms/DetailItem/idex';
import { Link, useSearchParams } from 'react-router-dom';
import { getSearchResult } from '../../api/search';
import { Typography } from '../../components/atoms/Typography';

const categoryMapping: Record<string, string> = {
  일반공지: 'general',
  학사공지: 'academic',
  장학공지: 'scholarship',
  진로공지: 'career',
  학생활동: 'activity',
  학칙개정: 'rule',
};

const ITEMS_PER_PAGE = 8;

const Notice: React.FC = () => {
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

  /**
   * '전체' 제거된 카테고리 목록
   */
  const CATEGORY_LIST = useMemo(() => Notices.filter((c) => c !== '전체'), []);

  /**
   * 기본값을 첫 카테고리로
   */
  const [selectedCategory, setSelectedCategory] = useState(CATEGORY_LIST[0] ?? '일반공지');
  const [items, setItems] = useState<ListItemProps[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    /**
     * search parameter가 있는 경우 검색을 수행합니다
     */
    if (keyword)
      (async () => {
        try {
          const res = await getSearchResult(keyword, 'NOTICE', 'relevance', page, ITEMS_PER_PAGE);
          console.log(res);
          const parsed: ListItemProps[] = res.content.map((item, index) => ({
            id: index,
            category: item.category,
            title: item.highlightedTitle ?? '',
            content: item.highlightedContent ?? '',
            date: item.date ?? '',
            link: item.link,
            imgSrc: item.imageUrl ?? undefined,
            variant: 'notice',
          }));
          setItems(parsed);
          setTotalPages(res.totalPages);
        } catch (e) {
          console.error(e);
        }
      })();
    /**
     * search parameter가 없는 경우 모든 결과를 출력합니다
     */ else
      (async () => {
        try {
          const categoryKey = categoryMapping[selectedCategory] ?? 'general';
          const data = await fetchNotices({
            category: categoryKey, // 항상 단일 카테고리로 호출
            page: page,
            size: ITEMS_PER_PAGE,
            sort: 'desc',
          });
          setItems(data.content);
          setTotalPages(data.totalPages);
        } catch {
          alert('공지사항을 불러오지 못했습니다.');
        }
      })();
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
          setPage(1);
        }}
      />
      <hr className='w-full border-blue-05 border-2' />
      <div className='flex-1 flex flex-col'>
        <NoticeList items={items} category='notice' />
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
