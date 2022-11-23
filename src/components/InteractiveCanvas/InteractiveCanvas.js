import './InteractiveCanvas.css';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const FOV = 45;
const NEAR = 1;
const FAR = 100;

function InteractiveCanvas({
  width,
  height,
  drawFunction=defaultDraw
}) {
  const canvasRef = useRef();
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);

  const mouseStartRef = useRef({ x: 0, y: 0 });
  const cameraStartRef = useRef({ x: 0, y: 0 });
  const draggingRef = useRef(false);
  const imageSizeRef = useRef({ width: 1, height: 1 });

  // Setup Three.js renderer
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

    rendererRef.current = renderer;
    sceneRef.current = scene;
    cameraRef.current = camera;

    const material = new THREE.LineBasicMaterial( { color: 0x0000ff } );
    const points = [];
    points.push( new THREE.Vector3( - 10, 0, 0 ) );
    points.push( new THREE.Vector3( 0, 10, 0 ) );
    points.push( new THREE.Vector3( 10, 0, 0 ) );

    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, material);
    scene.add(line);

    // draw();
    console.log('mounted');
  }, []);

  // Prepare draw function
  function draw() {
    requestAnimationFrame((time) => {
      // drawFunction(sceneRef.current);
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    });
  }
  // function draw() {   // TODO: Use callback!!!!
  //   const context = contextRef.current;
  //   const tl = context.transformPoint({
  //     x: 0,
  //     y: 0
  //   });
  //   const br = context.transformPoint({
  //     x: canvasRef.current.width,
  //     y: canvasRef.current.height
  //   });
  //   context.clearRect(tl.x, tl.y, br.x - tl.x, br.y - tl.y);
  //   return drawFunction(context);
  // }

  // // Event listeners
  // // Listeners can only access initial state, so use refs instead
  function onMouseDown(e) {
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
      // const context = contextRef.current;
      const mouseCurr = {
        x: e.offsetX,
        y: e.offsetY
      };
      
      const deltaX = mouseStart.x - e.offsetX;
      const deltaY = e.offsetY - mouseStart.y;
      camera.position.set(
        cameraStart.x + deltaX,
        cameraStart.y + deltaY
      );

      console.log(mouseCurr.x - mouseStart.x, mouseCurr.y - mouseStart.y);
      // console.log(curr.x, curr.y, x, y);
      // console.log(currX - x, currY - y);
      // console.log(contextRef.current.translate);
      // context.translate(curr.x - start.x, curr.y - start.y);
      
      draw();
      // render({});
    }
  }

  function onMouseUp(e) {
    draggingRef.current = false;
  }
  
  // // Draw frame on render
  // requestAnimationFrame((time) => {
  //   imageSizeRef.current = draw(contextRef.current);
  //   // console.log(imageSizeRef.current);
  // });
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

// function bindCanvasContext(context) {
//   // Transform point from document space to canvas space
//   context.transformPoint = function({x, y}) {
//       return this.getTransform().inverse().transformPoint({x, y});
//   }

//   // Track canvas scaling using the determinant
//   const t = context.getTransform();
//   const initialScale = Math.sqrt(t.a * t.d - t.b * t.c);
//   context.getScaleFactor = function() {
//       const m = this.getTransform();
//       return Math.sqrt(m.a * m.d - m.b * m.c) / initialScale;
//   }
// }

function defaultDraw(scene) {
  const material = new THREE.LineBasicMaterial( { color: 0x0000ff } );
  const points = [];
  points.push( new THREE.Vector3( - 10, 0, 0 ) );
  points.push( new THREE.Vector3( 0, 10, 0 ) );
  points.push( new THREE.Vector3( 10, 0, 0 ) );

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const line = new THREE.Line(geometry, material);
  scene.add(line);
}

// function defaultDraw(context) {
//   context.fillStyle = 'red';
//   context.fillRect(0, 0, 400, 400);

//   // Draw functions should return the size of largest image it drew
//   return {
//     width: 1, 
//     height: 1
//   };
// }

export default InteractiveCanvas;
