import api from './axiosConfig';
import { API_ENDPOINTS } from '../utils/constants';

// Get all doctors
export const getAllDoctors = async () => {
  const response = await api.get(API_ENDPOINTS.DOCTORS);
  return response.data;
};

// Get doctor by ID
export const getDoctorById = async (id) => {
  const response = await api.get(`${API_ENDPOINTS.DOCTORS}/${id}`);
  return response.data;
};

// Search doctors by name
export const searchDoctorsByName = async (name) => {
  const response = await api.get(`${API_ENDPOINTS.DOCTORS}/search`, {
    params: { name }
  });
  return response.data;
};

// Get doctors by specialty
export const getDoctorsBySpecialty = async (specialty) => {
  const response = await api.get(`${API_ENDPOINTS.DOCTORS}/specialty/${specialty}`);
  return response.data;
};

// Get doctors by hospital
export const getDoctorsByHospital = async (hospital) => {
  const response = await api.get(`${API_ENDPOINTS.DOCTORS}/hospital/${hospital}`);
  return response.data;
};

// Create doctor
export const createDoctor = async (doctorData) => {
  const response = await api.post(API_ENDPOINTS.DOCTORS, doctorData);
  return response.data;
};

// Update doctor
export const updateDoctor = async (id, doctorData) => {
  const response = await api.put(`${API_ENDPOINTS.DOCTORS}/${id}`, doctorData);
  return response.data;
};

// Delete doctor
export const deleteDoctor = async (id) => {
  const response = await api.delete(`${API_ENDPOINTS.DOCTORS}/${id}`);
  return response.data;
};

