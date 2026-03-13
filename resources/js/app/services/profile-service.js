import axios from 'axios';

export const updateProfile = async (data) => {
  const response = await axios.put('/api/profile', data);
  return response.data;
};

export const uploadProfilePicture = async (formData) => {
  const response = await axios.post('/api/profile/picture', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const deleteProfilePicture = async () => {
  const response = await axios.delete('/api/profile/picture');
  return response.data;
};

export const uploadResume = async (formData) => {
  const response = await axios.post('/api/profile/resume', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const deleteResume = async () => {
  const response = await axios.delete('/api/profile/resume');
  return response.data;
};
