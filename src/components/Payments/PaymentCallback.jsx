import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Alert, Spinner } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle, faHome, faListAlt } from '@fortawesome/free-solid-svg-icons';
import paymentService from '../../services/paymentService';
import { useAuth } from '../../contexts/AuthContext';

const PaymentCallback = () => {
  const [status, setStatus] = useState('processing');
  const [message, setMessage] = useState('');
  const [paymentDetails, setPaymentDetails] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Get query parameters
        const params = new URLSearchParams(location.search);
        const status = params.get('status');
        const tx_ref = params.get('tx_ref');
        const transaction_id = params.get('transaction_id');
        
        if (!tx_ref) {
          setStatus('failed');
          setMessage('Invalid payment reference. Please try again.');
          return;
        }
        
        // Verify the payment
        const verificationData = {
          tx_ref,
          status,
          transaction_id
        };
        
        const response = await paymentService.verifyPayment(verificationData);
        
        if (response.status === 'success') {
          setStatus('success');
          setMessage('Payment completed successfully!');
          setPaymentDetails(response.data);
        } else {
          setStatus('failed');
          setMessage(response.message || 'Payment verification failed. Please try again.');
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        setStatus('failed');
        setMessage('An error occurred while verifying the payment. Please try again.');
      }
    };
    
    verifyPayment();
  }, [location]);

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col lg={6}>
          <Card className="shadow-sm">
            <Card.Body className="p-5 text-center">
              {status === 'processing' && (
                <>
                  <Spinner animation="border" variant="primary" className="mb-4" />
                  <h3>Processing Your Payment</h3>
                  <p className="text-muted">Please wait while we verify your payment...</p>
                </>
              )}
              
              {status === 'success' && (
                <>
                  <div className="mb-4">
                    <FontAwesomeIcon 
                      icon={faCheckCircle} 
                      className="text-success"
                      style={{ fontSize: '5rem' }}
                    />
                  </div>
                  <h3 className="text-success">Payment Successful!</h3>
                  <p className="text-muted">Thank you! Your payment has been processed successfully.</p>
                  
                  {paymentDetails && (
                    <div className="mt-4 text-start">
                      <Alert variant="light">
                        <p className="mb-1"><strong>Reference:</strong> {paymentDetails.reference}</p>
                        <p className="mb-1"><strong>Amount:</strong> {paymentDetails.amount} {paymentDetails.currency}</p>
                        <p className="mb-0"><strong>Date:</strong> {new Date().toLocaleString()}</p>
                      </Alert>
                    </div>
                  )}
                </>
              )}
              
              {status === 'failed' && (
                <>
                  <div className="mb-4">
                    <FontAwesomeIcon 
                      icon={faTimesCircle} 
                      className="text-danger"
                      style={{ fontSize: '5rem' }}
                    />
                  </div>
                  <h3 className="text-danger">Payment Failed</h3>
                  <p className="text-muted">{message || 'Your payment could not be processed. Please try again.'}</p>
                </>
              )}
              
              <div className="mt-4 d-flex justify-content-center gap-3">
                {isAuthenticated ? (
                  <>
                    <Button
                      variant="outline-primary"
                      onClick={() => navigate('/dashboard')}
                    >
                      <FontAwesomeIcon icon={faHome} className="me-2" />
                      Dashboard
                    </Button>
                    <Button
                      variant="primary"
                      onClick={() => navigate('/payments')}
                    >
                      <FontAwesomeIcon icon={faListAlt} className="me-2" />
                      View Payments
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="primary"
                    href="/"
                  >
                    <FontAwesomeIcon icon={faHome} className="me-2" />
                    Return to Home
                  </Button>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PaymentCallback;