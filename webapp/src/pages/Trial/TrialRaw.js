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
  const [dataReady, setDataReady] = useState(false);

  // Load data
  const [stripRaw, setStripRaw] = useState([]);
  const [stripRawOutput, setStripRawOutput] = useState([]);
  const [stripMicrodoses, setStripMicrodoses] = useState([]);

  const [stripRawFrames, setStripRawFrames] = useState([]);
  const [stripRawOutputFrames, setStripRawOutputFrames] = useState([]);
  const [stripMicrodoseFrames, setStripMicrodoseFrames] = useState([]);
  
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
    const maxIndex = Math.max(
      getIndex(stripRaw[stripRaw.length-1].id),
      getIndex(stripRawOutput[stripRawOutput.length-1].id),
      getIndex(stripMicrodoses[stripMicrodoses.length-1].id)
    );
    
    // Load all sprites into their respective groups, maintaining order through daisy chaining
    function first() {
      loadSprites({
        array: stripRaw, 
        minIndex,
        maxIndex,
        scene, 
        getSprite: getStripSprite,
        setData: setStripRawFrames,
        callback: second
      });
      setStripRaw([]);    // Free up memory, working with only sprites now
    }

    function second() {
      loadSprites({
        array: stripMicrodoses, 
        minIndex,
        maxIndex,
        scene, 
        getSprite: getMicrodoseSprite,
        setData: setStripMicrodoseFrames,
        callback: () => setDataReady(true)
      });
      setStripMicrodoses([]);
    }
    
    // function second() {
    //   loadStripSprites({
    //     array: stripRawOutput, 
    //     minIndex,
    //     scene, 
    //     setData: setStripRawOutputFrames
    //   });
    //   setStripRawOutput([]);
    // }

    // Start the daisy chain
    first();
    console.log('init end');
  }

  /** Shows current frame's data and hides previous frame's data */
  function update({scene, camera, renderer}) {
    if (!dataReady || numFrames === 0) return;
    // console.log('update start', numFrames);

    stripRawFrames[index.prev].visible = false;
    stripRawFrames[index.curr].visible = true;

    stripMicrodoseFrames[index.prev].visible = false;
    stripMicrodoseFrames[index.curr].visible = true;

    // console.log('update end');
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

/** Loads the strips as sprite textures into their respective frame groups */
function loadSprites({
  array, 
  minIndex,
  maxIndex,
  scene, 
  getSprite,    // Function that returns the sprite for that strip's data
  setData,
  callback=(() => {})
}) {
  const frames = [];
  for (let i = minIndex; i <= maxIndex; ++i) {
    const group = new THREE.Group();
    group.visible = (frames.length === 0);   // Make first frame visible by default
    scene.add(group);
    frames.push(group);
  }

  asyncFor({
    array,
    f: (strip) => {
      const index = getIndex(strip.id) - minIndex;
      frames[index].add(getSprite(strip));
    }, 
    callback: () => {
      setData(frames);
      callback();
    }
  });
}

/** Returns the sprite for an image strip using the image as a texture */
function getStripSprite(strip) {
  const offset = getOffset(strip.id);

  // Build image sprite
  const texture = new THREE.TextureLoader().load(
    `data:image/bmp;base64,${strip.data}`,
    // (map) => renderer.initTexture(map)    // Init texture immediately, not on first-render
  );
  texture.repeat.set(1, -1);
  texture.offset.set(0, 1);
  const material = new THREE.SpriteMaterial({ map: texture });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(512, 16, 1);
  sprite.position.set(0, -256 + 8 + 16 * offset, 0);
  return sprite;
}

/** Returns the sprite for a list of microdoses as a group of dots */
function getMicrodoseSprite(strip) {
  const offset = getOffset(strip.id);
  const microdoseGroup = new THREE.Group();
  for (let microdose of strip.microdoses) {
    const x = microdose[1];
    const y = microdose[2];

    const circleGeometry = new THREE.CircleGeometry(2, 8);
    const circleMaterial = new THREE.MeshBasicMaterial({color: 0xff0000});
    const circle = new THREE.Mesh(circleGeometry, circleMaterial);
    circle.position.set(x - 256, -256 + 16 * offset + y, 1E-3);

    microdoseGroup.add(circle);
  }
  return microdoseGroup;
}

export default TrialRaw;
