import { useState, useEffect } from 'react';
import { API_ROOT } from '../../config'
import { Collapse, Button, Container, Table } from 'react-bootstrap';

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

  if (loading) return 'loading...';
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
  console.log(t);
  return (
    <tr>
      <td>{i+1}</td>
      <td>
        <Button
          onClick={() => toggleState(i)}
          aria-expanded={getState(i)}
          size='sm'
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
  );
}

export default Sessions;
