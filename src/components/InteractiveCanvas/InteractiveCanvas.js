import './InteractiveCanvas.css';
import { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import * as THREE from 'three';

const InteractiveCanvas = forwardRef((props, ref) => {
  let {
    displayWidth,
    displayHeight,
    contentWidth,
    contentHeight,
    init=((scene) => {}),
    update=((scene) => {})
  } = props;

  const FOV = 45;     // Vertical FOV in degrees
  const HALF_FOV_RAD = Math.PI / 180 * (FOV / 2);
  const NEAR = 100;
  const FAR = 2000;
  const MAX_SCALE = getScaleFromZ(NEAR);
  const MIN_SCALE = getScaleFromZ(FAR);

  const canvasRef = useRef();
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);

  const mouseStartRef = useRef({ x: 0, y: 0 });
  const cameraStartRef = useRef({ x: 0, y: 0 });
  const draggingRef = useRef(false);
  const defaultScaleRef = useRef(1.0);

  //////////////////////////
  //    Initialization    //
  //////////////////////////
  useEffect(() => {
    // Three.js uses standard Cartesian coordinates (up is +y, right is +x)
    const canvas = canvasRef.current;
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseup', onMouseUp);
    document.body.addEventListener('mouseup', onMouseUp);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true
    });
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      FOV, displayWidth / displayHeight, NEAR, FAR
    );
    scene.add(camera);

    // Fit content to display
    defaultScaleRef.current = Math.min(
      displayHeight / contentHeight,
      displayWidth / contentWidth
    );

    // Save references
    rendererRef.current = renderer;
    sceneRef.current = scene;
    cameraRef.current = camera;

    // Add objects to scene and initial render
    init(scene);
    centerCanvas();
    console.log('mounted');
  }, []);

  ////////////////////////////
  //    Helper Functions    //
  ////////////////////////////
  /** Re-renders the scene without updating */
  function render() {
    requestAnimationFrame(() => {
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    });
  }

  function getScaleFromZ(z) {
    const fov_height = 2 * Math.tan(HALF_FOV_RAD) * z;
    return displayHeight / fov_height;
  }

  function getZFromScale(scale) {
    const fov_height = displayHeight / scale;
    return Math.round(fov_height / (2 * Math.tan(HALF_FOV_RAD)));
  }

  function centerCanvas() {
    cameraRef.current.position.set(0, 0, getZFromScale(defaultScaleRef.current));
    render();
  }

  // Expose Canvas functions to parent component
  useImperativeHandle(ref, () => ({
    centerCanvas,
    render
  }));

  //////////////////////////
  //    Event Listeners   //
  //////////////////////////
  function onMouseDown(e) {     // useState does not work with event listeners
    const camera = cameraRef.current;
    mouseStartRef.current = {
      x: e.offsetX,
      y: e.offsetY
    };
    cameraStartRef.current = {
      x: camera.position.x,
      y: camera.position.y
    }
    draggingRef.current = true;
  }

  function onMouseMove(e) {
    if (draggingRef.current) {
      const camera = cameraRef.current;
      const mouseStart = mouseStartRef.current;
      const cameraStart = cameraStartRef.current;
      
      const scale = getScaleFromZ(camera.position.z);
      const deltaX = -(e.offsetX - mouseStart.x) / scale;
      const deltaY = (e.offsetY - mouseStart.y) / scale;
      camera.position.set(
        cameraStart.x + deltaX,
        cameraStart.y + deltaY
      );

      render();
    }
  }

  function onMouseUp(e) {
    draggingRef.current = false;
  }
  
  ////////////////////////////
  //    Render Component    //
  ////////////////////////////
  requestAnimationFrame(() => {
    update(sceneRef.current);
    render();
  });

  return (
    <div 
      className='interactive-canvas-rounded-corners' 
      style={{width: displayWidth, height: displayHeight}}
    >
      <canvas 
        ref={canvasRef} 
        width={displayWidth} 
        height={displayHeight}
        className='interactive-canvas'
      />
    </div>
  );
});

export default InteractiveCanvas;
