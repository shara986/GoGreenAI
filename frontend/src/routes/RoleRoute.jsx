import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const RoleRoute = ({ allowedRoles, children }) => {
  const { isAuthenticated, user, loading, getDashboardPath } = useAuth();

  if (loading) {
    return <LoadingSpinner text="Checking authorization..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && (!user?.role || !allowedRoles.includes(user.role))) {
    // Redirect to their own correct dashboard instead of a broken /unauthorized page
    return <Navigate to={getDashboardPath()} replace />;
  }

  return children ? children : <Outlet />;
};

export default RoleRoute;
