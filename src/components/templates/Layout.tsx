import { Outlet, useLocation } from 'react-router-dom';

import Footer from '../organisms/Footer';
import Navbar from '../organisms/Navbar';
import Header from '../organisms/Header';

const Layout = () => {
  const location = useLocation();
  const hideHeaderRoutes = ['/login', '/register', '/notice', '/news'];
  const shouldShowHeader = !hideHeaderRoutes.includes(location.pathname);

  return (
    <div className='flex flex-col w-screen min-h-screen items-center'>
      <Navbar />
      <main className='flex-1 w-[1280px] mx-auto flex flex-col'>
        {shouldShowHeader && <Header />}
        <div className='w-full h-full'>
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
