/** @jsxImportSource @emotion/react */
import { AuthProvider } from './context/AuthContext';
import { Routes, Route } from 'react-router-dom'; // `BrowserRouter` 제거
import { Global, css } from '@emotion/react';
import ScrollToTop from '@components/ScrollToTop';
import Layout from '@pages/Layout';

import BoardDetailPage from '@pages/board/BoardDetailPage';
import BoardListPage from '@pages/board/BoardListPage';
import BoardWritePage from '@pages/board/BoardWritePage';
import NotFoundPage from '@pages/NotFoundPage';
import MainPage from '@pages/MainPage';
import LoginPage from '@pages/LoginPage';
import ProfilePage from '@pages/profile';
import ProfileEditPage from '@pages/profile/edit';
import InqueryPage from '@pages/profile/inquery';
import InqueryWritePage from '@pages/profile/inquery/write';
import WithDrawalPage from '@pages/profile/withdrawal';
import MealPage from '@pages/meal/MealPage';
import NewsPage from '@pages/news/NewsPage';
import BoardActivityPage from '@pages/profile/activity/board';
import CommentActivityPage from '@pages/profile/activity/comment';
import LikeActivityPage from './pages/profile/activity/like';
import DebugPage from './pages/DebugPage';

const App = () => {
  return (
    <>
      <AuthProvider>
        <ScrollToTop />
        <Global styles={globalStyle} /> {/* 전역 스타일 적용 */}
        <Routes>
          {/* Layout 적용되는 페이지 */}
          <Route element={<Layout />}>
            <Route path="/" element={<MainPage />} />

            {/* url parameter 활용하여, 자유게시판목록 디테일 들어감 */}
            <Route path="/board" element={<BoardListPage />} />
            <Route path="/board/:uuid" element={<BoardDetailPage />} />
            <Route path="/board/write" element={<BoardWritePage />} />


            <Route path='/profile' element={<ProfilePage />} />
            <Route path='/profile/edit' element={<ProfileEditPage />} />
            <Route path='/profile/inquery' element={<InqueryPage />} />
            <Route path='/profile/inquery/write' element={<InqueryWritePage />} />
            <Route path='/profile/withdrawal' element={<WithDrawalPage />} />
            <Route path='/profile/activity/board' element={<BoardActivityPage />} />
            <Route path='/profile/activity/comment' element={<CommentActivityPage />} />
            <Route path='/profile/activity/like' element={<LikeActivityPage />} />



            {/* 식단 상세조회 페이지 */}
            <Route path="/meal" element={<MealPage />} />
            <Route path="/news" element={<NewsPage />}></Route>
          </Route>
          {/* Layout 미적용 페이지 */}
          <Route path="/start" element={<StartPage />}></Route>
          <Route path="/login" element={<LoginPage />} /> {/* 로그인 페이지 */}
          <Route path="*" element={<NotFoundPage />} /> {/* 404 페이지 */}

          <Route path='/debug34' element={<DebugPage />} /> {/* 테스트 페이지 */}
        </Routes>
      </AuthProvider>
    </>
  );
};

export default App;

// 전역 스타일
const globalStyle = css`
  body,
  html,
  #root {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
  }

  * {
    box-sizing: border-box;
  }

  body {
    font-family: 'Poppins', 'Arial', sans-serif;
  }
`;
