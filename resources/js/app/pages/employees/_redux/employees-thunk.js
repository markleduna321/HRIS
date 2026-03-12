import { createAsyncThunk } from '@reduxjs/toolkit';
import * as employeeService from '@/app/services/employee-management-service';

// Async thunks for employees
export const fetchEmployees = createAsyncThunk(
  'employees/fetchEmployees',
  async (params, { rejectWithValue }) => {
    try {
      console.log('⚡ Thunk: fetchEmployees called with params:', params);
      const result = await employeeService.getEmployees(params);
      console.log('⚡ Thunk: fetchEmployees returning:', result);
      return result;
    } catch (error) {
      console.error('❌ Thunk: fetchEmployees error:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchEmployee = createAsyncThunk(
  'employees/fetchEmployee',
  async (id, { rejectWithValue }) => {
    try {
      return await employeeService.getEmployeeById(id);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createEmployee = createAsyncThunk(
  'employees/createEmployee',
  async (employeeData, { rejectWithValue }) => {
    try {
      return await employeeService.createEmployee(employeeData);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateEmployee = createAsyncThunk(
  'employees/updateEmployee',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await employeeService.updateEmployee(id, data);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteEmployee = createAsyncThunk(
  'employees/deleteEmployee',
  async (id, { rejectWithValue }) => {
    try {
      await employeeService.deleteEmployee(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchDepartments = createAsyncThunk(
  'employees/fetchDepartments',
  async (_, { rejectWithValue }) => {
    try {
      console.log('⚡ Thunk: fetchDepartments called');
      const result = await employeeService.getDepartments();
      console.log('⚡ Thunk: fetchDepartments returning:', result);
      return result;
    } catch (error) {
      console.error('❌ Thunk: fetchDepartments error:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
