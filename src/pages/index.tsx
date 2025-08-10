import NoticeSection from '../components/organisms/sections/NoticeSection';
import MealSection from '../components/organisms/sections/MealSection';
import NewsSection from '../components/organisms/sections/NewsSection';
import LayoutForMain from '../components/templates/LayoutForMain';
import BroadcastSection from '../components/organisms/sections/BroadcastSection';

const Main = () => {
  return (
    <LayoutForMain>
      <MealSection />
      <NoticeSection />
      <NewsSection />
      <BroadcastSection />
    </LayoutForMain>
  );
};

export default Main;
