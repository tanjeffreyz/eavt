import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import * as THREE from 'three';
import InteractiveCanvas from '../../components/InteractiveCanvas/InteractiveCanvas';
import Loader from '../../components/Loader/Loader';
import { Scrubber, useScrubberState } from '../../components/Scrubber/Scrubber';
import { asyncFor } from '../../utils';
import { useLoadDatasets } from '../../hooks';

function TrialRaw() {
  const { trial } = useOutletContext();
  const [numLoaded, loadDatasets] = useLoadDatasets({limit: 1000});
  const [index, setIndex] = useScrubberState();

  // Load data
  const [stripRaw, setStripRaw] = useState([]);
  const [stripRawOutput, setStripRawOutput] = useState([]);
  const [stripMicrodoses, setStripMicrodoses] = useState([]);

  const [stripRawFrames, setStripRawFrames] = useState([]);
  const [stripRawOutputFrames, setStripRawOutputFrames] = useState([]);
  
  const datasets = [
    {uri: `/trials/${trial._id}/raw/strip-raw`, setData: setStripRaw},
    {uri: `/trials/${trial._id}/raw/strip-raw-output`, setData: setStripRawOutput},
    {uri: `/trials/${trial._id}/raw/strip-microdoses`, setData: setStripMicrodoses}
  ]

  useEffect(() => {
    loadDatasets(datasets);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Initialize all objects in the scene
  function init({scene, camera, renderer}) {
    console.log('init start');
    const minIndex = Math.min(
      getIndex(stripRaw[0].id),
      getIndex(stripRawOutput[0].id),
      getIndex(stripMicrodoses[0].id)
    );
    // const maxIndex = Math.max(
    //   getIndex(stripRaw[stripRaw.length-1].id),
    //   getIndex(stripRawOutput[stripRawOutput.length-1].id),
    //   getIndex(stripMicrodoses[stripMicrodoses.length-1].id)
    // );
    
    // Load all sprites into their respective groups, maintaining order through daisy chaining
    function first() {
      loadStripSprites({
        array: stripRaw, 
        minIndex,
        scene, 
        setData: setStripRawFrames,
        // callback: second
      });
      setStripRaw([]);    // Free up memory, working with only sprites now
    }
    
    function second() {
      loadStripSprites({
        array: stripRawOutput, 
        minIndex,
        scene, 
        setData: setStripRawOutputFrames
      });
      setStripRawOutput([]);
    }

    // Start the daisy chain
    first();
    console.log('init end');
  }

  /** Shows current frame's data and hides previous frame's data */
  function update({scene, camera, renderer}) {
    if (numFrames === 0) return;
    console.log('update start', numFrames);
    stripRawFrames[index.prev].visible = false;
    stripRawFrames[index.curr].visible = true;
    console.log('update end');
  }

  // Stall while loading
  if (numLoaded < datasets.length) return <Loader />;

  // Accommodate longest sequence of frames
  const numFrames = Math.min(
    stripRawFrames.length,
    // stripRawOutputSprites.length
  );
  console.log('rendered');

  // Render component
  return (
    <>
      <InteractiveCanvas 
        displayWidth={900} displayHeight={600}
        contentWidth={512} contentHeight={512}
        init={init}
        update={update}
      >
        {/* TODO: more controls here */}
      </InteractiveCanvas>

      <Scrubber 
        index={index}
        setIndex={setIndex}
        width={900}
        max={numFrames}
        className='mt-2'
      />
    </>
  );
}

////////////////////////////
//    Helper Functions    //
////////////////////////////
/** Returns the frame index for the given strip ID */
function getIndex(stripId) {
  return Math.floor(stripId / 32);
}

/** Returns the strip's offset within its frame */
function getOffset(stripId) {
  return stripId % 32;
}

function loadStripSprites({
  array, 
  minIndex,
  scene, 
  setData,
  callback
}) {
  const frames = [];

  function f(strip) {
    const offset = getOffset(strip.id);
    const index = getIndex(strip.id) - minIndex;

    // Build image sprite
    const texture = new THREE.TextureLoader().load(
      `data:image/bmp;base64,${strip.data}`,
      // (map) => renderer.initTexture(map)    // Init texture immediately, not on first-render
    );
    const material = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(512, 16, 1);
    sprite.position.set(0, 256 - 8 - 16 * offset, 0);
    
    // Add sprite to appropriate group
    while (index >= frames.length) {
      const group = new THREE.Group();
      group.visible = (frames.length === 0);   // Make first frame visible by default
      scene.add(group);
      frames.push(group);
    }
    frames[index].add(sprite);
  };

  asyncFor({
    array,
    f, 
    callback: () => {
      setData(frames);
      callback();
    }
  });
}

export default TrialRaw;
