import InteractiveCanvas from '../../components/InteractiveCanvas/InteractiveCanvas';

function TrialRaw() {
  return (
    <>
      <InteractiveCanvas width={900} height={600} />
      {[...Array(100).keys()].map(i => <><br key={i}></br>a</>)}
    </>
  );
}

export default TrialRaw;
