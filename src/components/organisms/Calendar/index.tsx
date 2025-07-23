import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { Typography } from '../../atoms/Typography';
import CalendarGridItem from '../../molecules/CalendarGridItem';
import { useMemo, useState } from 'react';
import clsx from 'clsx';
import { type CalendarEventItem } from '../../../api/calendar';

interface CalendarProps {
  events: CalendarEventItem[] | null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function Calendar({ events }: CalendarProps) {
  const [year, setYear] = useState(() => new Date().getFullYear());
  const [month, setMonth] = useState(() => new Date().getMonth() + 1);
  const [currentDayIndex] = useState(() => new Date().getDay());
  const weekdays = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  const calendarDays = useMemo(() => generateCalendarDays(year, month), [year, month]);
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;

  const prevMonth = () => {
    if (month === 1) {
      setYear(year - 1);
      setMonth(12);
    } else {
      setMonth(month - 1);
    }
  };

  const nextMonth = () => {
    if (month === 12) {
      setYear(year + 1);
      setMonth(1);
    } else {
      setMonth(month + 1);
    }
  };

  return (
    <div className='flex-2/3 flex flex-col gap-12'>
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
              className={clsx(
                'h-10 rounded-xl',
                currentYear === year && currentMonth === month && index === currentDayIndex
                  ? 'bg-blue-35 text-white'
                  : 'bg-blue-05 text-blue-10',
              )}
            >
              <Typography variant='body02'>{day}</Typography>
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
