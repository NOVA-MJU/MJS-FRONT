import { Link, useNavigate, useLocation } from 'react-router-dom';
import { HiMenu, HiX } from 'react-icons/hi';
import { useState, useEffect } from 'react';
import { FiLogIn, FiLogOut } from 'react-icons/fi';
import { useAuthStore } from '../../store/useAuthStore';
import { useNavTracking } from '../../hooks/gtm/useNavTracking';
import toast from 'react-hot-toast';
import SearchBar from '../atoms/SearchBar';
import { logout as apiLogout } from '@/api/user';

const CONTAINER = 'mx-auto w-[90%] md:max-w-[1200px] px-4';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, resetUser } = useAuthStore();
  const { trackNavClick } = useNavTracking();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => setIsOpen((p) => !p);
  const closeMenu = () => setIsOpen(false);

  const handleAuthClick = async () => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    try {
      await apiLogout();
      resetUser();
      toast.success('로그아웃 되었습니다.');
      if (location.pathname.startsWith('/mypage') || location.pathname === '/board/write') {
        navigate('/');
      }
    } catch (e) {
      resetUser();
      console.error('logout error:', e);
      toast.error('로그아웃 처리 중 문제가 발생했습니다.');
    }
  };

  const handleBoardClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!isLoggedIn) {
      e.preventDefault();
      toast.error('로그인이 필요한 서비스입니다.', { duration: 2000 });
      trackNavClick('board');
      navigate('/login');
    }
  };

  useEffect(() => {
    const root = document.documentElement;
    if (isOpen) root.classList.add('overflow-hidden');
    else root.classList.remove('overflow-hidden');
    return () => root.classList.remove('overflow-hidden');
  }, [isOpen]);

  const hideSearchRoutes = ['/login', '/register'];
  const showMobileSearch = !hideSearchRoutes.includes(location.pathname);

  return (
    <nav className='sticky top-0 z-50 w-full bg-mju-primary shadow-sm pt-[env(safe-area-inset-top)]'>
      {/* 상단 바 */}
      <div className={`${CONTAINER} h-14 flex items-center justify-between`}>
        <Link to='/' className='h-full'>
          <div className='flex items-center h-full'>
            <img src='/logo/MJS_darkLogo.svg' alt='MJS' className='w-17 h-auto' />
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
              to='/notice'
              className='inline-flex items-center h-10 px-3 rounded-lg hover:bg-white/10'
              onClick={() => trackNavClick('notice')}
            >
              공지사항
            </Link>
          </li>
          <li>
            <Link
              to='/department'
              className='inline-flex items-center h-10 px-3 rounded-lg hover:bg-white/10'
              onClick={() => trackNavClick('department')}
            >
              학과별정보
            </Link>
          </li>
          <li>
            <Link
              to='/board'
              className='inline-flex items-center h-10 px-3 rounded-lg hover:bg-white/10'
              onClick={handleBoardClick}
            >
              자유게시판
            </Link>
          </li>
          <li>
            <Link
              to='/menu'
              className='inline-flex items-center h-10 px-3 rounded-lg hover:bg-white/10'
              onClick={() => trackNavClick('meal')}
            >
              식단
            </Link>
          </li>
          <li>
            <Link
              to='/academic-calendar'
              className='inline-flex items-center h-10 px-3 rounded-lg hover:bg-white/10'
              onClick={() => trackNavClick('calendar')}
            >
              학사일정
            </Link>
          </li>
          <li>
            <a
              href='https://v0-university-career-data-platform.vercel.app/'
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center h-10 px-3 rounded-lg hover:bg-white/10'
              onClick={() => trackNavClick('mentor')}
            >
              멘토관 서비스
            </a>
          </li>
          <li>
            <a
              href='https://namu.wiki/w/%EB%AA%85%EC%A7%80%EB%8C%80%ED%95%99%EA%B5%90'
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center h-10 px-3 rounded-lg hover:bg-white/10'
              onClick={() => trackNavClick('wiki')}
            >
              띵지위키
            </a>
          </li>
          <li>
            <a
              href='https://sso1.mju.ac.kr/login.do?redirect_uri=https://msi.mju.ac.kr/index_Myiweb.jsp'
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center h-10 px-3 rounded-lg hover:text-blue-10 hover:bg-white/10'
              onClick={() => trackNavClick('wiki')}
            >
              MSI
            </a>
          </li>
          <li>
            <a
              href='https://myicap.mju.ac.kr/site/main/index001?prevurl=https%3A%2F%2Fmyicap.mju.ac.kr%2F'
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center h-10 px-3 rounded-lg hover:text-blue-10 hover:bg-white/10'
              onClick={() => trackNavClick('wiki')}
            >
              MYiCap
            </a>
          </li>
          <li>
            <button
              onClick={handleAuthClick}
              className='inline-flex items-center gap-2 h-10 px-3 rounded-lg hover:bg-white/10 transition-colors'
              title={isLoggedIn ? '로그아웃' : '로그인'}
            >
              {isLoggedIn ? (
                <>
                  <FiLogOut size={16} />
                  로그아웃
                </>
              ) : (
                <>
                  <FiLogIn size={16} />
                  로그인
                </>
              )}
            </button>
          </li>
        </ul>
      </div>

      {/* 모바일 검색바 */}
      {showMobileSearch && (
        <div className='md:hidden'>
          <div className={`${CONTAINER}`}>
            <div className='mt-2 pb-2 [&input]:h-10 [&input]:text-sm'>
              <SearchBar className='h-10' />
            </div>
          </div>
        </div>
      )}

      {/* 모바일 메뉴 */}
      {isOpen && (
        <ul className='flex flex-col md:hidden bg-[#002f6c] text-white text-sm font-medium list-none px-4 py-2 gap-1 leading-none border-t border-white/10'>
          <li>
            <Link
              to='/notice'
              onClick={closeMenu}
              className='inline-flex items-center px-3 h-10 rounded-lg hover:bg-white/10'
            >
              공지사항
            </Link>
          </li>
          <li>
            <Link
              to='/department'
              onClick={closeMenu}
              className='inline-flex items-center px-3 h-10 rounded-lg hover:bg-white/10'
            >
              학과별정보
            </Link>
          </li>
          <li>
            <Link
              to='/board'
              onClick={closeMenu}
              className='inline-flex items-center px-3 h-10 rounded-lg hover:bg-white/10'
            >
              자유게시판
            </Link>
          </li>
          <li>
            <Link
              to='/menu'
              onClick={closeMenu}
              className='inline-flex items-center px-3 h-10 rounded-lg hover:bg-white/10'
            >
              식단
            </Link>
          </li>
          <li>
            <Link
              to='/academic-calendar'
              onClick={closeMenu}
              className='inline-flex items-center px-3 h-10 rounded-lg hover:bg-white/10'
            >
              학사일정
            </Link>
          </li>
          <li>
            <a
              href='https://v0-university-career-data-platform.vercel.app/'
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center px-3 h-10 rounded-lg hover:bg-white/10'
              onClick={closeMenu}
            >
              멘토관 서비스
            </a>
          </li>
          <li>
            <a
              href='https://namu.wiki/w/%EB%AA%85%EC%A7%80%EB%8C%80%ED%95%99%EA%B5%90'
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center px-3 h-10 rounded-lg hover:bg-white/10'
              onClick={closeMenu}
            >
              띵지위키
            </a>
          </li>
          <li>
            <a
              href='https://sso1.mju.ac.kr/login.do?redirect_uri=https://msi.mju.ac.kr/index_Myiweb.jsp'
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center h-10 px-3 rounded-lg hover:text-blue-10 hover:bg-white/10'
              onClick={() => trackNavClick('wiki')}
            >
              MSI
            </a>
          </li>
          <li>
            <a
              href='https://myicap.mju.ac.kr/site/main/index001?prevurl=https%3A%2F%2Fmyicap.mju.ac.kr%2F'
              target='_blank'
              rel='noopener noreferrer'
              className='inline-flex items-center h-10 px-3 rounded-lg hover:text-blue-10 hover:bg-white/10'
              onClick={() => trackNavClick('wiki')}
            >
              MYiCap
            </a>
          </li>
          <li>
            <button
              onClick={async () => {
                await handleAuthClick();
                closeMenu();
              }}
              className='inline-flex items-center gap-2 px-3 h-10 rounded-lg hover:bg-white/10 transition-colors'
            >
              {isLoggedIn ? (
                <>
                  <FiLogOut size={16} /> 로그아웃
                </>
              ) : (
                <>
                  <FiLogIn size={16} /> 로그인
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
