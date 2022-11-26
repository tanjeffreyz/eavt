import './DocumentList.css';
import { useState, useEffect } from 'react';
import { sendRequest } from '../../utils';
import { useInfiniteScroll } from '../../hooks';
import Loader from '../../components/Loader/Loader';
import { Table } from 'react-bootstrap';

function DocumentList({
  headers,
  uri, 
  params, 
  Row
}) {
  const [documents, setDocuments] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useInfiniteScroll(fetchNextPage);
  const [pageState, setPageState] = useState({cursor: null, hasNext: true});

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => fetchNextPage(true), []);

  function fetchNextPage(reset=false) {
    if (!pageState.hasNext) {
      setLoading(false);
      return;
    }
    sendRequest({
      uri,
      params: {
        ...params,
        limit: 100,
        cursor: pageState.cursor
      },
      pass: (data) => {
        setDocuments(prev => {
          return (reset ? data.documents : [...prev, ...data.documents]);
        });
        setPageState({
          cursor: data.cursor,
          hasNext: data.hasNext
        })
        setLoading(false);
      },
      fail: setError
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
          {documents.map((d, i) => <Row key={i} index={i} document={d} />)}
        </tbody>
      </Table>
      {loading && <Loader />}
    </>
  );
}

export default DocumentList;
