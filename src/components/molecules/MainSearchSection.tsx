import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

/**
 * 메인 페이지 검색 섹션
 *
 * 첫 화면으로 표시되는 검색 UI입니다.
 * - 중앙 정렬된 검색창
 * - "명지에 대한 무엇이든 Go!" 안내 텍스트
 * - 추천 검색어 버튼들 (학식, 명지도, 학사일정, 멘토링)
 * - 좌우 네비게이션 화살표
 * - 각 버튼 클릭 시 해당 페이지로 이동
 */
export default function MainSearchSection() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  /**
   * 추천 검색어 카테고리 데이터
   * TODO: 추후 API로 동적으로 받아올 예정
   */
  const recommendedCategories = [
    { id: 1, label: '학식', icon: '🍚', path: '/meal' },
    { id: 2, label: '명지도', icon: '🗺️', path: '/map' },
    { id: 3, label: '학사일정', icon: '📅', path: '/academic-calendar' },
    { id: 4, label: '멘토링', icon: '👥', path: '/mentoring' },
  ];

  /**
   * 검색 실행 핸들러
   * TODO: 검색 API 연동 예정
   */
  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  /**
   * Enter 키 입력 핸들러
   */
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  /**
   * 카테고리 클릭 핸들러
   */
  const handleCategoryClick = (path: string) => {
    navigate(path);
  };

  return (
    <div className='relative flex h-screen w-full flex-col items-center justify-start px-6 pt-12'>
      {/* 검색창 영역 */}
      <div className='flex h-[230px] w-full max-w-md flex-col items-center justify-center gap-2'>
        {/* 안내 텍스트 */}
        <div className='relative'>
          <div className='bg-blue-35 text-caption01 absolute -top-10 left-1/2 -translate-x-1/2 rounded-full px-4 py-2 whitespace-nowrap text-white shadow-md'>
            명지대에 대한 무엇이든 Go!
          </div>
          {/* 말풍선 꼬리 */}
          <div className='bg-blue-35 absolute -top-4 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45'></div>
        </div>

        {/* 검색 입력창 */}
        <div className='border-blue-35 flex w-full items-center gap-2 rounded-full border-2 bg-white px-6 py-3 shadow-sm transition-all hover:shadow-md'>
          <input
            type='text'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder='검색어를 입력하세요'
            className='text-body03 placeholder:text-grey-20 flex-1 outline-none'
          />
          <button
            onClick={handleSearch}
            className='text-blue-35 hover:text-blue-40 transition-colors'
            aria-label='검색'
          >
            <FaSearch size={20} />
          </button>
        </div>
      </div>

      {/* 추천 검색어 영역 */}
      <div className='-mt-5 flex w-full max-w-md flex-col items-center gap-1.5'>
        <p className='text-body04 text-grey-30'>추천 검색어 예시</p>

        {/* 카테고리 버튼 Flex 레이아웃 */}
        <div className='flex w-full justify-center gap-3'>
          {recommendedCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryClick(category.path)}
              className='flex flex-col items-center gap-1 rounded-2xl bg-white p-3 shadow-sm transition-all hover:scale-105 hover:shadow-md active:scale-95'
            >
              {/* 아이콘 */}
              <div className='bg-blue-05 flex h-14 w-14 items-center justify-center rounded-xl text-2xl'>
                {category.icon}
              </div>
              {/* 라벨 */}
              <span className='text-caption01 text-grey-40'>{category.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 좌우 화살표 + 말풍선 영역 */}
      <div className='absolute inset-x-0 bottom-90'>
        <div className='flex items-center justify-between'>
          <div className='pl-2'>
            <img src='/main/leftArrow.png' alt='이전' className='h-auto w-8' />
          </div>

          {/* 오른쪽 화살표 + 말풍선 */}
          <div className='relative flex items-center justify-center pr-2'>
            <img src='/main/rightArrow.png' alt='다음' className='h-auto w-8' />

            {/* 말풍선은 화살표 기준으로 살짝 왼쪽으로 이동 */}
            <div className='absolute -top-10 translate-x-[-40%]'>
              <div className='bg-blue-35 text-caption01 rounded-full px-4 py-2 whitespace-nowrap text-white shadow-md'>
                옆으로 슬라이드
              </div>
              {/* 말풍선 꼬리: 말풍선 오른쪽 아래에 배치해서 화살표를 가리키도록 */}
              <div className='bg-blue-35 absolute right-4 -bottom-1 h-3 w-3 rotate-45' />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
