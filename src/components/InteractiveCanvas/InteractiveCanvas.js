import './InteractiveCanvas.css';
import { useEffect, useRef } from 'react';

function InteractiveCanvas({
  width,
  height,
  index,    // State that changes when a new frame should be drawn
  draw=(() => {})
}) {
  const canvasRef = useRef();

  useEffect(() => {
    console.log('drawn');
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);
    console.log(context);
  }, [index]);

  return (
    <div className='canvas-rounded-corners' style={{width, height}}>
      <canvas 
        ref={canvasRef} 
        width={width} 
        height={height}
      />
    </div>
  );
}

export default InteractiveCanvas;
