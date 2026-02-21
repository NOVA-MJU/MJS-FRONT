import Layout from '@/pages/layout';
import AcademicCalendar from '@/pages/academic-calendar';
import Board from '@/pages/board';
import BoardDetail from '@/pages/board/detail';
import BoardEdit from '@/pages/board/edit';
import BoardWrite from '@/pages/board/write';
import Broadcast from '@/pages/broadcast';
import GlobalErrorPage from '@/pages/error';
import DepartmentPostsDetailPage from '@/pages/main/department-posts-detail';
import DepartmentPostsNewPage from '@/pages/main/department-posts-new';
import DepartmentEventsNewPage from './pages/main/department-events-new';
import DepartmentEventsEditPage from './pages/main/department-events-edit';
import DepartmentPostsEditPage from './pages/main/department-posts-edit';
import LoginPage from '@/pages/login';
import Menu from '@/pages/menu';
import MyPage from '@/pages/mypage';
import MyPageEdit from '@/pages/mypage/edit';
import ViewComments from '@/pages/mypage/viewComments';
import ViewLikes from '@/pages/mypage/viewLikes';
import ViewPosts from '@/pages/mypage/viewPosts';
import News from '@/pages/news';
import Notice from '@/pages/notice';
import Register from '@/pages/register';
import { AgentationTool } from '@/utils/agentation';
import type { Location } from 'react-router-dom';
import { Route, Routes, useLocation } from 'react-router-dom';
import HomeSlider from './pages/HomeSlider';
import SearchEntry from '@/pages/search/SearchEntry';
import SearchOverlay from './pages/search/SearchOverlay';
import FindPasswordPage from './pages/find-password';

export default function App() {
  const location = useLocation();
  const state = location.state as { backgroundLocation?: Location } | undefined;
  const backgroundLocation = state?.backgroundLocation;

  return (
    <>
      <Routes location={backgroundLocation || location}>
        <Route element={<Layout />}>
          <Route path='/' element={<HomeSlider />} />

          <Route path='/board' element={<Board />} />
          <Route path='/board/:uuid' element={<BoardDetail />} />
          <Route path='/board/write' element={<BoardWrite />} />
          <Route path='/board/edit/:uuid' element={<BoardEdit />} />

          <Route path='/notice' element={<Notice />} />
          <Route path='/news' element={<News />} />
          <Route path='/broadcast' element={<Broadcast />} />
          <Route path='/mypage' element={<MyPage />} />
          <Route path='/mypage/:uuid' element={<MyPage />} />
          <Route path='/mypage/:uuid/edit' element={<MyPageEdit />} />

          <Route path='/mypage/my-post/:uuid' element={<ViewPosts />} />
          <Route path='/mypage/my-comment/:uuid' element={<ViewComments />} />
          <Route path='/mypage/my-likes/:uuid' element={<ViewLikes />} />

          <Route path='/menu' element={<Menu />} />
          <Route path='/academic-calendar' element={<AcademicCalendar />} />

          <Route path='/search' element={<SearchEntry />} />

          {/* 에러 페이지 */}
          <Route path='*' element={<GlobalErrorPage />} />

          {/* 학과별 정보 */}
          <Route path='/departments/posts/:uuid' element={<DepartmentPostsDetailPage />} />
          <Route path='/departments/posts/new' element={<DepartmentPostsNewPage />} />
          <Route path='/departments/posts/edit/:uuid' element={<DepartmentPostsEditPage />} />
          <Route path='/departments/events/new' element={<DepartmentEventsNewPage />} />
          <Route path='/departments/events/edit/:uuid' element={<DepartmentEventsEditPage />} />

          {/* 로그인 */}
          <Route path='/login' element={<LoginPage />} />
          <Route path='/register' element={<Register />} />
          <Route path='/find-password' element={<FindPasswordPage />} />
        </Route>
      </Routes>

      {backgroundLocation && (
        <Routes>
          <Route path='/search' element={<SearchOverlay />} />
        </Routes>
      )}

      <AgentationTool />
    </>
  );
}
