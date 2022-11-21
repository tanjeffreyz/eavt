import { useParams, useOutletContext } from 'react-router-dom';
import NavigationBar from '../../components/NavigationBar/NavigationBar';

function SessionNav() {
  const params = useParams();
  return NavigationBar({
    title: 'Session',
    subtitle: params.id,
    links: [
      {name: 'TCA', to: {hash: 'tca'}},
      {name: 'Trials', to: {hash: 'trials'}}
    ],
    context: ['asdfasdf']
  });
}

function Session() {
  const params = useParams();
  const [test] = useOutletContext();
  return (
    <div>{test}</div>
  );
}

export {
  SessionNav,
  Session
};
