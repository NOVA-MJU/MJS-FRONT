import Divider from '../../components/atoms/Divider';
import { Typography } from '../../components/atoms/Typography';
import CalendarListItem from '../../components/molecules/CalendarListItem';
import Calendar from '../../components/organisms/Calendar';

export default function AcademicCalendar() {
  return (
    <div className='px-7 py-12 flex flex-col gap-6'>
      <Typography variant='heading01' className='text-mju-primary'>
        학사일정
      </Typography>
      <Divider />
      <div className='flex gap-6'>
        {/* 캘린더 컨테이너 */}
        <Calendar />

        {/* 전체 학사일정 컨테이너 */}
        <div className='flex-1/3'>
          <div className='px-6 py-4 gap-2 flex flex-col border-2 border-grey-05 rounded-xl'>
            <Typography variant='title02' className='text-mju-primary'>
              전체 학사일정
            </Typography>
            <Divider variant='thin' />
            <CalendarListItem />
            <CalendarListItem />
            <CalendarListItem />
            <CalendarListItem />
          </div>
        </div>
      </div>
    </div>
  );
}
