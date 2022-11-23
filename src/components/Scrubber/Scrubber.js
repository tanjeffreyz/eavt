import { useEffect, useState, useRef } from 'react';
import { Col, Container, Form, Row } from 'react-bootstrap';
import { ChevronLeft, ChevronRight, Pause, Play } from '../../components/Icons/Icons';

function Scrubber({
  index,
  setIndex: _setIndex,
  width,
  fps=60,
  max=0,
  ...props
}) {
  const FPS_INTERVAL = 1000.0 / fps;

  const [playing, setPlaying] = useState(false);
  const animationFrameRef = useRef('initialReference');
  const startTimeRef = useRef(0);

  function setIndex(callback) {
    _setIndex((prevIndex) => {
      return {
        prev: prevIndex.curr,
        curr: callback(prevIndex.curr)
      };
    });
  }

  // Play/pause video
  useEffect(() => {
    if (!animationFrameRef.current) {
      animationFrameRef.current = requestAnimationFrame(play);
    } else {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  }, [playing]);

  // Seek functions
  function togglePlaying() {
    if (max > 0) setPlaying((prev) => !prev);
  }

  function play() {
    animationFrameRef.current = requestAnimationFrame(play);
    const now = Date.now();
    const diff = now - startTimeRef.current;
    if (diff > FPS_INTERVAL) {
      startTimeRef.current = now - (diff % FPS_INTERVAL);
      setIndex((prev) => (prev + 1) % max);
    }
  }

  function seekLeft() {
    if (max > 0) setIndex((prev) => Math.max(prev - 1, 0));
  }

  function seekRight() {
    if (max > 0) setIndex((prev) => Math.min(prev + 1, max - 1));
  }

  return (
    <Container fluid {...props} style={{width}}>
      <Row className='align-items-center'>
        <Col md='auto'>
          <ChevronLeft 
            className='me-2' 
            onClick={seekLeft} 
          />
          <span>
            {playing ? 
            <Pause width={30} height={30} onClick={togglePlaying} /> :
            <Play width={30} height={30} onClick={togglePlaying} />}
          </span>
          
          <ChevronRight 
            className='ms-2' 
            onClick={seekRight} 
          />
        </Col>
        <Col>
          <Form.Range 
            min={0}
            max={max - 1}
            value={index.curr}
            onChange={(e) => setIndex(() => parseInt(e.target.value))}
          />
        </Col>
        <Col md='auto'>
          <span>{`${max ? index.curr + 1 : 0} / ${max}`}</span>
        </Col>
      </Row>
    </Container>
  );
}

function useScrubberState() {
  return useState({curr: 0, prev: 0});
}

export {
  Scrubber,
  useScrubberState
};
