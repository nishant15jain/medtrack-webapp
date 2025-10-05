import api from './axiosConfig';

export const getAdminDashboardStats = async () => {
  const response = await api.get('/dashboard/admin/stats');
  return response.data;
};

