import './Index.css';
import { useState, useEffect } from 'react';
import { sendRequest, getFlagSymbol } from '../../utils';
import Loader from '../../components/Loader/Loader';
import { Collapse, Button, Container, Table } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';

function Trials() {
  const [ data, setData ] = useState(null);
  const [ error, setError ] = useState(null);
  const [ loading, setLoading ] = useState(true);
  const [ state, setState ] = useState({});
  
  useEffect(() => {
    sendRequest({
      uri: '/trials/query',
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
  }

  const toggleState = (i) => {
    setState((prev) => {
      return { ...prev, [i]: !getState(i) };
    });
  }

  // Render
  if (loading) return <Loader />;
  if (error) return error;
  return (
    <Container fluid align='center'>
      <h1>Trials</h1>
      <Table hover className='table-clamped-width'>
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

function TrialRow(trial, i, getState, toggleState) {
  const paths = trial.path.split('/');
  const sessionName = paths[0];
  const trialName = paths[paths.length-1];
  return (
    <LinkContainer key={trial._id} to={trial._id}>
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
        <td>{trial.dt}</td>
        <td>{getFlagSymbol(trial.flag)}</td>
      </tr>
    </LinkContainer>
  );
}

export default Trials;
