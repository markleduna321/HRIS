import React, { useState } from 'react';
import { Modal, Button, showSuccess } from '@/app/components';
import axios from 'axios';

export default function JobApplicationModal({ isOpen, onClose, job, onSuccess }) {
  const [formData, setFormData] = useState({
    applicant_name: '',
    email: '',
    phone: '',
    address: '',
    cover_letter_text: '',
  });
  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleFileChange = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (2MB)
      if (file.size > 2 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, [type]: 'File size must be less than 2MB' }));
        return;
      }
      
      if (type === 'resume') {
        setResume(file);
        setErrors(prev => ({ ...prev, resume: null }));
      } else {
        setCoverLetter(file);
        setErrors(prev => ({ ...prev, cover_letter: null }));
      }
    }
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
    if (formData.phone) submitData.append('phone', formData.phone);
    if (formData.address) submitData.append('address', formData.address);
    if (formData.cover_letter_text) submitData.append('cover_letter_text', formData.cover_letter_text);
    if (resume) submitData.append('resume', resume);
    if (coverLetter) submitData.append('cover_letter', coverLetter);

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
        applicant_name: '',
        email: '',
        phone: '',
        address: '',
        cover_letter_text: '',
      });
      setResume(null);
      setCoverLetter(null);
      
      onClose();
      if (onSuccess) onSuccess();
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else if (error.response?.data?.message) {
        setErrors({ general: error.response.data.message });
      } else {
        setErrors({ general: 'Failed to submit application. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  if (!job) return null;

  return (
    <Modal open={isOpen} onClose={onClose} size="lg" title={`Apply for ${job.title}`}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.general && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {errors.general}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="applicant_name"
            value={formData.applicant_name}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
          />
          {errors.applicant_name && <p className="mt-1 text-sm text-red-600">{errors.applicant_name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone Number
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
          />
          {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Address
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            rows={2}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
          />
          {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Resume (PDF, DOC, DOCX - Max 2MB)
          </label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => handleFileChange(e, 'resume')}
            className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100"
          />
          {resume && <p className="mt-1 text-sm text-gray-600">Selected: {resume.name}</p>}
          {errors.resume && <p className="mt-1 text-sm text-red-600">{errors.resume}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Cover Letter (Optional - PDF, DOC, DOCX - Max 2MB)
          </label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => handleFileChange(e, 'cover_letter')}
            className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-indigo-50 file:text-indigo-700
              hover:file:bg-indigo-100"
          />
          {coverLetter && <p className="mt-1 text-sm text-gray-600">Selected: {coverLetter.name}</p>}
          {errors.cover_letter && <p className="mt-1 text-sm text-red-600">{errors.cover_letter}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Cover Letter (Text)
          </label>
          <textarea
            name="cover_letter_text"
            value={formData.cover_letter_text}
            onChange={handleInputChange}
            rows={4}
            placeholder="Tell us why you're interested in this position..."
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
          />
          {errors.cover_letter_text && <p className="mt-1 text-sm text-red-600">{errors.cover_letter_text}</p>}
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Application'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
