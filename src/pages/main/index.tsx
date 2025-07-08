import NoticeSection from '../../components/organisms/sections/NoticeSection';
import MealSection from '../../components/organisms/sections/MealSection';
import Layout from '../../components/templates/Layout';
import NewsSection from '../../components/organisms/sections/NewsSection';
const Main = () => {
  return (
    <Layout>
      <MealSection />
      <NoticeSection />
      <NewsSection />
    </Layout>
  );
};

export default Main;
