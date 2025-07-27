import NoticeSection from '../../components/organisms/Sections/NoticeSection';
import MealSection from '../../components/organisms/Sections/MealSection';
import NewsSection from '../../components/organisms/Sections/NewsSection';
import LayoutForMain from '../../components/templates/LayoutForMain';
import BroadcastSection from '../../components/organisms/Sections/BroadcastSection';
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
