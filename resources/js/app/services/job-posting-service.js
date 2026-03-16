import axios from 'axios';

const API_URL = '/api/job-postings';

export const fetchJobPostings = async (params = {}) => {
  const response = await axios.get(API_URL, { params });
  return response.data;
};

export const fetchJobPosting = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const createJobPosting = async (data) => {
  const response = await axios.post(API_URL, data);
  return response.data;
};

export const updateJobPosting = async (id, data) => {
  const response = await axios.put(`${API_URL}/${id}`, data);
  return response.data;
};

export const deleteJobPosting = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
