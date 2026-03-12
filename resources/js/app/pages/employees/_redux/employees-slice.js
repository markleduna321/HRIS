import { createSlice } from '@reduxjs/toolkit';
import { 
  fetchEmployees, 
  fetchEmployee, 
  createEmployee, 
  updateEmployee, 
  deleteEmployee, 
  fetchDepartments 
} from './employees-thunk';

// Slice
const employeesSlice = createSlice({
  name: 'employees',
  initialState: {
    employees: [],
    departments: [],
    loading: false,
    error: null,
    currentEmployee: null,
    pagination: {
      total: 0,
      per_page: 10,
      current_page: 1,
      last_page: 1,
    },
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentEmployee: (state, action) => {
      state.currentEmployee = action.payload;
    },
    clearCurrentEmployee: (state) => {
      state.currentEmployee = null;
    },
    setFilters: (state, action) => {
      state.filters = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch employees
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        console.log('📦 Slice: fetchEmployees.fulfilled - Received payload:', action.payload);
        state.loading = false;
        // Laravel pagination returns { data: [...], current_page, total, etc. }
        state.employees = action.payload.data || action.payload;
        console.log('📦 Slice: Set employees array:', state.employees);
        // Extract pagination from Laravel response
        if (action.payload.total !== undefined) {
          state.pagination = {
            total: action.payload.total,
            per_page: action.payload.per_page,
            current_page: action.payload.current_page,
            last_page: action.payload.last_page,
          };
        }
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch single employee
      .addCase(fetchEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.currentEmployee = action.payload;
      })
      .addCase(fetchEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create employee
      .addCase(createEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.employees.push(action.payload);
      })
      .addCase(createEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update employee
      .addCase(updateEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.employees.findIndex(e => e.id === action.payload.id);
        if (index !== -1) {
          state.employees[index] = action.payload;
        }
        if (state.currentEmployee?.id === action.payload.id) {
          state.currentEmployee = action.payload;
        }
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete employee
      .addCase(deleteEmployee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.employees = state.employees.filter(e => e.id !== action.payload);
        if (state.currentEmployee?.id === action.payload) {
          state.currentEmployee = null;
        }
      })
      .addCase(deleteEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
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
      });
  },
});

export const { clearError, setCurrentEmployee, clearCurrentEmployee, setFilters } = employeesSlice.actions;
export default employeesSlice.reducer;
