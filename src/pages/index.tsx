import LayoutForMain from '../components/templates/LayoutForMain';
import MealSection from '../components/organisms/sections/MealSection';
import NoticeSection from '../components/organisms/sections/NoticeSection';
import NewsSection from '../components/organisms/sections/NewsSection';
import BroadcastSection from '../components/organisms/sections/BroadcastSection';
import AcademicCalendar from './academic-calendar';
const Main = () => {
  return (
    <LayoutForMain>
      <div className='hidden md:block'>
        <MealSection />
      </div>
      <NoticeSection />
      <NewsSection />
      <div>
        <AcademicCalendar />
      </div>
      <BroadcastSection />
    </LayoutForMain>
  );
};

export default Main;
