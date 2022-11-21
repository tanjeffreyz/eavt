import { useState, useEffect } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import { Collapse, Button, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { sendRequest, addWordBreaks, getFlagSymbol } from '../../utils';
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen';
import DocumentList from '../../components/DocumentList/DocumentList';

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
  const list = DocumentList({
    headers: ['#', 'Name', 'Date & Time', 'Flag'],
    uri: `/sessions/${session._id}/trials`,
    rowElement: TrialRow
  });
  return (
    <Container fluid align='center'>
      <h1>Trials</h1>
      {list}
    </Container>
  );
}

function TrialRow(trial, i, getDropdownState, toggleDropdownState) {
  const paths = trial.path.split('/');
  const trialName = addWordBreaks(paths[paths.length-1]);
  return (
    <LinkContainer key={i} to={trial._id}>
      <tr>
        <td>{i+1}</td>
        <td>
          <Button
            onClick={(e) => {
              toggleDropdownState(i);
              e.stopPropagation();
            }}
            aria-expanded={getDropdownState(i)}
            size='sm'
            variant='outline-primary'
          >
            {trialName}
          </Button>
          <Collapse in={getDropdownState(i)}>
            <div>sparkline or metadata</div>
          </Collapse>
        </td>
        <td>{trial.dt}</td>
        <td>{getFlagSymbol(trial.flag)}</td>
      </tr>
    </LinkContainer>
  );
}

export {
  SessionNav,
  Session
};
