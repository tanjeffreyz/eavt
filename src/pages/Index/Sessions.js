import './Index.css';
import { useState, useEffect } from 'react';
import { sendRequest, getFlagSymbol, useInfiniteScroll } from '../../utils';
import Loader from '../../components/Loader/Loader';
import { Collapse, Button, Container, Table } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

function Sessions() {
  const [sessions, setSessions] = useState([]);
  const [error, setError] = useState(null);
  const [state, setState] = useState({});
  const [loading, setLoading] = useInfiniteScroll(fetchNextPage);
  const [pageState, setPageState] = useState({cursor: null, hasNext: true});

  useEffect(() => fetchNextPage(3), []);

  function fetchNextPage(limit=1) {
    if (!pageState.hasNext) {
      setLoading(false);
      return;
    }
    sendRequest({
      uri: '/sessions/query',
      params: {
        field: 'dt', 
        limit,
        cursor: pageState.cursor
      },
      success: (data) => {
        setSessions(prev => ([...prev, ...data.documents]));
        setPageState({
          cursor: data.cursor,
          hasNext: data.hasNext
        })
        setLoading(false);
      },
      fail: setError
    });
  };

  function getState(i) {
    if (!(i in state)) {
      state[i] = false;
    }
    return state[i];
  };

  function toggleState(i) {
    setState((prev) => {
      return { ...prev, [i]: !getState(i) };
    });
  };

  // Render
  if (error) return error;
  return (
    <Container fluid align='center'>
      <h1>Sessions</h1>
      <Table hover className='table-clamped-width'>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Date & Time</th>
            <th>Flag</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((t, i) => SessionRow(t, i, getState, toggleState))}
        </tbody>
      </Table>
      {loading && <Loader />}
    </Container>
  );
}

function SessionRow(session, i, getState, toggleState) {
  return (
    <LinkContainer key={i} to={session._id}>
      <tr>
        <td>{i+1}</td>
        <td>
          <Button
            onClick={(e) => {
              toggleState(i);
              e.stopPropagation();
            }}
            aria-expanded={getState(i)}
            size='sm'
            variant='outline-primary'
          >
            {session.path}
          </Button>
          <Collapse in={getState(i)}>
            <div>sparkline or metadata</div>
          </Collapse>
        </td>
        <td>{session.dt}<br></br>a<br></br>a<br></br>a<br></br>a<br></br>a<br></br>a<br></br>a<br></br>a<br></br>a</td>
        <td>{getFlagSymbol(session.flag)}</td>
      </tr>
    </LinkContainer>
  );
}

export default Sessions;
