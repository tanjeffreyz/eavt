import { getFlagSymbol, addWordBreaks } from '../../utils';
import DocumentList from '../../components/DocumentList/DocumentList';
import { Collapse, Button, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

function Sessions() {
  return (
    <Container fluid align='center'>
      <h1>Sessions</h1>
      <DocumentList 
        headers={['#', 'Name', 'Date & Time', 'Flag']}
        uri='/sessions/query'
        params={{ field: 'dt' }}
        rowElement={SessionRow}
      />
    </Container>
  );
}

function SessionRow(session, i, getDropdownState, toggleDropdownState) {
  const sessionName = addWordBreaks(session.path);
  return (
    <LinkContainer key={i} to={session._id}>
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
            {sessionName}
          </Button>
          <Collapse in={getDropdownState(i)}>
            <div>sparkline or metadata</div>
          </Collapse>
        </td>
        <td>{session.dt}</td>
        <td>{getFlagSymbol(session.flag)}</td>
      </tr>
    </LinkContainer>
  );
}

export default Sessions;
