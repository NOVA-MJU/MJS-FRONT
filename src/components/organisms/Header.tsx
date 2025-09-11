import { FaBullhorn } from 'react-icons/fa';

export default function Header() {
  return (
    <div className='w-full bg-white'>
      <div className='max-w-screen-xl mx-auto px-4 py-4'>
        <div className='flex items-center  gap-3 text-[1.1rem] font-semibold text-[#0055ff]'>
          <FaBullhorn className='text-[1.4rem]' />

          <span className='text-s'>현재 Version2 작업중입니다! -MJS 일동-</span>
        </div>
      </div>
    </div>
  );
}
