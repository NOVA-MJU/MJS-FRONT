import NoticeSection from '../../components/organisms/sections/NoticeSection';
import MealSection from '../../components/organisms/sections/MealSection';
import Layout from '../../components/templates/Layout';
const Main = () => {
  return (
    <Layout>
      <MealSection />
      <NoticeSection />
    </Layout>
  );
};

export default Main;
