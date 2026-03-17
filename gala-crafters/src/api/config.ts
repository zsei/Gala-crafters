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
    USERS: '/api/admin/users',
    BOOKINGS: '/api/admin/bookings',
    PACKAGES: '/api/admin/packages',
    METRICS: '/api/admin/metrics',
    MESSAGES: '/api/admin/messages',
  },
  BOOKINGS: {
    CREATE: '/api/bookings',
    USER_HISTORY: '/api/users/bookings',
  },
  HEALTH: '/api/health'
};
