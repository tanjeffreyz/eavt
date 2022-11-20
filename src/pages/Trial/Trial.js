import { useParams } from 'react-router-dom';

function Trial() {
  const params = useParams();
  return (
    <div>{params.id}</div>
  );
}

export default Trial;
