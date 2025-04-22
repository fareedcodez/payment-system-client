import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/Auth/PrivateRoute';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import PaymentForm from './components/Payments/PaymentForm';
import PaymentsList from './components/Payments/PaymentsList';
import PaymentCallback from './components/Payments/PaymentCallback';
import BusinessProfile from './components/Dashboard/BusinessProfile';
import MainLayout from './components/Layout/MainLayout';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/payment/callback" element={<PaymentCallback />} />
        
        <Route 
          path="/" 
          element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="payments">
            <Route index element={<PaymentsList />} />
            <Route path="new" element={<PaymentForm />} />
            <Route path=":id" element={<PaymentForm />} />
          </Route>
          <Route path="profile" element={<BusinessProfile />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;