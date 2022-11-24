import { useState } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { addWordBreaks } from '../../utils';
import { useLoadDocument } from '../../hooks';
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen';
import { Back } from '../../components/Icons/Icons';
import Section from '../../components/Section/Section';
import TrialRaw from './TrialRaw';
import CommentList from '../../components/CommentList/CommentList';

function TrialNav() {
  const params = useParams();
  const [trial, loadTrial] = useLoadDocument(`/trials/${params.id}`);

  console.log('rendered trial nav');

  if (!trial) return <LoadingScreen />;

  const paths = trial.path.split('/');
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
      subtitle={subtitle}
      links={[
        {name: 'Visualization', to: {hash: 'visualization'}},
        {name: 'Data', to: {hash: 'data'}},
        {name: 'Comments', to: {hash: 'comments'}}
      ]}
      back={{
        icon: <Back />,
        to: `/sessions/${trial.parent_id}`
      }}
      context={{trial, loadTrial}}
    />
  );
}

function Trial() {
  const { trial, loadTrial } = useOutletContext();
  const [ test, setTest ] = useState(true);
  console.log('rendered trial body');
  return (
    <>
      <Section fluid align='center' id='visualization'>
        <h1>Visualization</h1>
        {/* setTest((prev) => !prev); */}
        <Button onClick={() => { loadTrial()}}>Test</Button>
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
          uri={`/trials/${trial._id}/comments`}
        />
      </Section>
    </>
  );
}

export {
  TrialNav,
  Trial
};
