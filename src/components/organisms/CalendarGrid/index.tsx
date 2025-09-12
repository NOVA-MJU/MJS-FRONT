import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { Typography } from '../../atoms/Typography';
import CalendarGridItem from '../../molecules/CalendarGridItem';
import { useMemo, useState } from 'react';
import clsx from 'clsx';

export interface CalendarEventItem {
  uuid: string;
  year: number;
  startDate: string;
  endDate: string;
  description: string;
}

interface CalendarGridProps {
  events: CalendarEventItem[] | null;
  onYearChange: (year: number) => void;
  onMonthChange: (month: number) => void;
}

type Event = { event: string };

export default function CalendarGrid({ events, onYearChange, onMonthChange }: CalendarGridProps) {
  const [year, setYear] = useState(() => new Date().getFullYear());
  const [month, setMonth] = useState(() => new Date().getMonth() + 1);
  const [currentDayIndex] = useState(() => new Date().getDay());
  const weekdays = [
    { short: '일', full: '일요일' },
    { short: '월', full: '월요일' },
    { short: '화', full: '화요일' },
    { short: '수', full: '수요일' },
    { short: '목', full: '목요일' },
    { short: '금', full: '금요일' },
    { short: '토', full: '토요일' },
  ];
  const calendarDays = useMemo(() => generateCalendarDays(year, month), [year, month]);
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const eventsByDay = useMemo(() => mapEventsToDays(events, year, month), [events, year, month]);

  const prevMonth = () => {
    if (month === 1) {
      const newYear = year - 1;
      const newMonth = 12;
      setYear(newYear);
      setMonth(newMonth);
      onYearChange(newYear);
      onMonthChange(newMonth);
    } else {
      const newMonth = month - 1;
      setMonth(newMonth);
      onMonthChange(newMonth);
    }
  };

  const nextMonth = () => {
    if (month === 12) {
      const newYear = year + 1;
      const newMonth = 1;
      setYear(newYear);
      setMonth(newMonth);
      onYearChange(newYear);
      onMonthChange(newMonth);
    } else {
      const newMonth = month + 1;
      setMonth(newMonth);
      onMonthChange(newMonth);
    }
  };

  return (
    <div className='w-full h-fit flex flex-col gap-12'>
      <div className='flex items-center'>
        <button className='cursor-pointer text-blue-10 text-2xl' onClick={prevMonth}>
          <IoIosArrowBack />
        </button>
        <Typography variant='heading02' className='flex-1 text-center'>
          {`${year}년 ${month}월`}
        </Typography>
        <button className='cursor-pointer text-blue-10 text-2xl' onClick={nextMonth}>
          <IoIosArrowForward />
        </button>
      </div>
      <div className='flex flex-col gap-3'>
        <div className='grid grid-cols-7 gap-1'>
          {weekdays.map((day, index) => (
            <button
              key={index}
              className={clsx(
                'w-full h-10 rounded-xl',
                currentYear === year && currentMonth === month && index === currentDayIndex
                  ? 'bg-blue-35 text-white'
                  : 'bg-blue-05 text-blue-10',
              )}
            >
              <span className='hidden md:block'>
                <Typography variant='body02'>{day.full}</Typography>
              </span>
              <span className='block md:hidden'>
                <Typography variant='body02'>{day.short}</Typography>
              </span>
            </button>
          ))}
        </div>
        <div className='grid grid-cols-7'>
          {calendarDays.map(({ day, outdated, focused }, index) => (
            <CalendarGridItem
              key={index}
              day={day}
              outdated={outdated}
              focused={focused}
              weekend={index % 7 === 0}
              events={eventsByDay[day]}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function generateCalendarDays(year: number, month: number) {
  const days: { day: number; outdated: boolean; focused: boolean }[] = [];
  const firstOfMonth = new Date(year, month - 1, 1);
  const startWeekday = firstOfMonth.getDay();
  const prevMonthLastDate = new Date(year, month - 1, 0).getDate();
  for (let i = startWeekday - 1; i >= 0; i--) {
    days.push({ day: prevMonthLastDate - i, outdated: true, focused: false });
  }
  const thisMonthLastDate = new Date(year, month, 0).getDate();
  const today = new Date();
  for (let d = 1; d <= thisMonthLastDate; d++) {
    days.push({
      day: d,
      outdated: false,
      focused:
        year === today.getFullYear() && month === today.getMonth() + 1 && d === today.getDate(),
    });
  }
  const remainder = days.length % 7;
  const nextDays = remainder === 0 ? 0 : 7 - remainder;
  for (let i = 1; i <= nextDays; i++) {
    days.push({ day: i, outdated: true, focused: false });
  }
  return days;
}

function mapEventsToDays(
  events: CalendarEventItem[] | null,
  year: number,
  month: number,
): Record<number, Event[]> {
  const daysInMonth = new Date(year, month, 0).getDate();
  const result: Record<number, Event[]> = {};
  for (let d = 1; d <= daysInMonth; d++) result[d] = [];
  if (!events) return result;

  events.forEach(({ startDate, description }) => {
    const start = new Date(startDate);
    if (start.getFullYear() === year && start.getMonth() + 1 === month) {
      result[start.getDate()].push({ event: description });
    }
  });

  return result;
}
