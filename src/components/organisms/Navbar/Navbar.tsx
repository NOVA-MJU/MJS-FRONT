import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FiLogIn, FiLogOut } from 'react-icons/fi';
import { IoIosClose, IoIosMenu, IoIosSearch } from 'react-icons/io';
import toast from 'react-hot-toast';

import { useAuthStore } from '@/store/useAuthStore';
import { useNavTracking } from '@/hooks/gtm/useNavTracking';
import { useResponsive } from '@/hooks/useResponse';
import { logout as apiLogout } from '@/api/user';

import { NAV_ITEMS } from '@/constants/nav';
import type { NavItem } from '@/types/nav/item';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, resetUser } = useAuthStore();
  const { trackNavClick } = useNavTracking();
  const { isDesktop } = useResponsive();
  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen((p) => !p);
  const closeMenu = () => setIsOpen(false);

  /** 로그인/로그아웃 */
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

  /** 로그인 필요한 메뉴 클릭 시 */
  const handleProtectedNav = (item: NavItem, e: React.MouseEvent<HTMLAnchorElement>) => {
    trackNavClick(item.key);

    if (!isLoggedIn) {
      e.preventDefault();
      toast.error('로그인이 필요한 서비스입니다.', { duration: 1500 });
      navigate('/login');
      return;
    }
  };

  useEffect(() => {
    const root = document.documentElement;
    if (isOpen) root.classList.add('overflow-hidden');
    else root.classList.remove('overflow-hidden');
    return () => root.classList.remove('overflow-hidden');
  }, [isOpen]);

  /** 공통 메뉴 렌더 */
  const renderMenuItem = (item: NavItem, isMobile = false) => {
    const clickAction = () => trackNavClick(item.key);

    // 외부 링크 로직
    if (item.href) {
      return (
        <a
          key={item.key}
          href={item.href}
          target='_blank'
          rel='noopener noreferrer'
          className={`inline-flex items-center h-10 px-3 rounded-lg hover:bg-white/10 ${
            isMobile ? 'px-3 py-2 block' : ''
          }`}
          onClick={isMobile ? closeMenu : clickAction}
        >
          {item.label}
        </a>
      );
    }

    // 로그인 필요 여부 체크
    return (
      <Link
        key={item.key}
        to={item.path!}
        onClick={(e) => {
          if (item.requiresAuth) {
            handleProtectedNav(item, e);
          } else {
            clickAction();
          }
          if (isMobile) closeMenu();
        }}
        className={`inline-flex items-center h-10 px-3 rounded-lg hover:bg-white/10 ${
          isMobile ? 'px-3 py-2 block' : ''
        }`}
      >
        {item.label}
      </Link>
    );
  };

  /** 데스크톱 */
  if (isDesktop)
    return (
      <nav className='w-full bg-mju-primary'>
        <div className='w-[1280px] mx-auto flex items-center justify-between '>
          <Link to='/' className='p-3' onClick={() => trackNavClick('home')}>
            <img src='/logo/mjs-typography-primary.svg' alt='MJS' className='w-17 h-auto' />
          </Link>

          <ul className='flex items-center gap-1 list-none text-white text-sm font-medium leading-none'>
            {NAV_ITEMS.map((item: NavItem) => (
              <li key={item.key}>{renderMenuItem(item)}</li>
            ))}

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

  /** 모바일 */
  return (
    <nav className='w-full h-fit bg-mju-primary'>
      <div className='px-5 py-2 flex flex-col'>
        <div className='flex items-center justify-between'>
          <Link to='/' onClick={() => trackNavClick('home')}>
            <img src='/logo/mjs-typography-primary.svg' alt='logo' />
          </Link>

          <div className='flex items-center gap-2 text-white text-xl'>
            <Link
              to='search'
              className='p-2 hover:bg-white/10 rounded-md cursor-pointer transition'
              onClick={() => trackNavClick('search')}
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

        {isOpen && (
          <ul className='flex flex-col md:hidden bg-mju-primary text-white text-body03 list-none px-4 py-2 gap-1 leading-none'>
            {NAV_ITEMS.map((item: NavItem) => (
              <li key={item.key}>{renderMenuItem(item, true)}</li>
            ))}

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
