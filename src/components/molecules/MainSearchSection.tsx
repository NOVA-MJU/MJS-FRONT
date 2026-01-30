import { useLocation, useNavigate } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';

export default function MainSearchSection() {
  const navigate = useNavigate();
  const location = useLocation();

  type CategoryItem = {
    id: number;
    label: string;
    imageUrl: string | null;
    path: string;
  };

  const recommendedCategories: CategoryItem[] = [
    { id: 1, label: '학식', imageUrl: '/main/main_MJMeal.png', path: '/meal' },
    { id: 2, label: '명지도', imageUrl: '/main/main_MJMap.png', path: '/map' },
    { id: 3, label: '학사일정', imageUrl: '/main/main_MJCalender.png', path: '/academic-calendar' },
    { id: 4, label: '멘토링', imageUrl: null, path: '/mentoring' },
  ];

  const handleCategoryClick = (path: string) => {
    navigate(path);
  };

  const handleSearchBarClick = () => {
    navigate('/search', {
      state: { backgroundLocation: location },
    });
  };

  return (
    <div className='relative flex h-full w-full flex-col items-center justify-start px-6 pt-8'>
      <div className='flex h-[230px] w-full max-w-md flex-col items-center justify-center gap-2'>
        <div className='relative'>
          <div className='bg-blue-35 text-caption01 absolute -top-10 left-1/2 -translate-x-1/2 rounded-full px-4 py-2 whitespace-nowrap text-white shadow-md'>
            명지대에 대한 무엇이든 Go!
          </div>
          <div className='bg-blue-35 absolute -top-4 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45'></div>
        </div>

        <button
          type='button'
          onClick={handleSearchBarClick}
          className='border-blue-35 flex w-full items-center justify-between rounded-full border-2 bg-white px-6 py-3 text-left shadow-sm'
        >
          <span className='text-body03 text-grey-30 flex-1 truncate'>검색어를 입력해 주세요.</span>
          <FaSearch className='text-blue-35 flex-shrink-0' size={20} />
        </button>
      </div>

      <div className='-mt-5 mb-18 flex w-full max-w-md flex-col items-center gap-1.5'>
        <p className='text-body04 text-grey-30'>추천 검색어 예시</p>

        <div className='flex w-full justify-center gap-3'>
          {recommendedCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.path)}
              className='flex flex-col items-center gap-1 rounded-2xl bg-white p-3 shadow-sm transition-all hover:scale-105 hover:shadow-md active:scale-95'
            >
              <div className='flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl'>
                {category.imageUrl ? (
                  <img
                    src={category.imageUrl}
                    alt={category.label}
                    className='h-full w-full object-contain p-2'
                  />
                ) : (
                  <div className='h-full w-full' />
                )}
              </div>
              <span className='text-caption01 text-grey-40'>{category.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className='absolute inset-x-0 -bottom-10'>
        <div className='flex items-center justify-between'>
          <div className='slide-indicator-anim-left pl-2'>
            <img src='/main/leftArrow.png' alt='이전' className='h-auto w-8' />
          </div>

          <div className='slide-indicator-anim-right relative flex items-center justify-center pr-2'>
            <img src='/main/rightArrow.png' alt='다음' className='h-auto w-8' />

            <div className='absolute -top-10 translate-x-[-40%]'>
              <div className='bg-blue-35 text-caption01 rounded-full px-4 py-2 whitespace-nowrap text-white shadow-md'>
                옆으로 슬라이드
              </div>
              <div className='bg-blue-35 absolute right-4 -bottom-1 h-3 w-3 rotate-45' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
