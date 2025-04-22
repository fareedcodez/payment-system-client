import React, { useState, useEffect } from 'react';
import { Card, Button, Alert, Form, Row, Col } from 'react-bootstrap';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import authService from '../../services/authService';
import { useAuth } from '../../contexts/AuthContext';

const profileSchema = Yup.object().shape({
  name: Yup.string().required('Business name is required'),
  email: Yup.string()
    .email('Invalid email address')
    .required('Email is required'),
  phone: Yup.string().required('Phone is required'),
  address: Yup.string().required('Address is required'),
  business_reg_number: Yup.string().required('Registration number is required')
});

const BusinessProfile = () => {
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState('');
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchBusinessProfile = async () => {
      try {
        const businessData = await authService.getProfile();
        setBusiness(businessData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching business profile:", error);
        setUpdateError('Failed to load business profile');
        setLoading(false);
      }
    };

    fetchBusinessProfile();
  }, []);

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      setUpdateSuccess(false);
      setUpdateError('');
      await authService.updateProfile(values);
      setBusiness(values);
      setUpdateSuccess(true);
    } catch (error) {
      console.error("Error updating profile:", error);
      setUpdateError('Failed to update business profile');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="business-profile">
      <h2 className="mb-4">Business Profile</h2>
      
      <Card className="shadow-sm">
        <Card.Body>
          {updateSuccess && (
            <Alert variant="success" onClose={() => setUpdateSuccess(false)} dismissible>
              Business profile updated successfully!
            </Alert>
          )}
          
          {updateError && (
            <Alert variant="danger" onClose={() => setUpdateError('')} dismissible>
              {updateError}
            </Alert>
          )}
          
          <Formik
            initialValues={business}
            validationSchema={profileSchema}
            onSubmit={handleSubmit}
            enableReinitialize
          >
            {({ handleSubmit, isSubmitting, dirty }) => (
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Business Name</Form.Label>
                      <Field 
                        name="name" 
                        as={Form.Control} 
                        placeholder="Enter business name" 
                      />
                      <ErrorMessage name="name" component="div" className="text-danger" />
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Email Address</Form.Label>
                      <Field 
                        name="email" 
                        type="email" 
                        as={Form.Control} 
                        placeholder="Enter email address" 
                      />
                      <ErrorMessage name="email" component="div" className="text-danger" />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Phone Number</Form.Label>
                      <Field 
                        name="phone" 
                        as={Form.Control} 
                        placeholder="Enter phone number" 
                      />
                      <ErrorMessage name="phone" component="div" className="text-danger" />
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Business Registration Number</Form.Label>
                      <Field 
                        name="business_reg_number" 
                        as={Form.Control} 
                        placeholder="Enter registration number" 
                      />
                      <ErrorMessage name="business_reg_number" component="div" className="text-danger" />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Form.Group className="mb-3">
                  <Form.Label>Business Address</Form.Label>
                  <Field 
                    name="address" 
                    as="textarea" 
                    className="form-control" 
                    placeholder="Enter business address" 
                    rows={3}
                  />
                  <ErrorMessage name="address" component="div" className="text-danger" />
                </Form.Group>
                
                <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                  <Button 
                    variant="primary" 
                    type="submit" 
                    disabled={isSubmitting || !dirty}
                  >
                    {isSubmitting ? 'Updating...' : 'Update Profile'}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </Card.Body>
      </Card>
    </div>
  );
};

export default BusinessProfile;