import api from './axios';

export const startInterview = async (domain, difficulty) => {
  const response = await api.post('/interviews/start', { domain, difficulty });
  return response.data;
};

export const getNextQuestion = async (interviewId) => {
  const response = await api.get(`/interviews/${interviewId}/next-question`);
  return response.data;
};

export const submitAnswer = async (interviewId, questionId, answer) => {
  const response = await api.post(`/interviews/${interviewId}/answer`, { questionId, answer });
  return response.data;
};

export const completeInterview = async (interviewId) => {
  const response = await api.post(`/interviews/${interviewId}/complete`);
  return response.data;
};

export const getInterviews = async () => {
  const response = await api.get('/interviews');
  return response.data;
};

export const getInterviewReport = async (interviewId) => {
  const response = await api.get(`/interviews/${interviewId}/report`);
  return response.data;
};
