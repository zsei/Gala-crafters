import React from 'react';
import { Navigate } from 'react-router-dom';
import { authService } from '../api/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'customer';
}

export default function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const isLoggedIn = authService.isLoggedIn();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole === 'admin') {
    const admin = authService.getStoredAdmin();
    if (!admin) {
      return <Navigate to="/admin/login" replace />;
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
