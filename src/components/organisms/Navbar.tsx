import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/schoolLogo.png';
import { HiMenu, HiX } from 'react-icons/hi';
import { useState } from 'react';
import { FiLogIn, FiLogOut } from 'react-icons/fi';
import { useAuthStore } from '../../store/useAuthStore';
import toast from 'react-hot-toast';
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, logout } = useAuthStore();
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen((prev) => !prev);
  const handleAuthClick = () => {
    if (isLoggedIn) logout();
    else navigate('/login');
  };
  const closeMenu = () => setIsOpen(false);

  const handleBoardClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault(); //Link tag의 Default Event를 방지.

    if (!isLoggedIn) {
      toast.error('로그인이 필요한 서비스입니다.');
      navigate('/login');
    }
  };

  return (
    <nav className='bg-mju-primary h-14 w-full z-50 shadow-sm overflow-hidden'>
      <div className='mx-auto md:max-w-[1200px] w-[90%] h-full px-4 flex items-center justify-between'>
        <Link to='/' className='h-full'>
          <div className='flex items-center h-full gap-3'>
            <img src={logo} alt='Logo' className='w-8 h-8 block' />
            <div className='flex text-white text-xl font-bold leading-none'>
              <span>MJ</span>
              <span className='text-sky-300'>S</span>
            </div>
          </div>
        </Link>

        {/* 모바일: 햄버거 */}
        <button
          className='md:hidden h-10 w-10 grid place-items-center text-white rounded hover:bg-white/10 transition-colors leading-none'
          onClick={toggleMenu}
          aria-label={isOpen ? '메뉴 닫기' : '메뉴 열기'}
        >
          {isOpen ? <HiX size={20} /> : <HiMenu size={20} />}
        </button>

        {/* 데스크톱 메뉴 */}
        <ul className='hidden md:flex items-center gap-1 list-none text-white text-sm font-medium leading-none'>
          <li>
            <Link
              to='/department'
              className='inline-flex items-center h-10 px-3 rounded-lg hover:bg-white/10'
            >
              학과정보
            </Link>
          </li>
          <li>
            <Link
              to='/menu'
              className='inline-flex items-center h-10 px-3 rounded-lg hover:bg-white/10'
            >
              식단
            </Link>
          </li>
          <li>
            <span className='inline-flex items-center h-10 px-3 rounded-lg cursor-default text-white/60'>
              벼룩시장
            </span>
          </li>
          <li>
            <span className='inline-flex items-center h-10 px-3 rounded-lg cursor-default text-white/60'>
              제휴
            </span>
          </li>
          <li>
            <Link
              to='/notice'
              className='inline-flex items-center h-10 px-3 rounded-lg hover:bg-white/10'
            >
              공지사항
            </Link>
          </li>
          <li>
            <Link
              to='/board'
              className='inline-flex items-center h-10 px-3 rounded-lg hover:bg-white/10'
              onClick={handleBoardClick}
            >
              검색게시판
            </Link>
          </li>
          <li>
            <span className='inline-flex items-center h-10 px-3 rounded-lg cursor-default text-white/60'>
              취업후기
            </span>
          </li>
          <li>
            <a
              href='https://namu.wiki/w/%EB%AA%85%EC%A7%80%EB%8C%80%ED%95%99%EA%B5%90'
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center h-10 px-3 rounded-lg hover:bg-white/10'
            >
              띵지위키
            </a>
          </li>
          {/* 로그인/로그아웃: 다른 메뉴와 동일한 형식 */}
          <li>
            <button
              onClick={handleAuthClick}
              className='inline-flex items-center gap-2 h-10 px-3 rounded-lg hover:bg-white/10 transition-colors'
              title={isLoggedIn ? '로그아웃' : '로그인'}
            >
              {isLoggedIn ? (
                <>
                  <FiLogOut size={16} className='block' />
                  로그아웃
                </>
              ) : (
                <>
                  <FiLogIn size={16} className='block' />
                  로그인
                </>
              )}
            </button>
          </li>
        </ul>
      </div>

      {/* 모바일 메뉴 */}
      {isOpen && (
        <ul className='flex flex-col md:hidden bg-[#002f6c] text-white text-sm font-medium list-none px-4 py-2 gap-1 leading-none border-t border-white/10'>
          <li>
            <span className='block px-3 h-10 rounded-lg cursor-default text-white/60 flex items-center'>
              학과정보
            </span>
          </li>
          <li>
            <Link
              to='/menu'
              onClick={closeMenu}
              className='block px-3 h-10 rounded-lg flex items-center hover:bg-white/10'
            >
              식단
            </Link>
          </li>
          <li>
            <span className='block px-3 h-10 rounded-lg cursor-default text-white/60 flex items-center'>
              벼룩시장
            </span>
          </li>
          <li>
            <span className='block px-3 h-10 rounded-lg cursor-default text-white/60 flex items-center'>
              제휴
            </span>
          </li>
          <li>
            <Link
              to='/notice'
              onClick={closeMenu}
              className='block px-3 h-10 rounded-lg flex items-center hover:bg-white/10'
            >
              공지사항
            </Link>
          </li>
          <li>
            <Link
              to='/board'
              onClick={closeMenu}
              className='block px-3 h-10 rounded-lg flex items-center hover:bg-white/10'
            >
              검색게시판
            </Link>
          </li>
          <li>
            <span className='block px-3 h-10 rounded-lg cursor-default text-white/60 flex items-center'>
              취업후기
            </span>
          </li>
          <li>
            <a
              href='https://namu.wiki/w/%EB%AA%85%EC%A7%80%EB%8C%80%ED%95%99%EA%B5%90'
              target='_blank'
              rel='noopener noreferrer'
              className='block px-3 h-10 rounded-lg flex items-center hover:bg-white/10'
              onClick={closeMenu}
            >
              띵지위키
            </a>
          </li>
          <li>
            <button
              onClick={() => {
                handleAuthClick();
                closeMenu();
              }}
              className='flex items-center gap-2 px-3 h-10 rounded-lg hover:bg-white/10 transition-colors'
            >
              {isLoggedIn ? (
                <>
                  <FiLogOut size={16} className='block' /> 로그아웃
                </>
              ) : (
                <>
                  <FiLogIn size={16} className='block' /> 로그인
                </>
              )}
            </button>
          </li>
        </ul>
      )}
    </nav>
  );
};

export default Navbar;
