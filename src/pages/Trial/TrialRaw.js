import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import InteractiveCanvas from '../../components/InteractiveCanvas/InteractiveCanvas';
import Loader from '../../components/Loader/Loader';
import { sendRequest } from '../../utils';

function TrialRaw() {
  const { trial } = useOutletContext();
  const [stripRaw, setStripRaw] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    requestAllPages({
      uri: `/trials/${trial._id}/raw/strip-raw`,
      setData: setStripRaw,
      callback: () => setLoading(false)
    });
  }, []);

  if (loading) return <Loader />;
  console.log(stripRaw);
  return (
    <>
      <InteractiveCanvas width={900} height={600} />
      {[...Array(100).keys()].map(i => <><br key={i}></br>a</>)}
    </>
  );
}

function requestAllPages({
  uri,
  setData=((data) => {}),
  callback=(() => {})
}) {
  function recur(cursor) {
    sendRequest({
      uri,
      params: { cursor },
      pass: (data) => {
        setData((prev) => [...prev, ...data.documents]);
        if (data.hasNext) {
          recur(data.cursor);
        } else {
          callback();
        }
      }
    });
  }
  recur(null);
}

export default TrialRaw;
