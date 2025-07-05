import MealSection from '../../../components/organisms/sections/MealSection';
import NotionSection from '../../../components/organisms/sections/NotionSection';

const MainPage = () => {
  console.log('MainPage 렌더링');
  return (
    <div>
      {' '}
      <MealSection />
      <NotionSection />
    </div>
  );
};

export default MainPage;
