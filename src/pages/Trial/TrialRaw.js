import { useEffect, useState, useRef } from 'react';
import { Button } from 'react-bootstrap';
import { useOutletContext } from 'react-router-dom';
import * as THREE from 'three';
import InteractiveCanvas from '../../components/InteractiveCanvas/InteractiveCanvas';
import Loader from '../../components/Loader/Loader';
import { sendRequest } from '../../utils';

function TrialRaw() {
  const { trial } = useOutletContext();
  const [numLoaded, setNumLoaded] = useState(0);    // Tracks # of datasets loaded
  const [index, setIndex] = useState(1);    
  const canvasRef = useRef(null);

  const [stripRaw, setStripRaw] = useState([]);
  const [stripRaw2, setStripRaw2] = useState([]);
  const [stripRaw3, setStripRaw3] = useState([]);

  const datasets = [
    {uri: `/trials/${trial._id}/raw/strip-raw`, setData: setStripRaw},
    {uri: `/trials/${trial._id}/raw/strip-raw`, setData: setStripRaw2},
    {uri: `/trials/${trial._id}/raw/strip-raw`, setData: setStripRaw3},
    {uri: `/trials/${trial._id}/raw/strip-raw`, setData: setStripRaw},
    {uri: `/trials/${trial._id}/raw/strip-raw`, setData: setStripRaw2},
    {uri: `/trials/${trial._id}/raw/strip-raw`, setData: setStripRaw3},
    {uri: `/trials/${trial._id}/raw/strip-raw`, setData: setStripRaw},
    {uri: `/trials/${trial._id}/raw/strip-raw`, setData: setStripRaw2},
    {uri: `/trials/${trial._id}/raw/strip-raw`, setData: setStripRaw3},
    {uri: `/trials/${trial._id}/raw/strip-raw`, setData: setStripRaw},
    {uri: `/trials/${trial._id}/raw/strip-raw`, setData: setStripRaw2},
    {uri: `/trials/${trial._id}/raw/strip-raw`, setData: setStripRaw3}
  ]

  useEffect(() => {
    loadAllDatasets({
      datasets,
      callback: () => setNumLoaded((prev) => prev + 1)
    });
  }, []);

  function defaultDraw(scene) {
    // console.log(stripRaw);
    // const material = new THREE.LineBasicMaterial( { color: 0x0000ff } );
    // const points = [];
    // points.push( new THREE.Vector3(-20, 0, 0) );
    // points.push( new THREE.Vector3(0, 10, 0) );
    // points.push( new THREE.Vector3(20, 0, 0) );
    // points.push( new THREE.Vector3(0, -10, 0) );
    // points.push( new THREE.Vector3(-20, 0, 0) );
  
    // const geometry = new THREE.BufferGeometry().setFromPoints(points);
    // const line = new THREE.Line(geometry, material);
    // scene.add(line);
  
    const material2 = new THREE.LineBasicMaterial( { color: 0xff0000 } );
    const points2 = [];
    points2.push( new THREE.Vector3(-256, -256, 0) );
    points2.push( new THREE.Vector3(-256, 256, 0) );
    points2.push( new THREE.Vector3(256, 256, 0) );
    points2.push( new THREE.Vector3(256, -256, 0) );
    points2.push( new THREE.Vector3(-256, -256, 0) );
  
    const geometry2 = new THREE.BufferGeometry().setFromPoints(points2);
    const line2 = new THREE.Line(geometry2, material2);
    scene.add(line2);

    // console.log(stripRaw[0].data);
    // const manager = new THREE.LoadingManager();
    // console.log(stripRaw);
    for (let i = 20; i < 52; i++) {
      const frame = stripRaw[i];
      const offset = frame.n % 32;
      // const num = Math.floor(frame.n / 32);

      const strip = new THREE.TextureLoader().load(
        `data:image/bmp;base64,${frame.data}`,
        () => canvasRef.current.render()
      );
      const stripMaterial = new THREE.SpriteMaterial( { map: strip } );
      const sprite = new THREE.Sprite( stripMaterial );
      sprite.scale.set(512, 16, 1);
      sprite.position.set(0, 256 - 8 - 16 * offset, 0);
      // console.log(sprite);
      scene.add( sprite );
    }
  }

  if (numLoaded < datasets.length) return <Loader />;
  console.log(stripRaw.length);
  console.log(stripRaw2.length);
  console.log(stripRaw3.length);
  return (
    <>
      <InteractiveCanvas 
        ref={canvasRef}
        displayWidth={900} displayHeight={600}
        contentWidth={512} contentHeight={512}
        init={defaultDraw}
      />
      {/* <img src={`data:image/bmp;base64,${stripRaw[0].data}`} /> */}
      <Button onClick={() => {setIndex(index + 1); canvasRef.current.centerCanvas();}}>
        Center
      </Button>
    </>
  );
}

////////////////////////////
//    Helper Functions    //
////////////////////////////
function loadAllDatasets({
  datasets, 
  callback
}) {
  for (let params of datasets) {
    getAllPages({
      ...params,
      callback
    });
  }
}

function getAllPages({
  uri,
  setData=((data) => {}),
  callback=(() => {})
}) {
  function recur(cursor) {
    sendRequest({
      uri,
      params: { cursor, limit: 1000 },
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
