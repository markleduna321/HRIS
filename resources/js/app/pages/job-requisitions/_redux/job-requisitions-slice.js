import { createSlice } from '@reduxjs/toolkit';
import * as thunks from './job-requisitions-thunk';

const initialState = {
  requisitions: [],
  statistics: {
    total: 0,
    pending: 0,
    approved: 0,
    in_progress: 0,
    filled: 0,
  },
  currentRequisition: null,
  departments: [],
  existingPositions: [],
  loading: false,
  error: null,
  filters: {
    status: '',
    priority: '',
    search: '',
  },
};

const jobRequisitionsSlice = createSlice({
  name: 'jobRequisitions',
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
    clearCurrentRequisition: (state) => {
      state.currentRequisition = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all requisitions
    builder
      .addCase(thunks.fetchJobRequisitions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(thunks.fetchJobRequisitions.fulfilled, (state, action) => {
        state.loading = false;
        state.requisitions = action.payload;
      })
      .addCase(thunks.fetchJobRequisitions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch statistics
    builder
      .addCase(thunks.fetchStatistics.fulfilled, (state, action) => {
        state.statistics = action.payload;
      });

    // Fetch single requisition
    builder
      .addCase(thunks.fetchJobRequisition.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(thunks.fetchJobRequisition.fulfilled, (state, action) => {
        state.loading = false;
        state.currentRequisition = action.payload;
      })
      .addCase(thunks.fetchJobRequisition.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Create requisition
    builder
      .addCase(thunks.createJobRequisition.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(thunks.createJobRequisition.fulfilled, (state, action) => {
        state.loading = false;
        state.requisitions.unshift(action.payload);
      })
      .addCase(thunks.createJobRequisition.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update requisition
    builder
      .addCase(thunks.updateJobRequisition.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(thunks.updateJobRequisition.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.requisitions.findIndex((r) => r.id === action.payload.id);
        if (index !== -1) {
          state.requisitions[index] = action.payload;
        }
        if (state.currentRequisition?.id === action.payload.id) {
          state.currentRequisition = action.payload;
        }
      })
      .addCase(thunks.updateJobRequisition.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete requisition
    builder
      .addCase(thunks.deleteJobRequisition.fulfilled, (state, action) => {
        state.requisitions = state.requisitions.filter((r) => r.id !== action.payload);
      });

    // Approve requisition
    builder
      .addCase(thunks.approveJobRequisition.fulfilled, (state, action) => {
        const index = state.requisitions.findIndex((r) => r.id === action.payload.id);
        if (index !== -1) {
          state.requisitions[index] = action.payload;
        }
      });

    // Reject requisition
    builder
      .addCase(thunks.rejectJobRequisition.fulfilled, (state, action) => {
        const index = state.requisitions.findIndex((r) => r.id === action.payload.id);
        if (index !== -1) {
          state.requisitions[index] = action.payload;
        }
      });

    // Mark in progress
    builder
      .addCase(thunks.markInProgress.fulfilled, (state, action) => {
        const index = state.requisitions.findIndex((r) => r.id === action.payload.id);
        if (index !== -1) {
          state.requisitions[index] = action.payload;
        }
      });

    // Cancel requisition
    builder
      .addCase(thunks.cancelJobRequisition.fulfilled, (state, action) => {
        const index = state.requisitions.findIndex((r) => r.id === action.payload.id);
        if (index !== -1) {
          state.requisitions[index] = action.payload;
        }
      });

    // Mark as viewed
    builder
      .addCase(thunks.markAsViewed.fulfilled, (state, action) => {
        const index = state.requisitions.findIndex((r) => r.id === action.payload.id);
        if (index !== -1) {
          state.requisitions[index] = action.payload;
        }
      });

    // Fetch departments
    builder
      .addCase(thunks.fetchDepartments.fulfilled, (state, action) => {
        state.departments = action.payload;
      });

    // Fetch existing positions
    builder
      .addCase(thunks.fetchExistingPositions.fulfilled, (state, action) => {
        state.existingPositions = action.payload;
      });
  },
});

export const { setFilters, clearFilters, clearError, clearCurrentRequisition } = jobRequisitionsSlice.actions;
export default jobRequisitionsSlice.reducer;
