import {
  getAcademicCalendar,
  type CalendarMonthlyRes,
  type CalendarScheduleItem,
} from '@/api/main/calendar';
import { Calendar } from '@/components/molecules/sections/academic-calendar';
import { ScheduleList } from '@/components/molecules/sections/academic-schedule-list';
import { useEffect, useMemo, useState } from 'react';

type CategoryKey = 'all' | 'undergrad' | 'graduate' | 'holiday';
const categoryMap: Record<CategoryKey, string> = {
  all: '전체',
  undergrad: '학부',
  graduate: '대학원',
  holiday: '휴일',
};

/**
 * 검색 페이지 학사일정 탭에서 쓰는 캘린더 + 일정 리스트 컴포넌트
 * (academic-schedule-widget의 캘린더 영역만 분리)
 */
export default function AcademicScheduleInSearch() {
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>('all');
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [scheduleData, setScheduleData] = useState<CalendarMonthlyRes | null>(null);

  useEffect(() => {
    getCalendarData(viewDate.getFullYear(), viewDate.getMonth() + 1);
  }, [viewDate]);

  const getCalendarData = async (year: number, month: number) => {
    try {
      setIsLoading(true);
      const res = await getAcademicCalendar(year, month);
      setScheduleData(res);
    } catch (e) {
      console.error('calendar-fetch-error', e);
    } finally {
      setIsLoading(false);
    }
  };

  const calendarDays = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const prevLastDay = new Date(year, month, 0);
    const startDayOfWeek = firstDay.getDay();
    const days: { date: Date; isCurrentMonth: boolean }[] = [];

    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevLastDay.getDate() - i),
        isCurrentMonth: false,
      });
    }
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
      });
    }
    const remainingCells = 42 - days.length;
    for (let i = 1; i <= remainingCells; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
      });
    }
    return days;
  }, [viewDate]);

  const handlePrevMonth = () =>
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  const handleNextMonth = () =>
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  const todayDay = new Date().getDay();

  const dailyScheduleList = useMemo(() => {
    if (!scheduleData) return [];
    const targetDate = selectedDate || new Date();
    const year = targetDate.getFullYear();
    const month = String(targetDate.getMonth() + 1).padStart(2, '0');
    const day = String(targetDate.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    const allEventsWithCategory: (CalendarScheduleItem & { categoryLabel: string })[] = [];
    if (selectedCategory === 'all' || selectedCategory === 'undergrad') {
      scheduleData.undergrad.forEach((e) =>
        allEventsWithCategory.push({ ...e, categoryLabel: categoryMap.undergrad }),
      );
    }
    if (selectedCategory === 'all' || selectedCategory === 'graduate') {
      scheduleData.graduate.forEach((e) =>
        allEventsWithCategory.push({ ...e, categoryLabel: categoryMap.graduate }),
      );
    }
    if (selectedCategory === 'all' || selectedCategory === 'holiday') {
      scheduleData.holiday.forEach((e) =>
        allEventsWithCategory.push({ ...e, categoryLabel: categoryMap.holiday }),
      );
    }
    return allEventsWithCategory.filter((e) => dateStr >= e.startDate && dateStr <= e.endDate);
  }, [scheduleData, selectedDate, selectedCategory]);

  return (
    <div className='flex flex-col gap-4 pb-10'>
      <div className='p-4'>
        <Calendar
          viewDate={viewDate}
          onDateSelect={setSelectedDate}
          onPrevMonth={handlePrevMonth}
          onNextMonth={handleNextMonth}
          calendarDays={calendarDays}
          todayDay={todayDay}
          scheduleData={scheduleData}
        />
      </div>
      <ScheduleList
        selectedDate={selectedDate}
        selectedCategory={selectedCategory}
        onCategoryToggle={() => setIsCategoryOpen(!isCategoryOpen)}
        isCategoryOpen={isCategoryOpen}
        onCategorySelect={(key) => {
          setSelectedCategory(key);
          setIsCategoryOpen(false);
        }}
        isLoading={isLoading}
        dailyScheduleList={dailyScheduleList}
      />
    </div>
  );
}
