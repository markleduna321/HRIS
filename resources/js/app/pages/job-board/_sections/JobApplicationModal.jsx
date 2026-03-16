import React, { useState, useEffect } from 'react';
import { Modal, Button, showSuccess, showError, Input, TextArea } from '@/app/components';
import { CheckCircleIcon, DocumentTextIcon, BriefcaseIcon, MapPinIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { usePage } from '@inertiajs/react';

export default function JobApplicationModal({ isOpen, onClose, job, user, onSuccess }) {
  const [formData, setFormData] = useState({
    applicant_name: '',
    email: '',
    phone: '',
    cover_letter_text: '',
  });
  const [resume, setResume] = useState(null);
  const [uploadNewResume, setUploadNewResume] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [profileResume, setProfileResume] = useState(null);

  useEffect(() => {
    if (user && isOpen) {
      // Prefill user data
      const firstName = user.first_name || '';
      const lastName = user.last_name || '';
      const fullName = `${firstName} ${lastName}`.trim();
      
      setFormData({
        applicant_name: fullName,
        email: user.email || '',
        phone: user.user_information?.phone || '',
        cover_letter_text: '',
      });

      // Check if user has a profile resume
      if (user.user_information && user.user_information.resume_path) {
        setProfileResume({
          file_path: user.user_information.resume_path,
          file_name: 'Resume from profile'
        });
      }
    }
  }, [user, isOpen]);

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

  const formatSalary = (min, max) => {
    if (!min && !max) return 'Competitive';
    const formatNumber = (num) => `₱${parseFloat(num).toLocaleString('en-PH', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    if (!max) return `${formatNumber(min)}+`;
    return `${formatNumber(min)} - ${formatNumber(max)}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!job) return;
    
    setLoading(true);
    setErrors({});

    const submitData = new FormData();
    submitData.append('job_posting_id', job.id);
    submitData.append('applicant_name', formData.applicant_name);
    submitData.append('email', formData.email);
    submitData.append('phone', formData.phone);
    
    if (formData.cover_letter_text) {
      submitData.append('cover_letter_text', formData.cover_letter_text);
    }
    
    // Use uploaded resume or profile resume
    if (resume) {
      submitData.append('resume', resume);
    } else if (profileResume && !uploadNewResume) {
      submitData.append('use_profile_resume', 'true');
      submitData.append('profile_resume_path', profileResume.file_path);
    }

    try {
      await axios.post('/api/job-applications', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      showSuccess({
        title: 'Application Submitted!',
        content: 'Your application has been submitted successfully. We will review it and get back to you soon.',
      });

      // Reset form
      setFormData({
        applicant_name: `${user?.first_name} ${user?.last_name}`.trim(),
        email: user?.email || '',
        phone: user?.user_information?.phone || '',
        cover_letter_text: '',
      });
      setResume(null);
      setUploadNewResume(false);
      
      onClose();
      if (onSuccess) onSuccess();
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else if (error.response?.data?.message) {
        showError({
          title: 'Error',
          content: error.response.data.message,
        });
      } else {
        showError({
          title: 'Error',
          content: 'Failed to submit application. Please try again.',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  if (!job) return null;

  return (
    <Modal open={isOpen} onClose={onClose} size="lg" title="Apply for Position">
      <div className="text-sm text-gray-600 mb-4">{job.title}</div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Easy Apply Enabled Banner */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex gap-3">
          <CheckCircleIcon className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-green-900">Easy Apply Enabled</h4>
            <p className="text-sm text-green-700 mt-1">
              Your profile information has been automatically filled in. Review and submit your application.
            </p>
          </div>
        </div>

        {/* Job Summary */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 mb-3">{job.title}</h4>
          <div className="space-y-2 text-sm text-gray-700">
            {job.department && (
              <div className="flex items-center gap-2">
                <BriefcaseIcon className="h-4 w-4 text-gray-500" />
                <span>{job.department.name}</span>
              </div>
            )}
            {job.location && (
              <div className="flex items-center gap-2">
                <MapPinIcon className="h-4 w-4 text-gray-500" />
                <span>{job.location}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <CurrencyDollarIcon className="h-4 w-4 text-gray-500" />
              <span>{formatSalary(job.salary_min, job.salary_max)}</span>
            </div>
          </div>
        </div>

        <Input
          label="Full Name"
          name="applicant_name"
          value={formData.applicant_name}
          onChange={handleInputChange}
          required
          error={errors.applicant_name?.[0]}
          disabled
          className="bg-gray-50"
        />

        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          required
          error={errors.email?.[0]}
          disabled
          className="bg-gray-50"
        />

        <Input
          label="Phone Number"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleInputChange}
          required
          error={errors.phone?.[0]}
        />

        {/* Resume Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Resume/CV (Optional - Using profile resume)
          </label>
          
          {profileResume && !uploadNewResume ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <DocumentTextIcon className="h-6 w-6 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-900">{profileResume.file_name}</p>
                    <p className="text-xs text-green-700">From your profile</p>
                  </div>
                </div>
                <CheckCircleIcon className="h-5 w-5 text-green-600" />
              </div>
              <button
                type="button"
                onClick={() => setUploadNewResume(true)}
                className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Click to upload a different resume (optional)
              </button>
            </div>
          ) : (
            <div>
              <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <DocumentTextIcon className="w-8 h-8 mb-2 text-gray-400" />
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
                        <span className="font-semibold">Click to upload a different resume (optional)</span>
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
                />
              </label>
              {profileResume && uploadNewResume && (
                <button
                  type="button"
                  onClick={() => {
                    setUploadNewResume(false);
                    setResume(null);
                  }}
                  className="mt-2 text-sm text-gray-600 hover:text-gray-800"
                >
                  ← Use profile resume instead
                </button>
              )}
            </div>
          )}
          {errors.resume && (
            <p className="mt-1 text-sm text-red-600">{errors.resume}</p>
          )}
        </div>

        {/* Cover Letter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cover Letter <span className="text-red-500">*</span>
          </label>
          <textarea
            name="cover_letter_text"
            value={formData.cover_letter_text}
            onChange={handleInputChange}
            rows={5}
            required
            placeholder="Tell us why you're a great fit for this position..."
            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
          />
          {errors.cover_letter_text && (
            <p className="mt-1 text-sm text-red-600">{errors.cover_letter_text[0]}</p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t">
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
            Submit Application
          </Button>
        </div>
      </form>
    </Modal>
  );
}
