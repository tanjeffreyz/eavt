import './DocumentList.css';
import { useState, useEffect } from 'react';
import { sendRequest, useInfiniteScroll } from '../../utils';
import Loader from '../../components/Loader/Loader';
import { Container, Table } from 'react-bootstrap';

function DocumentList({
  title,
  headers,
  uri, 
  field, 
  rowElement
}) {
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState(null);
  const [state, setState] = useState({});
  const [loading, setLoading] = useInfiniteScroll(fetchNextPage);
  const [pageState, setPageState] = useState({cursor: null, hasNext: true});

  useEffect(() => fetchNextPage(10), []);

  function fetchNextPage(limit=1) {
    if (!pageState.hasNext) {
      setLoading(false);
      return;
    }
    sendRequest({
      uri,
      params: {
        field, 
        limit,
        cursor: pageState.cursor
      },
      pass: (data) => {
        setDocuments(prev => ([...prev, ...data.documents]));
        setPageState({
          cursor: data.cursor,
          hasNext: data.hasNext
        })
        setLoading(false);
      },
      fail: setError
    });
  };

  function getDropdownState(i) {
    if (!(i in state)) {
      state[i] = false;
    }
    return state[i];
  };

  function toggleDropdownState(i) {
    setState((prev) => {
      return { ...prev, [i]: !getDropdownState(i) };
    });
  };

  // Render
  if (error) return error;
  return (
    <Container fluid align='center'>
      <h1>{title}</h1>
      <Table hover className='table-clamped-width'>
        <thead>
          <tr>
            {headers.map(h => <th>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {documents.map((t, i) => rowElement(t, i, getDropdownState, toggleDropdownState))}
        </tbody>
      </Table>
      {loading && <Loader />}
    </Container>
  );
}

export default DocumentList;
