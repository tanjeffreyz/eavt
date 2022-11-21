import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { IndexNav, Sessions, Trials } from './pages/Index/Index';
import { Session, SessionNav } from './pages/Session/Session';
import { TrialNav, Trial } from './pages/Trial/Trial';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<IndexNav />}>
          <Route index element={<Sessions />} />
          <Route path='sessions' element={<Sessions />} />
          <Route path='trials' element={<Trials />} />
        </Route>
        <Route path='/sessions/:id' element={<SessionNav />}>
          <Route index element={<Session />} />
        </Route>
        <Route path='/trials/:id' element={<TrialNav />}>
          <Route index element={<Trial />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
