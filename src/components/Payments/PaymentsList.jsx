import React, { useState, useEffect, useMemo } from 'react';
import { Card, Form, Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSearch, faFilter, faRefresh } from '@fortawesome/free-solid-svg-icons';
import paymentService from '../../services/paymentService';

const PaymentsList = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    payment_method: '',
    date_from: '',
    date_to: '',
    search: ''
  });

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const data = await paymentService.getPayments(filters);
      setPayments(data);
      setError('');
    } catch (err) {
      setError('Failed to fetch payments. Please try again.');
      console.error('Error fetching payments:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPayments();
  };

  const handleReset = () => {
    setFilters({
      status: '',
      payment_method: '',
      date_from: '',
      date_to: '',
      search: ''
    });
    // Fetch all payments without filters
    paymentService.getPayments()
      .then(data => {
        setPayments(data);
        setError('');
      })
      .catch(err => {
        setError('Failed to fetch payments. Please try again.');
        console.error('Error fetching payments:', err);
      });
  };

  const filteredPayments = useMemo(() => {
    return payments.filter(payment => {
      // Filter by search term if provided
      if (filters.search && !payment.reference.toLowerCase().includes(filters.search.toLowerCase()) &&
          !payment.customer.name.toLowerCase().includes(filters.search.toLowerCase()) &&
          !payment.customer.email.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      return true;
    });
  }, [payments, filters.search]);

  return (
    <div className="payments-list">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Payments</h2>
        <Button 
          as={Link} 
          to="/payments/new" 
          variant="primary"
        >
          <FontAwesomeIcon icon={faPlus} className="me-2" />
          New Payment
        </Button>
      </div>

      <Card className="mb-4">
        <Card.Body>
          <Form onSubmit={handleSearch}>
            <Row className="align-items-end">
              <Col md={3}>
                <Form.Group className="mb-md-0 mb-3">
                  <Form.Label>Search</Form.Label>
                  <div className="input-group">
                    <Form.Control
                      type="text"
                      placeholder="Reference, customer name, email..."
                      name="search"
                      value={filters.search}
                      onChange={handleFilterChange}
                    />
                    <Button variant="outline-secondary" type="submit">
                      <FontAwesomeIcon icon={faSearch} />
                    </Button>
                  </div>
                </Form.Group>
              </Col>
              
              <Col md={2}>
                <Form.Group className="mb-md-0 mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select 
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Statuses</option>
                    <option value="successful">Successful</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                    <option value="cancelled">Cancelled</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              
              <Col md={2}>
                <Form.Group className="mb-md-0 mb-3">
                  <Form.Label>Payment Method</Form.Label>
                  <Form.Select 
                    name="payment_method"
                    value={filters.payment_method}
                    onChange={handleFilterChange}
                  >
                    <option value="">All Methods</option>
                    <option value="mobile_money">Mobile Money</option>
                    <option value="card">Card</option>
                    <option value="bank_transfer">Bank Transfer</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              
              <Col md={2}>
                <Form.Group className="mb-md-0 mb-3">
                  <Form.Label>From Date</Form.Label>
                  <Form.Control 
                    type="date" 
                    name="date_from"
                    value={filters.date_from}
                    onChange={handleFilterChange}
                  />
                </Form.Group>
              </Col>
              
              <Col md={2}>
                <Form.Group className="mb-md-0 mb-3">
                  <Form.Label>To Date</Form.Label>
                  <Form.Control 
                    type="date" 
                    name="date_to"
                    value={filters.date_to}
                    onChange={handleFilterChange}
                  />
                </Form.Group>
              </Col>
              
              <Col md={1} className="d-flex justify-content-end">
                <Button variant="outline-secondary" onClick={handleReset} className="mb-md-0 mb-3">
                  <FontAwesomeIcon icon={faRefresh} />
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <Card>
        <Card.Body>
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Reference</th>
                    <th>Customer</th>
                    <th>Amount</th>
                    <th>Method</th>
                    <th>Date</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.map(payment => (
                    <tr key={payment.id}>
                      <td>{payment.reference}</td>
                      <td>
                        <div>{payment.customer.name}</div>
                        <small className="text-muted">{payment.customer.email}</small>
                      </td>
                      <td>{payment.amount} {payment.currency}</td>
                      <td>
                        {payment.payment_method === 'mobile_money' && 'Mobile Money'}
                        {payment.payment_method === 'card' && 'Card'}
                        {payment.payment_method === 'bank_transfer' && 'Bank Transfer'}
                      </td>
                      <td>{new Date(payment.created_at).toLocaleDateString()}</td>
                      <td>
                        <span className={`badge ${
                          payment.status === 'successful' ? 'bg-success' :
                          payment.status === 'failed' ? 'bg-danger' :
                          payment.status === 'cancelled' ? 'bg-secondary' :
                          'bg-warning'
                        }`}>
                          {payment.status}
                        </span>
                      </td>
                      <td>
                        <Link 
                          to={`/payments/${payment.id}`} 
                          className="btn btn-sm btn-outline-primary"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {filteredPayments.length === 0 && (
                    <tr>
                      <td colSpan="7" className="text-center py-5">
                        No payments found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default PaymentsList;