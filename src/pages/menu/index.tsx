import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMenuData } from '@/hooks/menu/useMenuData';
import { DailyMenuView } from '@/components/atoms/Meal/Mobile/DailyMenuView';
import WeeklyMenuView from '@/components/atoms/Meal/Web/WeeklyMenuView';
import { Typography } from '@/components/atoms/Typography';
import LoadingIndicator from '@/components/atoms/LoadingIndicator';

export default function MenuPage() {
  const { isLoading, error, groupedByDate, keys, todayKey, getByDate } = useMenuData();

  const [idx, setIdx] = useState<number | null>(null);

  useEffect(() => {
    if (!keys.length) return;
    setIdx((prev) => {
      if (prev === null) {
        const i = keys.indexOf(todayKey);
        return i >= 0 ? i : 0;
      }
      const max = Math.max(0, keys.length - 1);
      return Math.min(Math.max(prev, 0), max);
    });
  }, [keys, todayKey]);

  const dateKey = keys[idx] ?? todayKey;

  type currentMeal = 'BREAKFAST' | 'LUNCH' | 'DINNER';
  const now = new Date();
  const h = now.getHours() + now.getMinutes() / 60;
  const nowCategory: currentMeal | undefined =
    h >= 6 && h < 9
      ? 'BREAKFAST'
      : h >= 11 && h < 14
        ? 'LUNCH'
        : h >= 16 && h < 18.5
          ? 'DINNER'
          : undefined;

  const atStart = idx <= 0;
  const atEnd = idx >= keys.length - 1;

  const onPrev = () => {
    if (atStart) return;
    setIdx((i) => (i == null ? 0 : Math.max(0, i - 1)));
  };
  const onNext = () => {
    if (atEnd) return;
    setIdx((i) => (i == null ? 0 : Math.min(keys.length - 1, i + 1)));
  };

  if (isLoading) return <LoadingIndicator />;
  if (error) return <div className='p-4 text-red-500'>식단 로딩 실패</div>;

  return (
    <div className='mx-auto flex w-full flex-1 flex-col gap-2 p-4 md:w-[1280px] md:p-12'>
      <Link to='/menu'>
        <Typography variant='heading02' className='text-mju-primary block md:hidden'>
          학식
        </Typography>
        <Typography variant='heading01' className='text-mju-primary hidden md:block'>
          학식
        </Typography>
      </Link>
      <hr className='border-blue-10 w-[381px] rounded-xl border-t-2 md:hidden' />
      <div className='mt-4 flex flex-row justify-center'>
        <Typography
          variant='heading02'
          className='text-mju-primary hidden flex-row justify-center text-center md:flex'
        >
          {new Date().toLocaleDateString('ko-KR', {
            month: 'long',
            day: 'numeric',
            weekday: 'long',
          })}
        </Typography>
      </div>

      <DailyMenuView
        dateKey={dateKey}
        items={getByDate(dateKey) ?? []}
        nowCategory={nowCategory}
        onPrev={onPrev}
        onNext={onNext}
      />

      <WeeklyMenuView groupedByDate={groupedByDate} todayKey={todayKey} nowCategory={nowCategory} />
    </div>
  );
}
