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
      middle_name: '',
      last_name: '',
      suffix: '',
      email: '',
      phone: '',
      date_of_birth: '',
      gender: '',
      civil_status: '',
      nationality: '',
      address: '',
      barangay: '',
      city: '',
      state: '',
      zip_code: '',
      country: '',
      emergency_contact_name: '',
      emergency_contact_phone: '',
      emergency_contact_relationship: '',
      sss_number: '',
      philhealth_number: '',
      pagibig_number: '',
      tin_number: '',
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
        first_name: userInformation?.first_name || user?.first_name || '',
        middle_name: userInformation?.middle_name || '',
        last_name: userInformation?.last_name || user?.last_name || '',
        suffix: userInformation?.suffix || '',
        email: userInformation?.email || user?.email || '',
        phone: userInformation?.phone || '',
        date_of_birth: userInformation?.date_of_birth || '',
        gender: userInformation?.gender || '',
        civil_status: userInformation?.civil_status || '',
        nationality: userInformation?.nationality || '',
        address: userInformation?.address || '',
        barangay: userInformation?.barangay || '',
        city: userInformation?.city || '',
        state: userInformation?.state || '',
        zip_code: userInformation?.zip_code || '',
        country: userInformation?.country || '',
        emergency_contact_name: userInformation?.emergency_contact_name || '',
        emergency_contact_phone: userInformation?.emergency_contact_phone || '',
        emergency_contact_relationship: userInformation?.emergency_contact_relationship || '',
        sss_number: userInformation?.sss_number || '',
        philhealth_number: userInformation?.philhealth_number || '',
        pagibig_number: userInformation?.pagibig_number || '',
        tin_number: userInformation?.tin_number || '',
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
