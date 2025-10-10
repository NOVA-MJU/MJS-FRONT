import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useMenuData } from '@/hooks/menu/useMenuData';
import { DailyMenuView } from '@/components/atoms/Meal/Mobile/DailyMenuView';
import WeeklyMenuView from '@/components/atoms/Meal/Web/WeeklyMenuView';
import { Typography } from '@/components/atoms/Typography';
import LoadingIndicator from '@/components/atoms/LoadingIndicator';

export default function MenuPage() {
  const { isLoading, error, groupedByDate, keys, todayKey, getByDate } = useMenuData();

  // 모바일: 기본 오늘, 스와이프 시 인덱스 이동
  const [idx, setIdx] = useState<number | null>(null); //의도적으로 null로 시작하여, todayKey로 강제로 맞춘다.

  // 최초 1회만 todayKey로 맞추고, keys 길이 변하면 범위만 보정
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

  const dateKey = keys[idx] ?? todayKey; // 널 병합 연산자, keys[idx]가 null이면 todayKey

  // 현재 끼니
  type Meal = 'BREAKFAST' | 'LUNCH' | 'DINNER';
  const now = new Date();
  const h = now.getHours() + now.getMinutes() / 60;
  const nowCategory: Meal | undefined =
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

      {/* 모바일: 오늘(기본) + 좌우 이동 */}
      <DailyMenuView
        dateKey={dateKey}
        items={getByDate(dateKey) ?? []}
        nowCategory={nowCategory}
        onPrev={onPrev}
        onNext={onNext}
      />

      {/* 데스크톱: 주간 테이블 */}
      <WeeklyMenuView groupedByDate={groupedByDate} todayKey={todayKey} nowCategory={nowCategory} />
    </div>
  );
}
