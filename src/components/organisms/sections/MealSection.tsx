import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
import { getMenus } from '../../../api/menu';

import MealComponent from '../../molecules/mainpage/Meal';

type UIMealKey = '아침' | '점심' | '저녁';
type MenuCategory = 'BREAKFAST' | 'LUNCH' | 'DINNER';
type MenuItem = { date: string; menuCategory: MenuCategory; meals: string[] };

const DAY_KO = ['일', '월', '화', '수', '목', '금', '토'] as const;

const getCurrentMealTime = (): UIMealKey => {
  const hour = new Date().getHours();
  if (hour < 10) return '아침';
  if (hour < 16) return '점심';
  return '저녁';
};

const getTodayLabel = () => {
  const d = new Date();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  const dow = DAY_KO[d.getDay()];
  return `${mm}.${dd} (${dow})`;
};

const normalizeLabel = (s: string) => s.replace(/\s+/g, '');
const catToUiKey = (c: MenuCategory): UIMealKey =>
  c === 'BREAKFAST' ? '아침' : c === 'LUNCH' ? '점심' : '저녁';

const MealSection = () => {
  const current = getCurrentMealTime();
  const navigator = useNavigate();

  const handlePlusClick = () => navigator('/menu');

  const [todayMeals, setTodayMeals] = useState<Record<UIMealKey, string[]>>({
    아침: [],
    점심: [],
    저녁: [],
  });

  const isWeekend = () => {
    const day = new Date().getDay();
    return day === 0 || day === 6;
  };

  useEffect(() => {
    (async () => {
      try {
        // getMenus가 Axios라면: const list: MenuItem[] = (await getMenus()).data;
        const list: MenuItem[] = await getMenus();

        const today = getTodayLabel();
        const todays = list.filter((x) => normalizeLabel(x.date) === normalizeLabel(today));

        const next: Record<UIMealKey, string[]> = { 아침: [], 점심: [], 저녁: [] };
        todays.forEach((m) => {
          const key = catToUiKey(m.menuCategory);
          next[key] = m.meals ?? [];
        });

        setTodayMeals(next);
      } catch (e) {
        console.error('식단 불러오는 중 오류 발생', e);
      }
    })();
  }, []);

  return (
    <section className='w-full px-1 py-6 '>
      <div className='flex justify-between'>
        <h1 className='text-xl font-bold text-mju-primary mb-4'>학식</h1>
        <span>
          <FiPlus onClick={handlePlusClick} size={20} />
        </span>
      </div>

      {isWeekend() ? (
        <div className='text-grey-40 text-sm'>주말에는 학식이 제공되지 않습니다.</div>
      ) : (
        <div className='w-full md:flex-row gap-4 justify-start'>
          {/* 현재 끼만 보여줄 거면 아래 한 개만, 
             세 끼 모두 보여주고 현재 끼만 하이라이트하려면 3개 렌더 + highlight 조건 분기 */}
          <MealComponent key={current} title={current} items={todayMeals[current]} highlight />
        </div>
      )}
    </section>
  );
};

export default MealSection;
