import { IoIosArrowBack } from 'react-icons/io';
import { IoIosClose } from 'react-icons/io';
import { useNavigate } from 'react-router-dom';

import SearchBar from '@/components/atoms/SearchBar';

export default function SearchOverlay() {
  const navigate = useNavigate();

  return (
    <div className='fixed inset-0 z-50 flex justify-center bg-black/30 min-[769px]:hidden'>
      <div className='flex h-full w-full flex-col bg-white'>
        <header className='flex items-center gap-4 px-4 pt-4'>
          <button
            type='button'
            onClick={() => navigate(-1)}
            aria-label='검색 닫기'
            className='hover:bg-grey-05 flex cursor-pointer items-center justify-center rounded-full'
          >
            <IoIosArrowBack size={22} className='h-6 w-6' />
          </button>

          <div className='flex-1'>
            <SearchBar
              className='bg-grey-02 w-full rounded-full border-none px-[15px] py-[9px]'
              iconClassName='text-grey-30'
            />
          </div>
        </header>

        <main className='flex-1 overflow-y-auto pl-5'>
          <section className='mt-8'>
            <div className='mb-2.5 flex items-center justify-between'>
              <h2 className='text-body02 font-semibold text-black'>최근 검색어</h2>
              <button
                type='button'
                className='text-caption02 text-grey-60 cursor-pointer pr-5 hover:underline'
              >
                전체 삭제
              </button>
            </div>
            <div className='no-scrollbar flex gap-2 overflow-x-auto scroll-smooth'>
              {['키워드 예시', '키워드 예시', '키워드 예시', '키워드 예시', '키워드 예시'].map(
                (label) => (
                  <button
                    key={label}
                    type='button'
                    className='border-grey-10 text-body05 text-grey-40 flex shrink-0 items-center gap-1.5 rounded-full border bg-white px-3 py-1.5'
                  >
                    <span>{label}</span>
                    <IoIosClose size={16} className='text-grey-20 cursor-pointer' />
                  </button>
                ),
              )}
            </div>
          </section>

          <section className='mt-8'>
            <h2 className='text-body02 mb-3 font-semibold text-black'>추천 검색어</h2>
            <div className='no-scrollbar flex gap-2 overflow-x-auto scroll-smooth'>
              {[
                '키워드 예시',
                '카테고리',
                '카테고리',
                '카테고리',
                '카테고리',
                '카테고리',
                '카테고리',
              ].map((label) => (
                <button
                  key={label}
                  type='button'
                  className='bg-blue-05 text-caption02 text-blue-35 flex shrink-0 cursor-pointer rounded-full px-3 py-1.5'
                >
                  {label}
                </button>
              ))}
            </div>
          </section>

          <section className='mt-8 pr-5'>
            <h2 className='text-body02 mb-3 font-semibold text-black'>인기 검색어</h2>
            <div className='text-caption01 grid grid-cols-2 gap-y-2'>
              {[1, 2, 3, 4, 5, 6].map((rank) => (
                <div key={rank} className='flex items-center gap-2'>
                  <span className='text-blue-35 w-4'>{rank}</span>
                  <span className='text-grey-40 text-body05 cursor-pointer'>검색어 예시</span>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
