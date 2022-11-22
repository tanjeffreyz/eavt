import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { IndexNav, Sessions, Trials } from './pages/Index/Index';
import { Session, SessionNav } from './pages/Session/Session';
import { TrialNav, Trial } from './pages/Trial/Trial';

function App() {
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    console.log(pathname, hash, key);
    if (hash === '') {
      window.scrollTo(0, 0);
    } else {
      setTimeout(() => {
        const element = document.getElementById(hash.replace('#', ''));
        if (element) {
          element.scrollIntoView();
        }
      }, 0);
    }
  }, [pathname, hash, key]);

  return (
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
  );
}

export default App;
