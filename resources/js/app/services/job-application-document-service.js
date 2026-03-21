import axios from 'axios';

const API_URL = '/api/job-application-documents';

export const fetchJobApplicationDocuments = async (params = {}) => {
  const response = await axios.get(API_URL, { params });
  return response.data;
};

export const uploadJobApplicationDocument = async (formData) => {
  const response = await axios.post(API_URL, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const deleteJobApplicationDocument = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

export const approveJobApplicationDocument = async (id) => {
  const response = await axios.post(`${API_URL}/${id}/approve`);
  return response.data;
};

export const rejectJobApplicationDocument = async (id, rejectionReason) => {
  const response = await axios.post(`${API_URL}/${id}/reject`, {
    rejection_reason: rejectionReason,
  });
  return response.data;
};
