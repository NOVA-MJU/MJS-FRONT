import React from 'react';
import type { MenuItem } from '@/api/menu';
import MenuDayButton from '@/components/molecules/MenuDayButton';
import MenuItemButton from '@/components/molecules/MenuItemButton';

const timeLabelMap = {
  BREAKFAST: '아침',
  LUNCH: '점심',
  DINNER: '저녁',
} as const;

const ORDER: Array<keyof typeof timeLabelMap> = ['BREAKFAST', 'LUNCH', 'DINNER'];

// 주차/기간 유틸
function startOfWeek(d: Date, weekStartsOn = 1) {
  const date = new Date(d);
  const day = date.getDay();
  const diff = (day - weekStartsOn + 7) % 7;
  date.setDate(date.getDate() - diff);
  date.setHours(0, 0, 0, 0);
  return date;
}
function endOfWeek(d: Date, weekStartsOn = 1) {
  const start = startOfWeek(d, weekStartsOn);
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  end.setHours(23, 59, 59, 999);
  return end;
}
function getWeekOfMonth(d: Date, weekStartsOn = 1) {
  const date = new Date(d);
  const month = date.getMonth();
  const firstOfMonth = new Date(date.getFullYear(), month, 1);
  const firstWeekStart = startOfWeek(firstOfMonth, weekStartsOn);
  const thisWeekStart = startOfWeek(date, weekStartsOn);
  const diffDays = Math.floor((thisWeekStart.getTime() - firstWeekStart.getTime()) / 86400000);
  return Math.floor(diffDays / 7) + 1;
}
function fmtMD(date: Date) {
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${m}.${d}`;
}

type WeeklyMenuViewProps = {
  groupedByDate: Array<[string, MenuItem[]]>;
  todayKey: string;
  nowCategory?: 'BREAKFAST' | 'LUNCH' | 'DINNER';
};

// 데스크톱 전용(≥md) — 주간 테이블
export default function WeeklyMenuView({
  groupedByDate,
  todayKey,
  nowCategory,
}: WeeklyMenuViewProps) {
  const todayDate = todayKey;

  const now = new Date();
  const weekStartsOn = 1;
  const weekStart = startOfWeek(now, weekStartsOn);
  const weekEnd = endOfWeek(now, weekStartsOn);
  const weekOfMonth = getWeekOfMonth(now, weekStartsOn);
  const monthLabel = now.getMonth() + 1;
  const weekRangeLabel = `${fmtMD(weekStart)} ~ ${fmtMD(weekEnd)}`;

  const WeekHeader = () => (
    <div className='mb-3 md:mb-4 flex items-baseline gap-2 justify-center md:justify-start'>
      <h3 className='text-base md:text-xl font-semibold text-mju-primary'>
        {monthLabel}월 {weekOfMonth}주차
      </h3>
      <span className='text-xs md:text-sm text-gray-500'>{weekRangeLabel}</span>
    </div>
  );

  const DesktopTable = () => (
    <div className='hidden md:grid grid-cols-[88px_repeat(3,minmax(0,1fr))] gap-3'>
      <div className='sticky left-0 z-10 bg-white/80 backdrop-blur-md font-semibold text-sm px-2 py-1 rounded'>
        요일
      </div>
      {ORDER.map((k) => (
        <div key={k} className='font-semibold text-sm px-2 py-1'>
          {timeLabelMap[k]}
        </div>
      ))}

      {groupedByDate.map(([date, dayItems]) => {
        const isToday = date === todayDate;
        const weekdayLabel = `${date.split('(')[1]?.split(')')[0]?.trim() ?? ''}요일`;
        const fullRow = ORDER.map((k) => dayItems.find((d) => d.menuCategory === k));

        return (
          <React.Fragment key={date}>
            <div
              className='sticky left-0 z-10 px-0 py-0'
              aria-current={isToday ? 'date' : undefined}
            >
              <MenuDayButton label={weekdayLabel} focused={isToday} />
            </div>

            {fullRow.map((item, idx) =>
              item ? (
                <MenuItemButton
                  key={item.menuCategory}
                  time={timeLabelMap[item.menuCategory as keyof typeof timeLabelMap]}
                  menus={item.meals}
                  focused={isToday && item.menuCategory === nowCategory}
                />
              ) : (
                <div
                  key={`empty-${date}-${idx}`}
                  className='min-h-16 rounded-xl border border-dashed text-xs text-gray-400 flex items-center justify-center'
                >
                  등록된 메뉴가 없어요
                </div>
              ),
            )}
          </React.Fragment>
        );
      })}
    </div>
  );

  return (
    <div className='w-full'>
      <WeekHeader />
      <DesktopTable />
      {/* 모바일 UI는 DailyMenuView가 담당 */}
    </div>
  );
}
