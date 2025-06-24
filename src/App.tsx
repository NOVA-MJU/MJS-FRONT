import { Routes, Route } from 'react-router-dom';
import ButtonTestPage from './components/atoms/button/ButtonTestPage';
import InputTestPage from './components/atoms/input/InputTestPage';
import Layout from './components/layout/Layout';
import LoginPage from './pages/LoginPage';

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Layout></Layout>}>
        <Route path='/test/button' element={<ButtonTestPage></ButtonTestPage>}></Route>
        <Route path='/test/input' element={<InputTestPage></InputTestPage>}></Route>
        <Route path='/login' element={<LoginPage />}></Route>
      </Route>
    </Routes>
  );
};

export default App;
