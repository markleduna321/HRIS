import axios from 'axios';

/**
 * User Management Service
 * Handles all user-related API calls
 */
export const getUsers = async () => {
  console.log('📡 Service: Calling GET /api/users');
  const response = await axios.get('/api/users');
  console.log('✅ Service: Received users response:', response.data);
  return response.data;
};

export const getUserById = async (id) => {
  const response = await axios.get(`/api/users/${id}`);
  return response.data;
};

export const createUser = async (userData) => {
  const response = await axios.post('/api/users', userData);
  return response.data;
};

export const updateUser = async (id, userData) => {
  const response = await axios.put(`/api/users/${id}`, userData);
  return response.data;
};

export const deleteUser = async (id) => {
  const response = await axios.delete(`/api/users/${id}`);
  return response.data;
};

export const activateUser = async (id) => {
  const response = await axios.patch(`/api/users/${id}/activate`);
  return response.data;
};

export const deactivateUser = async (id) => {
  const response = await axios.patch(`/api/users/${id}/deactivate`);
  return response.data;
};

export const assignRolesToUser = async (id, roles) => {
  const response = await axios.post(`/api/users/${id}/roles`, { roles });
  return response.data;
};

export const resetUserPassword = async (id, passwordData) => {
  const response = await axios.post(`/api/users/${id}/reset-password`, passwordData);
  return response.data;
};
