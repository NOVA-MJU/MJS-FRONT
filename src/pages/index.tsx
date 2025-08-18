import LayoutForMain from '../components/templates/LayoutForMain';
import MealSection from '../components/organisms/sections/MealSection';
import NoticeSection from '../components/organisms/sections/NoticeSection';
import NewsSection from '../components/organisms/sections/NewsSection';
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
