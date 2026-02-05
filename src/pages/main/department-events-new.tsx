import { IoIosArrowBack } from 'react-icons/io';
import { FaRegCalendarAlt } from 'react-icons/fa';

export default function DepartmentEventsNewPage() {
  return (
    <section className='flex flex-1 flex-col'>
      {/* 헤더 */}
      <header className='border-grey-10 relative flex h-15 items-center justify-center border-b'>
        <button type='button' className='absolute left-2 cursor-pointer p-2' aria-label='뒤로 가기'>
          <IoIosArrowBack className='text-2xl text-black' />
        </button>
        <p className='text-body02 text-black'>일정 등록</p>
      </header>

      {/* 제목 입력 칸 */}
      <div className='m-5'>
        <input
          type='text'
          placeholder='제목'
          className='border-grey-10 text-body03 placeholder:text-grey-30 w-full rounded-lg border px-4 py-3 text-black'
          aria-label='제목'
        />
      </div>

      {/* 날짜 입력 칸 */}
      <div className='flex items-center gap-3 px-5'>
        <span className='text-body05 text-grey-40 shrink-0'>시작</span>
        <div className='border-grey-10 flex flex-1 items-center justify-between rounded-lg border'>
          <span className='text-body06 p-3 text-black'>2025. 08. 07</span>
          <button
            className='cursor-pointer p-3'
            aria-label='시작 날짜 선택'
            onClick={() => {
              // TODO: 시작 날짜 선택
            }}
          >
            <FaRegCalendarAlt className='text-grey-40 shrink-0 text-lg' aria-hidden />
          </button>
        </div>
      </div>
      <div className='mt-2 flex items-center gap-3 px-5'>
        <span className='text-body05 text-grey-40 shrink-0'>종료</span>
        <div className='border-grey-10 flex flex-1 items-center justify-between rounded-lg border'>
          <span className='text-body06 p-3 text-black'>2025. 08. 07</span>
          <button
            className='cursor-pointer p-3'
            aria-label='종료 날짜 선택'
            onClick={() => {
              // TODO: 종료 날짜 선택
            }}
          >
            <FaRegCalendarAlt className='text-grey-40 shrink-0 text-lg' aria-hidden />
          </button>
        </div>
      </div>

      {/* 하단 완료 버튼 */}
      <div className='mt-auto p-5'>
        <button
          type='button'
          className='bg-grey-02 text-grey-40 text-body05 w-full cursor-pointer rounded-lg p-2.5'
          aria-label='완료'
        >
          완료
        </button>
      </div>
    </section>
  );
}
