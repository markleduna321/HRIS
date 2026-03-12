import { createAsyncThunk } from '@reduxjs/toolkit';
import * as roleService from '@/app/services/role-management-service';

// Async thunks for roles
export const fetchRoles = createAsyncThunk(
  'roles/fetchRoles',
  async (_, { rejectWithValue }) => {
    try {
      console.log('⚡ Thunk: fetchRoles called');
      const result = await roleService.getRoles();
      console.log('⚡ Thunk: fetchRoles returning:', result);
      return result;
    } catch (error) {
      console.error('❌ Thunk: fetchRoles error:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createRole = createAsyncThunk(
  'roles/createRole',
  async (roleData, { rejectWithValue }) => {
    try {
      return await roleService.createRole(roleData);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateRole = createAsyncThunk(
  'roles/updateRole',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await roleService.updateRole(id, data);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteRole = createAsyncThunk(
  'roles/deleteRole',
  async (id, { rejectWithValue }) => {
    try {
      await roleService.deleteRole(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchPermissions = createAsyncThunk(
  'roles/fetchPermissions',
  async (_, { rejectWithValue }) => {
    try {
      console.log('⚡ Thunk: fetchPermissions called');
      const result = await roleService.getPermissions();
      console.log('⚡ Thunk: fetchPermissions returning:', result);
      return result;
    } catch (error) {
      console.error('❌ Thunk: fetchPermissions error:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
