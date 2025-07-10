import { Routes, Route } from 'react-router-dom';

import Board from './pages/board';
import BoardDetail from './pages/board/detail';
import BoardWrite from './pages/board/write';
import Login from './pages/Login';
import Register from './pages/Register';
import Notice from './pages/notice';
import News from './pages/news';
import Main from './pages/main';
import Layout from './components/templates/Layout';
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
      </Route>
    </Routes>
  );
};

export default App;
