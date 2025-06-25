import { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/schoolLogo.png';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  return (
    <nav className='w-full bg-[#002f6c] p-3 z-50'>
      <div className='max-w-[1200px] w-[90%] mx-auto flex justify-between items-center'>
        {/* 로고 + 이름 */}
        <div className='flex items-center gap-2'>
          <img src={logo} alt='Logo' className='w-10 h-10' />
          <Link to='/' className='text-white text-xl font-bold no-underline'>
            MJ<span className='text-sky-300'>S</span>
          </Link>
        </div>

        {/* 햄버거 메뉴 버튼 (모바일용) */}
        <div className='text-white text-2xl cursor-pointer block lg:hidden' onClick={toggleMenu}>
          ☰
        </div>

        {/* 메뉴 */}
        <ul
          className={`${
            menuOpen ? 'flex' : 'hidden'
          } flex-col lg:flex lg:flex-row lg:gap-5 mt-4 lg:mt-0 list-none w-full lg:w-auto text-white text-sm font-medium`}
        >
          <li>
            <span className='px-3 py-2 rounded cursor-default text-white/60'>학과정보</span>
          </li>
          <li>
            <Link to='/meal' className='nav-link'>
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
            <span className='px-3 py-2 rounded cursor-default text-white/60'>공지사항</span>
          </li>
          <li>
            <Link to='/board' className='nav-link'>
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
              className='nav-link'
            >
              띵지위키
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
