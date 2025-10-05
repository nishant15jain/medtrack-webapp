import api from './axiosConfig';
import { API_ENDPOINTS } from '../utils/constants';

// Get all visits
export const getAllVisits = async () => {
  const response = await api.get(API_ENDPOINTS.VISITS);
  return response.data;
};

// Get visit by ID
export const getVisitById = async (id) => {
  const response = await api.get(`${API_ENDPOINTS.VISITS}/${id}`);
  return response.data;
};

// Get visits by user ID
export const getVisitsByUserId = async (userId) => {
  const response = await api.get(`${API_ENDPOINTS.VISITS}/user/${userId}`);
  return response.data;
};

// Get visits by doctor ID
export const getVisitsByDoctorId = async (doctorId) => {
  const response = await api.get(`${API_ENDPOINTS.VISITS}/doctor/${doctorId}`);
  return response.data;
};

// Get visits by date range
export const getVisitsByDateRange = async (startDate, endDate) => {
  const response = await api.get(`${API_ENDPOINTS.VISITS}/date-range`, {
    params: { startDate, endDate }
  });
  return response.data;
};

// Get visits by date
export const getVisitsByDate = async (date) => {
  const response = await api.get(`${API_ENDPOINTS.VISITS}/date/${date}`);
  return response.data;
};

// Get visits by user and date range
export const getVisitsByUserIdAndDateRange = async (userId, startDate, endDate) => {
  const response = await api.get(`${API_ENDPOINTS.VISITS}/user/${userId}/date-range`, {
    params: { startDate, endDate }
  });
  return response.data;
};

// Get visits by doctor and date range
export const getVisitsByDoctorIdAndDateRange = async (doctorId, startDate, endDate) => {
  const response = await api.get(`${API_ENDPOINTS.VISITS}/doctor/${doctorId}/date-range`, {
    params: { startDate, endDate }
  });
  return response.data;
};

// Create visit
export const createVisit = async (visitData) => {
  const response = await api.post(API_ENDPOINTS.VISITS, visitData);
  return response.data;
};

// Update visit
export const updateVisit = async (id, visitData) => {
  const response = await api.put(`${API_ENDPOINTS.VISITS}/${id}`, visitData);
  return response.data;
};

// Delete visit
export const deleteVisit = async (id) => {
  const response = await api.delete(`${API_ENDPOINTS.VISITS}/${id}`);
  return response.data;
};

// Start visit (new location-based workflow)
export const startVisit = async (visitData) => {
  const response = await api.post(`${API_ENDPOINTS.VISITS}/start`, visitData);
  return response.data;
};

// End visit
export const endVisit = async (id, notes) => {
  const response = await api.put(`${API_ENDPOINTS.VISITS}/${id}/end`, { notes });
  return response.data;
};

// Get visits by location
export const getVisitsByLocation = async (locationId) => {
  const response = await api.get(`${API_ENDPOINTS.VISITS}/location/${locationId}`);
  return response.data;
};

// Get active visits by user
export const getActiveVisitsByUser = async (userId) => {
  const response = await api.get(`${API_ENDPOINTS.VISITS}/user/${userId}/active`);
  return response.data;
};

