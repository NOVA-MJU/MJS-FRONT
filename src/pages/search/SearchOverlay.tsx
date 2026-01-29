import { IoIosArrowBack } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';

import SearchBar from '@/components/atoms/SearchBar';

/**
 * 검색 오버레이 (route-modal)
 *
 * - 메인 등 기존 페이지 위에 덮어 쓰는 검색 전용 UI
 * - /search 경로로 진입했을 때 backgroundLocation 이 있는 경우에만 사용
 */
export default function SearchOverlay() {
  const navigate = useNavigate();

  return (
    <div className='fixed inset-0 z-50 flex justify-center bg-black/30'>
      <div className='flex h-full w-full max-w-[480px] flex-col bg-white'>
        {/* 상단 검색바 영역 */}
        <header className='flex items-center gap-2 px-4 pt-5 pb-3'>
          <button
            type='button'
            onClick={() => navigate(-1)}
            aria-label='검색 닫기'
            className='hover:bg-grey-05 flex h-9 w-9 items-center justify-center rounded-full'
          >
            <IoIosArrowBack size={22} />
          </button>

          <div className='flex-1'>
            <SearchBar className='bg-grey-02 w-full rounded-full' />
          </div>
        </header>

        <main className='flex-1 overflow-y-auto px-4 pb-6'>
          {/* 최근 검색어 */}
          <section className='mt-4'>
            <div className='mb-2 flex items-center justify-between'>
              <h2 className='text-body03 font-semibold text-black'>최근 검색어</h2>
              <button type='button' className='text-caption02 text-grey-30 hover:underline'>
                전체 삭제
              </button>
            </div>
            <div className='flex flex-wrap gap-2'>
              {['키워드 예시', '키워드 예시', '키워드 예시'].map((label) => (
                <button
                  key={label}
                  type='button'
                  className='bg-grey-02 text-caption02 text-grey-40 flex items-center gap-1 rounded-full px-3 py-1'
                >
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </section>

          {/* 추천 검색어 */}
          <section className='mt-6'>
            <h2 className='text-body03 mb-3 font-semibold text-black'>추천 검색어</h2>
            <div className='flex flex-wrap gap-2'>
              {['키워드 예시', '카테고리', '카테고리', '카테고리', '카테고리'].map((label) => (
                <button
                  key={label}
                  type='button'
                  className='bg-blue-05 text-caption02 text-blue-35 rounded-full px-3 py-1.5'
                >
                  {label}
                </button>
              ))}
            </div>
          </section>

          {/* 인기 검색어 */}
          <section className='mt-6'>
            <h2 className='text-body03 mb-3 font-semibold text-black'>인기 검색어</h2>
            <div className='text-caption01 grid grid-cols-2 gap-y-2'>
              {[1, 2, 3, 4, 5, 6].map((rank) => (
                <div key={rank} className='flex items-center gap-2'>
                  <span className='text-blue-35 w-4'>{rank}</span>
                  <span className='text-grey-40'>검색어 예시</span>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
