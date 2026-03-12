import React, { useState } from 'react';
import { 
  Input, 
  TextArea, 
  Select, 
  Checkbox, 
  RadioGroup, 
  Button,
  FormModal,
  showSuccess,
  showDeleteConfirm
} from './index';
import { EnvelopeIcon, PhoneIcon, UserIcon } from '@heroicons/react/24/outline';

/**
 * Complete Form Example
 * Demonstrates all form components in a real-world employee creation scenario
 */
export default function FormQuickStart() {
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'manager' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'employee' },
  ]);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    role: '',
    employmentType: '',
    bio: '',
    remoteWork: false,
    notifications: false,
    terms: false,
  });
  
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.department) newErrors.department = 'Please select a department';
    if (!formData.role) newErrors.role = 'Please select a role';
    if (!formData.employmentType) newErrors.employmentType = 'Please select employment type';
    if (!formData.terms) newErrors.terms = 'You must accept the terms';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }

    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newUser = {
      id: users.length + 1,
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      role: formData.role,
    };
    
    setUsers([...users, newUser]);
    setLoading(false);
    setIsModalOpen(false);
    
    // Reset form
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      department: '',
      role: '',
      employmentType: '',
      bio: '',
      remoteWork: false,
      notifications: false,
      terms: false,
    });
    
    showSuccess({
      title: 'Employee Created',
      content: `${newUser.name} has been successfully added to the system.`,
    });
  };

  const handleDelete = (user) => {
    showDeleteConfirm({
      title: `Delete ${user.name}?`,
      content: 'This action cannot be undone. All employee data will be permanently removed.',
      onOk: () => {
        setUsers(users.filter(u => u.id !== user.id));
        showSuccess({
          title: 'Employee Deleted',
          content: `${user.name} has been removed from the system.`,
        });
      },
    });
  };

  const departments = [
    { value: 'engineering', label: 'Engineering' },
    { value: 'sales', label: 'Sales' },
    { value: 'marketing', label: 'Marketing' },
    { value: 'hr', label: 'Human Resources' },
  ];

  const employmentTypes = [
    { value: 'full-time', label: 'Full Time', helperText: '40 hours per week' },
    { value: 'part-time', label: 'Part Time', helperText: '20-30 hours per week' },
    { value: 'contract', label: 'Contract', helperText: 'Fixed-term contract' },
    { value: 'intern', label: 'Intern', helperText: 'Temporary internship' },
  ];

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-3xl font-bold">Employee Management</h1>
            <p className="text-gray-600 mt-1">Complete form components demo</p>
          </div>
          <Button 
            onClick={() => setIsModalOpen(true)}
            icon={<UserIcon className="h-5 w-5" />}
          >
            Add Employee
          </Button>
        </div>

        {/* Employee Table */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                    {user.role}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <Button 
                      variant="outline-danger" 
                      size="sm"
                      onClick={() => handleDelete(user)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Employee Modal */}
      <FormModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
        title="Create New Employee"
        size="lg"
        submitText="Create Employee"
        loading={loading}
      >
        <div className="space-y-4">
          {/* Personal Information */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Personal Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="First Name"
                placeholder="John"
                value={formData.firstName}
                onChange={(e) => handleChange('firstName', e.target.value)}
                error={errors.firstName}
                leftIcon={<UserIcon className="h-5 w-5" />}
                required
              />
              
              <Input
                label="Last Name"
                placeholder="Doe"
                value={formData.lastName}
                onChange={(e) => handleChange('lastName', e.target.value)}
                error={errors.lastName}
                required
              />
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Contact Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="john.doe@company.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                error={errors.email}
                leftIcon={<EnvelopeIcon className="h-5 w-5" />}
                required
              />
              
              <Input
                label="Phone Number"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                leftIcon={<PhoneIcon className="h-5 w-5" />}
                helperText="Optional"
              />
            </div>
          </div>

          {/* Employment Details */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Employment Details</h3>
            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Department"
                options={departments}
                value={formData.department}
                onChange={(e) => handleChange('department', e.target.value)}
                error={errors.department}
                placeholder="Select department"
                required
              />
              
              <Select
                label="Role"
                value={formData.role}
                onChange={(e) => handleChange('role', e.target.value)}
                error={errors.role}
                placeholder="Select role"
                required
              >
                <option value="admin">Admin</option>
                <option value="manager">Manager</option>
                <option value="employee">Employee</option>
              </Select>
            </div>
          </div>

          {/* Employment Type */}
          <RadioGroup
            label="Employment Type"
            options={employmentTypes}
            value={formData.employmentType}
            onChange={(value) => handleChange('employmentType', value)}
            error={errors.employmentType}
            required
          />

          {/* Bio */}
          <TextArea
            label="Biography"
            placeholder="Tell us about the employee's background and experience..."
            value={formData.bio}
            onChange={(e) => handleChange('bio', e.target.value)}
            rows={4}
            helperText="Optional - Maximum 500 characters"
          />

          {/* Preferences */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Preferences</h3>
            <div className="space-y-3">
              <Checkbox
                label="Enable remote work"
                checked={formData.remoteWork}
                onChange={(e) => handleChange('remoteWork', e.target.checked)}
                helperText="Allow employee to work from home"
              />
              
              <Checkbox
                label="Email notifications"
                checked={formData.notifications}
                onChange={(e) => handleChange('notifications', e.target.checked)}
                helperText="Send system notifications to employee email"
              />
              
              <Checkbox
                label="I confirm that all information is accurate"
                checked={formData.terms}
                onChange={(e) => handleChange('terms', e.target.checked)}
                error={errors.terms}
                required
              />
            </div>
          </div>
        </div>
      </FormModal>
    </div>
  );
}
