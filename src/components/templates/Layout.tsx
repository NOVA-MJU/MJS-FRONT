import Footer from '../organisms/Footer';
import Navbar from '../organisms/Navbar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className='min-h-screen w-full flex flex-col justify-center items-center overflow-hidden'>
      <Navbar />
      <main className='flex-1 w-full h-auto md:w-[1280px] mx-auto flex flex-col'>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
