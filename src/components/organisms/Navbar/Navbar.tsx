import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FiLogIn, FiLogOut } from 'react-icons/fi';
import { IoIosClose, IoIosMenu } from 'react-icons/io';
import toast from 'react-hot-toast';

import { useAuthStore } from '@/store/useAuthStore';
import { useNavTracking } from '@/hooks/gtm/useNavTracking';
import { useResponsive } from '@/hooks/useResponse';
import { logout as apiLogout } from '@/api/user';

import { NAV_ITEMS } from '@/constants/nav';
import type { NavItem } from '@/types/nav/item';
import SidebarV2 from '@/components/organisms/SidebarV2';
import SearchBar from '@/components/atoms/SearchBar';
import { useHeaderStore } from '@/store/useHeaderStore';
import { setHomeSliderToMain } from '@/pages/HomeSlider';
import clsx from 'clsx';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isLoggedIn, resetUser } = useAuthStore();
  const { trackNavClick } = useNavTracking();
  const { isDesktop } = useResponsive();
  const { activeMainSlide } = useHeaderStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('keyword');

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

  const renderMenuItem = (item: NavItem, isMobile = false) => {
    const clickAction = () => trackNavClick(item.key);

    if (item.href) {
      return (
        <a
          key={item.key}
          href={item.href}
          target='_blank'
          rel='noopener noreferrer'
          className={`inline-flex h-10 items-center rounded-lg px-3 hover:bg-white/10 ${
            isMobile ? 'block px-3 py-2' : ''
          }`}
          onClick={isMobile ? closeMenu : clickAction}
        >
          {item.label}
        </a>
      );
    }

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
        className={`inline-flex h-10 items-center rounded-lg px-3 hover:bg-white/10 ${
          isMobile ? 'block px-3 py-2' : ''
        }`}
      >
        {item.label}
      </Link>
    );
  };

  const { setActiveMainSlide } = useHeaderStore();
  const handleLogoClick = (e: React.MouseEvent) => {
    setHomeSliderToMain();
    setActiveMainSlide(1);
    if (location.pathname === '/') {
      e.preventDefault();
    }
  };

  const location = useLocation();
  const isMainOrLogin =
    (location.pathname === '/' && activeMainSlide === 1) || location.pathname === '/login';

  if (isDesktop)
    return (
      <nav className='bg-mju-primary w-full'>
        <div className='mx-auto flex w-[1280px] items-center justify-between'>
          <Link
            to='/'
            className='p-3'
            onClick={() => {
              trackNavClick('home');
              setHomeSliderToMain();
            }}
          >
            <img src='/logo/ThingoBigLogo.svg' alt='thingo' className='h-auto w-17' />
          </Link>

          <ul className='flex list-none items-center gap-1 text-sm leading-none font-medium text-white'>
            {NAV_ITEMS.map((item: NavItem) => (
              <li key={item.key}>{renderMenuItem(item)}</li>
            ))}

            <li>
              <button
                onClick={handleAuthClick}
                className='inline-flex h-10 items-center gap-2 rounded-lg px-3 transition-colors hover:bg-white/10'
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

  return (
    <nav
      className={clsx('h-fit w-full bg-white', isMainOrLogin ? 'border-grey-10 border-b-1' : '')}
    >
      {isMainOrLogin ? (
        <div className='flex h-[60px] items-center justify-between px-5'>
          <Link
            to='/'
            onClick={(e) => {
              trackNavClick('home');
              setHomeSliderToMain();
              handleLogoClick(e);
            }}
          >
            <img src='/logo/ThingoBigLogo.svg' alt='logo' />
          </Link>

          <div className='flex items-center gap-2 text-xl text-black'>
            <button
              className='cursor-pointer rounded-md p-2 transition hover:bg-white/10'
              onClick={toggleMenu}
              aria-label={isOpen ? '메뉴 닫기' : '메뉴 열기'}
            >
              {isOpen ? <IoIosClose /> : <IoIosMenu />}
            </button>
          </div>
        </div>
      ) : (
        <header className='flex h-[60px] min-w-0 items-center gap-4 px-4'>
          <div
            className='h-12 w-12 shrink-0 cursor-pointer'
            onClick={() => {
              setHomeSliderToMain();
              setActiveMainSlide(1);
              if (location.pathname !== '/') navigate('/');
            }}
          >
            <img src='/logo/ThingoSmallLogo.svg' className='h-full w-full object-contain' />
          </div>

          <div className='min-w-0 flex-1 py-2'>
            <SearchBar
              initialContent={keyword ?? undefined}
              className='bg-grey-02 w-full rounded-full border-none px-[15px] py-[9px]'
              iconClassName='text-grey-30'
            />
          </div>
        </header>
      )}

      <SidebarV2 isOpen={isOpen} onClose={closeMenu} />
    </nav>
  );
}
