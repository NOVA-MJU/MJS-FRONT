import Footer from '../organisms/Footer';
import Navbar from '../organisms/Navbar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className='flex flex-col w-screen min-h-screen items-center'>
      <Navbar />
      <main className='flex-1 w-[1280px] mx-auto flex flex-col'>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
