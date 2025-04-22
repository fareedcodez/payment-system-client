import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { useAuth } from '../../contexts/AuthContext';

const registerSchema = Yup.object().shape({
  username: Yup.string()
    .min(4, 'Username must be at least 4 characters')
    .required('Username is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
  businessName: Yup.string().required('Business name is required'),
  businessEmail: Yup.string()
    .email('Invalid email address')
    .required('Business email is required'),
  businessPhone: Yup.string().required('Business phone is required'),
  businessAddress: Yup.string().required('Business address is required'),
  businessRegNumber: Yup.string().required('Registration number is required')
});

const Register = () => {
  const [error, setError] = useState('');
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    navigate('/dashboard');
    return null;
  }

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const userData = {
        username: values.username,
        email: values.email,
        password: values.password,
        business: {
          name: values.businessName,
          email: values.businessEmail,
          phone: values.businessPhone,
          address: values.businessAddress,
          business_reg_number: values.businessRegNumber
        }
      };
      
      await register(userData);
      navigate('/dashboard');
    } catch (err) {
      setError(err.detail || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow">
            <Card.Header className="bg-primary text-white text-center">
              <h4>Register for Payment System</h4>
            </Card.Header>
            <Card.Body className="p-4">
              {error && <Alert variant="danger">{error}</Alert>}
              
              <Formik
                initialValues={{
                  username: '',
                  email: '',
                  password: '',
                  confirmPassword: '',
                  businessName: '',
                  businessEmail: '',
                  businessPhone: '',
                  businessAddress: '',
                  businessRegNumber: ''
                }}
                validationSchema={registerSchema}
                onSubmit={handleSubmit}
              >
                {({ isSubmitting }) => (
                  <Form>
                    <h5 className="mb-3">Account Information</h5>
                    <Row>
                      <Col md={6}>
                        <div className="mb-3">
                          <label htmlFor="username" className="form-label">Username</label>
                          <Field 
                            type="text" 
                            name="username" 
                            className="form-control" 
                          />
                          <ErrorMessage name="username" component="div" className="text-danger" />
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="mb-3">
                          <label htmlFor="email" className="form-label">Email</label>
                          <Field 
                            type="email" 
                            name="email" 
                            className="form-control" 
                          />
                          <ErrorMessage name="email" component="div" className="text-danger" />
                        </div>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <div className="mb-3">
                          <label htmlFor="password" className="form-label">Password</label>
                          <Field 
                            type="password" 
                            name="password" 
                            className="form-control" 
                          />
                          <ErrorMessage name="password" component="div" className="text-danger" />
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="mb-3">
                          <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                          <Field 
                            type="password" 
                            name="confirmPassword" 
                            className="form-control" 
                          />
                          <ErrorMessage name="confirmPassword" component="div" className="text-danger" />
                        </div>
                      </Col>
                    </Row>

                    <hr className="my-4" />
                    <h5 className="mb-3">Business Information</h5>
                    
                    <Row>
                      <Col md={6}>
                        <div className="mb-3">
                          <label htmlFor="businessName" className="form-label">Business Name</label>
                          <Field 
                            type="text" 
                            name="businessName" 
                            className="form-control" 
                          />
                          <ErrorMessage name="businessName" component="div" className="text-danger" />
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="mb-3">
                          <label htmlFor="businessEmail" className="form-label">Business Email</label>
                          <Field 
                            type="email" 
                            name="businessEmail" 
                            className="form-control" 
                          />
                          <ErrorMessage name="businessEmail" component="div" className="text-danger" />
                        </div>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <div className="mb-3">
                          <label htmlFor="businessPhone" className="form-label">Business Phone</label>
                          <Field 
                            type="text" 
                            name="businessPhone" 
                            className="form-control" 
                          />
                          <ErrorMessage name="businessPhone" component="div" className="text-danger" />
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="mb-3">
                          <label htmlFor="businessRegNumber" className="form-label">Business Registration Number</label>
                          <Field 
                            type="text" 
                            name="businessRegNumber" 
                            className="form-control" 
                          />
                          <ErrorMessage name="businessRegNumber" component="div" className="text-danger" />
                        </div>
                      </Col>
                    </Row>

                    <div className="mb-3">
                      <label htmlFor="businessAddress" className="form-label">Business Address</label>
                      <Field 
                        as="textarea" 
                        name="businessAddress" 
                        className="form-control" 
                        rows={3}
                      />
                      <ErrorMessage name="businessAddress" component="div" className="text-danger" />
                    </div>

                    <Button 
                      type="submit" 
                      variant="primary" 
                      className="w-100 mt-3" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Registering...' : 'Register'}
                    </Button>
                  </Form>
                )}
              </Formik>
              
              <div className="mt-3 text-center">
                <p>
                  Already have an account? <Link to="/login">Login here</Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;