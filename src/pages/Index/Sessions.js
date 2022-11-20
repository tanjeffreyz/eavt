import './Index.css';
import { useState, useEffect } from 'react';
import { sendRequest, getFlagSymbol } from '../../utils';
import Loader from '../../components/Loader/Loader';
import { Collapse, Button, Container, Table } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

function Sessions() {
  const [ data, setData ] = useState(null);
  const [ error, setError ] = useState(null);
  const [ loading, setLoading ] = useState(true);
  const [ state, setState ] = useState({});

  useEffect(() => {
    sendRequest({
      uri: '/sessions/query',
      params: {field: 'dt'},
      setData,
      setError,
      setLoading
    })
  }, []);

  const getState = (i) => {
    if (!(i in state)) {
      state[i] = false;
    }
    return state[i];
  };

  const toggleState = (i) => {
    setState((prev) => {
      return { ...prev, [i]: !getState(i) };
    });
  };

  // Render
  if (loading) return <Loader />;
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
          {data.documents.map((t, i) => SessionRow(t, i, getState, toggleState))}
        </tbody>
      </Table>
    </Container>
  );
}

function SessionRow(t, i, getState, toggleState) {
  return (
    <LinkContainer key={t._id} to={t._id}>
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
            {t.path}
          </Button>
          <Collapse in={getState(i)}>
            <div>sparkline or metadata</div>
          </Collapse>
        </td>
        <td>{t.dt}</td>
        <td>{getFlagSymbol(t.flag)}</td>
      </tr>
    </LinkContainer>
  );
}

export default Sessions;
