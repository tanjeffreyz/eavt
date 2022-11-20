import { useParams } from 'react-router-dom';

function Session() {
  const params = useParams();
  return (
    <div>{params.id}</div>
  );
}

export default Session;
