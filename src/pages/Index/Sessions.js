import { useState, useEffect } from 'react';
import { API_ROOT } from '../../config'

function Sessions() {
  const [ loading, setLoading ] = useState(true);
  const [ data, setData ] = useState(null);
  
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

  if (loading) return 'loading...';
  return (
    <>
      <h1>Sessions</h1>
      <ol>
        {data ? data.documents.map((t) => <li key={t._id}>{t.path}</li>) : ''}
      </ol>
    </>
  );
}

export default Sessions;
