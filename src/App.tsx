import { Routes, Route } from 'react-router-dom';
import Board from '@/pages/board';
import BoardDetail from '@/pages/board/detail';
import BoardWrite from '@/pages/board/write';
import Notice from '@/pages/notice';
import Broadcast from '@/pages/broadcast';
import News from '@/pages/news';
import Main from '@/pages';
import Layout from '@/components/templates/Layout';
import Menu from '@/pages/menu';
import AcademicCalendar from '@/pages/academic-calendar';
import Search from '@/pages/search';
import MyPage from '@/pages/mypage';
import MyPageEdit from '@/pages/mypage/edit';
import Department from '@/pages/department';
import DepartmentDetail from '@/pages/department/detail';
import Login from '@/pages/login';
import Register from '@/pages/register';
import Admin from '@/pages/admin/calendar';
import AdminNotice from '@/pages/admin/notice';
import AdminNoticeDetail from '@/pages/admin/notice/detail';
import BoardEdit from '@/pages/board/edit';
import ViewPosts from '@/pages/mypage/viewPosts';
import ViewComments from '@/pages/mypage/viewComments';
import ViewLikes from '@/pages/mypage/viewLikes';
import AdminNoticeWrite from '@/pages/admin/notice/write';
import AdminNoticeEdit from '@/pages/admin/notice/edit';
import GlobalErrorPage from '@/pages/error';
import FindPw from '@/pages/findPw';
import DepartmentMainPage from '@/pages/main/department';
import DepartmentDetailPage from '@/pages/main/department-detail';
import DepartmentNewPost from '@/pages/main/department-new-post';

const App = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path='/' element={<Main />} />

        <Route path='/board' element={<Board />} />
        <Route path='/board/:uuid' element={<BoardDetail />} />
        <Route path='/board/write' element={<BoardWrite />} />
        <Route path='/board/edit/:uuid' element={<BoardEdit />} />

        <Route path='/notice' element={<Notice />} />
        <Route path='/news' element={<News />} />
        <Route path='/broadcast' element={<Broadcast />} />
        <Route path='/mypage/:uuid' element={<MyPage />} />
        <Route path='/mypage/:uuid/edit' element={<MyPageEdit />} />

        <Route path='/mypage/my-post/:uuid' element={<ViewPosts />} />
        <Route path='/mypage/my-comment/:uuid' element={<ViewComments />} />
        <Route path='/mypage/my-likes/:uuid' element={<ViewLikes />} />

        <Route path='/menu' element={<Menu />} />
        <Route path='/academic-calendar' element={<AcademicCalendar />} />

        <Route path='/department' element={<Department />} />
        <Route path='/department/:uuid' element={<DepartmentDetail />} />

        <Route path='/search' element={<Search />} />

        <Route path='/admin/:departmentUuid' element={<Admin />} />
        <Route path='/admin/:departmentUuid/notice' element={<AdminNotice />} />
        <Route path='/admin/:departmentUuid/notice/:noticeUuid' element={<AdminNoticeDetail />} />
        <Route path='/admin/:departmentUuid/notice/write' element={<AdminNoticeWrite />} />
        <Route
          path='/admin/:departmentUuid/notice/edit/:noticeUuid'
          element={<AdminNoticeEdit />}
        />

        <Route path='*' element={<GlobalErrorPage />} />

        {/* 디버깅용 */}
        <Route path='/main/department' element={<DepartmentMainPage />} />
        <Route path='/main/department/:uuid' element={<DepartmentDetailPage />} />
        <Route path='/main/department/new' element={<DepartmentNewPost />} />
      </Route>

      <Route element={<Layout className='bg-grey-05' />}>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/find-pw' element={<FindPw />} />
      </Route>
    </Routes>
  );
};

export default App;
