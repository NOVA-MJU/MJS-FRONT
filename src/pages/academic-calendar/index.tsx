 
import { useEffect, useState } from 'react';
import Divider from '../../components/atoms/Divider';
import { Typography } from '../../components/atoms/Typography';
import CalendarGrid from '../../components/organisms/CalendarGrid';
import { getAcademicEvents, type CalendarEventItem } from '../../api/calendar';
import CalendarList from '../../components/organisms/CalendarList';

export default function AcademicCalendar() {
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth() + 1);
  const [events, setEvents] = useState<CalendarEventItem[] | null>(null);

  useEffect(() => {
    const getEvents = async () => {
      try {
        const res = await getAcademicEvents({ year: currentYear });
        console.log(res);
        setEvents(res);
      } catch (err) {
        console.error(err);
      }
    };
    getEvents();
  }, [currentYear]);

  return (
    <div className='px-7 py-12 flex flex-col gap-6'>
      <Typography variant='heading01' className='text-mju-primary'>
        학사일정
      </Typography>
      <Divider />
      <div className='flex gap-6'>
        <div className='flex-2/3'>
          <CalendarGrid
            events={events}
            onYearChange={setCurrentYear}
            onMonthChange={setCurrentMonth}
          />
        </div>
        {/* 전체 학사일정 컨테이너 */}
        <div className='flex-1/3'>
          <CalendarList events={events} month={currentMonth} />
        </div>
      </div>
    </div>
  );
}
