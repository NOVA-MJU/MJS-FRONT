import { useEffect, useState } from 'react';
import { fetchNewsInfo } from '../../../api/news/newsApi';

const NewsSection = () => {
  const [categoryTab, setCategoryTab] = useState<CategoryTab>('REPORT');
  type CategoryTab = 'REPORT' | 'SOCIETY';

  const categoryLabel = {
    REPORT: '보도',
    SOCIETY: '사회',
  } as const;

  useEffect(() => {
    const fetchingNews = async () => {
      try {
        const response = fetchNewsInfo(categoryTab);
        console.log(response);
      } catch (e) {
        console.log('뉴스 가져오는데 오류 발생', e);
      }
    };
    fetchingNews();
  });
  return (
    <section className='w-full mt-5 '>
      <h1 className='text-xl font-bold text-mju-primary mb-4'>명대신문</h1>
      <div className='flex space-x-6 border-b border-gray-200 mb-6'>
        {(['REPORT', 'SOCIETY'] as CategoryTab[]).map((category) => (
          <button
            key={category}
            onClick={() => setCategoryTab(category)}
            className={`pb-2 w-full font-semibold ${
              categoryTab === category
                ? 'text-blue-15 border-b-2 border-b-blue-15'
                : 'text-gray-400'
            }`}
          >
            {categoryLabel[category]}
          </button>
        ))}
      </div>
    </section>
  );
};

export default NewsSection;
