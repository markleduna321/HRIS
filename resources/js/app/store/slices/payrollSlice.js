import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchPayroll = createAsyncThunk(
  'payroll/fetchPayroll',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/payroll', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const generatePayroll = createAsyncThunk(
  'payroll/generatePayroll',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/payroll/generate', data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const payrollSlice = createSlice({
  name: 'payroll',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPayroll.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPayroll.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data || action.payload;
      })
      .addCase(fetchPayroll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default payrollSlice.reducer;
