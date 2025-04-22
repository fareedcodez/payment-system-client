import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { Container, Row, Col } from 'react-bootstrap';

const MainLayout = () => {
  return (
    <div className="main-layout">
      <Navbar />
      <Container fluid>
        <Row>
          <Col md={3} lg={2} className="sidebar d-none d-md-block">
            <Sidebar />
          </Col>
          <Col md={9} lg={10} className="ms-sm-auto px-md-4 py-4 main-content">
            <Outlet />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default MainLayout;