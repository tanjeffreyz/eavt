import { useState, useEffect } from 'react';
import { API_ROOT } from '../../config'
import Loader from '../../components/Loader/Loader';
import { Collapse, Button, Container, Table } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

function Trials() {
  const [ loading, setLoading ] = useState(true);
  const [ data, setData ] = useState(null);
  const [ state, setState ] = useState({});
  
  useEffect(() => {
    const params = new URLSearchParams({field: 'dt'});
    fetch(API_ROOT + '/trials/query?' + params)
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
        console.log('Retrieved trial list');
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
      <h1>Trials</h1>
      <Table hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Session</th>
            <th>Date & Time</th>
            <th>Flag</th>
          </tr>
        </thead>
        <tbody>
          {data.documents.map((t, i) => TrialRow(t, i, getState, toggleState))}
        </tbody>
      </Table>
    </Container>
  );
}

function TrialRow(t, i, getState, toggleState) {
  const paths = t.path.split('/');
  const sessionName = paths[0];
  const trialName = paths[paths.length-1];
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
            {trialName}
          </Button>
          <Collapse in={getState(i)}>
            <div>sparkline or metadata</div>
          </Collapse>
        </td>
        <td>{sessionName}</td>
        <td>{t.dt}</td>
        <td>{t.flag}</td>
      </tr>
    </LinkContainer>
  );
}

export default Trials;
