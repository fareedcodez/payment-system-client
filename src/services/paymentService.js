import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const API = axios.create({
  baseURL: API_URL
});

// Interceptor to add auth token to requests
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Token ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const paymentService = {
  getPayments: async (filters = {}) => {
    try {
      const response = await API.get('/payments/', { params: filters });
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Failed to fetch payments' };
    }
  },

  getPayment: async (id) => {
    try {
      const response = await API.get(`/payments/${id}/`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Failed to fetch payment' };
    }
  },

  initializePayment: async (paymentData) => {
    try {
      const response = await API.post('/payments/initialize/', paymentData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Failed to initialize payment' };
    }
  },

  verifyPayment: async (verificationData) => {
    try {
      const response = await API.post('/payments/verify/', verificationData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Failed to verify payment' };
    }
  },

  getCustomers: async () => {
    try {
      const response = await API.get('/customers/');
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Failed to fetch customers' };
    }
  }
};

export default paymentService;