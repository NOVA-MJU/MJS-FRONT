import { useEffect, useMemo, useState } from 'react';
import Divider from '../../components/atoms/Divider';
import { Typography } from '../../components/atoms/Typography';
import WeeklyMenuTable from '../../components/organisms/WeeklyMenuTable';
import { getMenus } from '../../api/menu';
import type { MenuItem } from '../../api/menu';
import toast from 'react-hot-toast';

export default function Menu() {
  const [contents, setContents] = useState<MenuItem[]>([]);

  const todayString = useMemo(() => {
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    return `${month}월 ${day}일`;
  }, []);

  useEffect(() => {
    const getMealData = async () => {
      try {
        const response = await getMenus();
        setContents(response.data);
      } catch (e) {
        toast.error('식단을 불러오는 중 오류가 발생했습니다!', e);
      }
    };
    getMealData();
  }, []);

  return (
    <div className='px-4 py-8 md:px-7 md:py-12'>
      <div className='mx-auto w-full max-w-[1200px] flex flex-col gap-8 md:gap-12'>
        <Typography variant='heading01' className='text-mju-primary'>
          학식
        </Typography>
        <Divider />
        <Typography variant='heading02' className='text-center text-mju-primary'>
          {todayString}
        </Typography>

        <WeeklyMenuTable menus={contents} />
      </div>
    </div>
  );
}
