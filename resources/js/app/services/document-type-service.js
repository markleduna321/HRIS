import api from './api';

export const fetchDocumentTypes = async (params = {}) => {
  const response = await api.get('/document-types', { params });
  return response.data;
};

export const createDocumentType = async (data) => {
  const response = await api.post('/document-types', data);
  return response.data;
};

export const updateDocumentType = async (id, data) => {
  const response = await api.put(`/document-types/${id}`, data);
  return response.data;
};

export const deleteDocumentType = async (id) => {
  const response = await api.delete(`/document-types/${id}`);
  return response.data;
};

export const reorderDocumentTypes = async (order) => {
  const response = await api.post('/document-types/reorder', { order });
  return response.data;
};
