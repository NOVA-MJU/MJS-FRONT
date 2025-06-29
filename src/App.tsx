import { Routes, Route } from 'react-router-dom';
import ButtonTestPage from './components/atoms/button/ButtonTestPage';
import InputTestPage from './components/atoms/input/InputTestPage';
import Layout from './components/templates/Layout';

import Board from './pages/board';
import BoardDetail from './pages/board/detail';
import BoardWrite from './pages/board/write';
import Login from './pages/login';
import Register from './pages/register';
import Notice from './pages/notice';
import News from './pages/news';

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Layout></Layout>}>
        <Route path='/board' element={<Board />} />
        <Route path='/board/:uuid' element={<BoardDetail />} />
        <Route path='/board/write' element={<BoardWrite />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/notice' element={<Notice />} />
        <Route path='/news' element={<News />} />

        <Route path='/test/button' element={<ButtonTestPage></ButtonTestPage>}></Route>
        <Route path='/test/input' element={<InputTestPage></InputTestPage>}></Route>
      </Route>
    </Routes>
  );
};

export default App;
