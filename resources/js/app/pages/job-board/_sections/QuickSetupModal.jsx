import { Modal, Button, Input } from '@/app/components';
import { useState, useEffect } from 'react';
import { showSuccess, showError } from '@/app/components';
import axios from 'axios';

export default function QuickSetupModal({ isOpen, onClose, onComplete, user }) {
  const hasPhone = !!user?.user_information?.phone;
  const hasResume = !!user?.user_information?.resume_path;

  const [formData, setFormData] = useState({
    phone: user?.user_information?.phone || '',
  });
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setFormData({ phone: user?.user_information?.phone || '' });
      setResume(null);
      setErrors({});
    }
  }, [isOpen, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, resume: 'File size must be less than 5MB' }));
        return;
      }
      // Validate file type
      const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, resume: 'Only PDF, DOC, and DOCX files are allowed' }));
        return;
      }
      setResume(file);
      setErrors(prev => ({ ...prev, resume: undefined }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const submitData = new FormData();
      
      // Only send phone if it's missing
      if (!hasPhone && formData.phone) {
        submitData.append('phone', formData.phone);
      } else if (hasPhone) {
        submitData.append('phone', user.user_information.phone);
      }

      // Only send resume if it's missing
      if (!hasResume && resume) {
        submitData.append('resume', resume);
      }

      // Submit to profile update endpoint
      await axios.post('/api/user/profile/quick-setup', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      showSuccess({
        title: 'Profile Updated',
        content: 'Your profile information has been updated successfully!',
      });

      onComplete({
        phone: formData.phone,
        resume: resume ? resume.name : null,
      });
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        showError({
          title: 'Error',
          content: 'Failed to update profile. Please try again.',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose} size="md" title="Complete Your Profile">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h4 className="text-sm font-medium text-blue-900">Quick Setup Required</h4>
              <p className="text-sm text-blue-700 mt-1">
                {!hasPhone && !hasResume
                  ? 'Please provide your phone number and upload your resume to enable Easy Apply.'
                  : !hasPhone
                  ? 'Please provide your phone number to enable Easy Apply.'
                  : 'Please upload your resume to enable Easy Apply.'}
              </p>
            </div>
          </div>
        </div>

        {!hasPhone && (
          <Input
            label="Phone Number"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="+63 XXX XXX XXXX"
            required
            error={errors.phone?.[0]}
          />
        )}

        {!hasResume && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Resume/CV <span className="text-red-500">*</span>
            </label>
            <div className="mt-1">
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-8 h-8 mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  {resume ? (
                    <div className="text-center">
                      <p className="text-sm text-gray-700 font-medium">{resume.name}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {(resume.size / 1024).toFixed(2)} KB
                      </p>
                    </div>
                  ) : (
                    <>
                      <p className="mb-1 text-sm text-gray-600">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">PDF, DOC, DOCX (Max 5MB)</p>
                    </>
                  )}
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  required
                />
              </label>
            </div>
            {errors.resume && (
              <p className="mt-1 text-sm text-red-600">{errors.resume}</p>
            )}
          </div>
        )}

        <div className="flex gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            loading={loading}
            className="flex-1"
          >
            Save & Continue
          </Button>
        </div>
      </form>
    </Modal>
  );
}
