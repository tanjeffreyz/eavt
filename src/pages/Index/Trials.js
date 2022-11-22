import { getFlagSymbol, addWordBreaks } from '../../utils';
import DocumentList from '../../components/DocumentList/DocumentList';
import { Collapse, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Section from '../../components/Section/Section';

function Trials() {
  return (
    <Section fluid align='center'>
      <h1>Trials</h1>
      <DocumentList 
        headers={['#', 'Name', 'Session', 'Date & Time', 'Flag']}
        uri='/trials/query'
        params={{ field: 'dt' }}
        rowElement={TrialRow}
      />
    </Section>
  );
}

function TrialRow(trial, i, getDropdownState, toggleDropdownState) {
  const paths = trial.path.split('/');
  const sessionName = addWordBreaks(paths[0]);
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
        <td>{sessionName}</td>
        <td>{trial.dt}</td>
        <td>{getFlagSymbol(trial.flag)}</td>
      </tr>
    </LinkContainer>
  );
}

export default Trials;
