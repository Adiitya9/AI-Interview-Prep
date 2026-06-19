import api from './axios';

export const analyzeGap = async (resumeText, jobDescription) => {
  const response = await api.post('/skill-gap/analyze', { resumeText, jobDescription });
  return response.data;
};

export const getAnalyses = async () => {
  const response = await api.get('/skill-gap');
  return response.data;
};
