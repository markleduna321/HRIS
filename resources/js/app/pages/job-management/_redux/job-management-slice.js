import { createSlice } from '@reduxjs/toolkit';
import * as thunks from './job-management-thunk';

const initialState = {
  jobPostings: [],
  applications: [],
  currentJob: null,
  loading: false,
  error: null,
  filters: {
    status: '',
    search: '',
  },
  activeTab: 'active-postings',
};

const jobManagementSlice = createSlice({
  name: 'jobManagement',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
    clearError: (state) => {
      state.error = null;
    },
    setCurrentJob: (state, action) => {
      state.currentJob = action.payload;
    },
    clearCurrentJob: (state) => {
      state.currentJob = null;
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch all job postings
    builder
      .addCase(thunks.fetchJobPostings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(thunks.fetchJobPostings.fulfilled, (state, action) => {
        state.loading = false;
        state.jobPostings = action.payload;
      })
      .addCase(thunks.fetchJobPostings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Create job posting
    builder
      .addCase(thunks.createJobPosting.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(thunks.createJobPosting.fulfilled, (state, action) => {
        state.loading = false;
        state.jobPostings.unshift(action.payload);
      })
      .addCase(thunks.createJobPosting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update job posting
    builder
      .addCase(thunks.updateJobPosting.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(thunks.updateJobPosting.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.jobPostings.findIndex((j) => j.id === action.payload.id);
        if (index !== -1) {
          state.jobPostings[index] = action.payload;
        }
        if (state.currentJob?.id === action.payload.id) {
          state.currentJob = action.payload;
        }
      })
      .addCase(thunks.updateJobPosting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete job posting
    builder
      .addCase(thunks.deleteJobPosting.fulfilled, (state, action) => {
        state.jobPostings = state.jobPostings.filter((j) => j.id !== action.payload);
      });

    // Fetch applications
    builder
      .addCase(thunks.fetchJobApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(thunks.fetchJobApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = action.payload;
      })
      .addCase(thunks.fetchJobApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update application
    builder
      .addCase(thunks.updateJobApplication.fulfilled, (state, action) => {
        const index = state.applications.findIndex((a) => a.id === action.payload.id);
        if (index !== -1) {
          state.applications[index] = action.payload;
        }
      });
  },
});

export const { setFilters, clearFilters, clearError, setCurrentJob, clearCurrentJob, setActiveTab } = jobManagementSlice.actions;
export default jobManagementSlice.reducer;
