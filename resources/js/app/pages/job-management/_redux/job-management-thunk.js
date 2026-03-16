import { createAsyncThunk } from '@reduxjs/toolkit';
import * as jobPostingService from '@/app/services/job-posting-service';
import * as jobApplicationService from '@/app/services/job-application-service';

export const fetchJobPostings = createAsyncThunk(
  'jobManagement/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      return await jobPostingService.fetchJobPostings(params);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const createJobPosting = createAsyncThunk(
  'jobManagement/create',
  async (data, { rejectWithValue }) => {
    try {
      return await jobPostingService.createJobPosting(data);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateJobPosting = createAsyncThunk(
  'jobManagement/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await jobPostingService.updateJobPosting(id, data);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const deleteJobPosting = createAsyncThunk(
  'jobManagement/delete',
  async (id, { rejectWithValue }) => {
    try {
      await jobPostingService.deleteJobPosting(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchJobApplications = createAsyncThunk(
  'jobManagement/fetchApplications',
  async (params, { rejectWithValue }) => {
    try {
      return await jobApplicationService.fetchJobApplications(params);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const updateJobApplication = createAsyncThunk(
  'jobManagement/updateApplication',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      return await jobApplicationService.updateJobApplication(id, data);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
