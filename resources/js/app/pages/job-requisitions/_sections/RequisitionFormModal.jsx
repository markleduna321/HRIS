import React, { useState, useEffect } from 'react';
import { FormModal, Input, Select, TextArea, RadioGroup } from '@/app/components';

const employmentTypeOptions = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'internship', label: 'Internship' },
];

const priorityOptions = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
];

const initialFormData = {
  position_type: 'new',
  existing_job_posting_id: '',
  position_title: '',
  department_id: '',
  location: '',
  employment_type: 'full-time',
  number_of_positions: 1,
  priority: 'medium',
  salary_range: '',
  target_start_date: '',
  justification: '',
  required_qualifications: '',
  key_responsibilities: '',
};

export default function RequisitionFormModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  requisition = null, 
  departments = [], 
  existingPositions = [],
  loading = false,
  errors = {}
}) {
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (requisition) {
      setFormData({
        position_type: requisition.position_type || 'new',
        existing_job_posting_id: requisition.existing_job_posting_id || '',
        position_title: requisition.position_title || '',
        department_id: requisition.department_id || '',
        location: requisition.location || '',
        employment_type: requisition.employment_type || 'full-time',
        number_of_positions: requisition.number_of_positions || 1,
        priority: requisition.priority || 'medium',
        salary_range: requisition.salary_range || '',
        target_start_date: requisition.target_start_date || '',
        justification: requisition.justification || '',
        required_qualifications: requisition.required_qualifications || '',
        key_responsibilities: requisition.key_responsibilities || '',
      });
    } else {
      setFormData(initialFormData);
    }
  }, [requisition, isOpen]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // If switching to new position, clear existing_job_posting_id
    if (field === 'position_type' && value === 'new') {
      setFormData((prev) => ({ ...prev, existing_job_posting_id: '' }));
    }

    // If selecting existing position, auto-fill some fields
    if (field === 'existing_job_posting_id' && value) {
      const selectedPosition = existingPositions.find(p => p.id === parseInt(value));
      if (selectedPosition) {
        setFormData((prev) => ({
          ...prev,
          position_title: selectedPosition.title,
          department_id: selectedPosition.department_id || '',
          location: selectedPosition.location || '',
          employment_type: selectedPosition.employment_type || 'full-time',
        }));
      }
    }
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const departmentOptions = departments.map(d => ({
    value: d.id,
    label: d.name
  }));

  const positionOptions = existingPositions.map(p => ({
    value: p.id,
    label: `${p.title} - ${p.department?.name || 'N/A'}`
  }));

  return (
    <FormModal
      open={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title={requisition ? 'Edit Job Requisition' : 'New Job Requisition'}
      submitText={requisition ? 'Update Requisition' : 'Submit Requisition'}
      loading={loading}
      size="xl"
    >
      <div className="space-y-6">
        {/* Position Type */}
        <div className="bg-indigo-50 rounded-lg p-4">
          <RadioGroup
            label="Position Type"
            required
            options={[
              { 
                value: 'new', 
                label: 'New Position', 
                helperText: 'Create a requisition for a brand new position' 
              },
              { 
                value: 'existing', 
                label: 'Existing Position', 
                helperText: 'Request additional headcount for an existing role' 
              }
            ]}
            value={formData.position_type}
            onChange={(value) => handleChange('position_type', value)}
          />
        </div>

        {/* Existing Position Selection - Only show if type is existing */}
        {formData.position_type === 'existing' && (
          <div>
            <Select
              label="Select Existing Position"
              options={[{ value: '', label: '-- Select a position --' }, ...positionOptions]}
              value={formData.existing_job_posting_id}
              onChange={(e) => handleChange('existing_job_posting_id', e.target.value)}
              required
              error={errors.existing_job_posting_id}
            />
          </div>
        )}

        {/* Position Details */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Position Details</h3>
          <div className="space-y-4">
            <Input
              label="Position Title"
              placeholder="e.g., Senior Software Engineer"
              value={formData.position_title}
              onChange={(e) => handleChange('position_title', e.target.value)}
              required
              error={errors.position_title}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                label="Department"
                options={[{ value: '', label: 'Select Department' }, ...departmentOptions]}
                value={formData.department_id}
                onChange={(e) => handleChange('department_id', e.target.value)}
                error={errors.department_id}
              />
              
              <Input
                label="Location"
                placeholder="Select Location"
                value={formData.location}
                onChange={(e) => handleChange('location', e.target.value)}
                error={errors.location}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select
                label="Employment Type"
                options={employmentTypeOptions}
                value={formData.employment_type}
                onChange={(e) => handleChange('employment_type', e.target.value)}
                required
                error={errors.employment_type}
              />
              
              <Input
                label="Number of Positions"
                type="number"
                min="1"
                value={formData.number_of_positions}
                onChange={(e) => handleChange('number_of_positions', e.target.value)}
                required
                error={errors.number_of_positions}
              />
              
              <Select
                label="Priority"
                options={priorityOptions}
                value={formData.priority}
                onChange={(e) => handleChange('priority', e.target.value)}
                required
                error={errors.priority}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Salary Range"
                placeholder="e.g., ₱50,000 - ₱70,000"
                value={formData.salary_range}
                onChange={(e) => handleChange('salary_range', e.target.value)}
                error={errors.salary_range}
              />
              
              <Input
                label="Target Start Date"
                type="date"
                value={formData.target_start_date}
                onChange={(e) => handleChange('target_start_date', e.target.value)}
                error={errors.target_start_date}
              />
            </div>
          </div>
        </div>

        {/* Business Justification */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Business Justification</h3>
          <TextArea
            label="Justification for Position"
            placeholder="Explain why this position is needed..."
            rows={4}
            value={formData.justification}
            onChange={(e) => handleChange('justification', e.target.value)}
            required
            error={errors.justification}
          />
        </div>

        {/* Position Requirements */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Position Requirements</h3>
          <div className="space-y-4">
            <TextArea
              label="Required Qualifications"
              placeholder="List required education, experience, skills, certifications..."
              rows={4}
              value={formData.required_qualifications}
              onChange={(e) => handleChange('required_qualifications', e.target.value)}
              required
              error={errors.required_qualifications}
            />
            
            <TextArea
              label="Key Responsibilities"
              placeholder="Describe main duties and responsibilities..."
              rows={4}
              value={formData.key_responsibilities}
              onChange={(e) => handleChange('key_responsibilities', e.target.value)}
              required
              error={errors.key_responsibilities}
            />
          </div>
        </div>
      </div>
    </FormModal>
  );
}
