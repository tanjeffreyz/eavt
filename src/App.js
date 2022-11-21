import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { IndexNav, Sessions, Trials } from './pages/Index/Index';
import Session from './pages/Session/Session';
import Trial from './pages/Trial/Trial';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<IndexNav />}>
          <Route index element={<Sessions />} />
          <Route path='sessions' element={<Sessions />} />
          <Route path='trials' element={<Trials />} />
        </Route>
        <Route path='/sessions/:id' element={<Session />} />
        <Route path='/trials/:id' element={<Trial />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
