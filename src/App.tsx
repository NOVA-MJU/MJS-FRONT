import { Routes, Route } from 'react-router-dom';

import Board from './pages/board';
import BoardDetail from './pages/board/detail';
import BoardWrite from './pages/board/write';
import Login from './pages/login';
import Register from './pages/register';
import Notice from './pages/notice';
import News from './pages/news';
import Main from './pages/main';
import Layout from './components/templates/Layout';
import Menu from './pages/menu';
import AcademicCalendar from './pages/academic-calendar';
import Department from './pages/department';
import Search from './pages/search';
import MyPage from './pages/mypage';
import MyPageEdit from './pages/mypage/edit';

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Main />} />

      <Route element={<Layout />}>
        <Route path='/board' element={<Board />} />
        <Route path='/board/:uuid' element={<BoardDetail />} />
        <Route path='/board/write' element={<BoardWrite />} />
        <Route path='/board/edit/:uuid' element={<BoardWrite />} />

        <Route path='/notice' element={<Notice />} />
        <Route path='/news' element={<News />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/mypage/:uuid' element={<MyPage />} />
        <Route path='/mypage/:uuid/edit' element={<MyPageEdit />} />

        <Route path='/menu' element={<Menu />} />
        <Route path='/academic-calendar' element={<AcademicCalendar />} />
        <Route path='/department' element={<Department />} />

        <Route path='/search' element={<Search />} />
      </Route>
    </Routes>
  );
};

export default App;
