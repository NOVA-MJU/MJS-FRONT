import SearchBar from '../../components/molecules/common/SearchBar';
import Pagination from '../../components/molecules/common/Pagination';
import { useEffect, useState } from 'react';
import CategoryFilter from '../../components/molecules/common/CategoryFilter';
import { Notices } from '../../constants/notices';
import NoticeList from '../../components/organisms/CommonList';
import { fetchNotices } from '../../api/notice';
import type { ListItemProps } from '../../components/organisms/DetailItem/idex';

const categoryMapping: Record<string, string | undefined> = {
  전체: undefined,
  일반공지: 'general',
  학사공지: 'academic',
  장학공지: 'scholarship',
  진로공지: 'career',
  학생활동: 'activity',
  학칙개정: 'rule',
};

const ITEMS_PER_PAGE = 8;

const Notice: React.FC = () => {
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [items, setItems] = useState<ListItemProps[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchNotices({
          category: categoryMapping[selectedCategory] ?? 'general', // fallback
          page: page - 1,
          size: ITEMS_PER_PAGE,
          sort: 'desc',
        });
        setItems(data.content);
        setTotalPages(data.totalPages);
      } catch {
        alert('공지사항을 불러오지 못했습니다.');
      }
    })();
  }, [selectedCategory, page]);

  return (
    <div className='w-[1280px] min-h-screen flex flex-col p-12 gap-6 mx-auto'>
      <p className='text-4xl font-bold text-mju-primary'>공지사항</p>
      <SearchBar />
      <CategoryFilter
        categories={Notices}
        current={selectedCategory}
        onChange={(category) => {
          setSelectedCategory(category);
          setPage(1); // 카테고리 바뀌면 첫 페이지로
        }}
      />
      <hr className='w-full border-blue-05 border-2' />
      <NoticeList items={items} category='notice' />
      <Pagination page={page} totalPages={totalPages} onChange={(next) => setPage(next)} />
    </div>
  );
};

export default Notice;
