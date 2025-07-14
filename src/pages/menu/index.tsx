import { useMemo } from 'react';
import Divider from '../../components/atoms/Divider';
import { Typography } from '../../components/atoms/Typography';
import WeeklyMenuTable from '../../components/organisms/WeeklyMenuTable';

export default function Menu() {
  /**
   * 오늘 날짜를 표시합니다
   */
  const todayString = useMemo(() => {
    const today = new Date();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    return `${month}월 ${day}일`;
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
      <WeeklyMenuTable />
    </div>
  );
}
