import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { NavLink } from "react-router-dom";
import { paths } from "../../constants";

function Navigation() {
  return (
    <Navbar bg='light' expand='lg'>
      <Container fluid>
        <Navbar.Brand as={NavLink} to={paths.home}>
          Home
        </Navbar.Brand>
        <Navbar.Toggle aria-controls='navbarScroll' />
        <Navbar.Collapse id='navbarScroll'>
          <Nav
            className='me-auto my-2 my-lg-0'
            style={{ maxHeight: "100px" }}
            navbarScroll
          >
            <NavDropdown title='Hooks' id='navbarScrollingDropdown'>
              <NavDropdown.Item as={NavLink} to={paths.useContext}>
                useContext
              </NavDropdown.Item>
              <NavDropdown.Item as={NavLink} to={paths.useRef}>
                useRef
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;
