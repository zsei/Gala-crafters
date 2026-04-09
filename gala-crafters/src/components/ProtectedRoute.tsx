import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../api/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'customer';
  allowedRoles?: string[];
}

export default function ProtectedRoute({ children, requiredRole, allowedRoles }: ProtectedRouteProps) {
  const isLoggedIn = authService.isLoggedIn();

  // Basic login check
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Admin hierarchy checks
  if (requiredRole === 'admin') {
    const admin = authService.getStoredAdmin();
    if (!admin) {
      return <Navigate to="/admin/login" replace />;
    }
    
    // RBAC: Check specific allowed roles
    if (allowedRoles && allowedRoles.length > 0) {
      if (!allowedRoles.includes(admin.role)) {
        return <Navigate to="/admin" replace />; // Redirect unauthorized layout directly to dashboard
      }
    }
  }

  if (requiredRole === 'customer') {
    const user = authService.getStoredUser();
    if (!user) {
      return <Navigate to="/login" replace />;
    }
  }

  return <>{children}</>;
}
