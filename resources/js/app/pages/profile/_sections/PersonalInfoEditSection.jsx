import { Button, Input, Select } from '@/app/components';
import {
  UserIcon,
  PhoneIcon,
  MapPinIcon,
  ShieldCheckIcon,
  IdentificationIcon,
  CalendarIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';

const SectionHeader = ({ icon: Icon, title, bgColor }) => (
  <div className={`flex items-center gap-2 text-${bgColor}-700 mb-4`}>
    <Icon className="h-5 w-5" />
    <h3 className="text-base font-semibold">{title}</h3>
  </div>
);

export default function PersonalInfoEditSection({ formData, errors, loading, onFieldChange, onSave, onCancel }) {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onFieldChange(name, value);
  };

  const handleSelectChange = (name) => (e) => {
    onFieldChange(name, e.target.value);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Basic Information */}
      <div className="bg-blue-50 p-6 rounded-lg">
        <SectionHeader icon={UserIcon} title="Basic Information" bgColor="blue" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="First Name *"
            name="first_name"
            value={formData.first_name || ''}
            onChange={handleInputChange}
            error={errors.first_name?.[0]}
            required
          />
          <Input
            label="Middle Name"
            name="middle_name"
            value={formData.middle_name || ''}
            onChange={handleInputChange}
            error={errors.middle_name?.[0]}
          />
          <Input
            label="Last Name *"
            name="last_name"
            value={formData.last_name || ''}
            onChange={handleInputChange}
            error={errors.last_name?.[0]}
            required
          />
          <Input
            label="Suffix"
            name="suffix"
            value={formData.suffix || ''}
            onChange={handleInputChange}
            error={errors.suffix?.[0]}
            placeholder="Jr., Sr., III, etc."
          />
          <Input
            label="Date of Birth"
            name="date_of_birth"
            type="date"
            value={formData.date_of_birth || ''}
            onChange={handleInputChange}
            error={errors.date_of_birth?.[0]}
          />
          <Select
            label="Gender"
            name="gender"
            value={formData.gender || ''}
            onChange={handleSelectChange('gender')}
            error={errors.gender?.[0]}
            options={[
              { value: '', label: 'Select Gender' },
              { value: 'male', label: 'Male' },
              { value: 'female', label: 'Female' },
              { value: 'other', label: 'Other' },
            ]}
          />
          <Input
            label="Nationality"
            name="nationality"
            value={formData.nationality || ''}
            onChange={handleInputChange}
            error={errors.nationality?.[0]}
          />
          <Select
            label="Marital Status"
            name="civil_status"
            value={formData.civil_status || ''}
            onChange={handleSelectChange('civil_status')}
            error={errors.civil_status?.[0]}
            options={[
              { value: '', label: 'Select Status' },
              { value: 'single', label: 'Single' },
              { value: 'married', label: 'Married' },
              { value: 'widowed', label: 'Widowed' },
              { value: 'separated', label: 'Separated' },
              { value: 'divorced', label: 'Divorced' },
            ]}
          />
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-green-50 p-6 rounded-lg">
        <SectionHeader icon={PhoneIcon} title="Contact Information" bgColor="green" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Email Address *"
            name="email"
            type="email"
            value={formData.email || ''}
            onChange={handleInputChange}
            error={errors.email?.[0]}
            required
          />
          <Input
            label="Phone Number *"
            name="phone"
            type="tel"
            value={formData.phone || ''}
            onChange={handleInputChange}
            error={errors.phone?.[0]}
            required
          />
        </div>
      </div>

      {/* Address Information */}
      <div className="bg-pink-50 p-6 rounded-lg">
        <SectionHeader icon={MapPinIcon} title="Address Information" bgColor="pink" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Street Address"
            name="address"
            value={formData.address || ''}
            onChange={handleInputChange}
            error={errors.address?.[0]}
          />
          <Input
            label="Barangay"
            name="barangay"
            value={formData.barangay || ''}
            onChange={handleInputChange}
            error={errors.barangay?.[0]}
          />
          <Input
            label="City/Municipality"
            name="city"
            value={formData.city || ''}
            onChange={handleInputChange}
            error={errors.city?.[0]}
          />
          <Input
            label="Province"
            name="state"
            value={formData.state || ''}
            onChange={handleInputChange}
            error={errors.state?.[0]}
          />
          <Input
            label="Zip Code"
            name="zip_code"
            value={formData.zip_code || ''}
            onChange={handleInputChange}
            error={errors.zip_code?.[0]}
          />
          <Input
            label="Country"
            name="country"
            value={formData.country || ''}
            onChange={handleInputChange}
            error={errors.country?.[0]}
          />
        </div>
      </div>

      {/* Emergency Contact Information */}
      <div className="bg-rose-50 p-6 rounded-lg">
        <SectionHeader icon={ShieldCheckIcon} title="Emergency Contact Information" bgColor="rose" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Contact Person Full Name"
            name="emergency_contact_name"
            value={formData.emergency_contact_name || ''}
            onChange={handleInputChange}
            error={errors.emergency_contact_name?.[0]}
          />
          <Input
            label="Emergency Contact Number"
            name="emergency_contact_phone"
            type="tel"
            value={formData.emergency_contact_phone || ''}
            onChange={handleInputChange}
            error={errors.emergency_contact_phone?.[0]}
          />
          <Input
            label="Relationship"
            name="emergency_contact_relationship"
            value={formData.emergency_contact_relationship || ''}
            onChange={handleInputChange}
            error={errors.emergency_contact_relationship?.[0]}
            placeholder="e.g., Spouse, Parent, Sibling"
          />
        </div>
      </div>

      {/* Philippine Government IDs */}
      <div className="bg-yellow-50 p-6 rounded-lg">
        <SectionHeader icon={IdentificationIcon} title="Philippine Government IDs" bgColor="yellow" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="SSS Number"
            name="sss_number"
            value={formData.sss_number || ''}
            onChange={handleInputChange}
            error={errors.sss_number?.[0]}
            placeholder="XX-XXXXXXX-X"
          />
          <Input
            label="Pag-IBIG Number"
            name="pagibig_number"
            value={formData.pagibig_number || ''}
            onChange={handleInputChange}
            error={errors.pagibig_number?.[0]}
            placeholder="XXXX-XXXX-XXXX"
          />
          <Input
            label="PhilHealth Number"
            name="philhealth_number"
            value={formData.philhealth_number || ''}
            onChange={handleInputChange}
            error={errors.philhealth_number?.[0]}
            placeholder="XX-XXXXXXXXX-X"
          />
          <Input
            label="TIN Number"
            name="tin_number"
            value={formData.tin_number || ''}
            onChange={handleInputChange}
            error={errors.tin_number?.[0]}
            placeholder="XXX-XXX-XXX-XXX"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="primary"
          onClick={onSave}
          loading={loading}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}
