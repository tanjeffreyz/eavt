import { getFlagSymbol, addWordBreaks } from '../../utils';
import DocumentList from '../../components/DocumentList/DocumentList';
import { Collapse, Button, Container } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

function Sessions() {
  const list = DocumentList({
    headers: ['#', 'Name', 'Date & Time', 'Flag'],
    uri: '/sessions/query',
    field: 'dt',
    rowElement: SessionRow
  });

  return (
    <Container fluid align='center'>
      <h1>Sessions</h1>
      {list}
    </Container>
  );
}

function SessionRow(session, i, getDropdownState, toggleDropdownState) {
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
            {addWordBreaks(session.path)}
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
