import { Link } from 'react-router-dom';
import MyList from '../organisms/Mypage/MyList';
import type { MyListItemProps } from '../molecules/MyListItem/index';
import { useAuthStore } from '../../store/useAuthStore';
import Pagination from '../molecules/common/Pagination';

interface MyViewProps {
  title: string;
  itemsPerPage: number;
  items: MyListItemProps[];
  isComment?: boolean;
  page?: number;
  totalPages: number;
  onChange: (page: number) => void;
}
const MyViewLayout = ({
  title,
  itemsPerPage,
  items,
  isComment = false,
  page = 1,
  totalPages,
  onChange,
}: MyViewProps) => {
  const user = useAuthStore();
  return (
    <div className='bg-grey-05 w-[1280px] min-h-screen flex flex-col mx-auto p-12'>
      <Link to={`/mypage/${user?.user?.uuid}`} className='text-[#17171b] hover:underline'>
        <p className='text-blue-10 font-normal mb-6'>&lt; 이전</p>
      </Link>
      <p className='text-4xl font-bold text-blue-900 text-mju-primary'>{title}</p>
      <div className='w-full flex flex-col justify-center items-center mt-10 gap-12'>
        <MyList items={items} itemsPerPage={itemsPerPage} isComment={isComment} page={page} />
      </div>
      <div className='mt-6'>
        <Pagination page={page} totalPages={totalPages} onChange={onChange} />
      </div>
    </div>
  );
};

export default MyViewLayout;
