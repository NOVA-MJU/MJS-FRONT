import { useEffect, useMemo, useState } from 'react';
import Divider from '../../components/atoms/Divider';
import { Typography } from '../../components/atoms/Typography';
import WeeklyMenuTable from '../../components/organisms/WeeklyMenuTable';
import { getMenus } from '../../api/menu';
import type { MenuItem } from '../../api/menu';

export default function Menu() {
  const [contents, setContents] = useState<MenuItem[]>([]);

  /**
   * 오늘 날짜를 표시합니다
   */
  const todayString = useMemo(() => {
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    return `${month}월 ${day}일`;
  }, []);

  /**
   * 식단 정보를 서버에서 불러옵니다
   */
  useEffect(() => {
    const getData = async () => {
      try {
        const res = await getMenus();
        console.log(res.data);
        setContents(res.data);
        console.log(res.data[1].meals);
      } catch (e) {
        console.error(e);
      }
    };
    getData();
  }, []);

  return (
    <div className='flex flex-col px-7 py-12 gap-12'>
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
