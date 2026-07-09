import React from 'react';
import { useSelector } from 'react-redux';
import { hasPermission, hasRole } from '../utils/permissions';

interface PermissionGateProps {
  permission?: string;
  role?: string | string[];
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

const PermissionGate: React.FC<PermissionGateProps> = ({ 
  permission, 
  role,
  fallback = null, 
  children 
}) => {
  const { user } = useSelector((state: any) => state.auth);
  
  let hasAccess = false;
  
  if (permission) {
    hasAccess = hasPermission(user, permission);
  } else if (role) {
    hasAccess = hasRole(user, role);
  } else {
    hasAccess = true;
  }
  
  return hasAccess ? <>{children}</> : <>{fallback}</>;
};

export default PermissionGate;
