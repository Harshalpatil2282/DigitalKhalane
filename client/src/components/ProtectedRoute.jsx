/**
 * ProtectedRoute - Admin route guard
 */

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAdmin, loading } = useAuth();
  if (loading) return <div className="loading-page"><div className="spinner" /></div>;
  return isAdmin ? children : <Navigate to="/admin" replace />;
};

export default ProtectedRoute;
