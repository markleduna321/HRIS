import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Head, usePage, router } from '@inertiajs/react';
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
} from '@headlessui/react';
import {
  UserIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  Cog6ToothIcon,
  PencilIcon,
  LightBulbIcon,
  CameraIcon,
  TrashIcon,
  EyeIcon,
} from '@heroicons/react/24/outline';
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
import PersonalInfoSection from './_sections/PersonalInfoSection';
import ExperiencesSection from './_sections/ExperiencesSection';
import DocumentsSection from './_sections/DocumentsSection';
import CustomizationSection from './_sections/CustomizationSection';
import PersonalInfoEditSection from './_sections/PersonalInfoEditSection';

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

  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    dispatch(initializeProfile({
      user: auth.user,
      userInformation: profileUser?.user_information,
    }));
  }, [dispatch, auth.user, profileUser]);

  const tabs = [
    { id: 'personal', name: 'Personal Info', icon: UserIcon },
    { id: 'experiences', name: 'Experiences', icon: BriefcaseIcon },
    { id: 'documents', name: 'Documents', icon: DocumentTextIcon },
    { id: 'customization', name: 'Customization', icon: Cog6ToothIcon },
  ];

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

  // Calculate profile completion rate
  const calculateCompletionRate = () => {
    const fields = [
      formData.first_name,
      formData.last_name,
      formData.email,
      formData.phone,
      formData.date_of_birth,
      formData.gender,
      formData.civil_status,
      formData.nationality,
      formData.address,
      formData.city,
      formData.state,
      formData.country,
      formData.emergency_contact_name,
      formData.emergency_contact_phone,
      formData.sss_number,
      formData.philhealth_number,
      formData.pagibig_number,
      formData.tin_number,
      profilePicture,
    ];
    
    const filledFields = fields.filter(field => field && field !== '').length;
    return Math.round((filledFields / fields.length) * 100);
  };

  const completionRate = calculateCompletionRate();
  const fullName = `${formData.first_name || ''} ${formData.middle_name || ''} ${formData.last_name || ''}`.trim() || 'User';
  const userRole = auth?.user?.roles?.[0]?.name || 'Job Applicant';

  const handleSaveProfile = async () => {
    const result = await dispatch(updateProfile(formData));
    if (updateProfile.fulfilled.match(result)) {
      showSuccess({ title: 'Success', content: 'Profile updated successfully!' });
      setIsEditing(false);
      router.reload({ only: ['user'] });
    } else if (result.payload?.errors) {
      showError({ title: 'Error', content: 'Please fix the validation errors.' });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handlePictureUpload(file);
      e.target.value = '';
    }
  };

  const handleDeletePicture = () => {
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

  return (
    <AppLayout>
      <Head title="My Profile" />

      <div className="pb-6">
        <div className="mx-auto max-w-7xl">
          {/* Profile Header Card */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            {/* Gradient Banner */}
            <div className="h-32 bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600"></div>
            
            {/* Profile Content */}
            <div className="px-6 pb-6">
              {/* Profile Picture & Basic Info */}
              <div className="flex items-start justify-between -mt-16 mb-4">
                <div className="flex items-end gap-4">
                  {/* Profile Picture with Dropdown */}
                  <Menu as="div" className="relative flex-shrink-0">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                    <MenuButton className="h-32 w-32 rounded-full border-4 border-white shadow-lg cursor-pointer relative overflow-hidden group">
                      {profilePicture ? (
                        <>
                          <img
                            src={`/storage/${profilePicture}`}
                            alt="Profile"
                            className="h-full w-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-xs font-medium">
                              Click to edit
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="h-full w-full bg-gray-200 flex items-center justify-center group-hover:bg-gray-300 transition-colors">
                          <UserIcon className="h-16 w-16 text-gray-400 group-hover:text-gray-500" />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white text-xs font-medium">
                              Click to add
                            </div>
                          </div>
                        </div>
                      )}
                    </MenuButton>
                    
                    <MenuItems
                      transition
                      className="absolute left-0 top-full mt-2 w-48 origin-top-left rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in z-50"
                    >
                      <MenuItem>
                        <button
                          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                          className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100"
                        >
                          <EyeIcon className="h-4 w-4" />
                          View Profile
                        </button>
                      </MenuItem>
                      <MenuItem>
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100"
                        >
                          <CameraIcon className="h-4 w-4" />
                          Change Picture
                        </button>
                      </MenuItem>
                      {profilePicture && (
                        <MenuItem>
                          <button
                            onClick={handleDeletePicture}
                            className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 data-[focus]:bg-red-50"
                          >
                            <TrashIcon className="h-4 w-4" />
                            Delete Picture
                          </button>
                        </MenuItem>
                      )}
                    </MenuItems>
                  </Menu>
                  
                  {/* Name and Email */}
                  <div className="pb-2">
                    <h1 className="text-xl font-semibold text-gray-900">{fullName}</h1>
                    <div className="flex items-center gap-2 text-gray-600 text-sm mt-1">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>{formData.email || 'admin@gmail.com'}</span>
                    </div>
                  </div>
                </div>

                {/* Edit Profile Button */}
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="mt-2 flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  <PencilIcon className="h-4 w-4" />
                  {isEditing ? 'View Profile' : 'Edit Profile'}
                </button>
              </div>

              {/* Completion Alert */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <svg className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">Complete Your Profile</h3>
                    <p className="text-sm text-gray-700 mb-3">
                      Fill in your First Name, Last Name, Email, Contact Number, and upload your Resume to complete your profile.
                    </p>
                    
                    {/* Progress Bar */}
                    <div className="mb-2">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-yellow-500 transition-all duration-500"
                          style={{ width: `${completionRate}%` }}
                        ></div>
                      </div>
                      <div className="text-right mt-1">
                        <span className="text-sm font-semibold text-gray-700">{completionRate}%</span>
                      </div>
                    </div>

                    {/* Tip */}
                    <div className="flex items-start gap-2 text-sm text-gray-600 italic">
                      <LightBulbIcon className="h-4 w-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                      <span>Tip: Completing your profile to 100% increases your chances of getting hired!</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 bg-white rounded-t-lg">
            <nav className="flex -mb-px" aria-label="Tabs">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors
                      ${
                        activeTab === tab.id
                          ? 'border-indigo-500 text-indigo-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }
                    `}
                  >
                    <Icon className="h-5 w-5" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="bg-white rounded-b-lg shadow">
            {activeTab === 'personal' && (
              isEditing ? (
                <PersonalInfoEditSection
                  formData={formData}
                  errors={errors}
                  loading={loading}
                  onFieldChange={handleFieldChange}
                  onSave={handleSaveProfile}
                  onCancel={() => setIsEditing(false)}
                />
              ) : (
                <PersonalInfoSection
                  formData={formData}
                  errors={errors}
                  loading={loading}
                />
              )
            )}

            {activeTab === 'experiences' && (
              <ExperiencesSection />
            )}

            {activeTab === 'documents' && (
              <DocumentsSection
                resumePath={resumePath}
                uploadingResume={uploadingResume}
                onUploadResume={handleResumeUpload}
                onDeleteResume={handleResumeDelete}
              />
            )}

            {activeTab === 'customization' && (
              <CustomizationSection />
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
