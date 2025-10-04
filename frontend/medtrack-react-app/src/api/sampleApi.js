import api from './axiosConfig';
import { API_ENDPOINTS } from '../utils/constants';

// Get all samples
export const getAllSamples = async () => {
  const response = await api.get(API_ENDPOINTS.SAMPLES);
  return response.data;
};

// Get sample by ID
export const getSampleById = async (id) => {
  const response = await api.get(`${API_ENDPOINTS.SAMPLES}/${id}`);
  return response.data;
};

// Get samples by doctor ID
export const getSamplesByDoctorId = async (doctorId) => {
  const response = await api.get(`${API_ENDPOINTS.SAMPLES}/doctor/${doctorId}`);
  return response.data;
};

// Get samples by product ID
export const getSamplesByProductId = async (productId) => {
  const response = await api.get(`${API_ENDPOINTS.SAMPLES}/product/${productId}`);
  return response.data;
};

// Get samples by visit ID
export const getSamplesByVisitId = async (visitId) => {
  const response = await api.get(`${API_ENDPOINTS.SAMPLES}/visit/${visitId}`);
  return response.data;
};

// Get samples by date range
export const getSamplesByDateRange = async (startDate, endDate) => {
  const response = await api.get(`${API_ENDPOINTS.SAMPLES}/date-range`, {
    params: { startDate, endDate }
  });
  return response.data;
};

// Get samples by date
export const getSamplesByDate = async (date) => {
  const response = await api.get(`${API_ENDPOINTS.SAMPLES}/date/${date}`);
  return response.data;
};

// Get samples by doctor and date range
export const getSamplesByDoctorIdAndDateRange = async (doctorId, startDate, endDate) => {
  const response = await api.get(`${API_ENDPOINTS.SAMPLES}/doctor/${doctorId}/date-range`, {
    params: { startDate, endDate }
  });
  return response.data;
};

// Get samples by product and date range
export const getSamplesByProductIdAndDateRange = async (productId, startDate, endDate) => {
  const response = await api.get(`${API_ENDPOINTS.SAMPLES}/product/${productId}/date-range`, {
    params: { startDate, endDate }
  });
  return response.data;
};

// Get samples by doctor and product
export const getSamplesByDoctorIdAndProductId = async (doctorId, productId) => {
  const response = await api.get(`${API_ENDPOINTS.SAMPLES}/doctor/${doctorId}/product/${productId}`);
  return response.data;
};

// Get total quantity by product
export const getTotalQuantityByProductId = async (productId) => {
  const response = await api.get(`${API_ENDPOINTS.SAMPLES}/reports/product/${productId}/total-quantity`);
  return response.data;
};

// Get total quantity by doctor
export const getTotalQuantityByDoctorId = async (doctorId) => {
  const response = await api.get(`${API_ENDPOINTS.SAMPLES}/reports/doctor/${doctorId}/total-quantity`);
  return response.data;
};

// Issue sample
export const issueSample = async (sampleData) => {
  const response = await api.post(API_ENDPOINTS.SAMPLES, sampleData);
  return response.data;
};

// Update sample
export const updateSample = async (id, sampleData) => {
  const response = await api.put(`${API_ENDPOINTS.SAMPLES}/${id}`, sampleData);
  return response.data;
};

// Delete sample
export const deleteSample = async (id) => {
  const response = await api.delete(`${API_ENDPOINTS.SAMPLES}/${id}`);
  return response.data;
};

