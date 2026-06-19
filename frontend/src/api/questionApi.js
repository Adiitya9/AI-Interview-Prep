import api from './axios';

export const generateQuestions = async (domain, difficulty, count) => {
  const response = await api.post('/questions/generate', { domain, difficulty, count });
  return response.data;
};
