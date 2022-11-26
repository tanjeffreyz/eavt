import { useState } from 'react';
import { addWordBreaks } from '../../utils';
import { Flag } from '../../components/Flag/Flag';
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
        Row={TrialRow}
      />
    </Section>
  );
}

function TrialRow({
  document, 
  index
}) {
  const [dropdownState, setDropdownState] = useState(false);
  const paths = document.path.split('/');
  const sessionName = addWordBreaks(paths[0]);
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
        <td>{sessionName}</td>
        <td>{document.dt}</td>
        <td>{<Flag value={document.flag} />}</td>
      </tr>
    </LinkContainer>
  );
}

export default Trials;
