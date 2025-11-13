import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FiLogIn, FiLogOut } from 'react-icons/fi';
import { useAuthStore } from '../../store/useAuthStore';
import { useNavTracking } from '../../hooks/gtm/useNavTracking';
import toast from 'react-hot-toast';
import { useResponsive } from '@/hooks/useResponse';
import { IoIosClose, IoIosMenu, IoIosSearch } from 'react-icons/io';
import { logout as apiLogout } from '@/api/user';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, resetUser } = useAuthStore();
  const { trackNavClick } = useNavTracking();
  const navigate = useNavigate();
  const { isDesktop } = useResponsive();

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

  const handleBoardClick = () => {
    navigate('/board');
  };

  useEffect(() => {
    const root = document.documentElement;
    if (isOpen) root.classList.add('overflow-hidden');
    else root.classList.remove('overflow-hidden');
    return () => root.classList.remove('overflow-hidden');
  }, [isOpen]);

  if (isDesktop)
    return (
      <nav className='w-full bg-mju-primary'>
        <div className='w-[1280px] mx-auto flex items-center justify-between '>
          <Link to='/' className='p-3'>
            <div className='flex items-center h-full'>
              <img src='/logo/mjs-typography-primary.svg' alt='MJS' className='w-17 h-auto' />
            </div>
          </Link>
          <ul className='flex items-center gap-1 list-none text-white text-sm font-medium leading-none'>
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
      </nav>
    );

  if (!isDesktop)
    return (
      <nav className='w-full h-fit bg-mju-primary'>
        <div className='px-5 py-2 flex flex-col'>
          <div className='flex items-center justify-between'>
            <Link to='/'>
              <img src='/logo/mjs-typography-primary.svg' alt='logo' />
            </Link>
            {/* <div className='flex-1'> */}
            {/* <SearchBar className='h-5' /> */}
            {/* </div> */}
            <div className='flex items-center gap-2 text-white text-xl'>
              <Link
                to='search'
                className='p-2 hover:bg-white/10 rounded-md cursor-pointer transition'
              >
                <IoIosSearch />
              </Link>
              <button
                className='p-2 hover:bg-white/10 rounded-md cursor-pointer transition'
                onClick={toggleMenu}
                aria-label={isOpen ? '메뉴 닫기' : '메뉴 열기'}
              >
                {isOpen ? <IoIosClose /> : <IoIosMenu />}
              </button>
            </div>
          </div>

          {/* 모바일에서 확장 메뉴를 표시합니다 */}
          {isOpen && (
            <ul className='flex flex-col md:hidden bg-mju-primary text-white text-body03 list-none px-4 py-2 gap-1 leading-none'>
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
                  onClick={() => {
                    handleAuthClick();
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
        </div>
      </nav>
    );
}
