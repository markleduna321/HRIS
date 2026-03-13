import { createSlice } from '@reduxjs/toolkit';
import {
  updateProfile,
  uploadProfilePicture,
  deleteProfilePicture,
  uploadResume,
  deleteResume,
} from './profile-thunk';

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    formData: {
      first_name: '',
      last_name: '',
      email: '',
      phone: '',
      date_of_birth: '',
      gender: '',
      marital_status: '',
      nationality: '',
      current_address: '',
      permanent_address: '',
      bio: '',
      linkedin_url: '',
      portfolio_url: '',
    },
    profilePicture: null,
    resumePath: null,
    loading: false,
    uploadingPicture: false,
    uploadingResume: false,
    errors: {},
    error: null,
  },
  reducers: {
    initializeProfile: (state, action) => {
      const { user, userInformation } = action.payload;
      state.formData = {
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        phone: userInformation?.phone || '',
        date_of_birth: userInformation?.date_of_birth || '',
        gender: userInformation?.gender || '',
        marital_status: userInformation?.marital_status || '',
        nationality: userInformation?.nationality || '',
        current_address: userInformation?.current_address || '',
        permanent_address: userInformation?.permanent_address || '',
        bio: userInformation?.bio || '',
        linkedin_url: userInformation?.linkedin_url || '',
        portfolio_url: userInformation?.portfolio_url || '',
      };
      state.profilePicture = userInformation?.profile_picture || null;
      state.resumePath = userInformation?.resume_path || null;
      state.errors = {};
      state.error = null;
    },
    setFormField: (state, action) => {
      const { name, value } = action.payload;
      state.formData[name] = value;
      if (state.errors[name]) {
        delete state.errors[name];
      }
    },
    clearErrors: (state) => {
      state.errors = {};
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Update profile
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.errors = {};
      })
      .addCase(updateProfile.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        if (action.payload?.errors) {
          state.errors = action.payload.errors;
        } else {
          state.error = action.payload;
        }
      })
      // Upload profile picture
      .addCase(uploadProfilePicture.pending, (state) => {
        state.uploadingPicture = true;
      })
      .addCase(uploadProfilePicture.fulfilled, (state, action) => {
        state.uploadingPicture = false;
        state.profilePicture = action.payload.profile_picture;
      })
      .addCase(uploadProfilePicture.rejected, (state, action) => {
        state.uploadingPicture = false;
        state.error = action.payload;
      })
      // Delete profile picture
      .addCase(deleteProfilePicture.fulfilled, (state) => {
        state.profilePicture = null;
      })
      .addCase(deleteProfilePicture.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Upload resume
      .addCase(uploadResume.pending, (state) => {
        state.uploadingResume = true;
      })
      .addCase(uploadResume.fulfilled, (state, action) => {
        state.uploadingResume = false;
        state.resumePath = action.payload.resume_path;
      })
      .addCase(uploadResume.rejected, (state, action) => {
        state.uploadingResume = false;
        state.error = action.payload;
      })
      // Delete resume
      .addCase(deleteResume.fulfilled, (state) => {
        state.resumePath = null;
      })
      .addCase(deleteResume.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { initializeProfile, setFormField, clearErrors } = profileSlice.actions;
export default profileSlice.reducer;
