import { Link } from 'react-router-dom';
import logo from '../../assets/schoolLogo.png';
import { HiMenu, HiX } from 'react-icons/hi'; // 햄버거/닫기 아이콘
import { useState } from 'react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);

  return (
    <nav className='bg-[#002f6c] p-3 z-50 w-full'>
      <div className='md:max-w-[1200px] w-[90%] mx-auto flex justify-between items-center'>
        <Link to='/'>
          <div className='flex items-center gap-3'>
            <img src={logo} alt='Logo' className='w-10 h-10' />
            <div className='flex text-white text-xl font-bold no-underline'>
              <span>MJ</span>
              <span className='text-sky-300'>S</span>
            </div>
          </div>
        </Link>

        {/* 햄버거 버튼 (모바일) */}
        <button className='md:hidden text-white text-2xl focus:outline-none' onClick={toggleMenu}>
          {isOpen ? <HiX /> : <HiMenu />}
        </button>

        {/* 데스크톱 메뉴 */}
        <ul className='hidden md:flex gap-3 list-none text-white text-sm font-medium'>
          <li>
            <Link to='/department'>
              <span className='px-3 py-2'>학과정보</span>
            </Link>
          </li>
          <li>
            <Link to='/menu' className='p-3'>
              식단
            </Link>
          </li>
          <li>
            <span className='px-3 py-2 rounded cursor-default text-white/60'>벼룩시장</span>
          </li>
          <li>
            <span className='px-3 py-2 rounded cursor-default text-white/60'>제휴</span>
          </li>
          <li>
            <Link to='/notice' className='p-3'>
              공지사항
            </Link>
          </li>
          <li>
            <Link to='/board' className='p-3'>
              검색게시판
            </Link>
          </li>
          <li>
            <span className='px-3 py-2 rounded cursor-default text-white/60'>취업후기</span>
          </li>
          <li>
            <a
              href='https://namu.wiki/w/%EB%AA%85%EC%A7%80%EB%8C%80%ED%95%99%EA%B5%90'
              target='_blank'
              rel='noopener noreferrer'
            >
              띵지위키
            </a>
          </li>
        </ul>
      </div>

      {/* 모바일 메뉴 */}
      {isOpen && (
        <ul className='flex flex-col md:hidden bg-[#002f6c] text-white text-sm font-medium list-none p-4 gap-3'>
          <li>
            <span className='px-3 py-2 rounded cursor-default text-white/60'>학과정보</span>
          </li>
          <li>
            <Link to='/menu' className='px-3 py-2 block'>
              식단
            </Link>
          </li>
          <li>
            <span className='px-3 py-2 rounded cursor-default text-white/60'>벼룩시장</span>
          </li>
          <li>
            <span className='px-3 py-2 rounded cursor-default text-white/60'>제휴</span>
          </li>
          <li>
            <Link to='/notice' className='px-3 py-2 block'>
              공지사항
            </Link>
          </li>
          <li>
            <Link to='/board' className='px-3 py-2 block'>
              검색게시판
            </Link>
          </li>
          <li>
            <span className='px-3 py-2 rounded cursor-default text-white/60'>취업후기</span>
          </li>
          <li>
            <a
              href='https://namu.wiki/w/%EB%AA%85%EC%A7%80%EB%8C%80%ED%95%99%EA%B5%90'
              target='_blank'
              rel='noopener noreferrer'
              className='px-3 py-2 block'
            >
              띵지위키
            </a>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
