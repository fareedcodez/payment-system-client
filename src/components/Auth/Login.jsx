import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';

const loginSchema = Yup.object().shape({
  username: Yup.string().required('Username is required'),
  password: Yup.string().required('Password is required')
});

const Login = () => {
  const [error, setError] = useState('');
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    navigate('/dashboard');
    return null;
  }

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await login(values.username, values.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.detail || 'Login failed. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="shadow">
            <Card.Header className="bg-primary text-white text-center">
              <h4>Login to Payment System</h4>
            </Card.Header>
            <Card.Body className="p-4">
              {error && <Alert variant="danger">{error}</Alert>}
              
              <Formik
                initialValues={{ username: '', password: '' }}
                validationSchema={loginSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting }) => (
                  <Form>
                    <div className="mb-3">
                      <label htmlFor="username" className="form-label">Username</label>
                      <Field 
                        type="text" 
                        name="username" 
                        className="form-control" 
                        placeholder="Enter your username" 
                      />
                      <ErrorMessage name="username" component="div" className="text-danger" />
                    </div>

                    <div className="mb-3">
                      <label htmlFor="password" className="form-label">Password</label>
                      <Field 
                        type="password" 
                        name="password" 
                        className="form-control" 
                        placeholder="Enter your password" 
                      />
                      <ErrorMessage name="password" component="div" className="text-danger" />
                    </div>

                    <Button 
                      type="submit" 
                      variant="primary" 
                      className="w-100" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Logging in...' : 'Login'}
                    </Button>
                  </Form>
                )}
              </Formik>
              
              <div className="mt-3 text-center">
                <p>
                  Don't have an account? <Link to="/register">Register here</Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;