import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchPerformance = createAsyncThunk(
  'performance/fetchPerformance',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/performance', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const performanceSlice = createSlice({
  name: 'performance',
  initialState: {
    list: [],
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPerformance.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPerformance.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data || action.payload;
      })
      .addCase(fetchPerformance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default performanceSlice.reducer;
