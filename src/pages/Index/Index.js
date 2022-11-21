import NavigationBar from '../../components/NavigationBar/NavigationBar';
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
      element: 'asdf',
      to: {hash: ''}
    }
  });
}

export {
  IndexNav,
  Sessions,
  Trials
};
