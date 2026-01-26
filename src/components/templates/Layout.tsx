import Footer from '../organisms/Footer';
import Navbar from '../organisms/Navbar/Navbar';
import { Outlet } from 'react-router-dom';

interface LayoutProps {
  className?: string;
}

const Layout = ({ className }: LayoutProps) => {
  return (
    <div
      className={`
        w-full md:min-w-[1280px] min-h-screen flex flex-col items-center 
        mobile-figma-container
        ${className}
        `}
    >
      <Navbar />
      <main className='w-full flex-1 md:w-[1280px] h-auto mx-auto flex flex-col'>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
