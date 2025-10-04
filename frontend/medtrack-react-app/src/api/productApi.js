import api from './axiosConfig';
import { API_ENDPOINTS } from '../utils/constants';

// Get all products
export const getAllProducts = async () => {
  const response = await api.get(API_ENDPOINTS.PRODUCTS);
  return response.data;
};

// Get product by ID
export const getProductById = async (id) => {
  const response = await api.get(`${API_ENDPOINTS.PRODUCTS}/${id}`);
  return response.data;
};

// Search products by name
export const searchProductsByName = async (name) => {
  const response = await api.get(`${API_ENDPOINTS.PRODUCTS}/search`, {
    params: { name }
  });
  return response.data;
};

// Create product
export const createProduct = async (productData) => {
  const response = await api.post(API_ENDPOINTS.PRODUCTS, productData);
  return response.data;
};

// Update product
export const updateProduct = async (id, productData) => {
  const response = await api.put(`${API_ENDPOINTS.PRODUCTS}/${id}`, productData);
  return response.data;
};

// Delete product
export const deleteProduct = async (id) => {
  const response = await api.delete(`${API_ENDPOINTS.PRODUCTS}/${id}`);
  return response.data;
};

