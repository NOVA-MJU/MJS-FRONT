import { useEffect, useState } from 'react';
import { useMenuData } from '@/hooks/menu/useMenuData';
import { DailyMenuView } from '@/components/atoms/Meal/Mobile/DailyMenuView';
import WeeklyMenuView from '@/components/atoms/Meal/Web/WeeklyMenuView';

export default function MenuPage() {
  const { isLoading, error, groupedByDate, keys, todayKey, getByDate } = useMenuData();

  // 모바일: 기본 오늘, 스와이프 시 인덱스 이동
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    if (!keys.length) return;
    const i = keys.indexOf(todayKey);
    setIdx(i >= 0 ? i : 0);
  }, [keys, todayKey]);

  const dateKey = keys[idx] ?? todayKey;

  // 현재 끼니
  const now = new Date();
  const h = now.getHours() + now.getMinutes() / 60;
  const nowCategory =
    h >= 6 && h < 9
      ? 'BREAKFAST'
      : h >= 11 && h < 14
        ? 'LUNCH'
        : h >= 16 && h < 18.5
          ? 'DINNER'
          : undefined;

  // 제스처/버튼 이동
  const onPrev = () => setIdx((i) => Math.max(0, i - 1));
  const onNext = () => setIdx((i) => Math.min(keys.length - 1, i + 1));

  if (isLoading) return <div className='p-4 text-gray-500'>식단 불러오는 중…</div>;
  if (error) return <div className='p-4 text-red-500'>식단 로딩 실패</div>;

  return (
    <div className='w-full'>
      {/* 모바일: 오늘(기본) + 좌우 이동 */}
      <DailyMenuView
        dateKey={dateKey}
        items={getByDate(dateKey)}
        nowCategory={nowCategory}
        onPrev={onPrev}
        onNext={onNext}
      />

      {/* 데스크톱: 주간 테이블 */}
      <WeeklyMenuView groupedByDate={groupedByDate} todayKey={todayKey} nowCategory={nowCategory} />
    </div>
  );
}
