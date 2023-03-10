import { useState } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import { Collapse, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { addWordBreaks, sendRequest } from '../../utils';
import { Flag, FlagSelector } from '../../components/Flag/Flag';
import { useLoadDocument } from '../../hooks';
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen';
import DocumentList from '../../components/DocumentList/DocumentList';
import { Back, Refresh } from '../../components/Icons/Icons';
import Section from '../../components/Section/Section';
import CommentList from '../../components/CommentList/CommentList';

function SessionNav() {
  const params = useParams();
  const uri = `/sessions/${params.id}`;
  const [session, loadSession] = useLoadDocument(uri);
  const [reindexing, setReindexing] = useState(false);

  function reindexSession() {
    setReindexing(true);
    sendRequest({
      uri,
      config: {
        method: 'PUT'
      },
      pass: () => window.location.reload(false)
    })
  }

  if (!session) return <LoadingScreen />;

  return (
    <NavigationBar
      title='Session'
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
      context={{session, loadSession, uri}}
    >
      {session.path}
      <FlagSelector 
        value={session.flag} 
        uri={uri} 
        className='ms-3'
        loadDocument={loadSession}
      />
      <Refresh 
        className='ms-3'
        iconClassName={reindexing ? 'icon-spinning' : ''}
        title='Re-index Session' 
        style={{position: 'relative', top: '-1px'}}
        onClick={reindexSession}
      />
    </NavigationBar>
  );
}

function Session() {
  const { session, loadSession, uri } = useOutletContext();
  return (
    <>
      <Section fluid align='center' id='visualization'>
        <h1>Visualization</h1>
      </Section>
      
      <Section fluid align='center' id='data'>
        <h1>Data</h1>
      </Section>

      <Section fluid align='center' id='comments'>
        <h1>Comments</h1>
        <CommentList 
          document={session}
          loadDocument={loadSession}
          uri={uri}
        />
      </Section>

      <Section fluid align='center' id='trials'>
        <h1>Trials</h1>
        <DocumentList 
          headers={['#', 'Name', 'Date & Time', 'Flag']}
          uri={`/sessions/${session._id}/trials`}
          params={{ field: 'dt' }}
          Row={TrialRow}
        />
      </Section>
    </>
    
  );
}

function TrialRow({
  document, 
  index
}) {
  const [dropdownState, setDropdownState] = useState(false);
  const paths = document.path.split(/[/\\]+/);
  const trialName = addWordBreaks(paths[paths.length-1]);
  const date = new Date(document.dt);
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
        <td>{date.toLocaleString()}</td>
        <td>{<Flag value={document.flag} />}</td>
      </tr>
    </LinkContainer>
  );
}

export {
  SessionNav,
  Session
};
