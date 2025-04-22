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

const authService = {
  setAuthToken: (token) => {
    if (token) {
      localStorage.setItem('token', token);
      API.defaults.headers.common['Authorization'] = `Token ${token}`;
    } else {
      delete API.defaults.headers.common['Authorization'];
    }
  },

  clearAuthToken: () => {
    localStorage.removeItem('token');
    delete API.defaults.headers.common['Authorization'];
  },

  login: async (username, password) => {
    try {
      const response = await API.post('/auth/login/', { username, password });
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Login failed' };
    }
  },

  register: async (userData) => {
    try {
      const response = await API.post('/auth/register/', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Registration failed' };
    }
  },

  getProfile: async () => {
    try {
      const response = await API.get('/businesses/');
      return response.data[0]; // Assuming one business per user
    } catch (error) {
      throw error.response?.data || { detail: 'Failed to fetch profile' };
    }
  },

  updateProfile: async (businessData) => {
    try {
      const response = await API.put(`/businesses/${businessData.id}/`, businessData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { detail: 'Failed to update profile' };
    }
  }
};

export default authService;