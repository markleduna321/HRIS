import React, { useState, useEffect } from 'react';
import { Modal, Button, showSuccess } from '@/app/components';
import axios from 'axios';

export default function JobPostingModal({ isOpen, onClose, editingJob, onSuccess }) {
  const [departments, setDepartments] = useState([]);
  const [unfilledRequisitions, setUnfilledRequisitions] = useState([]);
  const [selectedRequisition, setSelectedRequisition] = useState(null);
  const [formData, setFormData] = useState({
    job_requisition_id: '',
    title: '',
    department_id: '',
    location: '',
    employment_type: 'full-time',
    description: '',
    requirements: '',
    responsibilities: '',
    salary_min: '',
    salary_max: '',
    status: 'draft',
    closing_date: '',
    positions_available: 1,
    target_audience: 'both',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      fetchDepartments();
      fetchUnfilledRequisitions();
    }
  }, [isOpen]);

  useEffect(() => {
    if (editingJob) {
      setFormData({
        job_requisition_id: editingJob.job_requisition_id || '',
        title: editingJob.title || '',
        department_id: editingJob.department_id || '',
        location: editingJob.location || '',
        employment_type: editingJob.employment_type || 'full-time',
        description: editingJob.description || '',
        requirements: editingJob.requirements || '',
        responsibilities: editingJob.responsibilities || '',
        salary_min: editingJob.salary_min || '',
        salary_max: editingJob.salary_max || '',
        status: editingJob.status || 'draft',
        closing_date: editingJob.closing_date || '',
        positions_available: editingJob.positions_available || 1,
        target_audience: editingJob.target_audience || 'both',
      });
    } else {
      setFormData({
        job_requisition_id: '',
        title: '',
        department_id: '',
        location: '',
        employment_type: 'full-time',
        description: '',
        requirements: '',
        responsibilities: '',
        salary_min: '',
        salary_max: '',
        status: 'draft',
        closing_date: '',
        positions_available: 1,
        target_audience: 'both',
      });
      setSelectedRequisition(null);
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

  const fetchUnfilledRequisitions = async () => {
    try {
      const response = await axios.get('/api/job-requisitions/unfilled');
      setUnfilledRequisitions(response.data);
    } catch (error) {
      console.error('Failed to fetch unfilled requisitions:', error);
    }
  };

  const handleRequisitionChange = (e) => {
    const requisitionId = e.target.value;
    
    if (!requisitionId) {
      setSelectedRequisition(null);
      // Reset to empty form when "Create without requisition" is selected
      setFormData({
        job_requisition_id: '',
        title: '',
        department_id: '',
        location: '',
        employment_type: 'full-time',
        description: '',
        requirements: '',
        responsibilities: '',
        salary_min: '',
        salary_max: '',
        status: 'draft',
        closing_date: '',
        positions_available: 1,
        target_audience: 'both',
      });
      return;
    }

    const requisition = unfilledRequisitions.find(r => r.id === parseInt(requisitionId));
    if (requisition) {
      setSelectedRequisition(requisition);
      
      // Parse salary range (e.g., "₱50,000 - ₱80,000")
      let salaryMin = '';
      let salaryMax = '';
      if (requisition.salary_range) {
        const salaryMatch = requisition.salary_range.match(/₱?([\d,]+)\s*-\s*₱?([\d,]+)/);
        if (salaryMatch) {
          salaryMin = salaryMatch[1].replace(/,/g, '');
          salaryMax = salaryMatch[2].replace(/,/g, '');
        }
      }

      // Pre-fill form with requisition data
      setFormData({
        job_requisition_id: requisition.id,
        title: requisition.position_title,
        department_id: requisition.department_id || '',
        location: requisition.location || '',
        employment_type: requisition.employment_type || 'full-time',
        description: requisition.justification || '',
        requirements: requisition.required_qualifications || '',
        responsibilities: requisition.key_responsibilities || '',
        salary_min: salaryMin,
        salary_max: salaryMax,
        status: 'draft',
        closing_date: requisition.target_start_date || '',
        positions_available: requisition.number_of_positions - (requisition.positions_filled || 0),
        target_audience: 'both',
      });
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

        {/* Link to Job Requisition */}
        {!editingJob && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Link to Job Requisition (Optional)
            </label>
            <p className="text-xs text-gray-600 mb-3">Select Unfilled Position</p>
            <select
              value={selectedRequisition?.id || ''}
              onChange={handleRequisitionChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
            >
              <option value="">-- Create without requisition --</option>
              {unfilledRequisitions.map((req) => (
                <option key={req.id} value={req.id}>
                  {req.requisition_number} - {req.position_title} ({req.number_of_positions - (req.positions_filled || 0)} positions available)
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Target Audience */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <label className="block text-sm font-medium text-gray-900 mb-3">
            Target Audience <span className="text-red-500">*</span>
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="target_audience"
                value="both"
                checked={formData.target_audience === 'both'}
                onChange={handleInputChange}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Both Applicants & Employees</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="target_audience"
                value="applicants"
                checked={formData.target_audience === 'applicants'}
                onChange={handleInputChange}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Applicants Only</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="target_audience"
                value="employees"
                checked={formData.target_audience === 'employees'}
                onChange={handleInputChange}
                className="mr-2"
              />
              <span className="text-sm text-gray-700">Employees Only (Internal)</span>
            </label>
          </div>
        </div>

        <h3 className="text-base font-semibold text-gray-900">Basic Information</h3>

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
              placeholder="e.g., Senior Software Engineer"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
          </div>

          {/* Department */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Department <span className="text-red-500">*</span>
            </label>
            <select
              name="department_id"
              value={formData.department_id}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
            >
              <option value="">e.g., IT</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
            {errors.department_id && <p className="mt-1 text-sm text-red-600">{errors.department_id}</p>}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Location <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="e.g., Manila"
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
              Salary Range <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="salary_min"
              value={formData.salary_min}
              onChange={handleInputChange}
              placeholder="₱50,000 - ₱80,000"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
            />
            {errors.salary_min && <p className="mt-1 text-sm text-red-600">{errors.salary_min}</p>}
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

        {/* DeApplication Deadline <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="closing_date"
              value={formData.closing_date}
              onChange={handleInputChange}
              placeholder="mm/dd/yyyy"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
            />
            {errors.closing_date && <p className="mt-1 text-sm text-red-600">{errors.closing_date}</p>}
          </div>
        </div>

        <h3 className="text-base font-semibold text-gray-900 mt-6">Job Details</h3>

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
            placeholder="Describe the role and responsibilities..."
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
          />
          {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
        </div>

        {/* Requirements */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Requirements (one per line) <span className="text-red-500">*</span>
          </label>
          <textarea
            name="requirements"
            value={formData.requirements}
            onChange={handleInputChange}
            rows={4}
            placeholder={"5+ years experience\\nProficiency in React\\nStrong communication skills"}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
          />
          {errors.requirements && <p className="mt-1 text-sm text-red-600">{errors.requirements}</p>}
        </div>

        {/* Experience and Education */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Experience Required <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., 3+ years"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Education Required <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g., Bachelor's degree"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm px-3 py-2 border"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={loading}
          >
            {loading ? 'Saving...' : editingJob ? 'Update Job' : 'Create Job Posting'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
