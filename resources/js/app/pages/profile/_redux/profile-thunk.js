import { createAsyncThunk } from '@reduxjs/toolkit';
import * as profileService from '@/app/services/profile-service';

export const updateProfile = createAsyncThunk(
  'profile/updateProfile',
  async (data, { rejectWithValue }) => {
    try {
      return await profileService.updateProfile(data);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const uploadProfilePicture = createAsyncThunk(
  'profile/uploadProfilePicture',
  async (formData, { rejectWithValue }) => {
    try {
      return await profileService.uploadProfilePicture(formData);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteProfilePicture = createAsyncThunk(
  'profile/deleteProfilePicture',
  async (_, { rejectWithValue }) => {
    try {
      return await profileService.deleteProfilePicture();
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const uploadResume = createAsyncThunk(
  'profile/uploadResume',
  async (formData, { rejectWithValue }) => {
    try {
      return await profileService.uploadResume(formData);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteResume = createAsyncThunk(
  'profile/deleteResume',
  async (_, { rejectWithValue }) => {
    try {
      return await profileService.deleteResume();
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
