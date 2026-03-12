import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchLeaves = createAsyncThunk(
  'leaves/fetchLeaves',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/leaves', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const createLeave = createAsyncThunk(
  'leaves/createLeave',
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post('/leaves', data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const approveLeave = createAsyncThunk(
  'leaves/approveLeave',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.post(`/leaves/${id}/approve`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const rejectLeave = createAsyncThunk(
  'leaves/rejectLeave',
  async ({ id, remarks }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/leaves/${id}/reject`, { remarks });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const leaveSlice = createSlice({
  name: 'leaves',
  initialState: {
    list: [],
    balances: {},
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeaves.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLeaves.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data || action.payload;
      })
      .addCase(fetchLeaves.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createLeave.fulfilled, (state, action) => {
        state.list.unshift(action.payload.leave);
      });
  },
});

export const { clearError } = leaveSlice.actions;
export default leaveSlice.reducer;
