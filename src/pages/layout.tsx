import { useResponsive } from '@/hooks/useResponse';
import { Outlet, useLocation } from 'react-router-dom';
import Footer from '../components/organisms/Footer';
import Navbar from '../components/organisms/Navbar/Navbar';

export default function Layout() {
  const location = useLocation();
  const { isDesktop } = useResponsive();
  const isMobileMain = location.pathname === '/' && !isDesktop;

  if (isMobileMain) {
    return (
      <div className='flex h-[100svh] w-full flex-col overflow-hidden'>
        <Navbar />
        <main className='min-h-0 flex-1 overflow-hidden'>
          <Outlet />
        </main>
      </div>
    );
  }

  return (
    <div className='flex min-h-screen w-full flex-col items-center md:min-w-[1280px]'>
      <Navbar />
      <main className='mx-auto flex h-auto w-full flex-1 flex-col md:w-[1280px]'>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
