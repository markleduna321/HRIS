import axios from 'axios';

const API_BASE_URL = '/api/employee-documents';

export const getEmployeeDocuments = async (params = {}) => {
  console.log('📄 Service: fetching employee documents', params);
  const response = await axios.get(API_BASE_URL, { params });
  console.log('📄 Service: employee documents response:', response.data);
  return response.data;
};

export const getEmployeeDocument = async (id) => {
  console.log('📄 Service: fetching employee document', id);
  const response = await axios.get(`${API_BASE_URL}/${id}`);
  console.log('📄 Service: employee document response:', response.data);
  return response.data;
};

export const uploadEmployeeDocument = async (formData) => {
  console.log('📄 Service: uploading employee document');
  // Log FormData contents
  for (let pair of formData.entries()) {
    console.log('📄 FormData:', pair[0], '=', pair[1]);
  }
  
  // Don't set Content-Type header - let browser set it with boundary
  const response = await axios.post(API_BASE_URL, formData);
  console.log('📄 Service: upload response:', response.data);
  return response.data;
};

export const updateEmployeeDocument = async (id, data) => {
  console.log('📄 Service: updating employee document', id, data);
  const response = await axios.put(`${API_BASE_URL}/${id}`, data);
  console.log('📄 Service: update response:', response.data);
  return response.data;
};

export const deleteEmployeeDocument = async (id) => {
  console.log('📄 Service: deleting employee document', id);
  const response = await axios.delete(`${API_BASE_URL}/${id}`);
  console.log('📄 Service: delete response:', response.data);
  return response.data;
};

export const downloadEmployeeDocument = async (id) => {
  console.log('📄 Service: downloading employee document', id);
  const response = await axios.get(`${API_BASE_URL}/${id}/download`, {
    responseType: 'blob',
  });
  console.log('📄 Service: download response received');
  return response;
};

export const getDocumentTypes = async () => {
  console.log('📄 Service: fetching document types');
  const response = await axios.get(`${API_BASE_URL}/document-types`);
  console.log('📄 Service: document types response:', response.data);
  return response.data;
};
