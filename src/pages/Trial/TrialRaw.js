import { useEffect, useState, useRef } from 'react';
import { Button } from 'react-bootstrap';
import { useOutletContext } from 'react-router-dom';
import * as THREE from 'three';
import InteractiveCanvas from '../../components/InteractiveCanvas/InteractiveCanvas';
import Loader from '../../components/Loader/Loader';
import { Scrubber, useScrubberState } from '../../components/Scrubber/Scrubber';
import { sendRequest } from '../../utils';

function TrialRaw() {
  const { trial } = useOutletContext();
  const [numLoaded, setNumLoaded] = useState(0);    // Tracks number of datasets loaded
  const canvasRef = useRef(null);
  const [index, setIndex] = useScrubberState();

  // Load data
  const [stripRaw, setStripRaw] = useState([]);
  const [stripRawOutput, setStripRawOutput] = useState([]);
  const datasets = [
    {uri: `/trials/${trial._id}/raw/strip-raw`, setData: setStripRaw},
    {uri: `/trials/${trial._id}/raw/strip-raw`, setData: setStripRaw},
    {uri: `/trials/${trial._id}/raw/strip-raw`, setData: setStripRaw},
    {uri: `/trials/${trial._id}/raw/strip-raw`, setData: setStripRaw},
    {uri: `/trials/${trial._id}/raw/strip-raw`, setData: setStripRaw},
    {uri: `/trials/${trial._id}/raw/strip-raw`, setData: setStripRaw},
    {uri: `/trials/${trial._id}/raw/strip-raw`, setData: setStripRaw},
    {uri: `/trials/${trial._id}/raw/strip-raw`, setData: setStripRaw},
    {uri: `/trials/${trial._id}/raw/strip-raw`, setData: setStripRaw},
    {uri: `/trials/${trial._id}/raw/strip-raw`, setData: setStripRaw},
    {uri: `/trials/${trial._id}/raw/strip-raw`, setData: setStripRaw},
    {uri: `/trials/${trial._id}/raw/strip-raw`, setData: setStripRaw},
    {uri: `/trials/${trial._id}/raw/strip-raw-output`, setData: setStripRawOutput}
  ]

  useEffect(() => {
    loadAllDatasets({
      datasets,
      callback: () => setNumLoaded((prev) => prev + 1)
    });
  }, []);

  function init({scene, camera, renderer}) {
    // Free up memory, working with sprites only now
    setStripRaw(loadStripSprites(stripRaw, scene, renderer));
    // setStripRawOutput(addSprites(stripRawOutput, scene));
  }

  /** Shows current frame's data and hides previous frame's data */
  function update({scene, camera, renderer}) {
    console.log(index, numFrames);
    if (stripRaw && stripRaw.length > 0 && Array.isArray(stripRaw[0])) {
      stripRaw[index.prev].forEach((s) => { s.visible = false; });
      stripRaw[index.curr].forEach((s) => { s.visible = true; });
    }
    // if (stripRawOutput && stripRawOutput.length > 0 && Array.isArray(stripRawOutput[0])) {
    //   stripRawOutput[prevIndexRef.current].forEach((s) => { s.visible = false; });
    //   stripRawOutput[index].forEach((s) => { s.visible = true; });
    // }
  }

  // Stall while loading
  if (numLoaded < datasets.length) return <Loader />;

  // Accommodate longest sequence of frames
  const numFrames = Math.min(
    stripRaw.length,
    stripRawOutput.length
  );
  console.log('rendered');

  // Render component
  return (
    <>
      <InteractiveCanvas 
        ref={canvasRef}
        displayWidth={900} displayHeight={600}
        contentWidth={512} contentHeight={512}
        init={init}
        update={update}
      />

      <Scrubber 
        index={index}
        setIndex={setIndex}
        width={900}
        max={numFrames}
        className='mt-2'
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
function loadStripSprites(strips, scene, renderer) {
  const minIndex = Math.floor(strips[0].name / 32);
  const frames = [];
  strips.forEach((strip) => {
    const offset = strip.name % 32;
    const index = Math.floor(strip.name / 32) - minIndex;

    // Build image sprite
    const texture = new THREE.TextureLoader().load(
      `data:image/bmp;base64,${strip.data}`,
      (map) => renderer.initTexture(map)    // Init texture immediately, not on first-render
    );
    const material = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(512, 16, 1);
    sprite.position.set(0, 256 - 8 - 16 * offset, 0);
    sprite.visible = (index === 0);   // Make first frame visible
    scene.add(sprite);
    
    // Add to appropriate sprite frame bucket
    if (index >= frames.length) {
      frames.push([]);
    }
    frames[index].push(sprite);
  });
  return frames;
}

/** Gets all pages of data from multiple endpoints */
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

/** Gets all pages of data from `uri`, appends to data using `setData`. */
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
