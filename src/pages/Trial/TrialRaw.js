import { useEffect, useState, useRef } from 'react';
import { Button } from 'react-bootstrap';
import { useOutletContext } from 'react-router-dom';
import * as THREE from 'three';
import InteractiveCanvas from '../../components/InteractiveCanvas/InteractiveCanvas';
import Loader from '../../components/Loader/Loader';
import { sendRequest } from '../../utils';

function TrialRaw() {
  const { trial } = useOutletContext();
  const [stripRaw, setStripRaw] = useState([]);
  const [loading, setLoading] = useState(true);
  const [test, setTest] = useState(1);
  const canvasRef = useRef(null);

  useEffect(() => {
    getAllPages({
      uri: `/trials/${trial._id}/raw/strip-raw`,
      setData: setStripRaw,
      callback: () => setLoading(false)
    });
  }, []);

  if (loading) return <Loader />;
  return (
    <>
      <InteractiveCanvas 
        ref={canvasRef}
        displayWidth={900} displayHeight={600}
        contentWidth={40} contentHeight={20}
        init={defaultDraw}
      />
      <Button onClick={() => canvasRef.current.centerCanvas()}>
        Center
      </Button>
    </>
  );
}

function getAllPages({
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


function defaultDraw(scene) {
  const material = new THREE.LineBasicMaterial( { color: 0x0000ff } );
  const points = [];
  points.push( new THREE.Vector3(0, 10, 0) );
  points.push( new THREE.Vector3(20, 0, 0) );
  points.push( new THREE.Vector3(40, 10, 0) );
  points.push( new THREE.Vector3(20, 20, 0) );
  points.push( new THREE.Vector3(0, 10, 0) );

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const line = new THREE.Line(geometry, material);
  scene.add(line);
}

export default TrialRaw;
