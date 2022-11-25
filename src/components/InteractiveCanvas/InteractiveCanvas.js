import './InteractiveCanvas.css';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Crosshair } from '../Icons/Icons';

function InteractiveCanvas({
  displayWidth,
  displayHeight,
  contentWidth,
  contentHeight,
  scrollSensitivity=0.05,
  init=({scene, camera, renderer}) => {},
  update=({scene, camera, renderer}) => {},
  ...props
}) {
  const FOV = 45;     // Vertical FOV in degrees
  const HALF_FOV_RAD = Math.PI / 180 * (FOV / 2);
  const NEAR = 100;
  const FAR = 1000;

  const canvasRef = useRef();
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);

  const mouseStartRef = useRef({ x: 0, y: 0 });
  const cameraStartRef = useRef({ x: 0, y: 0 });
  const draggingRef = useRef(false);
  const initialScaleRef = useRef(1.0);

  //////////////////////////
  //    Initialization    //
  //////////////////////////
  useEffect(() => {
    // Three.js uses standard Cartesian coordinates (up is +y, right is +x)
    const canvas = canvasRef.current;
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('mousewheel', onMouseWheel);
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
    initialScaleRef.current = Math.min(
      displayHeight / contentHeight,
      displayWidth / contentWidth
    );

    // Save references
    rendererRef.current = renderer;
    sceneRef.current = scene;
    cameraRef.current = camera;

    // Add objects to scene and initial render
    init({scene, camera, renderer});
    centerCanvas();

    // Clean up event listeners
    return () => {
      canvas.removeEventListener('mousedown', onMouseDown);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('mousewheel', onMouseWheel);
      document.body.removeEventListener('mouseup', onMouseUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  ////////////////////////////
  //    Helper Functions    //
  ////////////////////////////
  function render() {
    requestAnimationFrame(() => {
      if (rendererRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
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
    cameraRef.current.position.set(0, 0, getZFromScale(initialScaleRef.current));
    render();
  }

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

  function onMouseWheel(e) {
    const camera = cameraRef.current;
    const frustrumDepth = FAR - NEAR;

    // Mouse position in camera's normalized device coordinates
    const mouseX = (e.offsetX / displayWidth) * 2 - 1;
    const mouseY = -(e.offsetY / displayHeight) * 2 + 1;
    const mouseZ = (camera.position.z - NEAR) / frustrumDepth * 2 - 1;
    const vector = new THREE.Vector3(mouseX, mouseY, mouseZ);
    vector.unproject(camera);
    vector.sub(camera.position);    // Vector from camera to mouse in world-space
    
    // Move camera along vector towards mouse
    const delta = frustrumDepth / Math.cos(HALF_FOV_RAD) * scrollSensitivity;
    vector.setLength(delta);
    const newCameraPos = new THREE.Vector3();
    if (e.deltaY < 0) {
      newCameraPos.addVectors(camera.position, vector);
    } else {
      newCameraPos.subVectors(camera.position, vector);
    }

    // Make sure the plane is still within the frustrum
    if (newCameraPos.z >= NEAR && newCameraPos.z <= FAR) {
      camera.position.copy(newCameraPos);
    }

    render();
    e.preventDefault();
  }
  
  ////////////////////////////
  //    Render Component    //
  ////////////////////////////
  update({    // This should never be skipped, can't use animation frame here!
    scene: sceneRef.current,
    camera: cameraRef.current,
    renderer: rendererRef.current
  });
  render();
  
  return (
    <div 
      className='interactive-canvas'
      style={{width: displayWidth, height: displayHeight}}
    >
      <canvas 
        ref={canvasRef} 
        width={displayWidth} 
        height={displayHeight}
      />
      <Crosshair 
        width={30} 
        height={30} 
        onClick={centerCanvas}
        fill='white'
        className='canvas-button'
        style={{top: '5px', right: '5px'}}
      />
      {props.children}
    </div>
  );
}

export default InteractiveCanvas;
