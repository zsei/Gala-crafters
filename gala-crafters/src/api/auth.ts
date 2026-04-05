// Authentication Service - handles API calls to backend
import { API_BASE_URL, API_ENDPOINTS } from './config';

export const authService = {
  /**
   * Customer login
   */
  login: async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTH.LOGIN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Login failed');
      }

      const data = await response.json();
      
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        return data;
      }
      throw new Error('No token received');
    } catch (error: any) {
      // Check if it's a network error
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error(`Cannot connect to server at ${API_BASE_URL}. Please ensure the backend is running.`);
      }
      throw new Error(error.message || 'Login failed');
    }
  },

  /**
   * Customer registration
   */
  register: async (userData: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTH.REGISTER}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Registration failed');
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      // Check if it's a network error
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error(`Cannot connect to server at ${API_BASE_URL}. Please ensure the backend is running.`);
      }
      throw new Error(error.message || 'Registration failed');
    }
  },

  /**
   * Admin login
   */
  adminLogin: async (email: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTH.ADMIN_LOGIN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Admin login failed');
      }

      const data = await response.json();
      
      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('admin', JSON.stringify(data.admin));
        return data;
      }
      throw new Error('No token received');
    } catch (error: any) {
      // Check if it's a network error
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error(`Cannot connect to server at ${API_BASE_URL}. Please ensure the backend is running.`);
      }
      throw new Error(error.message || 'Admin login failed');
    }
  },

  /**
   * Request password reset
   */
  forgotPassword: async (email: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTH.FORGOT_PASSWORD}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to request password reset');
      }

      return await response.json();
    } catch (error: any) {
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error(`Cannot connect to server at ${API_BASE_URL}. Please ensure the backend is running.`);
      }
      throw new Error(error.message || 'Error processing forgot password request');
    }
  },

  /**
   * Execute password reset
   */
  resetPassword: async (token: string, password: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.AUTH.RESET_PASSWORD}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to reset password');
      }

      return await response.json();
    } catch (error: any) {
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error(`Cannot connect to server at ${API_BASE_URL}. Please ensure the backend is running.`);
      }
      throw new Error(error.message || 'Error processing password reset');
    }
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
    const token = localStorage.getItem('token');
    if (!token) {
      throw new Error('No token found');
    }

    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.USERS.PROFILE}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to get profile');
    }

    return response.json();
  },

  /**
   * Update user profile
   */
  updateProfile: async (userData: any) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.USERS.UPDATE}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Update failed');
      }

      const data = await response.json();
      
      // Update stored user data if successful
      if (data.user) {
        localStorage.setItem('user', JSON.stringify(data.user));
      } else {
        // Fallback: if backend only returns success, we manually merge
        const existing = JSON.parse(localStorage.getItem('user') || '{}');
        const updated = { ...existing, ...userData };
        localStorage.setItem('user', JSON.stringify(updated));
      }
      
      return data;
    } catch (error: any) {
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error(`Cannot connect to server at ${API_BASE_URL}. Please ensure the backend is running.`);
      }
      throw new Error(error.message || 'Update failed');
    }
  },

  /**
   * Get all bookings for current user
   */
  getUserBookings: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.BOOKINGS.USER_HISTORY}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to fetch bookings');
      }

      return response.json();
    } catch (error: any) {
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error(`Cannot connect to server at ${API_BASE_URL}. Please ensure the backend is running.`);
      }
      throw new Error(error.message || 'Failed to fetch bookings');
    }
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

export default authService;
