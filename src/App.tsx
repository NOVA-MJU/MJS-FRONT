import { Routes, Route } from 'react-router-dom';
import ButtonTestPage from './components/atomic/button/ButtonTestPage';
import InputTestPage from './components/atomic/input/InputTestPage';
import Layout from './components/atomic/layout/Layout';

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<Layout></Layout>}>
        {' '}
        <Route path='/test/button' element={<ButtonTestPage></ButtonTestPage>}></Route>
        <Route path='/test/input' element={<InputTestPage></InputTestPage>}></Route>
      </Route>
    </Routes>
  );
};

export default App;
