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
    return `TODAY ${month}월 ${day}일`;
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await getMenus();
        console.log(res);
        setContents(res);
      } catch (e) {
        toast.error('식단을 불러오는 중 오류가 발생했습니다!', e);
      }
    })();
  }, []);

  return (
    <div className='flex flex-col p-4 md:p-8 gap-3 md:gap-12'>
      <Typography variant='heading01' className='text-mju-primary'>
        학식
      </Typography>
      <Divider />
      <Typography variant='heading02' className='text-center text-mju-primary'>
        {todayString}
      </Typography>
      <WeeklyMenuTable menus={contents} />
    </div>
  );
}
