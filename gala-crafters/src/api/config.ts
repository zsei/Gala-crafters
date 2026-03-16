// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    ADMIN_LOGIN: '/api/auth/admin-login',
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
