import { Outlet } from 'react-router-dom';
import { LinkContainer } from 'react-router-bootstrap';
import { Container, Nav, Navbar } from 'react-bootstrap';
import Trials from './Trials'
import Sessions from './Sessions';

function IndexNav() {
  return (
    <>
      <Navbar bg='light' expand='md'>
        <Container fluid>
          <Navbar.Brand href='#'>Index</Navbar.Brand>
          <Navbar.Toggle aria-controls='index-navbar-nav' />
          <Navbar.Collapse id='index-navbar-nav'>
            <Nav className='ms-auto'>
              <LinkContainer to="/sessions">
                <Nav.Link className='px-3'>Sessions</Nav.Link>
              </LinkContainer>
              <LinkContainer to="/trials">
                <Nav.Link className='px-3'>Trials</Nav.Link>
              </LinkContainer>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Outlet />
    </>
  );
}

export {
  IndexNav,
  Sessions,
  Trials
};
