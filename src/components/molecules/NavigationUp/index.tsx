import { IoIosArrowBack } from 'react-icons/io';

interface NavigationUpProps {
  onClick: () => void;
}

/**
 * 화살표 표시가 있는 뒤로 가기 버튼입니다.
 * @param onClick 클릭 시 실행할 함수를 입력하세요. 뒤로가기 사용 시 `() => navigate(-1)`를 입력하세요.
 */
export default function NavigationUp({ onClick }: NavigationUpProps) {
  return (
    <button
      className='w-fit h-fit ps-1.5 pe-3 py-2.5 rounded-xl flex gap-2 items-center cursor-pointer duration-200 hover:bg-grey-05'
      onClick={onClick}
    >
      <IoIosArrowBack className='text-lg text-blue-10' />
      <span className='text-body03 text-blue-10'>이전</span>
    </button>
  );
}
