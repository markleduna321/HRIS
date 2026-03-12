import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunks
export const fetchEmployees = createAsyncThunk(
  'employees/fetchEmployees',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/employees', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const fetchEmployee = createAsyncThunk(
  'employees/fetchEmployee',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/employees/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const createEmployee = createAsyncThunk(
  'employees/createEmployee',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/employees', data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const updateEmployee = createAsyncThunk(
  'employees/updateEmployee',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/employees/${id}`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const deleteEmployee = createAsyncThunk(
  'employees/deleteEmployee',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/employees/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const employeeSlice = createSlice({
  name: 'employees',
  initialState: {
    list: [],
    currentEmployee: null,
    pagination: {
      current_page: 1,
      last_page: 1,
      per_page: 15,
      total: 0,
    },
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentEmployee: (state) => {
      state.currentEmployee = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Employees
      .addCase(fetchEmployees.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEmployees.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data;
        state.pagination = {
          current_page: action.payload.current_page,
          last_page: action.payload.last_page,
          per_page: action.payload.per_page,
          total: action.payload.total,
        };
      })
      .addCase(fetchEmployees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Employee
      .addCase(fetchEmployee.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEmployee.fulfilled, (state, action) => {
        state.loading = false;
        state.currentEmployee = action.payload;
      })
      .addCase(fetchEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Employee
      .addCase(createEmployee.pending, (state) => {
        state.loading = true;
      })
      .addCase(createEmployee.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createEmployee.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Employee
      .addCase(updateEmployee.fulfilled, (state) => {
        state.loading = false;
      })
      // Delete Employee
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.list = state.list.filter(emp => emp.id !== action.payload);
      });
  },
});

export const { clearCurrentEmployee, clearError } = employeeSlice.actions;
export default employeeSlice.reducer;
