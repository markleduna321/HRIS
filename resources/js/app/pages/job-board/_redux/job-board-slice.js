import { createSlice } from '@reduxjs/toolkit';
import * as thunks from './job-board-thunk';

const initialState = {
  jobs: [],
  user: null,
  selectedJob: null,
  appliedJobIds: [],
  loading: false,
  error: null,
  filters: {
    search: '',
    status: 'open',
  },
};

const jobBoardSlice = createSlice({
  name: 'jobBoard',
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
    setSelectedJob: (state, action) => {
      state.selectedJob = action.payload;
    },
    clearSelectedJob: (state) => {
      state.selectedJob = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch job board postings
    builder
      .addCase(thunks.fetchJobBoardPostings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(thunks.fetchJobBoardPostings.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload;
      })
      .addCase(thunks.fetchJobBoardPostings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch current user
    builder
      .addCase(thunks.fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload;
      });

    // Fetch user applications
    builder
      .addCase(thunks.fetchUserApplications.fulfilled, (state, action) => {
        state.appliedJobIds = action.payload.map((app) => app.job_posting_id);
      });

    // Submit application
    builder
      .addCase(thunks.submitJobApplication.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(thunks.submitJobApplication.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload?.job_posting_id) {
          state.appliedJobIds.push(action.payload.job_posting_id);
        }
      })
      .addCase(thunks.submitJobApplication.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Quick setup
    builder
      .addCase(thunks.submitQuickSetup.fulfilled, (state, action) => {
        if (action.payload?.user) {
          state.user = action.payload.user;
        }
      });
  },
});

export const { setFilters, clearFilters, clearError, setSelectedJob, clearSelectedJob, setUser } = jobBoardSlice.actions;
export default jobBoardSlice.reducer;
