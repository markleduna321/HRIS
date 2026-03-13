import React, { useState, useEffect } from 'react';
import { Modal, Button, showSuccess } from '@/app/components';
import axios from 'axios';

export default function JobPostingModal({ isOpen, onClose, editingJob, onSuccess }) {
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    department_id: '',
    location: '',
    employment_type: 'full-time',
    description: '',
    requirements: '',
    responsibilities: '',
    salary_min: '',
    salary_max: '',
    status: 'open',
    closing_date: '',
    positions_available: 1,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (editingJob) {
      setFormData({
        title: editingJob.title || '',
        department_id: editingJob.department_id || '',
        location: editingJob.location || '',
        employment_type: editingJob.employment_type || 'full-time',
        description: editingJob.description || '',
        requirements: editingJob.requirements || '',
        responsibilities: editingJob.responsibilities || '',
        salary_min: editingJob.salary_min || '',
        salary_max: editingJob.salary_max || '',
        status: editingJob.status || 'open',
        closing_date: editingJob.closing_date || '',
        positions_available: editingJob.positions_available || 1,
      });
    } else {
      setFormData({
        title: '',
        department_id: '',
        location: '',
        employment_type: 'full-time',
        description: '',
        requirements: '',
        responsibilities: '',
        salary_min: '',
        salary_max: '',
        status: 'open',
        closing_date: '',
        positions_available: 1,
      });
    }
    setErrors({});
  }, [editingJob, isOpen]);

  const fetchDepartments = async () => {
    try {
      const response = await axios.get('/api/departments');
      setDepartments(response.data);
    } catch (error) {
      console.error('Failed to fetch departments:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      if (editingJob) {
        await axios.put(`/api/job-postings/${editingJob.id}`, formData);
        showSuccess({
          title: 'Job Updated',
          content: 'Job posting has been updated successfully.',
        });
      } else {
        await axios.post('/api/job-postings', formData);
        showSuccess({
          title: 'Job Posted',
          content: 'Job posting has been created successfully.',
        });
      }

      onClose();
      if (onSuccess) onSuccess();
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ general: 'Failed to save job posting. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      size="xl"
      title={editingJob ? 'Edit Job Posting' : 'Create New Job Posting'}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.general && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {errors.general}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Job Title */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">
              Job Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
          </div>

          {/* Department */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Department
            </label>
            <select
              name="department_id"
              value={formData.department_id}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
            >
              <option value="">None</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
            {errors.department_id && <p className="mt-1 text-sm text-red-600">{errors.department_id}</p>}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="e.g., Manila, Remote, Hybrid"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
            />
            {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
          </div>

          {/* Employment Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Employment Type <span className="text-red-500">*</span>
            </label>
            <select
              name="employment_type"
              value={formData.employment_type}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
            >
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
            </select>
            {errors.employment_type && <p className="mt-1 text-sm text-red-600">{errors.employment_type}</p>}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
            >
              <option value="open">Open</option>
              <option value="closed">Closed</option>
              <option value="draft">Draft</option>
            </select>
            {errors.status && <p className="mt-1 text-sm text-red-600">{errors.status}</p>}
          </div>

          {/* Salary Range */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Minimum Salary
            </label>
            <input
              type="number"
              name="salary_min"
              value={formData.salary_min}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
            />
            {errors.salary_min && <p className="mt-1 text-sm text-red-600">{errors.salary_min}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Maximum Salary
            </label>
            <input
              type="number"
              name="salary_max"
              value={formData.salary_max}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
            />
            {errors.salary_max && <p className="mt-1 text-sm text-red-600">{errors.salary_max}</p>}
          </div>

          {/* Positions Available */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Positions Available <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="positions_available"
              value={formData.positions_available}
              onChange={handleInputChange}
              min="1"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
            />
            {errors.positions_available && <p className="mt-1 text-sm text-red-600">{errors.positions_available}</p>}
          </div>

          {/* Closing Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Closing Date
            </label>
            <input
              type="date"
              name="closing_date"
              value={formData.closing_date}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
            />
            {errors.closing_date && <p className="mt-1 text-sm text-red-600">{errors.closing_date}</p>}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Job Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            rows={4}
            placeholder="Describe the role, responsibilities, and what the candidate will be doing..."
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
          />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
        </div>

        {/* Requirements */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Requirements
          </label>
          <textarea
            name="requirements"
            value={formData.requirements}
            onChange={handleInputChange}
            rows={4}
            placeholder="List the qualifications, skills, and experience required..."
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
          />
          {errors.requirements && <p className="mt-1 text-sm text-red-600">{errors.requirements}</p>}
        </div>

        {/* Responsibilities */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Responsibilities
          </label>
          <textarea
            name="responsibilities"
            value={formData.responsibilities}
            onChange={handleInputChange}
            rows={4}
            placeholder="List the key responsibilities and duties..."
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
          />
          {errors.responsibilities && <p className="mt-1 text-sm text-red-600">{errors.responsibilities}</p>}
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
            {loading ? 'Saving...' : editingJob ? 'Update Job' : 'Post Job'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
