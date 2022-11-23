import { useEffect, useState, useRef } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useOutletContext } from 'react-router-dom';
import * as THREE from 'three';
import InteractiveCanvas from '../../components/InteractiveCanvas/InteractiveCanvas';
import Loader from '../../components/Loader/Loader';
import { sendRequest } from '../../utils';

function TrialRaw() {
  const { trial } = useOutletContext();
  const [numLoaded, setNumLoaded] = useState(0);    // Tracks # of datasets loaded
  const [index, setIndex] = useState(0);
  const prevIndexRef = useRef(0);
  const canvasRef = useRef(null);

  const [stripRaw, setStripRaw] = useState([]);

  const datasets = [
    {uri: `/trials/${trial._id}/raw/strip-raw`, setData: setStripRaw},
  ]

  useEffect(() => {
    loadAllDatasets({
      datasets,
      callback: () => setNumLoaded((prev) => prev + 1)
    });
  }, []);

  /** Loads raw strip data into sprites */
  function init(scene) {
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
    
    const minIndex = Math.floor(stripRaw[0].n / 32);
    const frames = [];
    stripRaw.forEach((frame) => {
      const offset = frame.n % 32;
      const index = Math.floor(frame.n / 32) - minIndex;

      // Build image sprite
      const texture = new THREE.TextureLoader().load(
        `data:image/bmp;base64,${frame.data}`,
        () => {}  // For some reason, adding a callback here causes the image to render after loading...
      );
      const material = new THREE.SpriteMaterial({ map: texture });
      const sprite = new THREE.Sprite(material);
      sprite.scale.set(512, 16, 1);
      sprite.position.set(0, 256 - 8 - 16 * offset, 0);
      sprite.visible = (index === 0);
      scene.add(sprite);
      
      // Add to appropriate sprite frame (bucket)
      if (index >= frames.length) {
        frames.push([]);
      }
      frames[index].push(sprite);
    });
    setStripRaw(frames);    // Free up memory, working with sprites only now
  }

  /** Shows current frame's data and hides previous frame's data */
  function update(scene) {
    console.log(index, prevIndexRef.current)
    if (stripRaw && stripRaw.length > 0 && Array.isArray(stripRaw[0])) {
      stripRaw[prevIndexRef.current].forEach((s) => { s.visible = false; });
      stripRaw[index].forEach((s) => { s.visible = true; });
    }
  }

  // Render the component
  if (numLoaded < datasets.length) return <Loader />;

  const numFrames = Math.max(
    stripRaw.length,
  );
  return (
    <>
      <InteractiveCanvas 
        ref={canvasRef}
        displayWidth={900} displayHeight={600}
        contentWidth={512} contentHeight={512}
        init={init}
        update={update}
      />
      <Form.Range 
        min={0}
        max={numFrames - 1}
        value={index}
        onChange={(e) => {
          setIndex((prev) => {
            prevIndexRef.current = prev;
            return e.target.value;
          });
        }}
      />
      <Button onClick={() => canvasRef.current.centerCanvas()}>
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
  datasets.forEach((params) => {
    getAllPages({
      ...params,
      callback
    });
  });
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
