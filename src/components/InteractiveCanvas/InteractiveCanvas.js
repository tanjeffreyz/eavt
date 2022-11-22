import './InteractiveCanvas.css';
import { useEffect, useRef } from 'react';

function InteractiveCanvas({
  width,
  height,
  drawFunction=defaultDraw
}) {
  const canvasRef = useRef();
  const contextRef = useRef(null);
  const mouseStartRef = useRef({ x: 0, y: 0 });
  const draggingRef = useRef(false);
  const imageSizeRef = useRef({width: 1, height: 1});

  // Prepare draw function
  function draw() {   // TODO: Use callback!!!!
    const context = contextRef.current;
    const tl = context.transformPoint({
      x: 0,
      y: 0
    });
    const br = context.transformPoint({
      x: canvasRef.current.width,
      y: canvasRef.current.height
    });
    context.clearRect(tl.x, tl.y, br.x - tl.x, br.y - tl.y);
    return drawFunction(context);
  }

  // Event listeners
  // Listeners can only access initial state, so use refs instead
  function onMouseDown(e) {
    mouseStartRef.current = contextRef.current.transformPoint({
      x: e.offsetX,
      y: e.offsetY
    });
    draggingRef.current = true;
  }

  function onMouseMove(e) {
    if (draggingRef.current) {
      const context = contextRef.current;
      const curr = context.transformPoint({
        x: e.offsetX,
        y: e.offsetY
      });
      const start = mouseStartRef.current;
      // console.log(curr.x, curr.y, x, y);
      // console.log(currX - x, currY - y);
      // console.log(contextRef.current.translate);
      context.translate(curr.x - start.x, curr.y - start.y);
      
      draw();
      // render({});
    }
  }

  function onMouseUp(e) {
    draggingRef.current = false;
  }

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.addEventListener('mousedown', onMouseDown);
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseup', onMouseUp);
    contextRef.current = canvas.getContext('2d');
    bindCanvasContext(contextRef.current);
    draw(contextRef.current);
    console.log('mounted');
  }, []);
  
  // Draw frame on render
  requestAnimationFrame((time) => {
    imageSizeRef.current = draw(contextRef.current);
    // console.log(imageSizeRef.current);
  });
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

function bindCanvasContext(context) {
  // Transform point from document space to canvas space
  context.transformPoint = function({x, y}) {
      return this.getTransform().inverse().transformPoint({x, y});
  }

  // Track canvas scaling using the determinant
  const t = context.getTransform();
  const initialScale = Math.sqrt(t.a * t.d - t.b * t.c);
  context.getScaleFactor = function() {
      const m = this.getTransform();
      return Math.sqrt(m.a * m.d - m.b * m.c) / initialScale;
  }
}

function defaultDraw(context) {
  context.fillStyle = 'red';
  context.fillRect(0, 0, 400, 400);

  // Draw functions should return the size of largest image it drew
  return {
    width: 1, 
    height: 1
  };
}

export default InteractiveCanvas;
