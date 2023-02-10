import { useState } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { addWordBreaks, sendRequest } from '../../utils';
import { useLoadDocument } from '../../hooks';
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen';
import { Back, Refresh } from '../../components/Icons/Icons';
import Section from '../../components/Section/Section';
import TrialRaw from './TrialRaw';
import CommentList from '../../components/CommentList/CommentList';
import { FlagSelector } from '../../components/Flag/Flag';

function TrialNav() {
  const params = useParams();
  const uri = `/trials/${params.id}`;
  const [trial, loadTrial] = useLoadDocument(uri);
  const [reindexing, setReindexing] = useState(false);

  console.log('rendered trial nav');

  function reindexTrial() {
    setReindexing(true);
    sendRequest({
      uri,
      config: {
        method: 'PUT'
      },
      pass: () => window.location.reload(false)
    })
  }

  if (!trial) return <LoadingScreen />;

  const paths = trial.path.split(/[/\\]+/);
  const sessionName = paths[0];
  const trialName = paths[paths.length-1];
  const subtitle = (
    <span title={`Session: ${sessionName}`}>
      {trialName}
    </span>
  );

  return (
    <NavigationBar
      title='Trial'
      links={[
        {name: 'Visualization', to: {hash: 'visualization'}},
        {name: 'Data', to: {hash: 'data'}},
        {name: 'Comments', to: {hash: 'comments'}}
      ]}
      back={{
        icon: <Back />,
        to: `/sessions/${trial.parent_id}`
      }}
      context={{trial, loadTrial, uri}}
    >
      {subtitle}
      <FlagSelector 
        value={trial.flag} 
        uri={uri} 
        className='ms-3'
        loadDocument={loadTrial}
      />
      <Refresh 
        className='ms-3'
        iconClassName={reindexing ? 'icon-spinning' : ''}
        title='Re-index Trial' 
        style={{position: 'relative', top: '-1px'}}
        onClick={reindexTrial}
      />
    </NavigationBar>
  );
}

function Trial() {
  const { trial, loadTrial, uri } = useOutletContext();
  const [ test, setTest ] = useState(true);
  console.log('rendered trial body');
  return (
    <>
      <Section fluid align='center' id='visualization'>
        <h1>Visualization</h1>
        {/* setTest((prev) => !prev); */}
        {/* <Button onClick={() => { loadTrial()}}>Test</Button> */}
        {test ? <TrialRaw /> : <span>heheh</span>}
      </Section>

      <Section fluid align='center' id='data'>
        <h1>Data</h1>
        <div align='left'>
          <p>LMS: (0, 1, 0)</p>
          <p>Jitter: 21.6589</p>
        </div>
        <span>{addWordBreaks(trial.path)}</span>
      </Section>

      <Section fluid align='center' id='comments'>
        <h1>Comments</h1>
        <CommentList 
          document={trial}
          loadDocument={loadTrial}
          uri={uri}
        />
      </Section>
    </>
  );
}

export {
  TrialNav,
  Trial
};
