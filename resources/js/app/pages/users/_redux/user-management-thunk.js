import { createAsyncThunk } from '@reduxjs/toolkit';
import * as userService from '@/app/services/user-management-service';

// Async thunks for users
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      console.log('⚡ Thunk: fetchUsers called');
      const result = await userService.getUsers();
      console.log('⚡ Thunk: fetchUsers returning:', result);
      return result;
    } catch (error) {
      console.error('❌ Thunk: fetchUsers error:', error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createUser = createAsyncThunk(
  'users/createUser',
  async (userData, { rejectWithValue }) => {
    try {
      return await userService.createUser(userData);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await userService.updateUser(id, data);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteUser = createAsyncThunk(
  'users/deleteUser',
  async (id, { rejectWithValue }) => {
    try {
      await userService.deleteUser(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
