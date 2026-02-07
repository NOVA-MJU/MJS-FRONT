import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMenus } from '../../../api/menu';
import { IoIosArrowForward } from 'react-icons/io';
import Divider from '../../atoms/Divider';
import { Skeleton } from '@/components/atoms/Skeleton';
import { useResponsive } from '@/hooks/useResponse';
import { ICON_SIZE_LG } from '@/constants/common';
import { handleError } from '@/utils/error';

type UIMealKey = '아침' | '점심' | '저녁';
type MenuCategory = 'BREAKFAST' | 'LUNCH' | 'DINNER';
type MenuItem = { date: string; menuCategory: MenuCategory; meals: string[] };

const getKSTInfo = (d: Date = new Date()) => {
  const formatter = new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    weekday: 'short',
    hour12: false,
  });

  const parts = formatter.formatToParts(d);
  const find = (type: string) => parts.find((p) => p.type === type)?.value || '';

  const month = find('month');
  const day = find('day');
  const dow = find('weekday');
  const hour = parseInt(find('hour'));
  const minute = parseInt(find('minute'));

  return {
    month,
    day,
    dow,
    hour,
    minute,
    // API 요청용 형식: "02.01 (일)"
    apiDateLabel: `${month.padStart(2, '0')}.${day.padStart(2, '0')} (${dow})`,
    // UI 표시용 형식: "2월 1일 (일)"
    uiDateLabel: `${month}월 ${day}일 (${dow})`,
  };
};

type MealTimeInfo = {
  uiMealKey: UIMealKey; // '아침', '점심', '저녁'
  apiDateLabel: string; // "10.20 (월)" (API 요청용)
  uiFullLabel: string; // "10월 20일 (월) 아침" (UI 표시용)
  apiCategory: MenuCategory; // 'BREAKFAST', 'LUNCH', 'DINNER'
};

/**
 * KST 기준으로 현재 표시해야 할 식단 정보를 반환합니다.
 */
const getTargetMealInfo = (): MealTimeInfo => {
  const kst = getKSTInfo();
  const kstSum = kst.hour + kst.minute / 60;

  let uiMealKey: UIMealKey;
  let apiCategory: MenuCategory;

  if (kstSum < 9.0) {
    uiMealKey = '아침';
    apiCategory = 'BREAKFAST';
  } else if (kstSum < 14.0) {
    uiMealKey = '점심';
    apiCategory = 'LUNCH';
  } else {
    uiMealKey = '저녁';
    apiCategory = 'DINNER';
  }

  return {
    uiMealKey,
    apiDateLabel: kst.apiDateLabel,
    uiFullLabel: `${kst.uiDateLabel} ${uiMealKey}`,
    apiCategory,
  };
};

const normalizeLabel = (s: string) => s.replace(/\s+/g, '');

export default function MealSection() {
  const [mealInfo, setMealInfo] = useState<MealTimeInfo>(getTargetMealInfo());
  const [meals, setMeals] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // KST 기준으로 주말인지 확인
  const kst = getKSTInfo();
  const isWeekend = kst.dow === '토' || kst.dow === '일';

  const { isDesktop } = useResponsive();

  useEffect(() => {
    if (isWeekend) {
      setIsLoading(false);
      return;
    }

    (async () => {
      try {
        setIsLoading(true);

        const list: MenuItem[] = await getMenus();

        const currentMealInfo = getTargetMealInfo();
        setMealInfo(currentMealInfo);

        const targetApiDate = normalizeLabel(currentMealInfo.apiDateLabel);
        const foundMeal = list.find(
          (x) =>
            normalizeLabel(x.date) === targetApiDate &&
            x.menuCategory === currentMealInfo.apiCategory,
        );

        if (foundMeal) {
          setMeals(foundMeal.meals ?? []);
        } else {
          setMeals([]);
        }
      } catch (e) {
        handleError(e, '식단 정보를 불러오는 중 오류가 발생했습니다.', { showToast: false });
        setMeals([]);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [isWeekend]);

  /**
   * 데스크탑 뷰
   */
  if (isDesktop)
    return (
      <section className='flex w-full flex-col gap-3'>
        <div className='flex items-center justify-between px-3'>
          <h3 className='text-heading02 text-mju-primary'>학식</h3>
          <Link to='/menu'>
            <IoIosArrowForward className='text-blue-10' size={ICON_SIZE_LG} />
          </Link>
        </div>
        <div className='border-grey-05 flex flex-col gap-6 rounded-xl border-2 p-6'>
          <h3 className='text-body02 text-mju-secondary'>{mealInfo.uiFullLabel}</h3>
          <Divider variant='thin' />
          <ul className='grid grid-cols-1 gap-y-3 md:grid-cols-2'>
            {isLoading && [...Array(6)].map((_, i) => <Skeleton key={i} className='h-6 w-48' />)}
            {!isLoading && meals.length === 0 && (
              <li className='text-body03'>식단 정보가 없습니다.</li>
            )}
            {!isLoading &&
              meals.map((meal, index) => (
                <li key={index} className='text-body03'>
                  {meal}
                </li>
              ))}
          </ul>
        </div>
      </section>
    );

  /**
   * 모바일 뷰
   */
  if (!isDesktop)
    return (
      <section className='border-grey-10 flex w-full flex-col gap-2 rounded-[10px] border-[1px] p-4'>
        <Link to='/menu' className='flex flex-col gap-2'>
          {/* 헤더: 아이콘 + 현재 식단 라벨 (날짜/시간) */}
          <div className='flex items-center gap-2'>
            <img src='/img/meal-icon.png' alt='식단 아이콘' className='h-6 w-6 object-contain' />
            <span className='text-body02 font-semibold text-black'>{mealInfo.uiFullLabel}</span>
          </div>

          {/* 바디: 식단 내용 */}
          <div className='px-[3px] py-1'>
            {isLoading && (
              <div className='flex flex-col gap-1'>
                <Skeleton className='h-5 w-full' />
                <Skeleton className='h-5 w-3/4' />
              </div>
            )}
            {!isLoading && meals.length === 0 && (
              <p className='text-body05 text-grey-80'>등록된 식단 내용이 없습니다.</p>
            )}
            {!isLoading && meals.length > 0 && (
              <ul className='flex flex-wrap gap-x-2 gap-y-1'>
                {meals.map((meal, index) => (
                  <li key={index} className='text-body05 text-grey-80'>
                    {meal}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Link>
      </section>
    );
}
