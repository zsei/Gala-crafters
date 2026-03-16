# 🔗 React Frontend Integration Guide

## Overview

This guide explains how to connect your React frontend (`gala-crafters/`) to the FastAPI backend API.

## 📋 Prerequisites

- Backend API running at `http://localhost:8000`
- React development server running at `http://localhost:5173` (Vite) or `http://localhost:3000`
- Installed dependencies: `axios` or `fetch` API (built-in)

## 🔧 Installation

### Install Axios (Optional but Recommended)

```bash
cd gala-crafters
npm install axios
```

## 🌐 API Base URL Configuration

Create a file [src/api/config.ts](src/api/config.ts):

```typescript
// src/api/config.ts
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    ADMIN_LOGIN: '/api/auth/admin-login',
    LOGOUT: '/api/auth/logout'
  },
  USERS: {
    PROFILE: '/api/users/profile',
    LIST: '/api/users',
    GET: (id: number) => `/api/users/${id}`
  },
  ADMIN: {
    PROFILE: '/api/admin/profile',
    USERS: '/api/admin/users'
  },
  HEALTH: '/api/health'
};
```

## 🔐 Authentication Service

Create [src/api/auth.ts](src/api/auth.ts):

```typescript
// src/api/auth.ts
import axios from 'axios';
import { API_BASE_URL, API_ENDPOINTS } from './config';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  /**
   * Customer login
   */
  login: async (email: string, password: string) => {
    const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, {
      email,
      password
    });
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      return response.data;
    }
    throw new Error('Login failed');
  },

  /**
   * Admin login
   */
  adminLogin: async (email: string, password: string) => {
    const response = await api.post(API_ENDPOINTS.AUTH.ADMIN_LOGIN, {
      email,
      password
    });
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('admin', JSON.stringify(response.data.admin));
      return response.data;
    }
    throw new Error('Admin login failed');
  },

  /**
   * Logout
   */
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('admin');
  },

  /**
   * Get current user profile
   */
  getProfile: async () => {
    const response = await api.get(API_ENDPOINTS.USERS.PROFILE);
    return response.data;
  },

  /**
   * Update user profile
   */
  updateProfile: async (data: any) => {
    const response = await api.put(API_ENDPOINTS.USERS.PROFILE, data);
    return response.data;
  },

  /**
   * Get user by ID
   */
  getUser: async (userId: number) => {
    const response = await api.get(API_ENDPOINTS.USERS.GET(userId));
    return response.data;
  },

  /**
   * List all users
   */
  listUsers: async () => {
    const response = await api.get(API_ENDPOINTS.USERS.LIST);
    return response.data;
  },

  /**
   * Get admin profile
   */
  getAdminProfile: async () => {
    const response = await api.get(API_ENDPOINTS.ADMIN.PROFILE);
    return response.data;
  },

  /**
   * Get all admin users
   */
  getAdminUsers: async () => {
    const response = await api.get(API_ENDPOINTS.ADMIN.USERS);
    return response.data;
  },

  /**
   * Check if user is logged in
   */
  isLoggedIn: (): boolean => {
    return !!localStorage.getItem('token');
  },

  /**
   * Get stored user data
   */
  getStoredUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  /**
   * Get stored admin data
   */
  getStoredAdmin: () => {
    const admin = localStorage.getItem('admin');
    return admin ? JSON.parse(admin) : null;
  }
};

export default api;
```

## 📝 Update LoginPage Component

Update [src/components/LoginPage.tsx](src/components/LoginPage.tsx):

```typescript
// src/components/LoginPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../api/auth';
import './Auth.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authService.login(email, password);
      console.log('Login successful:', response.user);
      navigate('/dashboard'); // or desired route
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Login failed. Please check your credentials.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form onSubmit={handleLogin}>
        <h1>Login</h1>
        
        {error && <div className="error-message">{error}</div>}
        
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
        
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        />
        
        <button type="submit" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      {/* Test credentials display */}
      <div className="test-credentials">
        <h3>Test Credentials (Development Only)</h3>
        <p><strong>Email:</strong> natasha.khaleira@email.com</p>
        <p><strong>Password:</strong> hashed_password_123</p>
      </div>
    </div>
  );
}
```

## 🔐 Protected Route Component

Create [src/components/ProtectedRoute.tsx](src/components/ProtectedRoute.tsx):

```typescript
// src/components/ProtectedRoute.tsx
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
      return <Navigate to="/login" replace />;
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
```

## 🗺️ Update Router Configuration

Update [src/main.tsx](src/main.tsx) or your router setup:

