import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { IoIosClose, IoIosMenu } from 'react-icons/io';

import { useNavTracking } from '@/hooks/gtm/useNavTracking';
import SidebarV2 from '@/components/organisms/SidebarV2';
import SearchBar from '@/components/atoms/SearchBar';
import { useHeaderStore } from '@/store/useHeaderStore';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { trackNavClick } = useNavTracking();
  const { activeMainSlide } = useHeaderStore();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get('keyword');

  const toggleMenu = () => setIsOpen((p) => !p);
  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    const root = document.documentElement;
    if (isOpen) root.classList.add('overflow-hidden');
    else root.classList.remove('overflow-hidden');
    return () => root.classList.remove('overflow-hidden');
  }, [isOpen]);

  const { setActiveMainSlide } = useHeaderStore();
  const handleLogoClick = (e: React.MouseEvent) => {
    setActiveMainSlide(1);
    if (location.pathname === '/') {
      e.preventDefault();
    }
  };

  const location = useLocation();
  const isMainOrLogin =
    (location.pathname === '/' && activeMainSlide === 1) || location.pathname === '/login';

  return (
    <nav className='border-grey-10 h-fit w-full border-b-1 bg-white'>
      {isMainOrLogin ? (
        <div className='flex h-[60px] items-center justify-between px-5'>
          <Link
            to='/'
            onClick={(e) => {
              trackNavClick('home');
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
            className='h-12 w-12 shrink-0'
            onClick={(e) => {
              handleLogoClick(e);
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
