import './DocumentList.css';
import { useState, useEffect } from 'react';
import { sendRequest, useInfiniteScroll } from '../../utils';
import Loader from '../../components/Loader/Loader';
import { Table } from 'react-bootstrap';

function DocumentList({
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <>
      <Table hover className='table-clamped-width'>
        <thead>
          <tr>
            {headers.map((h, i) => <th key={i}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {documents.map((d, i) => rowElement(d, i, getDropdownState, toggleDropdownState))}
        </tbody>
      </Table>
      {loading && <Loader />}
    </>
  );
}

export default DocumentList;
