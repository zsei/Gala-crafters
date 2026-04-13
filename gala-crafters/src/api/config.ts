// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    ADMIN_LOGIN: '/api/auth/admin-login',
    FORGOT_PASSWORD: '/api/auth/forgot-password',
    RESET_PASSWORD: '/api/auth/reset-password',
  },
  USERS: {
    PROFILE: '/api/users/profile',
    UPDATE: '/api/users/profile',
    LIST: '/api/users',
    GET: (id: number) => `/api/users/${id}`,
    REVIEWS: '/api/users/reviews'
  },
  ADMIN: {
    PROFILE: '/api/admin/profile',
    USERS: '/api/admin/users',
    BOOKINGS: '/api/admin/bookings',
    PACKAGES: '/api/admin/packages',
    METRICS: '/api/admin/metrics',
    MESSAGES: '/api/admin/messages',
  },
  PACKAGES: {
    LIST: '/api/packages',
  },
  BOOKINGS: {
    CREATE: '/api/bookings',
    USER_HISTORY: '/api/users/bookings',
  },
  PAYMENTS: {
    CREATE_CHECKOUT: '/api/payments/create-checkout',
  },
  NOTIFICATIONS: {
    GET: '/api/notifications',
    MARK_READ: (id: number) => `/api/notifications/${id}/read`,
    READ_ALL: '/api/notifications/read-all',
    CLEAR: '/api/notifications'
  },
  HEALTH: '/api/health'
};
