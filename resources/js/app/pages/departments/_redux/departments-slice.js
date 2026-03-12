import { createSlice } from '@reduxjs/toolkit';
import { 
  fetchDepartments, 
  fetchDepartment, 
  createDepartment, 
  updateDepartment, 
  deleteDepartment 
} from './departments-thunk';

// Slice
const departmentsSlice = createSlice({
  name: 'departments',
  initialState: {
    departments: [],
    loading: false,
    error: null,
    currentDepartment: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentDepartment: (state, action) => {
      state.currentDepartment = action.payload;
    },
    clearCurrentDepartment: (state) => {
      state.currentDepartment = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch departments
      .addCase(fetchDepartments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDepartments.fulfilled, (state, action) => {
        console.log('📦 Slice: fetchDepartments.fulfilled - Received payload:', action.payload);
        state.loading = false;
        state.departments = action.payload;
        console.log('📦 Slice: Set departments array:', state.departments);
      })
      .addCase(fetchDepartments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch single department
      .addCase(fetchDepartment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDepartment.fulfilled, (state, action) => {
        state.loading = false;
        state.currentDepartment = action.payload;
      })
      .addCase(fetchDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create department
      .addCase(createDepartment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDepartment.fulfilled, (state, action) => {
        state.loading = false;
        state.departments.push(action.payload);
      })
      .addCase(createDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update department
      .addCase(updateDepartment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateDepartment.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.departments.findIndex(d => d.id === action.payload.id);
        if (index !== -1) {
          state.departments[index] = action.payload;
        }
        if (state.currentDepartment?.id === action.payload.id) {
          state.currentDepartment = action.payload;
        }
      })
      .addCase(updateDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete department
      .addCase(deleteDepartment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDepartment.fulfilled, (state, action) => {
        state.loading = false;
        state.departments = state.departments.filter(d => d.id !== action.payload);
        if (state.currentDepartment?.id === action.payload) {
          state.currentDepartment = null;
        }
      })
      .addCase(deleteDepartment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setCurrentDepartment, clearCurrentDepartment } = departmentsSlice.actions;
export default departmentsSlice.reducer;
