import Footer from '../organisms/Footer';
import Navbar from '../organisms/Navbar/Navbar';
import { Outlet } from 'react-router-dom';

interface LayoutProps {
  className?: string;
}

const Layout = ({ className }: LayoutProps) => {
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
