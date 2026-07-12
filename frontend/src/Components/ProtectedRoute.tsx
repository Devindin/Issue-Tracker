import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { hasPermission } from '../utils/permissions';

interface ProtectedRouteProps {
  children: React.ReactNode;
  permission?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, permission }) => {
  const location = useLocation();
  const { token, user } = useSelector((state: any) => state.auth);

  if (!token || !user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // if a permission was specified, make sure user has it
  if (permission) {
    if (!hasPermission(user, permission)) {
      // redirect to dashboard or show 403
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;