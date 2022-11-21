import NavigationBar from '../../components/NavigationBar/NavigationBar';
import { Home } from '../../components/Icons/Icons';
import Trials from './Trials'
import Sessions from './Sessions';

function IndexNav() {
  return NavigationBar({
    title: 'Index',
    links: [
      {name: 'Sessions', to: '/sessions'},
      {name: 'Trials', to: '/trials'}
    ],
    back: {
      icon: Home({}),
      to: {hash: ''}
    }
  });
}

export {
  IndexNav,
  Sessions,
  Trials
};