```typescript
// src/main.tsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './components/LoginPage';
import SignUpPage from './components/SignUpPage';
import Dashboard from './components/Dashboard'; // Create this
import AdminDashboard from './components/Admin/AdminDashboard';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        
        {/* Protected customer routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute requiredRole="customer">
              <Dashboard />
            </ProtectedRoute>
          }
        />
        
        {/* Protected admin routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        
        {/* Redirect root to login or dashboard */}
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
```

## 🎯 Example: Create Dashboard Component

Create [src/components/Dashboard.tsx](src/components/Dashboard.tsx):

```typescript
// src/components/Dashboard.tsx
import { useEffect, useState } from 'react';
import { authService } from '../api/auth';

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await authService.getProfile();
        setUser(profile);
      } catch (err: any) {
        setError('Failed to load profile');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = () => {
    authService.logout();
    window.location.href = '/login';
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="dashboard">
      <h1>Welcome, {user?.first_name}!</h1>
      
      <div className="user-info">
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Phone:</strong> {user?.phone}</p>
        <p><strong>Location:</strong> {user?.city}, {user?.country}</p>
      </div>

      <button onClick={handleLogout} className="logout-btn">
        Logout
      </button>
    </div>
  );
}
```

## 🔄 Context Provider (Optional but Recommended)

Create [src/context/AuthContext.tsx](src/context/AuthContext.tsx):

```typescript
// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../api/auth';

interface AuthContextType {
  user: any | null;
  admin: any | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  adminLogin: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);
  const [admin, setAdmin] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Check if user was logged in on mount
  useEffect(() => {
    const storedUser = authService.getStoredUser();
    const storedAdmin = authService.getStoredAdmin();
    
    if (storedUser) setUser(storedUser);
    if (storedAdmin) setAdmin(storedAdmin);
    
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setError(null);
    try {
      const response = await authService.login(email, password);
      setUser(response.user);
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Login failed';
      setError(message);
      throw err;
    }
  };

  const handleAdminLogin = async (email: string, password: string) => {
    setError(null);
    try {
      const response = await authService.adminLogin(email, password);
      setAdmin(response.admin);
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Admin login failed';
      setError(message);
      throw err;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setAdmin(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      admin,
      isLoggedIn: !!user || !!admin,
      login,
      adminLogin: handleAdminLogin,
      logout,
      loading,
      error
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

## 🚀 Environment Configuration

Create `.env` file in `gala-crafters/` root:

```
VITE_API_URL=http://localhost:8000
VITE_NODE_ENV=development
```

Update [src/api/config.ts](src/api/config.ts):

```typescript
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
```

## 📊 Testing the Integration

### 1. Start Backend
```bash
cd backend
python main.py
```

### 2. Start Frontend
```bash
cd gala-crafters
npm run dev
```

### 3. Test Login
- Navigate to http://localhost:5173/login
- Enter credentials:
  - Email: `natasha.khaleira@email.com`
  - Password: `hashed_password_123`
- Should redirect to dashboard showing user profile

### 4. Test Admin Login
- Create separate admin login page or route
- Use credentials:
  - Email: `a.sterling@gala.com`
  - Password: `hashed_admin_123`

## 🐛 Troubleshooting

### CORS Errors
- Ensure backend includes frontend URL in CORS origins
- Check [backend/main.py](backend/main.py) line ~15

### 401 Unauthorized Errors
- Check token is being sent in headers: `Authorization: Bearer <token>`
- Verify token is stored in localStorage
- Check token hasn't expired (24 hours)

### Login Credentials Wrong
- Verify database has sample data
- Run: `SELECT * FROM users;` in psql
- Check password matches exactly (case-sensitive)

### API Not Responding
- Ensure backend is running on http://localhost:8000
- Check backend console for errors
- Verify database is connected

## 📚 Complete File Structure

After integration, your project should look like:

```
gala-crafters/
├── src/
│   ├── api/
│   │   ├── config.ts          (NEW)
│   │   ├── auth.ts            (NEW)
│   │   └── client.ts          (Optional API client)
│   ├── components/
│   │   ├── LoginPage.tsx       (UPDATED)
│   │   ├── Dashboard.tsx       (NEW)
│   │   ├── ProtectedRoute.tsx  (NEW)
│   │   └── ...
│   ├── context/
│   │   └── AuthContext.tsx     (NEW - Optional)
│   └── main.tsx               (UPDATED)
├── .env                       (NEW)
└── ...
```

## 🎯 Next Steps

1. ✅ Create API service layer
2. ✅ Create auth context/state management
3. ✅ Create protected routes
4. ✅ Create dashboard components
5. Create booking endpoints and UI
6. Create admin panel endpoints and UI
7. Create message/inquiry endpoints and UI
8. Add form validation
9. Add error handling
10. Add loading states

---

**Integration complete! Your React app is now connected to the FastAPI backend. 🎉**
