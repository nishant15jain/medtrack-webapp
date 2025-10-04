import api from './axiosConfig';
import { API_ENDPOINTS } from '../utils/constants';

// Get all orders
export const getAllOrders = async () => {
  const response = await api.get(API_ENDPOINTS.ORDERS);
  return response.data;
};

// Get order by ID
export const getOrderById = async (id) => {
  const response = await api.get(`${API_ENDPOINTS.ORDERS}/${id}`);
  return response.data;
};

// Get orders by doctor ID
export const getOrdersByDoctorId = async (doctorId) => {
  const response = await api.get(`${API_ENDPOINTS.ORDERS}/doctor/${doctorId}`);
  return response.data;
};

// Get orders by visit ID
export const getOrdersByVisitId = async (visitId) => {
  const response = await api.get(`${API_ENDPOINTS.ORDERS}/visit/${visitId}`);
  return response.data;
};

// Get orders by status
export const getOrdersByStatus = async (status) => {
  const response = await api.get(`${API_ENDPOINTS.ORDERS}/status/${status}`);
  return response.data;
};

// Get orders by payment status
export const getOrdersByPaymentStatus = async (paymentStatus) => {
  const response = await api.get(`${API_ENDPOINTS.ORDERS}/payment-status/${paymentStatus}`);
  return response.data;
};

// Get orders by date range
export const getOrdersByDateRange = async (startDate, endDate) => {
  const response = await api.get(`${API_ENDPOINTS.ORDERS}/date-range`, {
    params: { startDate, endDate }
  });
  return response.data;
};

// Get orders by doctor and date range
export const getOrdersByDoctorIdAndDateRange = async (doctorId, startDate, endDate) => {
  const response = await api.get(`${API_ENDPOINTS.ORDERS}/doctor/${doctorId}/date-range`, {
    params: { startDate, endDate }
  });
  return response.data;
};

// Get order by order number
export const getOrderByOrderNumber = async (orderNumber) => {
  const response = await api.get(`${API_ENDPOINTS.ORDERS}/order-number/${orderNumber}`);
  return response.data;
};

// Get total revenue
export const getTotalRevenue = async () => {
  const response = await api.get(`${API_ENDPOINTS.ORDERS}/reports/total-revenue`);
  return response.data;
};

// Get total revenue by doctor
export const getTotalRevenueByDoctorId = async (doctorId) => {
  const response = await api.get(`${API_ENDPOINTS.ORDERS}/reports/doctor/${doctorId}/total-revenue`);
  return response.data;
};

// Get total revenue by date range
export const getTotalRevenueByDateRange = async (startDate, endDate) => {
  const response = await api.get(`${API_ENDPOINTS.ORDERS}/reports/total-revenue/date-range`, {
    params: { startDate, endDate }
  });
  return response.data;
};

// Count orders by status
export const countOrdersByStatus = async (status) => {
  const response = await api.get(`${API_ENDPOINTS.ORDERS}/reports/count-by-status/${status}`);
  return response.data;
};

// Get recent orders
export const getRecentOrders = async (limit = 10) => {
  const response = await api.get(`${API_ENDPOINTS.ORDERS}/recent`, {
    params: { limit }
  });
  return response.data;
};

// Create order
export const createOrder = async (orderData) => {
  const response = await api.post(API_ENDPOINTS.ORDERS, orderData);
  return response.data;
};

// Update order status
export const updateOrderStatus = async (id, updateData) => {
  const response = await api.patch(`${API_ENDPOINTS.ORDERS}/${id}`, updateData);
  return response.data;
};

// Delete order
export const deleteOrder = async (id) => {
  const response = await api.delete(`${API_ENDPOINTS.ORDERS}/${id}`);
  return response.data;
};

