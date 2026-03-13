import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Head, usePage, router } from '@inertiajs/react';
import AppLayout from '../layout';
import { showSuccess, showError, showDeleteConfirm } from '@/app/components';
import {
  initializeProfile,
  setFormField,
  updateProfile,
  uploadProfilePicture,
  deleteProfilePicture,
  uploadResume,
  deleteResume,
} from './_redux';
import ProfilePictureSection from './_sections/ProfilePictureSection';
import ResumeSection from './_sections/ResumeSection';
import PersonalInfoSection from './_sections/PersonalInfoSection';

export default function Profile() {
  const dispatch = useDispatch();
  const { auth, user: profileUser } = usePage().props;
  const {
    formData,
    profilePicture,
    resumePath,
    loading,
    uploadingPicture,
    uploadingResume,
    errors,
  } = useSelector((state) => state.profilePage);

  useEffect(() => {
    dispatch(initializeProfile({
      user: auth.user,
      userInformation: profileUser?.user_information,
    }));
  }, [dispatch, auth.user, profileUser]);

  const handleFieldChange = (name, value) => {
    dispatch(setFormField({ name, value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(updateProfile(formData));
    if (updateProfile.fulfilled.match(result)) {
      showSuccess({ title: 'Success', content: 'Profile updated successfully!' });
    } else if (result.payload?.errors) {
      showError({ title: 'Error', content: 'Please fix the validation errors.' });
    }
  };

  const handlePictureUpload = async (file) => {
    if (file.size > 2 * 1024 * 1024) {
      showError({ title: 'Error', content: 'File size must be less than 2MB' });
      return;
    }
    if (!file.type.startsWith('image/')) {
      showError({ title: 'Error', content: 'File must be an image' });
      return;
    }
    const data = new FormData();
    data.append('profile_picture', file);
    const result = await dispatch(uploadProfilePicture(data));
    if (uploadProfilePicture.fulfilled.match(result)) {
      showSuccess({ title: 'Success', content: 'Profile picture uploaded successfully!' });
      router.reload({ only: ['auth'] });
    } else {
      showError({ title: 'Error', content: 'Failed to upload profile picture' });
    }
  };

  const handlePictureDelete = () => {
    showDeleteConfirm({
      title: 'Delete Profile Picture',
      content: 'Are you sure you want to delete your profile picture?',
      onOk: async () => {
        const result = await dispatch(deleteProfilePicture());
        if (deleteProfilePicture.fulfilled.match(result)) {
          showSuccess({ title: 'Success', content: 'Profile picture deleted successfully!' });
          router.reload({ only: ['auth'] });
        } else {
          showError({ title: 'Error', content: 'Failed to delete profile picture' });
        }
      },
    });
  };

  const handleResumeUpload = async (file) => {
    if (file.size > 2 * 1024 * 1024) {
      showError({ title: 'Error', content: 'File size must be less than 2MB' });
      return;
    }
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      showError({ title: 'Error', content: 'File must be PDF, DOC, or DOCX' });
      return;
    }
    const data = new FormData();
    data.append('resume', file);
    const result = await dispatch(uploadResume(data));
    if (uploadResume.fulfilled.match(result)) {
      showSuccess({ title: 'Success', content: 'Resume uploaded successfully!' });
    } else {
      showError({ title: 'Error', content: 'Failed to upload resume' });
    }
  };

  const handleResumeDelete = () => {
    showDeleteConfirm({
      title: 'Delete Resume',
      content: 'Are you sure you want to delete your resume?',
      onOk: async () => {
        const result = await dispatch(deleteResume());
        if (deleteResume.fulfilled.match(result)) {
          showSuccess({ title: 'Success', content: 'Resume deleted successfully!' });
        } else {
          showError({ title: 'Error', content: 'Failed to delete resume' });
        }
      },
    });
  };

  return (
    <AppLayout>
      <Head title="My Profile" />

      <div className="py-6">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-2xl font-semibold text-gray-900">My Profile</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage your personal information, profile picture, and resume
            </p>
          </div>

          <div className="space-y-6">
            <ProfilePictureSection
              profilePicture={profilePicture}
              uploadingPicture={uploadingPicture}
              onUpload={handlePictureUpload}
              onDelete={handlePictureDelete}
            />

            <ResumeSection
              resumePath={resumePath}
              uploadingResume={uploadingResume}
              onUpload={handleResumeUpload}
              onDelete={handleResumeDelete}
            />

            <PersonalInfoSection
              formData={formData}
              errors={errors}
              loading={loading}
              onFieldChange={handleFieldChange}
              onSubmit={handleSubmit}
            />
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
