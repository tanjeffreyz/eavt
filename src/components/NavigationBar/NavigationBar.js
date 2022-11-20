import { Outlet } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { Container, Nav, Navbar } from 'react-bootstrap';

function NavigationBar({
  title,
  subtitle,
  links
}) {
  const linkElements = links.map((r, i) => {
    return (
      <LinkContainer key={i} to={r.to}>
        <Nav.Link className='px-3'>{r.name}</Nav.Link>
      </LinkContainer>
    );
  });
  return (
    <>
      <Navbar bg='light' expand='md'>
        <Container fluid>
          <span>
            <Navbar.Brand className='pe-3'>{title}</Navbar.Brand>
            {subtitle}
          </span>
          <Navbar.Toggle aria-controls='index-navbar-nav' />
          <Navbar.Collapse id='index-navbar-nav'>
            <Nav className='ms-auto'>
              {linkElements}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Outlet />
    </>
  );
}

export default NavigationBar;
