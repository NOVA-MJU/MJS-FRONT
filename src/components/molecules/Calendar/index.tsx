import type { CalendarMonthlyRes } from '@/api/main/calendar';
import clsx from 'clsx';
import { useMemo, useState } from 'react';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

interface CalendarProps {
  className?: string;
  onYearChange: (year: number) => void;
  onMonthChange: (month: number) => void;
  events: CalendarMonthlyRes | null;
  onDateSelect: (date: Date) => void;
}

export default function Calendar({
  className,
  onYearChange,
  onMonthChange,
  events: initialEvents,
  onDateSelect,
}: CalendarProps) {
  const date = new Date();
  const dayMap = ['일', '월', '화', '수', '목', '금', '토'];
  const [currentYear, setCurrentYear] = useState(date.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(date.getMonth() + 1);
  const [events] = useState(initialEvents);

  /**
   * 시스템 현재 날짜값 보관
   */
  const today = new Date();
  const actualCurrentYear = today.getFullYear();
  const actualCurrentMonth = today.getMonth() + 1;
  const actualCurrentDayOfWeek = today.getDay();

  /**
   * 이전 달 버튼 핸들러
   */
  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      const newYear = currentYear - 1;
      const newMonth = 12;
      setCurrentYear(newYear);
      setCurrentMonth(newMonth);
      onYearChange(newYear);
      onMonthChange(newMonth);
    } else {
      const newMonth = currentMonth - 1;
      setCurrentMonth(newMonth);
      onMonthChange(newMonth);
    }
  };

  /**
   * 다음 달 버튼 핸들러
   */
  const handleNextMonth = () => {
    if (currentMonth === 12) {
      const newYear = currentYear + 1;
      const newMonth = 1;
      setCurrentYear(newYear);
      setCurrentMonth(newMonth);
      onYearChange(newYear);
      onMonthChange(newMonth);
    } else {
      const newMonth = currentMonth + 1;
      setCurrentMonth(newMonth);
      onMonthChange(newMonth);
    }
  };

  /**
   * 이벤트 카테고리별 색상을 지정합니다
   */
  const allEvents = useMemo(() => {
    if (!events) {
      return [];
    } else {
      return [
        ...events.all.map((e) => ({
          ...e,
          category: 'all',
          color: 'bg-blue-20',
        })),
        ...events.undergrad.map((e) => ({
          ...e,
          category: 'undergrad',
          color: 'bg-mju-primary',
        })),
        ...events.graduate.map((e) => ({
          ...e,
          category: 'graduate',
          color: 'bg-grey-40',
        })),
        ...events.holiday.map((e) => ({
          ...e,
          category: 'holiday',
          color: 'bg-error',
        })),
      ];
    }
  }, [events]);

  /**
   * 캘린더 표시 로직
   */
  const calendarDays = useMemo(() => {
    const days = [];

    const firstDayOfMonth = new Date(currentYear, currentMonth - 1, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth, 0);
    const daysInMonth = lastDayOfMonth.getDate();
    const startDayOfWeek = firstDayOfMonth.getDay();
    const lastDayOfPrevMonth = new Date(currentYear, currentMonth - 1, 0).getDate();

    const getEventsForDate = (dateStr: string) => {
      return allEvents.filter((event) => dateStr >= event.startDate && dateStr <= event.endDate);
    };

    const formatDate = (date: Date) => {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    };

    /**
     * 이전 달
     */
    for (let i = startDayOfWeek; i > 0; i--) {
      const day = lastDayOfPrevMonth - i + 1;
      const dayOfWeek = startDayOfWeek - i;
      const date = new Date(currentYear, currentMonth - 2, day);
      const currentDateStr = formatDate(date);

      days.push({
        day: day,
        outdated: true,
        weekend: dayOfWeek === 0 || dayOfWeek === 6,
        events: getEventsForDate(currentDateStr),
        fullDate: date,
      });
    }

    /**
     * 현재 달
     */
    for (let i = 1; i <= daysInMonth; i++) {
      const dayOfWeek = (startDayOfWeek + i - 1) % 7;
      const date = new Date(currentYear, currentMonth - 1, i);
      const currentDateStr = formatDate(date);

      days.push({
        day: i,
        outdated: false,
        weekend: dayOfWeek === 0 || dayOfWeek === 6,
        events: getEventsForDate(currentDateStr),
        fullDate: date,
      });
    }

    const totalCellsNeeded = startDayOfWeek + daysInMonth;
    const totalGridCells = totalCellsNeeded > 35 ? 42 : 35;
    const remainingCells = totalGridCells - totalCellsNeeded;

    /**
     * 다음 달
     */
    for (let i = 1; i <= remainingCells; i++) {
      const dayOfWeek = (startDayOfWeek + daysInMonth + i - 1) % 7;
      const date = new Date(currentYear, currentMonth, i);
      const currentDateStr = formatDate(date);

      days.push({
        day: i,
        outdated: true,
        weekend: dayOfWeek === 0 || dayOfWeek === 6,
        events: getEventsForDate(currentDateStr),
        fullDate: date,
      });
    }

    return days;
  }, [currentYear, currentMonth, allEvents]);

  return (
    <section>
      <div
        className={`
          px-2 py-3 flex flex-col gap-2.5
          rounded-sm border-1 border-grey-05
          ${className}
        `}
      >
        <div className='flex flex-col gap-4 items-center'>
          {/**
           * 날짜 표시 및 변경 버튼
           */}
          <div className='w-fit flex gap-3 items-center'>
            <button className='p-2 text-blue-10 cursor-pointer' onClick={handlePrevMonth}>
              <IoIosArrowBack size={20} />
            </button>
            <span className='text-body02'>{`${currentYear}년 ${currentMonth}월`}</span>
            <button className='p-2 text-blue-10 cursor-pointer' onClick={handleNextMonth}>
              <IoIosArrowForward size={20} />
            </button>
          </div>

          {/**
           * 요일 표시
           */}
          <div className='w-full flex gap-0.5'>
            {dayMap.map((day, index) => {
              const isCurrentMonthAndYear =
                currentYear === actualCurrentYear && currentMonth === actualCurrentMonth;
              const isToday = index === actualCurrentDayOfWeek;
              const style =
                isCurrentMonthAndYear && isToday
                  ? 'bg-blue-35 text-white'
                  : 'bg-blue-05 text-blue-10';

              return (
                <div
                  key={index}
                  className={`
                    flex-1 text-center rounded-sm p-1 text-caption03 
                    ${style}
                  `}
                >
                  {day}
                </div>
              );
            })}
          </div>

          {/**
           * 이벤트 표시
           */}
          <div className='w-full grid grid-cols-7'>
            {calendarDays.map((item, index) => (
              <CalendarItem
                key={index}
                day={item.day}
                outdated={item.outdated}
                weekend={item.weekend}
                events={item.events}
                onClick={() => onDateSelect?.(item.fullDate)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

interface CalendarEvent {
  id: number;
  startDate: string;
  endDate: string;
  description: string;
  category: string;
  color: string;
}

interface CalendarItemProps {
  day: number;
  outdated?: boolean;
  weekend?: boolean;
  events?: CalendarEvent[];
  onClick: () => void;
}

function CalendarItem({
  day,
  outdated = false,
  weekend = false,
  events = [],
  onClick,
}: CalendarItemProps) {
  return (
    <button onClick={onClick}>
      <div className='min-h-15 p-1 flex flex-col hover:bg-blue-05'>
        <span
          className={clsx(
            'text-caption04 text-start',
            outdated && 'text-grey-40',
            weekend && 'text-error',
          )}
        >
          {String(day).padStart(2, '0')}
        </span>
        <div className='h-[0.5px] bg-grey-10' />

        {/**
         * 이벤트 막대(bar) 렌더링 영역
         */}
        <div className='flex flex-col gap-0.5 mt-1'>
          {events.map((event) => (
            <div
              key={event.id}
              title={event.description} // 마우스 호버 시 툴팁으로 설명 표시
              className={clsx('w-full h-1', event.color)}
            />
          ))}
        </div>
      </div>
    </button>
  );
}
