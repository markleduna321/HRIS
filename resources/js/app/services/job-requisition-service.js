import axios from 'axios';

const API_URL = '/api/job-requisitions';

export const fetchJobRequisitions = async (filters = {}) => {
  const response = await axios.get(API_URL, { params: filters });
  return response.data;
};

export const fetchJobRequisitionStatistics = async () => {
  const response = await axios.get(`${API_URL}/statistics`);
  return response.data;
};

export const fetchJobRequisition = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const createJobRequisition = async (data) => {
  const response = await axios.post(API_URL, data);
  return response.data;
};

export const updateJobRequisition = async (id, data) => {
  const response = await axios.put(`${API_URL}/${id}`, data);
  return response.data;
};

export const deleteJobRequisition = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

export const approveJobRequisition = async (id) => {
  const response = await axios.post(`${API_URL}/${id}/approve`);
  return response.data;
};

export const rejectJobRequisition = async (id, reason) => {
  const response = await axios.post(`${API_URL}/${id}/reject`, { rejection_reason: reason });
  return response.data;
};

export const markInProgress = async (id) => {
  const response = await axios.post(`${API_URL}/${id}/mark-in-progress`);
  return response.data;
};

export const cancelJobRequisition = async (id) => {
  const response = await axios.post(`${API_URL}/${id}/cancel`);
  return response.data;
};

export const markAsViewed = async (id) => {
  const response = await axios.post(`${API_URL}/${id}/mark-viewed`);
  return response.data;
};

export const fetchExistingPositions = async () => {
  const response = await axios.get(`${API_URL}/existing-positions`);
  return response.data;
};
