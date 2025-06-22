import { Routes, Route } from 'react-router-dom';
import ButtonTestPage from './components/atomic/button/ButtonTestPage';

const App = () => {
  return (
    <Routes>
      <Route
        path="/test/button"
        element={<ButtonTestPage></ButtonTestPage>}
      ></Route>
    </Routes>
  );
};

export default App;
