import { useState, useEffect } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import { Collapse, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { sendRequest, addWordBreaks, getFlagSymbol } from '../../utils';
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen';
import DocumentList from '../../components/DocumentList/DocumentList';
import { Back } from '../../components/Icons/Icons';
import Section from '../../components/Section/Section';

function SessionNav() {
  const params = useParams();
  const [session, setSession] = useState(null);

  useEffect(() => {
    sendRequest({
      uri: `/sessions/${params.id}`,
      pass: (data) => setSession(data)
    })
  }, [params.id]);

  if (!session) return <LoadingScreen />;
  return (
    <NavigationBar
      title='Session'
      subtitle={session.path}
      links={[
        {name: 'Visualization', to: {hash: 'visualization'}},
        {name: 'Data', to: {hash: 'data'}},
        {name: 'Comments', to: {hash: 'comments'}},
        {name: 'Trials', to: {hash: 'trials'}}
      ]}
      back={{
        icon: <Back />,
        to: '/sessions'
      }}
      context={{session}}
    />
  );
}

function Session() {
  const { session } = useOutletContext();
  return (
    <Section fluid align='center' id='trials'>
      <h1>Trials</h1>
      <DocumentList 
        headers={['#', 'Name', 'Date & Time', 'Flag']}
        uri={`/sessions/${session._id}/trials`}
        params={{ field: 'dt' }}
        Row={TrialRow}
      />
      {[...Array(100).keys()].map(i => <><br key={i}></br>a</>)}
    </Section>
  );
}

function TrialRow({
  document, index
}) {
  const [dropdownState, setDropdownState] = useState(false);
  const paths = document.path.split('/');
  const trialName = addWordBreaks(paths[paths.length-1]);
  return (
    <LinkContainer key={index} to={`/trials/${document._id}`}>
      <tr>
        <td>{index+1}</td>
        <td>
          <Button
            onClick={(e) => {
              setDropdownState((prev) => !prev);
              e.stopPropagation();
            }}
            aria-expanded={dropdownState}
            size='sm'
            variant='outline-primary'
          >
            {trialName}
          </Button>
          <Collapse in={dropdownState}>
            <div>sparkline or metadata</div>
          </Collapse>
        </td>
        <td>{document.dt}</td>
        <td>{getFlagSymbol(document.flag)}</td>
      </tr>
    </LinkContainer>
  );
}

export {
  SessionNav,
  Session
};
