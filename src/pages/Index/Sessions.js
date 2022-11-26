import { useState } from 'react';
import { addWordBreaks } from '../../utils';
import { Flag } from '../../components/Flag/Flag';
import DocumentList from '../../components/DocumentList/DocumentList';
import { Collapse, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Section from '../../components/Section/Section';

function Sessions() {
  return (
    <Section fluid align='center'>
      <h1>Sessions</h1>
      <DocumentList 
        headers={['#', 'Name', 'Date & Time', 'Flag']}
        uri='/sessions/query'
        params={{ field: 'dt' }}
        Row={SessionRow}
      />
    </Section>
  );
}

function SessionRow({
  document, 
  index
}) {
  const [dropdownState, setDropdownState] = useState(false);
  const sessionName = addWordBreaks(document.path);
  return (
    <LinkContainer key={index} to={`/sessions/${document._id}`}>
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
            {sessionName}
          </Button>
          <Collapse in={dropdownState}>
            <div>sparkline or metadata</div>
          </Collapse>
        </td>
        <td>{document.dt}</td>
        <td>{<Flag value={document.flag} />}</td>
      </tr>
    </LinkContainer>
  );
}

export default Sessions;
