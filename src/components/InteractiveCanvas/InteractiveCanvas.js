import './InteractiveCanvas.css';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

function InteractiveCanvas({
  width,
  height,
  init=((scene) => {}),
  update=((scene) => {})
}) {
  const FOV = 45;   // Vertical FOV in degrees
  const NEAR = 1;
  const FAR = 100;

  const canvasRef = useRef();
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);

  const mouseStartRef = useRef({ x: 0, y: 0 });
  const cameraStartRef = useRef({ x: 0, y: 0 });
  const draggingRef = useRef(false);
  const imageSizeRef = useRef({ width: 1, height: 1 });

  //////////////////////////
  //    Initialization    //
  //////////////////////////
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseup', onMouseUp);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true
    });
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      FOV, width / height, NEAR, FAR
    );
    camera.position.set(0, 0, FAR);
    scene.add(camera);

    init(scene);
    draw();

    rendererRef.current = renderer;
    sceneRef.current = scene;
    cameraRef.current = camera;
  }, []);

  //////////////////////////
  //    Draw Function     //
  //////////////////////////
  function draw() {
    requestAnimationFrame((time) => {
      // drawFunction(sceneRef.current);
      update(sceneRef.current);
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    });
  }

  ////////////////////////////
  //    Helper Functions    //
  ////////////////////////////
  const HALF_FOV_RAD = Math.PI / 180 * (FOV / 2);

  function getScaleFromZ(z) {
    const fov_height = 2 * Math.tan(HALF_FOV_RAD) * z;
    return height / fov_height;
  }

  function getZFromScale(scale) {
    const fov_height = height / scale;
    return fov_height / (2 * Math.tan(HALF_FOV_RAD));
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
    console.log(mouseStartRef.current);
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

      draw();
    }
  }

  function onMouseUp(e) {
    draggingRef.current = false;
  }

  console.log('rendered');
  
  // Render component
  return (
    <div 
      className='interactive-canvas-rounded-corners' 
      style={{width, height}}
    >
      <canvas 
        ref={canvasRef} 
        width={width} 
        height={height}
        className='interactive-canvas'
      />
    </div>
  );
}

export default InteractiveCanvas;
