import { useState, useEffect } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import { sendRequest } from '../../utils';
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen';

function SessionNav() {
  const params = useParams();
  const [session, setSession] = useState(null);

  useEffect(() => {
    sendRequest({
      uri: `/sessions/${params.id}`,
      pass: (data) => setSession(data)
    })
  }, []);

  if (!session) return <LoadingScreen />;
  return NavigationBar({
    title: 'Session',
    subtitle: session.path,
    links: [
      {name: 'TCA', to: {hash: 'tca'}},
      {name: 'Trials', to: {hash: 'trials'}}
    ],
    context: { session }
  });
}

function Session() {
  const { session } = useOutletContext();
  return (
    <div>{session._id}</div>
  );
}

export {
  SessionNav,
  Session
};
