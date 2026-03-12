import { createSlice } from '@reduxjs/toolkit';
import { fetchRoles, createRole, updateRole, deleteRole, fetchPermissions } from './roles-thunk';

// Slice
const rolesSlice = createSlice({
  name: 'roles',
  initialState: {
    roles: [],
    permissions: [],
    loading: false,
    error: null,
    currentRole: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentRole: (state, action) => {
      state.currentRole = action.payload;
    },
    clearCurrentRole: (state) => {
      state.currentRole = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch roles
      .addCase(fetchRoles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRoles.fulfilled, (state, action) => {
        console.log('📦 Slice: fetchRoles.fulfilled - Received payload:', action.payload);
        state.loading = false;
        state.roles = action.payload;
        console.log('📦 Slice: Set roles array:', state.roles);
      })
      .addCase(fetchRoles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create role
      .addCase(createRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRole.fulfilled, (state, action) => {
        state.loading = false;
        state.roles.push(action.payload);
      })
      .addCase(createRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update role
      .addCase(updateRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRole.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.roles.findIndex(r => r.id === action.payload.id);
        if (index !== -1) {
          state.roles[index] = action.payload;
        }
      })
      .addCase(updateRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete role
      .addCase(deleteRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.loading = false;
        state.roles = state.roles.filter(r => r.id !== action.payload);
      })
      .addCase(deleteRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch permissions
      .addCase(fetchPermissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPermissions.fulfilled, (state, action) => {
        console.log('📦 Slice: fetchPermissions.fulfilled - Received payload:', action.payload);
        state.loading = false;
        state.permissions = action.payload;
        console.log('📦 Slice: Set permissions array:', state.permissions);
      })
      .addCase(fetchPermissions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setCurrentRole, clearCurrentRole } = rolesSlice.actions;
export default rolesSlice.reducer;
