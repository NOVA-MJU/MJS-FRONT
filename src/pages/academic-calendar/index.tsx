import { useEffect, useState } from 'react';
import { useResponsive } from '@/hooks/useResponse';
import AcademicScheduleWidget from '@/components/molecules/sections/academic-schedule-widget';
import type { CalendarEventItem } from '@/components/organisms/CalendarGrid';
import { getAcademicEvents } from '@/api/calendar';
import Divider from '@/components/atoms/Divider';
import CalendarGrid from '@/components/organisms/CalendarGrid';
import CalendarList from '@/components/organisms/CalendarList';
import { getAcademicCalendar, type CalendarMonthlyRes } from '@/api/main/calendar';
import Calendar from '@/components/molecules/Calendar';
import { DailyAcademicScheduleWidget } from '@/components/molecules/sections/daily-academic-schedule-widget';

export default function AcademicCalendar() {
  const [, setIsLoading] = useState(true);
  const [, setIsError] = useState(false);
  const [currentYear, setCurrentYear] = useState<number>(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState<number>(new Date().getMonth() + 1);
  const [events, setEvents] = useState<CalendarMonthlyRes | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const { isDesktop } = useResponsive();

  useEffect(() => {
    getEvents(currentYear, currentMonth);
  }, [currentYear, currentMonth]);

  /**
   * 캘린더 데이터를 조회합니다
   */
  async function getEvents(year: number, month: number) {
    try {
      setIsLoading(true);
      const res = await getAcademicCalendar(year, month);
      console.log(res);
      setEvents(res);
      setIsError(false);
    } catch (e) {
      setIsError(true);
      console.error('academic-calendar.tsx', e);
    } finally {
      setIsLoading(false);
    }
  }

  /**
   * @deprecated 삭제예정 코드
   */
  const [data, setData] = useState<CalendarEventItem[] | null>(null);
  useEffect(() => {
    (async () => {
      try {
        const res = await getAcademicEvents({ year: currentYear });
        setData(res);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [currentYear]);

  /**
   * 데스크탑 화면을 표시합니다
   */
  if (isDesktop)
    return (
      <div className='px-4 md:px-7 py-8 md:py-12 flex flex-col gap-4 md:gap-6'>
        <h2 className='text-heading01 text-mju-primary md:text-2xl text-xl md:hidden'>학사일정</h2>
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
              events={data}
              onYearChange={setCurrentYear}
              onMonthChange={setCurrentMonth}
            />
          </div>

          <aside className='hidden md:block w-full' aria-hidden={false}>
            <CalendarList events={data} month={currentMonth} />
          </aside>
        </section>
      </div>
    );

  /**
   * 모바일 화면을 표시합니다
   */
  if (!isDesktop)
    return (
      <div className='flex-1 p-5'>
        <div className='flex flex-col gap-4'>
          <div>
            <span className='text-title01 text-blue-35'>학사일정</span>
          </div>
          <div>
            <Calendar
              events={events}
              onYearChange={setCurrentYear}
              onMonthChange={setCurrentMonth}
              onDateSelect={setSelectedDate}
            />
          </div>
          <div>
            <DailyAcademicScheduleWidget date={selectedDate} events={events} />
          </div>
          <div>
            <AcademicScheduleWidget events={events} />
          </div>
        </div>
      </div>
    );
}
