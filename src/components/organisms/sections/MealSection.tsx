import { fetchMealInfo } from '../../../api/main/meal-api';
import type { MealInfo } from '../../../types/meal/mealInfo';
import MealComponent from '../../molecules/mainpage/Meal';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus } from 'react-icons/fi';
const getCurrentMealTime = () => {
  const hour = new Date().getHours();
  if (hour < 10) return '아침';
  if (hour < 16) return '점심';
  return '저녁';
};

//서버에서 제공해주는 date : 07.07 (월)에 sync Format
const getTodayString = () => {
  const today = new Date();
  const mm = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'][today.getDay()];
  return `${mm}.${day} ( ${dayOfWeek} )`;
};

const MealSection = () => {
  const current = getCurrentMealTime();
  const navigator = useNavigate();
  const handlePlusClick = () => {
    navigator('/menu');
  };

  const [todayMeals, setTodayMeals] = useState<Record<'아침' | '점심' | '저녁', string[]>>({
    아침: [],
    점심: [],
    저녁: [],
  });

  //주말인 경우의 예외처리로직
  const isWeekend = () => {
    const day = new Date().getDay();
    return day === 0 || day === 6;
  };

  useEffect(() => {
    const fetchingMealSection = async () => {
      try {
        const response = await fetchMealInfo();
        console.log(response.data);
        const todayStr = getTodayString();
        const meals = response.data.filter((item) => item.date === todayStr);

        const mapped: Record<'아침' | '점심' | '저녁', string[]> = {
          아침: [],
          점심: [],
          저녁: [],
        };

        meals.forEach((m: MealInfo) => {
          if (m.menuCategory === 'BREAKFAST') mapped['아침'] = m.meals;
          if (m.menuCategory === 'LUNCH') mapped['점심'] = m.meals;
          if (m.menuCategory === 'DINNER') mapped['저녁'] = m.meals;
        });

        setTodayMeals(mapped);
      } catch (e) {
        console.log('식단 불러오는 중 오류 발생', e);
      }
    };
    fetchingMealSection();
  }, []);

  return (
    <section className='w-full px-1 py-6'>
      <div className='flex justify-between'>
        <h1 className='text-xl font-bold text-mju-primary mb-4'>학식</h1>
        <span>
          <FiPlus onClick={handlePlusClick} size={20} />
        </span>
      </div>

      {isWeekend() ? (
        <div className='text-gray-400 text-sm'>주말에는 학식이 제공되지 않습니다.</div>
      ) : (
        <div className='w-full md:flex-row gap-4 justify-start'>
          <MealComponent
            key={current}
            title={current}
            items={todayMeals[current]}
            highlight={true}
          />
        </div>
      )}
    </section>
  );
};
export default MealSection;
