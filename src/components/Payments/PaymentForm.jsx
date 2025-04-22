import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Alert, Form, Row, Col } from 'react-bootstrap';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import paymentService from '../../services/paymentService';

const paymentSchema = Yup.object().shape({
  amount: Yup.number()
    .required('Amount is required')
    .positive('Amount must be positive')
    .typeError('Amount must be a number'),
  customer_name: Yup.string().required('Customer name is required'),
  customer_email: Yup.string()
    .email('Invalid email address')
    .required('Customer email is required'),
  customer_phone: Yup.string().required('Customer phone is required'),
  currency: Yup.string().required('Currency is required'),
  description: Yup.string(),
  payment_method: Yup.string().required('Payment method is required'),
});

const PaymentForm = () => {
  const [paymentLink, setPaymentLink] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const initialValues = {
    amount: '',
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    currency: 'TZS',
    description: '',
    payment_method: 'mobile_money',
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      setLoading(true);
      setError('');
      setPaymentLink(null);
      
      const response = await paymentService.initializePayment(values);
      
      if (response.status === 'success') {
        setPaymentLink(response.data.payment_link);
        resetForm();
      } else {
        setError('Failed to initialize payment. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while initializing payment.');
      console.error('Payment initialization error:', err);
    } finally {
      setLoading(false);
      setSubmitting(false);
    }
  };

  return (
    <div className="payment-form">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Create New Payment</h2>
        <Button 
          variant="outline-secondary" 
          onClick={() => navigate('/payments')}
        >
          <FontAwesomeIcon icon={faArrowLeft} className="me-2" />
          Back to Payments
        </Button>
      </div>

      <Card className="shadow-sm">
        <Card.Body>
          {error && (
            <Alert variant="danger" dismissible onClose={() => setError('')}>
              {error}
            </Alert>
          )}
          
          {paymentLink && (
            <Alert variant="success" dismissible onClose={() => setPaymentLink(null)}>
              <div className="mb-3">
                Payment link generated successfully! Share this link with your customer:
              </div>
              <div className="input-group mb-3">
                <input
                  type="text"
                  className="form-control"
                  value={paymentLink}
                  readOnly
                />
                <Button
                  variant="outline-primary"
                  onClick={() => {
                    navigator.clipboard.writeText(paymentLink);
                    alert('Payment link copied to clipboard!');
                  }}
                >
                  Copy
                </Button>
                <Button
                  variant="primary"
                  onClick={() => window.open(paymentLink, '_blank')}
                >
                  Open
                </Button>
              </div>
            </Alert>
          )}
          
          <Formik
            initialValues={initialValues}
            validationSchema={paymentSchema}
            onSubmit={handleSubmit}
          >
            {({ handleSubmit, isSubmitting, values }) => (
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Amount</Form.Label>
                      <Field name="amount">
                        {({ field }) => (
                          <Form.Control
                            {...field}
                            type="number"
                            placeholder="Enter amount"
                            min="0"
                          />
                        )}
                      </Field>
                      <ErrorMessage name="amount" component="div" className="text-danger" />
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Currency</Form.Label>
                      <Field name="currency" as="select" className="form-select">
                        <option value="TZS">Tanzanian Shilling (TZS)</option>
                        <option value="USD">US Dollar (USD)</option>
                      </Field>
                      <ErrorMessage name="currency" component="div" className="text-danger" />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Form.Group className="mb-3">
                  <Form.Label>Payment Method</Form.Label>
                  <Field name="payment_method" as="select" className="form-select">
                    <option value="mobile_money">Mobile Money</option>
                    <option value="card">Card</option>
                    <option value="bank_transfer">Bank Transfer</option>
                  </Field>
                  <ErrorMessage name="payment_method" component="div" className="text-danger" />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Field 
                    name="description" 
                    as="textarea" 
                    className="form-control" 
                    placeholder="Payment description (optional)" 
                    rows={2}
                  />
                  <ErrorMessage name="description" component="div" className="text-danger" />
                </Form.Group>
                
                <hr className="my-4" />
                <h5 className="mb-3">Customer Information</h5>
                
                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>Customer Name</Form.Label>
                      <Field 
                        name="customer_name" 
                        type="text" 
                        className="form-control" 
                        placeholder="Enter customer name" 
                      />
                      <ErrorMessage name="customer_name" component="div" className="text-danger" />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Customer Email</Form.Label>
                      <Field 
                        name="customer_email" 
                        type="email" 
                        className="form-control" 
                        placeholder="Enter customer email" 
                      />
                      <ErrorMessage name="customer_email" component="div" className="text-danger" />
                    </Form.Group>
                  </Col>
                  
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Customer Phone</Form.Label>
                      <Field 
                        name="customer_phone" 
                        type="text" 
                        className="form-control" 
                        placeholder="Enter customer phone" 
                      />
                      <ErrorMessage name="customer_phone" component="div" className="text-danger" />
                    </Form.Group>
                  </Col>
                </Row>
                
                <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                  <Button
                    variant="secondary"
                    type="reset"
                    className="me-md-2"
                    disabled={isSubmitting}
                  >
                    Clear
                  </Button>
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={isSubmitting || loading}
                  >
                    {isSubmitting || loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Processing...
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faPaperPlane} className="me-2" />
                        Generate Payment Link
                      </>
                    )}
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

export default PaymentForm;