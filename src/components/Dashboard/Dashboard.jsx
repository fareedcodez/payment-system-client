import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faMoneyBillWave, 
  faCheckCircle,
  faTimesCircle,
  faChartLine,
  faPlus
} from '@fortawesome/free-solid-svg-icons';
import { Line, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title } from 'chart.js';
import paymentService from '../../services/paymentService';
import { useAuth } from '../../contexts/AuthContext';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement, Title);

const Dashboard = () => {
  const [paymentStats, setPaymentStats] = useState({
    total: 0,
    successful: 0,
    failed: 0,
    pending: 0,
    recentPayments: []
  });
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch payments
        const payments = await paymentService.getPayments();
        
        // Calculate statistics
        const successful = payments.filter(p => p.status === 'successful').length;
        const failed = payments.filter(p => p.status === 'failed').length;
        const pending = payments.filter(p => p.status === 'pending').length;
        const total = payments.length;
        
        // Get recent payments (last 5)
        const recentPayments = payments.slice(0, 5);
        
        setPaymentStats({
          total,
          successful,
          failed,
          pending,
          recentPayments
        });
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Data for status distribution chart
  const statusData = {
    labels: ['Successful', 'Failed', 'Pending'],
    datasets: [
      {
        data: [paymentStats.successful, paymentStats.failed, paymentStats.pending],
        backgroundColor: ['#28a745', '#dc3545', '#ffc107'],
        borderColor: ['#28a745', '#dc3545', '#ffc107'],
        borderWidth: 1,
      },
    ],
  };

  // Mock data for recent transactions chart (last 7 days)
  const getLastSevenDays = () => {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
    }
    return dates;
  };

  const transactionData = {
    labels: getLastSevenDays(),
    datasets: [
      {
        label: 'Transactions',
        data: [5, 8, 12, 7, 10, 15, 9],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="dashboard">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Dashboard</h2>
        <Button 
          as={Link} 
          to="/payments/new" 
          variant="primary"
        >
          <FontAwesomeIcon icon={faPlus} className="me-2" />
          New Payment
        </Button>
      </div>

      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center h-100 dashboard-card">
            <Card.Body>
              <div className="icon-circle bg-primary">
                <FontAwesomeIcon icon={faMoneyBillWave} className="text-white fa-2x" />
              </div>
              <h5 className="mt-3">Total Payments</h5>
              <h2>{paymentStats.total}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100 dashboard-card">
            <Card.Body>
              <div className="icon-circle bg-success">
                <FontAwesomeIcon icon={faCheckCircle} className="text-white fa-2x" />
              </div>
              <h5 className="mt-3">Successful</h5>
              <h2>{paymentStats.successful}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100 dashboard-card">
            <Card.Body>
              <div className="icon-circle bg-danger">
                <FontAwesomeIcon icon={faTimesCircle} className="text-white fa-2x" />
              </div>
              <h5 className="mt-3">Failed</h5>
              <h2>{paymentStats.failed}</h2>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100 dashboard-card">
            <Card.Body>
              <div className="icon-circle bg-warning">
                <FontAwesomeIcon icon={faChartLine} className="text-white fa-2x" />
              </div>
              <h5 className="mt-3">Pending</h5>
              <h2>{paymentStats.pending}</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-4">
        <Col md={8}>
          <Card className="h-100">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Payment Trends (Last 7 Days)</h5>
            </Card.Header>
            <Card.Body>
              <Line data={transactionData} />
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100">
            <Card.Header className="bg-white">
              <h5 className="mb-0">Payment Status</h5>
            </Card.Header>
            <Card.Body className="d-flex align-items-center justify-content-center">
              <Doughnut data={statusData} />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col md={12}>
          <Card>
            <Card.Header className="bg-white d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Recent Payments</h5>
              <Link to="/payments" className="btn btn-sm btn-outline-primary">View All</Link>
            </Card.Header>
            <Card.Body>
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Reference</th>
                      <th>Customer</th>
                      <th>Amount</th>
                      <th>Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paymentStats.recentPayments.map((payment) => (
                      <tr key={payment.id}>
                        <td>{payment.reference}</td>
                        <td>{payment.customer.name}</td>
                        <td>{payment.amount} {payment.currency}</td>
                        <td>{new Date(payment.created_at).toLocaleDateString()}</td>
                        <td>
                          <span className={`badge ${
                            payment.status === 'successful' ? 'bg-success' :
                            payment.status === 'failed' ? 'bg-danger' :
                            'bg-warning'
                          }`}>
                            {payment.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {paymentStats.recentPayments.length === 0 && (
                      <tr>
                        <td colSpan="5" className="text-center">No payments available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;