import axiosInstance from './axiosConfig';

export const getAdminDashboardStats = async () => {
  const response = await axiosInstance.get('/dashboard/admin/stats');
  return response.data;
};

