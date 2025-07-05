import NotionSection from '../../components/organisms/sections/NotionSection';
import MealSection from '../../components/organisms/sections/MealSection';
import Layout from '../../components/templates/Layout';
const Main = () => {
  return (
    <Layout>
      <MealSection />
      <NotionSection />
    </Layout>
  );
};

export default Main;
