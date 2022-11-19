import API_ROOT from '../../config.js';
import { Outlet, Link } from 'react-router-dom';

function IndexNav() {
  return (
    <>
      <nav>
        <ul>
          <li>
            <Link to="/sessions">Sessions</Link>
          </li>
          <li>
            <Link to="/trials">Trials</Link>
          </li>
        </ul>
      </nav>

      <Outlet />
    </>
  );
}

function Sessions() {
  const test = ['1', '2', '3'];
  const list = test.map((t) => <li>{t}</li>);
  return (
    <>
      <h1>Sessions</h1>
      <ol>
        {list}
      </ol>
    </>
  );
}

function Trials() {
  const test = ['1', '2', '3'];
  const list = test.map((t) => <li>{t}</li>);
  return (
    <>
      <h1>Trials</h1>
      <ol>
        {list}
      </ol>
    </>
  );
}

export {
  IndexNav,
  Sessions,
  Trials
};
