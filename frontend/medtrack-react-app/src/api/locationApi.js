import api from './axiosConfig';

// Get all locations
export const getAllLocations = async (activeOnly = false) => {
  const response = await api.get('/locations', {
    params: { activeOnly }
  });
  return response.data;
};

// Get active locations only
export const getActiveLocations = async () => {
  const response = await api.get('/locations', {
    params: { activeOnly: true }
  });
  return response.data;
};

// Get location by ID
export const getLocationById = async (id) => {
  const response = await api.get(`/locations/${id}`);
  return response.data;
};

// Get locations by city
export const getLocationsByCity = async (city) => {
  const response = await api.get(`/locations/city/${city}`);
  return response.data;
};

// Search locations
export const searchLocations = async (query, activeOnly = false) => {
  const response = await api.get('/locations/search', {
    params: { q: query, activeOnly }
  });
  return response.data;
};

// Create new location
export const createLocation = async (locationData) => {
  const response = await api.post('/locations', locationData);
  return response.data;
};

// Create multiple locations in bulk
export const createBulkLocations = async (locationsData) => {
  const response = await api.post('/locations/bulk', { locations: locationsData });
  return response.data;
};

// Update location
export const updateLocation = async (id, locationData) => {
  const response = await api.put(`/locations/${id}`, locationData);
  return response.data;
};

// Delete location
export const deleteLocation = async (id) => {
  const response = await api.delete(`/locations/${id}`);
  return response.data;
};

// Activate location
export const activateLocation = async (id) => {
  const response = await api.put(`/locations/${id}/activate`);
  return response.data;
};

// Deactivate location
export const deactivateLocation = async (id) => {
  const response = await api.put(`/locations/${id}/deactivate`);
  return response.data;
};

// Get user locations
export const getUserLocations = async (userId) => {
  const response = await api.get(`/users/${userId}/locations`);
  return response.data;
};

// Assign locations to user
export const assignLocationsToUser = async (userId, locationIds) => {
  const response = await api.put(`/users/${userId}/locations`, locationIds);
  return response.data;
};

// Add location to user
export const addLocationToUser = async (userId, locationId) => {
  const response = await api.post(`/users/${userId}/locations/${locationId}`);
  return response.data;
};

// Remove location from user
export const removeLocationFromUser = async (userId, locationId) => {
  const response = await api.delete(`/users/${userId}/locations/${locationId}`);
  return response.data;
};

// Get users by location
export const getUsersByLocation = async (locationId) => {
  const response = await api.get(`/users/by-location/${locationId}`);
  return response.data;
};

