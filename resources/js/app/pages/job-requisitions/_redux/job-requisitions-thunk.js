import { createAsyncThunk } from '@reduxjs/toolkit';
import * as jobRequisitionService from '@/app/services/job-requisition-service';
import axios from 'axios';

// Fetch all job requisitions with filters
export const fetchJobRequisitions = createAsyncThunk(
  'jobRequisitions/fetchAll',
  async (filters, { rejectWithValue }) => {
    try {
      const data = await jobRequisitionService.fetchJobRequisitions(filters);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch statistics
export const fetchStatistics = createAsyncThunk(
  'jobRequisitions/fetchStatistics',
  async (_, { rejectWithValue }) => {
    try {
      const data = await jobRequisitionService.fetchJobRequisitionStatistics();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch single job requisition
export const fetchJobRequisition = createAsyncThunk(
  'jobRequisitions/fetchOne',
  async (id, { rejectWithValue }) => {
    try {
      const data = await jobRequisitionService.fetchJobRequisition(id);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Create job requisition
export const createJobRequisition = createAsyncThunk(
  'jobRequisitions/create',
  async (formData, { rejectWithValue }) => {
    try {
      const data = await jobRequisitionService.createJobRequisition(formData);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Update job requisition
export const updateJobRequisition = createAsyncThunk(
  'jobRequisitions/update',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const result = await jobRequisitionService.updateJobRequisition(id, data);
      return result;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Delete job requisition
export const deleteJobRequisition = createAsyncThunk(
  'jobRequisitions/delete',
  async (id, { rejectWithValue }) => {
    try {
      await jobRequisitionService.deleteJobRequisition(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Approve job requisition
export const approveJobRequisition = createAsyncThunk(
  'jobRequisitions/approve',
  async (id, { rejectWithValue }) => {
    try {
      const data = await jobRequisitionService.approveJobRequisition(id);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Reject job requisition
export const rejectJobRequisition = createAsyncThunk(
  'jobRequisitions/reject',
  async ({ id, reason }, { rejectWithValue }) => {
    try {
      const data = await jobRequisitionService.rejectJobRequisition(id, reason);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Mark as in progress
export const markInProgress = createAsyncThunk(
  'jobRequisitions/markInProgress',
  async (id, { rejectWithValue }) => {
    try {
      const data = await jobRequisitionService.markInProgress(id);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Cancel job requisition
export const cancelJobRequisition = createAsyncThunk(
  'jobRequisitions/cancel',
  async (id, { rejectWithValue }) => {
    try {
      const data = await jobRequisitionService.cancelJobRequisition(id);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Mark as viewed
export const markAsViewed = createAsyncThunk(
  'jobRequisitions/markAsViewed',
  async (id, { rejectWithValue }) => {
    try {
      const data = await jobRequisitionService.markAsViewed(id);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch departments
export const fetchDepartments = createAsyncThunk(
  'jobRequisitions/fetchDepartments',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/api/departments');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

// Fetch existing positions
export const fetchExistingPositions = createAsyncThunk(
  'jobRequisitions/fetchExistingPositions',
  async (_, { rejectWithValue }) => {
    try {
      const data = await jobRequisitionService.fetchExistingPositions();
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);
