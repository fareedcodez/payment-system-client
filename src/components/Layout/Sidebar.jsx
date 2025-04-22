import React from 'react';
import { NavLink } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTachometerAlt, 
  faCreditCard, 
  faPlus, 
  faUsers, 
  faUser 
} from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
  return (
    <div className="sidebar-sticky pt-3">
      <Nav className="flex-column">
        <Nav.Item>
          <NavLink to="/dashboard" className="nav-link">
            <FontAwesomeIcon icon={faTachometerAlt} className="me-2" />
            Dashboard
          </NavLink>
        </Nav.Item>
        <Nav.Item>
          <NavLink to="/payments" className="nav-link">
            <FontAwesomeIcon icon={faCreditCard} className="me-2" />
            Payments
          </NavLink>
        </Nav.Item>
        <Nav.Item>
          <NavLink to="/payments/new" className="nav-link">
            <FontAwesomeIcon icon={faPlus} className="me-2" />
            New Payment
          </NavLink>
        </Nav.Item>
        <Nav.Item>
          <NavLink to="/profile" className="nav-link">
            <FontAwesomeIcon icon={faUser} className="me-2" />
            Business Profile
          </NavLink>
        </Nav.Item>
      </Nav>
    </div>
  );
};

export default Sidebar;