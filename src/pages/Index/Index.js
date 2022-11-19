import { Outlet, Link } from 'react-router-dom';
import Trials from './Trials'
import Sessions from './Sessions';

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

export {
  IndexNav,
  Sessions,
  Trials
};
