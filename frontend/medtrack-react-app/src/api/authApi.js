import api from './axiosConfig';
import { API_ENDPOINTS } from '../utils/constants';

// Login
export const login = async (email, password) => {
  const response = await api.post(API_ENDPOINTS.AUTH.LOGIN, {
    email,
    password
  });
  return response.data;
};

// Register (Admin only)
export const register = async (userData) => {
  const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, userData);
  return response.data;
};

