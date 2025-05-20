import React from 'react'
import { Navbar, Nav, Container} from 'react-bootstrap'
import { Link } from 'react-router-dom'

const NavBar = () => {
    return (
        <Navbar bg="dark" variant="dark" expand="lg">
            <Container>
                <Navbar.Brand as={Link} to="/">Movie Database</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/">All Movies</Nav.Link>
                        <Nav.Link as={Link} to="/add-movie">Add New Movie</Nav.Link>
                        <Nav.Link as={Link} to="/top-movies">Top Movies</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};


export default NavBar