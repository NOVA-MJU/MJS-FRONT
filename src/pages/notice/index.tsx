import SearchBar from '../../components/molecules/common/SearchBar';
import Pagination from '../../components/molecules/common/Pagination';
import { useState } from 'react';
import CategoryFilter from '../../components/molecules/common/CategoryFilter';
import { Notices } from '../../constants/notices';
import { noticeData } from '../../constants/noticeData';
import NoticeList from '../../components/organisms/NoticeList';

const Notice: React.FC = () => {
  const [page, setPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('전체');

  const filteredNotices =
    selectedCategory === '전체'
      ? noticeData
      : noticeData.filter((notice) => notice.category === selectedCategory);
  return (
    <div className='bg-grey-05 w-[1240px] min-h-screen flex flex-col p-12 gap-6 mx-auto'>
      <p className='text-4xl font-bold text-blue-900 text-mju-primary'>공지사항</p>
      <SearchBar />
      <CategoryFilter
        categories={Notices}
        current={selectedCategory}
        onChange={setSelectedCategory}
      />
      <NoticeList key={selectedCategory} items={filteredNotices} />
      <Pagination page={page} totalPages={10} onChange={(next) => setPage(next)} />
    </div>
  );
};

export default Notice;
