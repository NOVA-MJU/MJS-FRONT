import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMenuData } from '@/hooks/menu/useMenuData';
import { DailyMenuView } from '@/components/atoms/Meal/Mobile/DailyMenuView';
import WeeklyMenuView from '@/components/atoms/Meal/Web/WeeklyMenuView';
import { Typography } from '@/components/atoms/Typography';
import LoadingIndicator from '@/components/atoms/LoadingIndicator';

/**
 * 학식 메뉴 페이지
 *
 * 일일 및 주간 학식 메뉴를 표시하는 페이지입니다.
 * 모바일에서는 DailyMenuView, 데스크톱에서는 WeeklyMenuView를 표시합니다.
 * (컴포넌트 내부에서 반응형 처리)
 */
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
    <div className='w-full md:w-[1280px] flex-1 flex flex-col p-4 md:p-12 gap-2 mx-auto'>
      <Link to='/menu'>
        <Typography variant='heading02' className='md:hidden block  text-mju-primary'>
          학식
        </Typography>
        <Typography variant='heading01' className='hidden md:block text-mju-primary'>
          학식
        </Typography>
      </Link>
      <hr className='w-[381px] border-t-2 border-blue-10 rounded-xl md:hidden' />
      <div className='flex flex-row justify-center mt-4 '>
        <Typography
          variant='heading02'
          className='text-mju-primary text-center hidden md:flex flex-row justify-center '
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
