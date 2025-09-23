import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMenus } from '../../../api/menu';
import { IoIosArrowForward } from 'react-icons/io';
import Divider from '../../atoms/Divider';

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

export default function MealSection() {
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

  if (isWeekend()) return <></>;

  return (
    <section className='w-full flex flex-col gap-3'>
      <div className='px-3 flex justify-between items-center'>
        <h1 className='text-heading02 text-mju-primary'>학식</h1>
        <span>
          <IoIosArrowForward
            className='text-blue-10 cursor-pointer'
            onClick={handlePlusClick}
            size={20}
          />
        </span>
      </div>
      <div className='p-6 flex flex-col rounded-xl border-2 border-grey-05 gap-6'>
        <h3 className='text-body02 text-mju-secondary'>{current}</h3>
        <Divider variant='thin' />
        <ul className='grid grid-cols-1 md:grid-cols-2 gap-y-3'>
          {todayMeals[current].map((meal, index) => (
            <li key={index} className='text-body03'>
              {meal}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
