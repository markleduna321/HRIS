import { createAsyncThunk } from '@reduxjs/toolkit';
import * as departmentService from '@/app/services/employee-management-service';

// Async thunks for departments
export const fetchDepartments = createAsyncThunk(
  'departments/fetchDepartments',
  async (_, { rejectWithValue }) => {
    try {
      console.log('⚡ Thunk: fetchDepartments called');
      const result = await departmentService.getDepartments();
      console.log('⚡ Thunk: fetchDepartments returning:', result);
      return result;
    } catch (error) {
      console.error('❌ Thunk: fetchDepartments error:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchDepartment = createAsyncThunk(
  'departments/fetchDepartment',
  async (id, { rejectWithValue }) => {
    try {
      console.log('⚡ Thunk: fetchDepartment called with id:', id);
      const result = await departmentService.getDepartmentById(id);
      console.log('⚡ Thunk: fetchDepartment returning:', result);
      return result;
    } catch (error) {
      console.error('❌ Thunk: fetchDepartment error:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createDepartment = createAsyncThunk(
  'departments/createDepartment',
  async (departmentData, { rejectWithValue }) => {
    try {
      console.log('⚡ Thunk: createDepartment called with data:', departmentData);
      const result = await departmentService.createDepartment(departmentData);
      console.log('⚡ Thunk: createDepartment returning:', result);
      return result;
    } catch (error) {
      console.error('❌ Thunk: createDepartment error:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateDepartment = createAsyncThunk(
  'departments/updateDepartment',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      console.log('⚡ Thunk: updateDepartment called with id:', id, 'data:', data);
      const result = await departmentService.updateDepartment(id, data);
      console.log('⚡ Thunk: updateDepartment returning:', result);
      return result;
    } catch (error) {
      console.error('❌ Thunk: updateDepartment error:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteDepartment = createAsyncThunk(
  'departments/deleteDepartment',
  async (id, { rejectWithValue }) => {
    try {
      console.log('⚡ Thunk: deleteDepartment called with id:', id);
      await departmentService.deleteDepartment(id);
      console.log('⚡ Thunk: deleteDepartment success');
      return id;
    } catch (error) {
      console.error('❌ Thunk: deleteDepartment error:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
