import { STORAGE_KEYS } from './constants';

// Store authentication data
export const setAuthData = (token, role, userId) => {
  localStorage.setItem(STORAGE_KEYS.TOKEN, token);
  localStorage.setItem(STORAGE_KEYS.USER_ROLE, role);
  if (userId) {
    localStorage.setItem(STORAGE_KEYS.USER_ID, userId);
  }
};

// Get token
export const getToken = () => {
  return localStorage.getItem(STORAGE_KEYS.TOKEN);
};

// Get user role
export const getUserRole = () => {
  return localStorage.getItem(STORAGE_KEYS.USER_ROLE);
};

// Get user ID
export const getUserId = () => {
  return localStorage.getItem(STORAGE_KEYS.USER_ID);
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getToken();
};

// Clear all auth data
export const clearAuthData = () => {
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER_ROLE);
  localStorage.removeItem(STORAGE_KEYS.USER_ID);
};

// Decode JWT token (simple base64 decode)
export const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

// Extract user ID from token
export const extractUserIdFromToken = (token) => {
  const decoded = decodeToken(token);
  return decoded?.sub || null; // 'sub' is the standard JWT claim for subject (userId)
};

// Check if token is expired
export const isTokenExpired = (token) => {
  try {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) return true;
    
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    return true;
  }
};

