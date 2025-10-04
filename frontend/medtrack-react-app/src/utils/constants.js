// API Configuration
export const API_BASE_URL = 'http://localhost:8080/api';

// User Roles
export const USER_ROLES = {
  ADMIN: 'ADMIN',
  MANAGER: 'MANAGER',
  REP: 'REP'
};

// Role Descriptions
export const ROLE_DESCRIPTIONS = {
  ADMIN: 'Can add/edit reps, doctors, products, see all data',
  MANAGER: 'Can view visits, samples, and doctor lists in their team',
  REP: 'Can log visits, issue samples'
};

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'medtrack_token',
  USER_ROLE: 'medtrack_user_role',
  USER_ID: 'medtrack_user_id'
};

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register'
  },
  USERS: '/users',
  DOCTORS: '/doctors',
  PRODUCTS: '/products',
  VISITS: '/visits',
  SAMPLES: '/samples'
};

