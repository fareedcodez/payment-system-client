import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar as BootstrapNavbar, Nav, Container, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const { currentUser, logout } = useAuth();

  return (
    <BootstrapNavbar bg="primary" variant="dark" expand="md" className="py-2 shadow-sm">
      <Container fluid>
        <BootstrapNavbar.Brand as={Link} to="/dashboard">
          <strong>Tanzania Payment System</strong>
        </BootstrapNavbar.Brand>
        <BootstrapNavbar.Toggle aria-controls="navbar-nav" />
        <BootstrapNavbar.Collapse id="navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link as={Link} to="/profile" className="d-flex align-items-center">
              <FontAwesomeIcon icon={faUser} className="me-2" />
              {currentUser?.business?.name || 'My Business'}
            </Nav.Link>
            <Button 
              variant="outline-light" 
              className="ms-3" 
              onClick={logout}
            >
              <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
              Logout
            </Button>
          </Nav>
        </BootstrapNavbar.Collapse>
      </Container>
    </BootstrapNavbar>
  );
};

export default Navbar;