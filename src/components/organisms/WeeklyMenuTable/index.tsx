import React from 'react';
import type { MenuItem } from '../../../api/menu';
import MenuDayButton from '../../molecules/MenuDayButton';
import MenuItemButton from '../../molecules/MenuItemButton';

const timeLabelMap = {
  BREAKFAST: '아침',
  LUNCH: '점심',
  DINNER: '저녁',
} as const;

export default function WeeklyMenuTable({ menus }: { menus: MenuItem[] }) {
  const days = menus.reduce<MenuItem[][]>((groups, item) => {
    if (groups.length === 0 || groups[groups.length - 1].length === 3) {
      groups.push([item]);
    } else {
      groups[groups.length - 1].push(item);
    }
    return groups;
  }, []);

  /**
   * 오늘 날짜 계산
   */
  const now = new Date();
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  const dow = ['일', '월', '화', '수', '목', '금', '토'][now.getDay()];
  const todayDate = `${mm}.${dd} (${dow})`; // API의 date 필드 형식에 맞춤
  const hour = now.getHours() + now.getMinutes() / 60;
  const nowCategory =
    hour >= 6 && hour < 9
      ? 'BREAKFAST'
      : hour >= 11 && hour < 14
        ? 'LUNCH'
        : hour >= 16 && hour < 18.5
          ? 'DINNER'
          : undefined;

  return (
    <div className='grid grid-cols-[80px_repeat(3,1fr)] gap-6'>
      {days.map((dayItems) => {
        const date = dayItems[0].date; // ex) "07.14 (월)"
        const isToday = date === todayDate;

        return (
          <React.Fragment key={date}>
            <MenuDayButton
              label={`${date.split('(')[1]?.split(')')[0]?.trim() ?? ''}요일`}
              focused={isToday}
            />
            {dayItems.map((item) => (
              <MenuItemButton
                key={item.menuCategory}
                time={timeLabelMap[item.menuCategory]}
                menus={item.meals}
                focused={isToday && item.menuCategory === nowCategory}
              />
            ))}
          </React.Fragment>
        );
      })}
    </div>
  );
}
