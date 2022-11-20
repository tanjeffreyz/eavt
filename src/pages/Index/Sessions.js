import { getFlagSymbol } from '../../utils';
import DocumentList from '../../components/DocumentList/DocumentList';
import { Collapse, Button } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

function Sessions() {
  return DocumentList({
    title: 'Sessions',
    headers: ['#', 'Name', 'Date & Time', 'Flag'],
    uri: '/sessions/query',
    field: 'dt',
    rowElement: SessionRow
  });
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
            {session.path}
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
