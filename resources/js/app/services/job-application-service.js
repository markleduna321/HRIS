import axios from 'axios';

const API_URL = '/api/job-applications';

export const fetchJobApplications = async (params = {}) => {
  const response = await axios.get(API_URL, { params });
  return response.data;
};

export const fetchJobApplication = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const createJobApplication = async (formData) => {
  const response = await axios.post(API_URL, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const updateJobApplication = async (id, data) => {
  const response = await axios.put(`${API_URL}/${id}`, data);
  return response.data;
};

export const deleteJobApplication = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
