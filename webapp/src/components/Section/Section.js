import './Section.css';
import { Container } from "react-bootstrap";

function Section(props) {
  return <Container {...props} className={`${props.className} section`} />
}

export default Section;
