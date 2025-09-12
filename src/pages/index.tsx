import LayoutForMain from '../components/templates/LayoutForMain';
import MealSection from '../components/organisms/sections/MealSection';
import NoticeSection from '../components/organisms/sections/NoticeSection';
import NewsSection from '../components/organisms/sections/NewsSection';
import BroadcastSection from '../components/organisms/sections/BroadcastSection';
import AcademicCalendar from './academic-calendar';

const Main = () => {
  return (
    <LayoutForMain>
      <div className='hidden md:block md:order-1'>
        <MealSection />
      </div>

      <div className='order-1 md:order-2'>
        <NoticeSection />
      </div>

      <div className='order-3 md:order-3'>
        <NewsSection />
      </div>

      <div className='hidden md:block md:order-4'>
        <BroadcastSection />
      </div>

      <div className='order-2 md:hidden'>
        <AcademicCalendar />
      </div>
    </LayoutForMain>
  );
};

export default Main;
