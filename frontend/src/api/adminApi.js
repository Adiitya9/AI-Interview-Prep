import api from './axios';

export const getAllUsers = async () => {
  const response = await api.get('/admin/users');
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/admin/users/${id}`);
  return response.data;
};

export const getAnalytics = async () => {
  const response = await api.get('/admin/analytics');
  return response.data;
};
