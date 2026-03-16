import { createAsyncThunk } from '@reduxjs/toolkit';
import * as jobPostingService from '@/app/services/job-posting-service';
import * as jobApplicationService from '@/app/services/job-application-service';
import axios from 'axios';

export const fetchJobBoardPostings = createAsyncThunk(
  'jobBoard/fetchPostings',
  async (_, { rejectWithValue }) => {
    try {
      const data = await jobPostingService.fetchJobPostings();
      // Filter to only show open jobs visible to applicants
      return data.filter(job =>
        job.status === 'open' &&
        (job.target_audience === 'both' || job.target_audience === 'applicants' || !job.target_audience)
      );
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchUserApplications = createAsyncThunk(
  'jobBoard/fetchUserApplications',
  async (_, { rejectWithValue }) => {
    try {
      const data = await jobApplicationService.fetchJobApplications({ mine: 1 });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'jobBoard/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/user/profile');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const submitJobApplication = createAsyncThunk(
  'jobBoard/submitApplication',
  async (formData, { rejectWithValue }) => {
    try {
      return await jobApplicationService.createJobApplication(formData);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

export const submitQuickSetup = createAsyncThunk(
  'jobBoard/quickSetup',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/user/profile/quick-setup', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
