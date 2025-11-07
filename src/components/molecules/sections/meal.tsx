import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMenus } from '../../../api/menu';
import { IoIosArrowForward } from 'react-icons/io';
import Divider from '../../atoms/Divider';
import { Skeleton } from '@/components/atoms/Skeleton';
import { useResponsive } from '@/hooks/useResponse';

type UIMealKey = '아침' | '점심' | '저녁';
type MenuCategory = 'BREAKFAST' | 'LUNCH' | 'DINNER';
type MenuItem = { date: string; menuCategory: MenuCategory; meals: string[] };

const DAY_KO = ['일', '월', '화', '수', '목', '금', '토'] as const;

/**
 * 현재 한국 시간(KST)을 기준으로 Date 객체를 반환합니다.
 * 식단 컴포넌트는 무조건 한국 시간을 기준으로 동작합니다.
 */
const getKSTDate = (): Date => {
  const now = new Date(); // 현재 로컬 시간
  const utc = now.getTime() + now.getTimezoneOffset() * 60000; // UTC 시간 (밀리초)
  const kstOffset = 9 * 60 * 60000; // KST는 UTC+9
  return new Date(utc + kstOffset);
};

/**
 * KST Date 객체를 API 응답 형식('MM.DD (요일)')으로 변환합니다.
 * @example "10.20 (월)"
 */
const getApiDateLabel = (d: Date) => {
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const dow = DAY_KO[d.getDay()];
  return `${mm}.${dd} (${dow})`;
};

/**
 * KST Date 객체를 UI 표시 형식('M월 D일 (요일)')으로 변환합니다.
 * @example "10월 20일 (월)"
 */
const getUIDateLabel = (d: Date) => {
  const mm = d.getMonth() + 1;
  const dd = d.getDate();
  const dow = DAY_KO[d.getDay()];
  return `${mm}월 ${dd}일 (${dow})`;
};

type MealTimeInfo = {
  uiMealKey: UIMealKey; // '아침', '점심', '저녁'
  apiDateLabel: string; // "10.20 (월)" (API 요청용)
  uiFullLabel: string; // "10월 20일 (월) 아침" (UI 표시용)
  apiCategory: MenuCategory; // 'BREAKFAST', 'LUNCH', 'DINNER'
};

/**
 * KST 기준으로 현재 표시해야 할 식단 정보(시간, 날짜)를 반환합니다.
 * - 09:00 이전: 오늘 아침
 * - 14:00 이전: 오늘 점심
 * - 18:30 이전: 오늘 저녁
 * - 18:30 이후: 내일 아침
 */
const getTargetMealInfo = (): MealTimeInfo => {
  const kstNow = getKSTDate();
  const kstHour = kstNow.getHours();
  const kstMinutes = kstNow.getMinutes();
  const kstTime = kstHour + kstMinutes / 60; // 예: 18:30 -> 18.5

  let targetDate = kstNow;
  let uiMealKey: UIMealKey;
  let apiCategory: MenuCategory;

  if (kstTime < 9.0) {
    uiMealKey = '아침';
    apiCategory = 'BREAKFAST';
  } else if (kstTime < 14.0) {
    uiMealKey = '점심';
    apiCategory = 'LUNCH';
  } else if (kstTime < 18.5) {
    uiMealKey = '저녁';
    apiCategory = 'DINNER';
  } else {
    // 18:30 이후는 다음날 아침
    uiMealKey = '아침';
    apiCategory = 'BREAKFAST';
    const tomorrow = new Date(kstNow);
    tomorrow.setDate(tomorrow.getDate() + 1);
    targetDate = tomorrow;
  }

  const apiDateLabel = getApiDateLabel(targetDate);
  const uiDateLabel = getUIDateLabel(targetDate);

  return {
    uiMealKey,
    apiDateLabel,
    uiFullLabel: `${uiDateLabel} ${uiMealKey}`,
    apiCategory,
  };
};

const normalizeLabel = (s: string) => s.replace(/\s+/g, '');

export default function MealSection() {
  const [mealInfo, setMealInfo] = useState<MealTimeInfo>(getTargetMealInfo());
  const [meals, setMeals] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // KST 기준으로 주말인지 확인
  const kstDay = getKSTDate().getDay();
  const isWeekend = kstDay === 0 || kstDay === 6;

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
        console.error('MealSection.tsx::fetching meal data', e);
        setMeals([]);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [isWeekend]);

  if (isWeekend) return null;

  /**
   * 데스크탑 뷰
   */
  if (isDesktop)
    return (
      <section className='w-full flex flex-col gap-3'>
        <div className='px-3 flex justify-between items-center'>
          <h1 className='text-heading02 text-mju-primary'>학식</h1>
          <Link to='/menu'>
            <IoIosArrowForward className='text-blue-10' size={20} />
          </Link>
        </div>
        <div className='p-6 flex flex-col rounded-xl border-2 border-grey-05 gap-6'>
          <h3 className='text-body02 text-mju-secondary'>{mealInfo.uiFullLabel}</h3>
          <Divider variant='thin' />
          <ul className='grid grid-cols-1 md:grid-cols-2 gap-y-3'>
            {isLoading && [...Array(6)].map((_, i) => <Skeleton key={i} className='w-48 h-6' />)}
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
      <section>
        <Link to='/menu'>
          <div className='flex flex-col items-center gap-2'>
            <p className='text-body02'>9월 11일 (목) 점심</p>
            <Divider variant='thin' />
            <div className='flex flex-wrap justify-center gap-x-2 gap-y-1'>
              {isLoading && (
                <>
                  <Skeleton className='w-40 h-5' />
                  <Skeleton className='w-32 h-5' />
                  <Skeleton className='w-28 h-5' />
                  <Skeleton className='w-40 h-5' />
                  <Skeleton className='w-28 h-5' />
                </>
              )}
              {!isLoading && !meals && (
                <li className='text-body03 text-center'>식단 정보가 없습니다.</li>
              )}
              {!isLoading &&
                meals &&
                meals.map((meal, index) => (
                  <span key={index} className='text-body03 whitespace-nowrap'>
                    {meal}
                    {index < meals.length - 1 && ', '}
                  </span>
                ))}
            </div>
          </div>
        </Link>
      </section>
    );
}
