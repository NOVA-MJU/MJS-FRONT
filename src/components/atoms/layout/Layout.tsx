import { Outlet } from 'react-router-dom';
import Footer from './Footer';
import Navbar from './Navbar';
import Header from './Header';

const Layout = () => {
  return (
    <div className='flex flex-col min-w-screen min-h-screen gap-4'>
      <div className='w-full'>
        <Navbar />
      </div>
      <Header />
      <main className='flex-1 w-full flex justify-center px-4 py-4'>
        <div className='w-full max-w-screen-xl flex flex-col gap-7'>
          <Outlet />
        </div>
      </main>
      <div className='w-full'>
        <Footer />
      </div>
    </div>
  );
};

export default Layout;
