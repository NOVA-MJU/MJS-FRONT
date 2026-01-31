import Footer from '../organisms/Footer';
import Navbar from '../organisms/Navbar/Navbar';
import { Outlet, useLocation } from 'react-router-dom';
import { useResponsive } from '@/hooks/useResponse';

interface LayoutProps {
  className?: string;
}

const Layout = ({ className }: LayoutProps) => {
  const location = useLocation();
  const { isDesktop } = useResponsive();
  const isMobileMain = location.pathname === '/' && !isDesktop;

  if (isMobileMain) {
    return (
      <div className={`flex h-[100svh] w-full flex-col overflow-hidden ${className}`}>
        <Navbar />
        <main className='min-h-0 flex-1 overflow-y-auto'>
          <Outlet />
        </main>
      </div>
    );
  }

  return (
    <div
      className={`flex min-h-screen w-full flex-col items-center md:min-w-[1280px] ${className} `}
    >
      <Navbar />
      <main className='mx-auto flex h-auto w-full flex-1 flex-col md:w-[1280px]'>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
