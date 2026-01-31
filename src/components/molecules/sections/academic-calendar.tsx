import clsx from 'clsx';

interface CalendarProps {
  viewDate: Date;
  onDateSelect: (date: Date) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  calendarDays: { date: Date; isCurrentMonth: boolean }[];
  todayDay: number;
}

/**
 * 학사일정용 캘린더 그리드 컴포넌트
 */
export function Calendar({
  viewDate,
  onDateSelect,
  onPrevMonth,
  onNextMonth,
  calendarDays,
  todayDay,
}: CalendarProps) {
  const dayLabels = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <div className='border-grey-02 flex w-full flex-col items-center gap-4 rounded-[4px] border px-[7px] py-[12px]'>
      {/* 월 전환 헤더 */}
      <div className='flex items-center gap-4'>
        <button
          onClick={onPrevMonth}
          className='text-grey-30 transition-transform outline-none hover:text-black active:scale-95'
        >
          <svg
            width='20'
            height='20'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <path d='m15 18-6-6 6-6' />
          </svg>
        </button>
        <h3 className='text-body02 font-semibold text-black'>
          {viewDate.getFullYear()}년 {viewDate.getMonth() + 1}월
        </h3>
        <button
          onClick={onNextMonth}
          className='text-grey-30 transition-transform outline-none hover:text-black active:scale-95'
        >
          <svg
            width='20'
            height='20'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2.5'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <path d='m9 18 6-6-6-6' />
          </svg>
        </button>
      </div>

      {/* 요일 칩 헤더 */}
      <div className='grid w-full grid-cols-7 place-items-center gap-1'>
        {dayLabels.map((label, i) => (
          <div
            key={label}
            className={clsx(
              'text-caption04 flex h-[18px] w-full max-w-[46px] items-center justify-center rounded-[4px] leading-[1.5] transition-colors',
              i === todayDay ? 'bg-blue-15 text-white' : 'bg-grey-02 text-grey-30 opacity-80',
            )}
          >
            {label}
          </div>
        ))}
      </div>

      {/* 날짜 그리드 */}
      <div className='mt-2 grid w-full grid-cols-7 gap-y-4'>
        {calendarDays.map((dayObj, i) => {
          const isSun = dayObj.date.getDay() === 0;

          return (
            <button
              key={i}
              onClick={() => onDateSelect(dayObj.date)}
              className='group relative flex aspect-square w-full items-center justify-center p-0 outline-none'
            >
              <span
                className={clsx(
                  'text-caption04 absolute top-0.5 left-1 px-1 py-0.5 leading-none transition-colors',
                  !dayObj.isCurrentMonth && 'text-grey-10', // 타 월
                  dayObj.isCurrentMonth && isSun && 'text-error', // 휴일(일요일)
                  dayObj.isCurrentMonth && !isSun && 'text-[#17171b]', // 평일
                )}
              >
                {String(dayObj.date.getDate()).padStart(2, '0')}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
