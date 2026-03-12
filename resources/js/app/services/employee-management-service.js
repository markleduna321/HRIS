import axios from 'axios';

/**
 * Employee Management Service
 * Handles all employee-related API calls
 */
export const getEmployees = async (params = {}) => {
  console.log('📡 Service: Calling GET /api/employees with params:', params);
  const response = await axios.get('/api/employees', { params });
  console.log('✅ Service: Received response:', response.data);
  return response.data;
};

export const getEmployeeById = async (id) => {
  const response = await axios.get(`/api/employees/${id}`);
  return response.data;
};

export const createEmployee = async (employeeData) => {
  const response = await axios.post('/api/employees', employeeData);
  return response.data;
};

export const updateEmployee = async (id, employeeData) => {
  const response = await axios.put(`/api/employees/${id}`, employeeData);
  return response.data;
};

export const deleteEmployee = async (id) => {
  const response = await axios.delete(`/api/employees/${id}`);
  return response.data;
};

export const getDepartments = async () => {
  console.log('📡 Service: Calling GET /api/departments');
  const response = await axios.get('/api/departments');
  console.log('✅ Service: Received departments response:', response.data);
  return response.data;
};

export const getDepartmentById = async (id) => {
  console.log('📡 Service: Calling GET /api/departments/' + id);
  const response = await axios.get(`/api/departments/${id}`);
  console.log('✅ Service: Received department response:', response.data);
  return response.data;
};

export const createDepartment = async (departmentData) => {
  console.log('📡 Service: Calling POST /api/departments with data:', departmentData);
  const response = await axios.post('/api/departments', departmentData);
  console.log('✅ Service: Created department:', response.data);
  return response.data;
};

export const updateDepartment = async (id, departmentData) => {
  console.log('📡 Service: Calling PUT /api/departments/' + id, 'with data:', departmentData);
  const response = await axios.put(`/api/departments/${id}`, departmentData);
  console.log('✅ Service: Updated department:', response.data);
  return response.data;
};

export const deleteDepartment = async (id) => {
  console.log('📡 Service: Calling DELETE /api/departments/' + id);
  const response = await axios.delete(`/api/departments/${id}`);
  console.log('✅ Service: Deleted department');
  return response.data;
};

export const searchEmployees = async (query) => {
  const response = await axios.get('/api/employees/search', { params: { q: query } });
  return response.data;
};

export const getEmployeeStats = async () => {
  const response = await axios.get('/api/employees/stats');
  return response.data;
};

export const updateEmployeeStatus = async (id, status) => {
  const response = await axios.patch(`/api/employees/${id}/status`, { status });
  return response.data;
};

export const getEmployeeAttendance = async (id, params = {}) => {
  const response = await axios.get(`/api/employees/${id}/attendance`, { params });
  return response.data;
};

export const getEmployeeLeaves = async (id, params = {}) => {
  const response = await axios.get(`/api/employees/${id}/leaves`, { params });
  return response.data;
};

export const getEmployeePayroll = async (id, params = {}) => {
  const response = await axios.get(`/api/employees/${id}/payroll`, { params });
  return response.data;
};

export const getEmployeePerformance = async (id, params = {}) => {
  const response = await axios.get(`/api/employees/${id}/performance`, { params });
  return response.data;
};

export const exportEmployees = async (params = {}) => {
  const response = await axios.get('/api/employees/export', { 
    params,
    responseType: 'blob' 
  });
  return response.data;
};

export const importEmployees = async (formData) => {
  const response = await axios.post('/api/employees/import', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};
