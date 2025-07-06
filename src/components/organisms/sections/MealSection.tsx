'use client';

import MealComponent from '../../molecules/mainpage/mealComponent';

const dummyMeals = {
  아침: ['어쩌구저쩌구', '어쩌구저쩌구', '어쩌구저쩌구', '어쩌구저쩌구'],
  점심: ['어쩌구저쩌구', '어쩌구저쩌구', '어쩌구저쩌구', '어쩌구저쩌구'],
  저녁: ['어쩌구저쩌구', '어쩌구저쩌구', '어쩌구저쩌구', '어쩌구저쩌구'],
};

const getCurrentMealTime = () => {
  const hour = new Date().getHours();
  console.log(hour);
  if (hour < 10) return '아침';
  if (hour < 16) return '점심';
  return '저녁';
};

const MealSection = () => {
  const current = getCurrentMealTime();

  return (
    <section className='w-full  px-1 py-6'>
      <h1 className='text-xl font-bold text-mju-primary mb-4'>학식</h1>
      <div className='flex flex-col md:flex-row gap-4 justify-start'>
        {(['아침', '점심', '저녁'] as const).map((meal) => (
          <MealComponent
            key={meal}
            title={meal}
            items={dummyMeals[meal]}
            highlight={current === meal}
          />
        ))}
      </div>
    </section>
  );
};

export default MealSection;
