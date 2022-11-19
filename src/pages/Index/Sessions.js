import { useState, useEffect } from 'react';
import { API_ROOT } from '../../config'
import Loader from '../../components/Loader/Loader';
import { Collapse, Button, Container, Table } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

function Sessions() {
  const [ loading, setLoading ] = useState(true);
  const [ data, setData ] = useState(null);
  const [ state, setState ] = useState({});
  
  useEffect(() => {
    const params = new URLSearchParams({field: 'dt'});
    fetch(API_ROOT + '/sessions/query?' + params)
      .then(res => {
        if (res.ok) {
          return res.json();
        }
      })
      .then(data => { 
        setData(data);
      })
      .finally(() => {
        setLoading(false);
        console.log('Retrieved session list');
      });
  }, []);

  function getState(i) {
    if (!(i in state)) {
      state[i] = false;
    }
    return state[i];
  }

  function toggleState(i) {
    setState((prev) => {
      return { ...prev, [i]: !getState(i) };
    });
  }

  if (loading) return <Loader />;
  return (
    <Container fluid align='center'>
      <h1>Sessions</h1>
      <Table hover>
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
    <LinkContainer to={t._id}>
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
        <td>{t.flag}</td>
      </tr>
    </LinkContainer>
  );
}

export default Sessions;
