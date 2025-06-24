import { FaBullhorn } from 'react-icons/fa';
import ProfileComponent from './ProfileComponent';
import SearchBar from './SearchBar';

export default function Header() {
  return (
    <div className='w-full bg-white'>
      <div className='w-full max-w-screen-xl mx-auto flex gap-4'>
        <div className='flex flex-col gap-4 flex-2 w-full'>
          <div className='flex items-center gap-4 text-[1.1rem] font-semibold text-[#0055ff]'>
            <div className='flex gap-3 mt-5'>
              <FaBullhorn className='text-[1.4rem] ' />
              <span>현재 Version1 작업중입니다 _ MJS 일동</span>
            </div>
          </div>
          <div>
            <SearchBar className='ml-4 mt-1' />
          </div>
        </div>

        <div className='flex-1 w-full mt-5'>
          <ProfileComponent className='mr-7' />
        </div>
      </div>
    </div>
  );
}
