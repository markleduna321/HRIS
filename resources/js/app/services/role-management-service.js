import axios from 'axios';

/**
 * Role Management Service
 * Handles all role and permission related API calls
 */
export const getRoles = async () => {
  console.log('📡 Service: Calling GET /api/roles');
  const response = await axios.get('/api/roles');
  console.log('✅ Service: Received roles response:', response.data);
  return response.data;
};

export const getRoleById = async (id) => {
  const response = await axios.get(`/api/roles/${id}`);
  return response.data;
};

export const createRole = async (roleData) => {
  const response = await axios.post('/api/roles', roleData);
  return response.data;
};

export const updateRole = async (id, roleData) => {
  const response = await axios.put(`/api/roles/${id}`, roleData);
  return response.data;
};

export const deleteRole = async (id) => {
  const response = await axios.delete(`/api/roles/${id}`);
  return response.data;
};

export const getPermissions = async () => {
  console.log('📡 Service: Calling GET /api/permissions');
  const response = await axios.get('/api/permissions');
  console.log('✅ Service: Received permissions response:', response.data);
  return response.data;
};

export const assignPermissionsToRole = async (id, permissions) => {
  const response = await axios.post(`/api/roles/${id}/permissions`, { permissions });
  return response.data;
};

export const syncRolePermissions = async (id, permissions) => {
  const response = await axios.put(`/api/roles/${id}/permissions`, { permissions });
  return response.data;
};

export const getRoleStats = async () => {
  const response = await axios.get('/api/roles/stats');
  return response.data;
};

export const getRoleUsers = async (id) => {
  const response = await axios.get(`/api/roles/${id}/users`);
  return response.data;
};
