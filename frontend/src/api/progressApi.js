import api from './axios';

export const getProgress = async () => {
  const response = await api.get('/progress');
  return response.data;
};

export const getWeeklyReport = async () => {
  const response = await api.get('/progress/weekly-report');
  return response.data;
};
