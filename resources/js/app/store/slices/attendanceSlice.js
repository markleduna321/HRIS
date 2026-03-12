import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchAttendance = createAsyncThunk(
  'attendance/fetchAttendance',
  async (params, { rejectWithValue }) => {
    try {
      const response = await api.get('/attendance', { params });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const checkIn = createAsyncThunk(
  'attendance/checkIn',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post('/attendance/check-in');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

export const checkOut = createAsyncThunk(
  'attendance/checkOut',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post('/attendance/check-out');
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data);
    }
  }
);

const attendanceSlice = createSlice({
  name: 'attendance',
  initialState: {
    list: [],
    todayAttendance: null,
    loading: false,
    error: null,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAttendance.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload.data || action.payload;
      })
      .addCase(fetchAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(checkIn.fulfilled, (state, action) => {
        state.todayAttendance = action.payload;
      })
      .addCase(checkOut.fulfilled, (state, action) => {
        state.todayAttendance = action.payload;
      });
  },
});

export default attendanceSlice.reducer;
