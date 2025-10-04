import api from './axiosConfig';
import { API_ENDPOINTS } from '../utils/constants';

// Get all users
export const getAllUsers = async () => {
  const response = await api.get(API_ENDPOINTS.USERS);
  return response.data;
};

// Get user by ID
export const getUserById = async (id) => {
  const response = await api.get(`${API_ENDPOINTS.USERS}/${id}`);
  return response.data;
};

// Get users by role
export const getUsersByRole = async (role) => {
  const response = await api.get(`${API_ENDPOINTS.USERS}/role/${role}`);
  return response.data;
};

// Create user
export const createUser = async (userData) => {
  const response = await api.post(API_ENDPOINTS.USERS, userData);
  return response.data;
};

// Update user
export const updateUser = async (id, userData) => {
  const response = await api.put(`${API_ENDPOINTS.USERS}/${id}`, userData);
  return response.data;
};

// Delete user
export const deleteUser = async (id) => {
  const response = await api.delete(`${API_ENDPOINTS.USERS}/${id}`);
  return response.data;
};

// Activate user
export const activateUser = async (id) => {
  const response = await api.put(`${API_ENDPOINTS.USERS}/${id}/activate`);
  return response.data;
};

// Deactivate user
export const deactivateUser = async (id) => {
  const response = await api.put(`${API_ENDPOINTS.USERS}/${id}/deactivate`);
  return response.data;
};

