import { useEffect, useState } from 'react';
import Divider from '../../components/atoms/Divider';
import { Typography } from '../../components/atoms/Typography';
import CalendarGrid, { type CalendarEventItem } from '../../components/organisms/CalendarGrid';
import CalendarList from '../../components/organisms/CalendarList';
import { getAcademicEvents } from '../../api/calendar';

export default function AcademicCalendar() {
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth() + 1);
  const [events, setEvents] = useState<CalendarEventItem[] | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await getAcademicEvents({ year: currentYear });
        setEvents(res);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [currentYear]);

  return (
    <div className='px-4 md:px-7 py-8 md:py-12 flex flex-col gap-4 md:gap-6'>
      <Typography variant='heading01' className='text-mju-primary'>
        <span className='md:text-2xl text-xl md:hidden'>학사일정</span>
      </Typography>
      <span className='md:hidden'>
        <Divider />
      </span>

      <section
        className='
          grid gap-4 md:gap-6
          grid-cols-1
          md:grid-cols-[2fr_1fr]
        '
      >
        <div className='w-full'>
          <CalendarGrid
            events={events}
            onYearChange={setCurrentYear}
            onMonthChange={setCurrentMonth}
          />
        </div>

        <aside className='hidden md:block w-full' aria-hidden={false}>
          <CalendarList events={events} month={currentMonth} />
        </aside>
      </section>
    </div>
  );
}
