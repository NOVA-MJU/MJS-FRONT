import LayoutForMain from '../components/templates/LayoutForMain';
import MealSection from '../components/organisms/Sections/MealSection';
import NoticeSection from '../components/organisms/Sections/NoticeSection';
import NewsSection from '../components/organisms/Sections/NewsSection';
import BroadcastSection from '../components/organisms/Sections/BroadcastSection';
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
