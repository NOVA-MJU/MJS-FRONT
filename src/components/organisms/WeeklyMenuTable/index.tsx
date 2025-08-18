import React, { useMemo } from 'react';
import type { MenuItem } from '../../../api/menu';
import MenuDayButton from '../../molecules/MenuDayButton';
import MenuItemButton from '../../molecules/MenuItemButton';

const timeLabelMap = {
  BREAKFAST: '아침',
  LUNCH: '점심',
  DINNER: '저녁',
} as const;

const ORDER: Array<keyof typeof timeLabelMap> = ['BREAKFAST', 'LUNCH', 'DINNER'];

// NEW: 유틸 - 주차/주간 범위 계산 (월요일 시작)
function startOfWeek(d: Date, weekStartsOn = 1) {
  const date = new Date(d);
  const day = date.getDay(); // 0=Sun ... 6=Sat
  // 월요일 시작 기준으로 오프셋 계산
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
  const month = date.getMonth(); // 0-11
  const firstOfMonth = new Date(date.getFullYear(), month, 1);
  const firstWeekStart = startOfWeek(firstOfMonth, weekStartsOn);
  const thisWeekStart = startOfWeek(date, weekStartsOn);
  // 주차 = (해당 주의 월요일과 월 1일이 포함된 첫 주의 월요일 간 일수 차이)/7 + 1
  const diffDays = Math.floor(
    (thisWeekStart.getTime() - firstWeekStart.getTime()) / (1000 * 60 * 60 * 24),
  );
  return Math.floor(diffDays / 7) + 1;
}

function fmtMD(date: Date) {
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${m}.${d}`;
}

export default function WeeklyMenuTable({ menus }: { menus: MenuItem[] }) {
  const groupedByDate = useMemo(() => {
    const map = new Map<string, MenuItem[]>();
    for (const item of menus) {
      if (!map.has(item.date)) map.set(item.date, []);
      map.get(item.date)!.push(item);
    }
    for (const [, arr] of map.entries()) {
      arr.sort(
        (a, b) =>
          ORDER.indexOf(a.menuCategory as keyof typeof timeLabelMap) -
          ORDER.indexOf(b.menuCategory as keyof typeof timeLabelMap),
      );
    }
    return Array.from(map.entries()).sort(([d1], [d2]) => d1.localeCompare(d2));
  }, [menus]); // PERF: O(N) 변환 + 정렬 한 번만

  // 오늘/현재 끼니 계산
  const now = new Date();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const dow = ['일', '월', '화', '수', '목', '금', '토'][now.getDay()];
  const todayDate = `${mm}.${dd} (${dow})`; // API date 포맷 가정
  const hour = now.getHours() + now.getMinutes() / 60;
  const nowCategory =
    hour >= 6 && hour < 9
      ? 'BREAKFAST'
      : hour >= 11 && hour < 14
        ? 'LUNCH'
        : hour >= 16 && hour < 18.5
          ? 'DINNER'
          : undefined;

  // NEW: "8월 N주차" + "주간 기간" 계산 (월요일~일요일)
  const weekStartsOn = 1; // 월요일
  const weekStart = startOfWeek(now, weekStartsOn);
  const weekEnd = endOfWeek(now, weekStartsOn);
  const weekOfMonth = getWeekOfMonth(now, weekStartsOn);
  const monthLabel = now.getMonth() + 1;
  const weekRangeLabel = `${fmtMD(weekStart)} ~ ${fmtMD(weekEnd)}`;

  // --- 주차 헤더 (공통 상단) ---
  // NEW: 데스크톱/모바일 모두 위에 노출되는 주차 헤더
  const WeekHeader = () => (
    <div className='mb-3 md:mb-4 flex items-baseline justify-between'>
      <h3 className='text-base md:text-lg font-semibold text-mju-primary'>
        {/* 예: 8월 3주차 */}
        {monthLabel}월 {weekOfMonth}주차
      </h3>
      <span className='text-xs md:text-sm text-gray-500'>{weekRangeLabel}</span>
    </div>
  );

  // --- 데스크톱(≥md): 테이블 레이아웃 ---
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
            <div className='sticky left-0 z-10 px-0 py-0'>
              <MenuDayButton label={weekdayLabel} focused={isToday} aria-current={isToday} />
            </div>

            {fullRow.map((item, idx) =>
              item ? (
                <MenuItemButton
                  key={item.menuCategory}
                  time={timeLabelMap[item.menuCategory as keyof typeof timeLabelMap]}
                  menus={item.meals}
                  focused={isToday && item.menuCategory === nowCategory}
                  aria-current={isToday && item.menuCategory === nowCategory}
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

  const MobileCards = () => (
    <div className='md:hidden flex flex-col gap-4'>
      {groupedByDate.map(([date, dayItems]) => {
        const isToday = date === todayDate;
        const weekdayLabel = `${date.split('(')[1]?.split(')')[0]?.trim() ?? ''}요일`;
        const fullRow = ORDER.map((k) => dayItems.find((d) => d.menuCategory === k));

        return (
          <section
            key={date}
            className='rounded-lg border-2 border-grey-05 flex flex-col gap-4 p-4'
          >
            <div className='flex items-center justify-between'>
              <MenuDayButton label={weekdayLabel} focused={isToday} aria-current={isToday} />
              <span className='text-xs text-gray-500'>{date}</span>
            </div>

            <div className='grid grid-cols-1 gap-2'>
              {fullRow.map((item, idx) =>
                item ? (
                  <MenuItemButton
                    key={item.menuCategory}
                    time={timeLabelMap[item.menuCategory as keyof typeof timeLabelMap]}
                    menus={item.meals}
                    focused={isToday && item.menuCategory === nowCategory}
                    aria-current={isToday && item.menuCategory === nowCategory}
                  />
                ) : (
                  <div
                    key={`empty-mobile-${date}-${idx}`}
                    className='min-h-14 rounded-xl border border-dashed text-xs text-gray-400 flex items-center justify-center'
                  >
                    메뉴 없음
                  </div>
                ),
              )}
            </div>
          </section>
        );
      })}
    </div>
  );

  return (
    <div className='w-full'>
      {/* NEW: 주차 헤더 */}
      <WeekHeader />
      <DesktopTable />
      <MobileCards />
    </div>
  );
}
