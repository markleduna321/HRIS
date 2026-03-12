import React from 'react';
import { Input, Select } from '@/app/components';

export default function EmployeeFormSection({ 
  data, 
  setData, 
  errors,
  departments,
  editingEmployee
}) {
  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500">
        {editingEmployee ? 'Update employee information' : 'Fill in the employee details. A user account will be created automatically.'}
      </p>

      {/* Basic Information */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-4">Basic Information</h4>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Input
            label="Employee Number"
            value={data.employee_number}
            onChange={(e) => setData('employee_number', e.target.value)}
            error={errors.employee_number}
            disabled={!editingEmployee}
            placeholder={!editingEmployee ? 'Auto-generated' : ''}
            helperText={!editingEmployee ? 'Format: YYMMDD## (Year+Month+Day+Sequence, e.g., 26031201)' : ''}
            required
          />
          
          <Select
            label="Department"
            value={data.department_id}
            onChange={(e) => setData('department_id', e.target.value)}
            error={errors.department_id}
            placeholder="Select Department"
            required
          >
            <option value="">Select Department</option>
            {departments.map((dept) => (
              <option key={dept.id} value={dept.id}>{dept.name}</option>
            ))}
          </Select>
          
          <Input
            label="Position"
            value={data.position}
            onChange={(e) => setData('position', e.target.value)}
            error={errors.position}
            required
          />
        </div>
      </div>

      {/* Personal Information */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-4">Personal Information</h4>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Input
            label="First Name"
            value={data.first_name}
            onChange={(e) => setData('first_name', e.target.value)}
            error={errors.first_name}
            required
          />
          
          <Input
            label="Middle Name"
            value={data.middle_name}
            onChange={(e) => setData('middle_name', e.target.value)}
          />
          
          <Input
            label="Last Name"
            value={data.last_name}
            onChange={(e) => setData('last_name', e.target.value)}
            error={errors.last_name}
            required
          />
          
          <Input
            label="Email"
            type="email"
            value={data.email}
            onChange={(e) => setData('email', e.target.value)}
            error={errors.email}
            required
          />
          
          <Input
            label="Phone"
            type="tel"
            value={data.phone}
            onChange={(e) => setData('phone', e.target.value)}
            error={errors.phone}
            required
          />
          
          <Input
            label="Date of Birth"
            type="date"
            value={data.date_of_birth}
            onChange={(e) => setData('date_of_birth', e.target.value)}
            error={errors.date_of_birth}
            required
          />
          
          <Select
            label="Gender"
            value={data.gender}
            onChange={(e) => setData('gender', e.target.value)}
            error={errors.gender}
            placeholder="Select Gender"
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </Select>
        </div>
      </div>

      {/* Address Information */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-4">Address Information</h4>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="sm:col-span-2 lg:col-span-3">
            <Input
              label="Address"
              value={data.address}
              onChange={(e) => setData('address', e.target.value)}
              error={errors.address}
              required
            />
          </div>
          
          <Input
            label="City"
            value={data.city}
            onChange={(e) => setData('city', e.target.value)}
            error={errors.city}
            required
          />
          
          <Input
            label="State/Province"
            value={data.state}
            onChange={(e) => setData('state', e.target.value)}
            error={errors.state}
            required
          />
          
          <Input
            label="Zip Code"
            value={data.zip_code}
            onChange={(e) => setData('zip_code', e.target.value)}
            error={errors.zip_code}
            required
          />
        </div>
      </div>

      {/* Employment Information */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-4">Employment Information</h4>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="Date Hired"
            type="date"
            value={data.date_hired}
            onChange={(e) => setData('date_hired', e.target.value)}
            error={errors.date_hired}
            required
          />
          
          <Select
            label="Employment Status"
            value={data.employment_status}
            onChange={(e) => setData('employment_status', e.target.value)}
            error={errors.employment_status}
            required
          >
            <option value="active">Active</option>
            <option value="on_leave">On Leave</option>
            <option value="resigned">Resigned</option>
            <option value="terminated">Terminated</option>
          </Select>
        </div>
      </div>

      {/* Government IDs */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-4">Government IDs (Philippines)</h4>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Input
            label="SSS Number"
            value={data.sss_number}
            onChange={(e) => setData('sss_number', e.target.value)}
            error={errors.sss_number}
          />
          
          <Input
            label="TIN Number"
            value={data.tin_number}
            onChange={(e) => setData('tin_number', e.target.value)}
            error={errors.tin_number}
          />
          
          <Input
            label="PhilHealth Number"
            value={data.philhealth_number}
            onChange={(e) => setData('philhealth_number', e.target.value)}
            error={errors.philhealth_number}
          />
          
          <Input
            label="Pag-IBIG Number"
            value={data.pagibig_number}
            onChange={(e) => setData('pagibig_number', e.target.value)}
            error={errors.pagibig_number}
          />
        </div>
      </div>

      {/* Emergency Contact */}
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-4">Emergency Contact</h4>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Input
            label="Contact Name"
            value={data.emergency_contact_name}
            onChange={(e) => setData('emergency_contact_name', e.target.value)}
            error={errors.emergency_contact_name}
            required
          />
          
          <Input
            label="Contact Phone"
            type="tel"
            value={data.emergency_contact_phone}
            onChange={(e) => setData('emergency_contact_phone', e.target.value)}
            error={errors.emergency_contact_phone}
            required
          />
          
          <Input
            label="Relationship"
            value={data.emergency_contact_relationship}
            onChange={(e) => setData('emergency_contact_relationship', e.target.value)}
            error={errors.emergency_contact_relationship}
            required
          />
        </div>
      </div>
    </div>
  );
}
