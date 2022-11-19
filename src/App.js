import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { IndexNav, Sessions, Trials } from './pages/Index/Index';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<IndexNav />}>
          <Route index element={<Sessions />} />
          <Route path='sessions' element={<Sessions />} />
          <Route path='trials' element={<Trials />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
