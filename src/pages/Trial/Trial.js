import { useState, useEffect } from 'react';
import { useParams, useOutletContext } from 'react-router-dom';
import { sendRequest, addWordBreaks, getFlagSymbol } from '../../utils';
import NavigationBar from '../../components/NavigationBar/NavigationBar';
import LoadingScreen from '../../components/LoadingScreen/LoadingScreen';
import { Back } from '../../components/Icons/Icons';
import Section from '../../components/Section/Section';
import TrialRaw from './TrialRaw';

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
      context={{trial}}
    />
  );
}

function Trial() {
  const { trial } = useOutletContext();
  return (
    <>
      <Section fluid align='center' id='visualization'>
        <h1>Visualization</h1>
        <TrialRaw />
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
        {[...Array(100).keys()].map(i => <><br key={i}></br>a</>)}
      </Section>
    </>
  );
}

export {
  TrialNav,
  Trial
};
