import { Routes, Route } from 'react-router-dom';
import ButtonTestPage from './components/atomic/button/ButtonTestPage';
import InputTestPage from './components/atomic/input/InputTestPage';

const App = () => {
  return (
    <Routes>
      <Route path='/test/button' element={<ButtonTestPage></ButtonTestPage>}></Route>
      <Route path='/test/input' element={<InputTestPage></InputTestPage>}></Route>
    </Routes>
  );
};

export default App;
