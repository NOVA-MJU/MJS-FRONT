/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { Outlet } from 'react-router-dom';
import Navbar from '@components/Navbar';
import Footer from '@components/Footer';
import Header from '@components/Header';

const Layout = () => {
  return (
    <div
      css={css`
        display: flex; 
        flex-direction: column; 
        min-height: 100vh; 
        gap: 1rem;
      `}
    >
      <Navbar />
      <div
        css={css`
          flex: 1; 
          width: 1280px; 
          display: flex;
          flex-direction: column;
          margin: 0 auto; 
          box-sizing: border-box;
          gap: 1.75rem;
          padding: 1rem; 
        `}
      >
        <Header />
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
