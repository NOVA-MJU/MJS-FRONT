import type { CalendarMonthlyRes, CalendarScheduleItem } from '@/api/main/calendar';
import clsx from 'clsx';

interface CalendarProps {
  viewDate: Date;
  onDateSelect: (date: Date) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  calendarDays: { date: Date; isCurrentMonth: boolean }[];
  todayDay: number;
  scheduleData: CalendarMonthlyRes | null;
}

type EventBar = {
  type: 'undergrad' | 'graduate' | 'holiday';
  item: CalendarScheduleItem;
  startCol: number;
  endCol: number;
  row: number;
  layer: number;
};

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
  scheduleData,
}: CalendarProps) {
  const dayLabels = ['일', '월', '화', '수', '목', '금', '토'];

  /**
   * 일정 타입에 따른 색상 반환
   */
  const getEventColor = (type: 'undergrad' | 'graduate' | 'holiday') => {
    switch (type) {
      case 'undergrad':
        return 'bg-blue-35'; // 학부 - blue35
      case 'graduate':
        return 'bg-blue-15'; // 대학원 - blue15
      case 'holiday':
        return 'bg-grey-02'; // 휴일 - gray02
      default:
        return 'bg-blue-05';
    }
  };

  /**
   * 모든 일정을 grid 위에 배치할 바 정보로 변환
   */
  const getEventBars = (): EventBar[] => {
    if (!scheduleData) return [];

    const bars: EventBar[] = [];
    const allEvents: { type: 'undergrad' | 'graduate' | 'holiday'; item: CalendarScheduleItem }[] =
      [];

    // 모든 일정 추가 (학부, 대학원, 휴일)
    scheduleData.undergrad.forEach((item) => allEvents.push({ type: 'undergrad', item }));
    scheduleData.graduate.forEach((item) => allEvents.push({ type: 'graduate', item }));
    scheduleData.holiday.forEach((item) => allEvents.push({ type: 'holiday', item }));

    // 로컬 날짜 문자열 생성 함수 (YYYY-MM-DD)
    const getLocalDateString = (date: Date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    // 각 일정을 grid 좌표로 변환
    allEvents.forEach((event) => {
      // 캘린더에 표시되는 날짜 중에서 이 일정이 포함되는 범위 찾기
      let startIdx = -1;
      let endIdx = -1;

      // 일정의 시작일과 종료일 (이미 YYYY-MM-DD 형식)
      const eventStart = event.item.startDate;
      const eventEnd = event.item.endDate;

      calendarDays.forEach((day, idx) => {
        const dayStr = getLocalDateString(day.date);

        // 시작 인덱스: 일정 시작일이거나 그 이후 첫 날짜
        if (startIdx === -1 && dayStr >= eventStart && dayStr <= eventEnd) {
          startIdx = idx;
        }

        // 종료 인덱스: 일정 종료일이거나 그 이전 마지막 날짜
        if (dayStr >= eventStart && dayStr <= eventEnd) {
          endIdx = idx;
        }
      });

      // 일정이 이번 달 캘린더에 표시되는 경우에만 추가
      if (startIdx !== -1 && endIdx !== -1 && startIdx <= endIdx) {
        // 주 단위로 분할 (7일 grid이므로)
        let currentStart = startIdx;
        while (currentStart <= endIdx) {
          const currentRow = Math.floor(currentStart / 7);
          const rowEnd = (currentRow + 1) * 7 - 1;
          const currentEnd = Math.min(endIdx, rowEnd);

          bars.push({
            type: event.type,
            item: event.item,
            startCol: currentStart % 7,
            endCol: currentEnd % 7,
            row: currentRow,
            layer: 0, // 레이어는 나중에 계산
          });

          currentStart = currentEnd + 1;
        }
      }
    });

    // 각 행에서 겹치는 일정들의 레이어 계산
    const rowBars: { [key: number]: EventBar[] } = {};
    bars.forEach((bar) => {
      if (!rowBars[bar.row]) rowBars[bar.row] = [];
      rowBars[bar.row].push(bar);
    });

    Object.values(rowBars).forEach((rowBarList) => {
      rowBarList.sort((a, b) => a.startCol - b.startCol);
      rowBarList.forEach((bar, idx) => {
        bar.layer = idx;
      });
    });

    return bars;
  };

  const eventBars = getEventBars();

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

      {/* 날짜 그리드 - 일정 바를 위한 relative 컨테이너 */}
      <div className='relative mt-2 w-full'>
        <div className='grid w-full grid-cols-7 gap-y-4'>
          {calendarDays.map((dayObj, i) => {
            const isSun = dayObj.date.getDay() === 0;

            return (
              <button
                key={i}
                onClick={() => onDateSelect(dayObj.date)}
                className='group relative flex aspect-square w-full flex-col items-center justify-start p-0 outline-none'
              >
                <span
                  className={clsx(
                    'text-caption04 absolute top-0.5 left-1 z-10 px-1 py-0.5 leading-none transition-colors',
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

        {/* 일정 바들을 absolute로 배치 */}
        {eventBars.map((bar, idx) => {
          const cellWidth = 100 / 7; // 7 columns
          const left = `${bar.startCol * cellWidth}%`;
          const width = `${(bar.endCol - bar.startCol + 1) * cellWidth}%`;

          // 각 행의 높이 계산 (aspect-square이므로 셀 너비와 동일)
          // gap-y-4 = 1rem = 16px
          const gapSize = 16; // 1rem in pixels
          const cellHeight = `calc((100% - ${5 * gapSize}px) / 6)`; // 6 rows, 5 gaps

          // 날짜 셀 상단에서 일정 바까지의 오프셋
          const topOffset = 20; // 20px from top (날짜 숫자 아래)
          const barHeight = 6; // 6px bar height

          // top = (row * cellHeight) + (row * gap) + topOffset + (layer * (barHeight + gap))
          const barGap = 4; // 4px gap between bars
          const top = `calc(${bar.row} * (${cellHeight} + ${gapSize}px) + ${topOffset + bar.layer * (barHeight + barGap)}px)`;

          return (
            <div
              key={idx}
              className={clsx('pointer-events-none absolute h-[6px]', getEventColor(bar.type))}
              style={{
                left,
                width,
                top,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}
