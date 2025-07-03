import SearchBar from '../../components/molecules/common/SearchBar';
import Pagination from '../../components/molecules/common/Pagination';
import { useState } from 'react';
import CategoryFilter from '../../components/molecules/common/CategoryFilter';
import { Notices } from '../../constants/notices';
import { noticeData } from '../../constants/noticeData';
import NoticeList from '../../components/organisms/CommonList';

const Notice: React.FC = () => {
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('전체');

  const filteredNotices =
    selectedCategory === '전체'
      ? noticeData
      : noticeData.filter((notice) => notice.category === selectedCategory);

  // pagination 관련 로직
  const ITEMS_PER_PAGE = 8; // 한 페이지에 보여줄 아이템 수
  const totalPages = Math.ceil(filteredNotices.length / ITEMS_PER_PAGE); //전체 페이지 수
  const currentItems = filteredNotices.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE); // 현재 페이지에 보여줄 아이템 목록

  return (
    <div className='bg-grey-05 w-[1280px] min-h-screen flex flex-col p-12 gap-6 mx-auto'>
      <p className='text-4xl font-bold text-blue-900 text-mju-primary'>공지사항</p>
      <SearchBar />
      <CategoryFilter
        categories={Notices}
        current={selectedCategory}
        onChange={(category) => {
          setSelectedCategory(category);
          setPage(1);
        }}
      />
      <NoticeList key={selectedCategory} items={currentItems} category={'notice'} />
      <Pagination page={page} totalPages={totalPages} onChange={(next) => setPage(next)} />
    </div>
  );
};

export default Notice;
