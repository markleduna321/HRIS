import axios from 'axios';

const API_URL = '/api/interviews';

export const fetchInterviews = async (params = {}) => {
  const response = await axios.get(API_URL, { params });
  return response.data;
};

export const createInterview = async (data) => {
  const response = await axios.post(API_URL, data);
  return response.data;
};

export const updateInterview = async (id, data) => {
  const response = await axios.put(`${API_URL}/${id}`, data);
  return response.data;
};

export const deleteInterview = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
