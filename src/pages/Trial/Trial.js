import { useState, useEffect } from 'react';
import { useParams, useOutletContext, Outlet } from 'react-router-dom';
import { Collapse, Button, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { sendRequest, addWordBreaks, getFlagSymbol } from '../../utils';
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen';
import { Back } from '../../components/Icons/Icons';

function TrialNav() {
  const params = useParams();
  const [trial, setTrial] = useState(null);

  useEffect(() => {
    sendRequest({
      uri: `/trials/${params.id}`,
      pass: (data) => setTrial(data)
    })
  }, [params.id]);

  if (!trial) return <LoadingScreen />;
  const paths = trial.path.split('/');
  const sessionName = paths[0];
  const trialName = paths[paths.length-1];
  const subtitle = (
    <span title={`Session: ${sessionName}`}>
      {trialName}
    </span>
  );
  return NavigationBar({
    title: 'Trial',
    subtitle,
    links: [
      {name: 'Raw', to: 'raw'},
      {name: 'Processed', to: 'processed'}
    ],
    back: {
      icon: Back({}),
      to: `/sessions/${trial.parent_id}`
    },
    context: { trial }
  });
}

function Trial() {
  const { trial } = useOutletContext();
  return (
    <>
      <Outlet />

      <Container fluid align='center'>
        
        <span>{addWordBreaks(trial.path)}</span>
      </Container>
    </>
  );
}

export {
  TrialNav,
  Trial
};
