/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { getWeeklyMenu } from '@/api/mealApi';
import { useNavigate } from 'react-router-dom';
import LoadingComponent from '../util/LoadingComponent';

const mealPlanStyle = css`
  display: flex;
  flex-direction: column;
  text-align: center;
  gap: 6px;
  font-size: 0.9rem;
  color: #333;
  height: 200px;
  overflow-y: auto; /* 내부 스크롤 활성화 */
  padding: 10px;
  box-sizing: border-box; /* 패딩 포함하여 높이 계산 */

  h4 {
    font-size: 1.1rem;
    font-weight: bold;
    color: #001f5c;
    margin-bottom: 7px;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: center;

    li {
      flex: 1 1 calc(33.33% - 5px);
      word-wrap: break-word; /* 긴 단어 줄바꿈 처리 */
    }
  }
`;

const MealPlan = () => {
  //빈 배열로 초기값 설정
  const [mealInfo, setMealInfo] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const handleMealPlanClick = () => {
    navigate('/meal');
  };
  useEffect(() => {
    const fetchMealPlan = async () => {
      try {
        const data = await getWeeklyMenu();
        setMealInfo(data || []);
        setLoading(false);
      } catch (error) {
        console.log('식단 조회 오류', error);
      }
    };
    fetchMealPlan();
  }, []);

  //요일 기준으로 맞춤
  const dayNames = ['일', '월', '화', '수', '목', '금', '토'];
  const todayDayName = dayNames[new Date().getDay()];

  //주말일 경우 학교 식단이 Null이기에 Null 방지
  const isWeekend = new Date().getDay() === 0 || new Date().getDay() === 6;

  if (isWeekend) {
    return (
      <div css={mealPlanStyle}>
        <strong style={{ marginBottom: '7px', color: 'red' }}>
          주말은 식단이 존재하지 않습니다!
        </strong>
      </div>
    );
  }
  //24 시간 3교대로 타임마다, 아침, 점심 , 저녁 fetching
  const currentHour = new Date().getHours();
  let mealCategory = 'BREAKFAST';

  if (currentHour >= 8 && currentHour < 16) {
    mealCategory = 'LUNCH';
  } else if (currentHour >= 16) {
    mealCategory = 'DINNER';
  }

  const todayMeals = mealInfo.filter((meal) => {
    const match = meal.date.match(/\(([^)]+)\)/); // 괄호 안의 문자 추출
    const mealDay = match ? match[1].trim() : ''; // 공백 제거
    return mealDay === todayDayName;
  });

  const firstMeal =
    todayMeals.find((meal) => meal.menuCategory === mealCategory) ||
    todayMeals.find((meal) => meal.menuCategory === 'LUNCH') ||
    todayMeals.find((meal) => meal.menuCategory === 'BREAKFAST') ||
    todayMeals.find((meal) => meal.menuCategory === 'DINNER') ||
    null;

  if (loading) {
    return (
      <LoadingComponent message="식단 정보를 불러오는 중입니다." />
    );
  }

  return (
    <div css={mealPlanStyle} onClick={handleMealPlanClick}>
      {/* <h4>오늘의 식단 | {firstMeal.menuCategory} </h4> */}
      {<strong style={{ marginBottom: '7px' }}>{firstMeal.date}</strong>}
      <ul>
        {firstMeal.meals.map((menu, index) => (
          <li key={index}>{menu}</li>
        ))}
      </ul>
    </div>
  );
};

export default MealPlan;
