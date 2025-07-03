import { Routes, Route } from 'react-router-dom';
import ButtonTestPage from './components/atoms/button/ButtonTestPage';
import InputTestPage from './components/atoms/input/InputTestPage';
import Layout from './components/atoms/layout/Layout';

import Board from './pages/board';
import BoardDetail from './pages/board/detail';
import BoardWrite from './pages/board/write';
import MainPage from './pages/board/main/MainPage';

const App = () => {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path='/' element={<MainPage />} />
        <Route path='/board' element={<Board />} />
        <Route path='/board/:uuid' element={<BoardDetail />} />
        <Route path='/board/write' element={<BoardWrite />} />

        <Route path='/test/button' element={<ButtonTestPage></ButtonTestPage>}></Route>
        <Route path='/test/input' element={<InputTestPage></InputTestPage>}></Route>
      </Route>
    </Routes>
  );
};

export default App;
