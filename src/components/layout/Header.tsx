import { FaBullhorn } from 'react-icons/fa';
import ProfileComponent from './ProfileComponent';
import SearchBar from './SearchBar';

export default function Header() {
  return (
    <div className='w-full flex gap-4'>
      <div className='flex flex-col gap-4 flex-2 w-full'>
        <div className='flex items-center gap-4 text-[1.1rem] font-semibold text-[#0055ff]'>
          <FaBullhorn className='text-[1.4rem]' />
          <span>현재 Version1 작업중입니다 _ MJS 일동</span>
        </div>
        <SearchBar />
      </div>

      {/* 우측 영역: 프로필 */}
      <div className='flex-1 w-full'>
        <ProfileComponent />
      </div>
    </div>
  );
}
