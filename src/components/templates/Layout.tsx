import Footer from '../organisms/Footer';
import Navbar from '../organisms/Navbar';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className='flex w-full flex-col md:min-h-screen justify-center items-center md:h-full overflow-hidden'>
      <Navbar />
      <main className='bg-black flex-1 w-full h-auto md:w-[1280px] mx-auto flex flex-col'>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
