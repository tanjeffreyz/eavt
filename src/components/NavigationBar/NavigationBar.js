import './NavigationBar.css';
import { Outlet } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { Container, Nav, Navbar } from 'react-bootstrap';

function NavigationBar({
  title,
  links,
  back=null,
  context=[],
  ...props
}) {
  const linkElements = links.map((r, i) => {
    return (
      <LinkContainer key={i} to={r.to}>
        <Nav.Link className='px-3'>{r.name}</Nav.Link>
      </LinkContainer>
    );
  });

  const backLink = back && (
    <LinkContainer to={back.to} className='me-3'>
      <span className='icon'>{back.icon}</span>
    </LinkContainer>
  );

  return (
    <>
      <Navbar bg='light' expand='lg' fixed='top'>
        <Container fluid>
          <span>
            {backLink}
            <Navbar.Brand className='pe-3'>{title}</Navbar.Brand>
            {props.children}
          </span>
          <Navbar.Toggle aria-controls='index-navbar-nav' />
          <Navbar.Collapse id='index-navbar-nav'>
            <Nav className='ms-auto'>
              {linkElements}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Outlet context={context} />
    </>
  );
}

export default NavigationBar;
