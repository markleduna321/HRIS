import {
  UserIcon,
  PhoneIcon,
  MapPinIcon,
  ShieldCheckIcon,
  IdentificationIcon,
  CalendarIcon,
  EnvelopeIcon,
} from '@heroicons/react/24/outline';

const InfoField = ({ icon: Icon, label, value }) => (
  <div>
    <div className="text-sm font-medium text-gray-700 mb-1">{label}</div>
    <div className="flex items-center gap-2 text-gray-600">
      {Icon && <Icon className="h-5 w-5 text-gray-400" />}
      <span className={!value || value === '' ? 'text-gray-400' : 'text-gray-900'}>
        {value && value !== '' ? value : 'Not provided'}
      </span>
    </div>
  </div>
);

const SectionHeader = ({ icon: Icon, title, bgColor }) => (
  <div className={`flex items-center gap-2 text-${bgColor}-700 mb-4`}>
    <Icon className="h-5 w-5" />
    <h3 className="text-base font-semibold">{title}</h3>
  </div>
);

export default function PersonalInfoSection({ formData, errors, loading }) {
  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const capitalizeFirst = (str) => {
    if (!str) return null;
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Basic Information */}
      <div className="bg-blue-50 p-6 rounded-lg">
        <SectionHeader icon={UserIcon} title="Basic Information" bgColor="blue" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoField
            icon={UserIcon}
            label="First Name *"
            value={formData.first_name}
          />
          <InfoField
            icon={UserIcon}
            label="Middle Name"
            value={formData.middle_name}
          />
          <InfoField
            icon={UserIcon}
            label="Last Name *"
            value={formData.last_name}
          />
          <InfoField
            label="Suffix"
            value={formData.suffix}
          />
          <InfoField
            icon={CalendarIcon}
            label="Date of Birth"
            value={formatDate(formData.date_of_birth)}
          />
          <InfoField
            icon={UserIcon}
            label="Gender"
            value={capitalizeFirst(formData.gender)}
          />
          <InfoField
            icon={UserIcon}
            label="Nationality"
            value={formData.nationality}
          />
          <InfoField
            label="Marital Status"
            value={capitalizeFirst(formData.civil_status)}
          />
        </div>
      </div>

      {/* Contact Information */}
      <div className="bg-green-50 p-6 rounded-lg">
        <SectionHeader icon={PhoneIcon} title="Contact Information" bgColor="green" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoField
            icon={EnvelopeIcon}
            label="Email Address *"
            value={formData.email}
          />
          <InfoField
            icon={PhoneIcon}
            label="Phone Number *"
            value={formData.phone}
          />
        </div>
      </div>

      {/* Address Information */}
      <div className="bg-pink-50 p-6 rounded-lg">
        <SectionHeader icon={MapPinIcon} title="Address Information" bgColor="pink" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoField
            icon={MapPinIcon}
            label="Street Address"
            value={formData.address}
          />
          <InfoField
            label="Barangay"
            value={formData.barangay}
          />
          <InfoField
            icon={MapPinIcon}
            label="City/Municipality"
            value={formData.city}
          />
          <InfoField
            label="Province"
            value={formData.state}
          />
          <InfoField
            icon={MapPinIcon}
            label="Zip Code"
            value={formData.zip_code}
          />
          <InfoField
            label="Country"
            value={formData.country}
          />
        </div>
      </div>

      {/* Emergency Contact Information */}
      <div className="bg-rose-50 p-6 rounded-lg">
        <SectionHeader icon={ShieldCheckIcon} title="Emergency Contact Information" bgColor="rose" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoField
            icon={UserIcon}
            label="Contact Person Full Name"
            value={formData.emergency_contact_name}
          />
          <InfoField
            icon={PhoneIcon}
            label="Emergency Contact Number"
            value={formData.emergency_contact_phone}
          />
          <InfoField
            icon={UserIcon}
            label="Relationship"
            value={formData.emergency_contact_relationship}
          />
        </div>
      </div>

      {/* Philippine Government IDs */}
      <div className="bg-yellow-50 p-6 rounded-lg">
        <SectionHeader icon={IdentificationIcon} title="Philippine Government IDs" bgColor="yellow" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoField
            icon={IdentificationIcon}
            label="SSS Number"
            value={formData.sss_number}
          />
          <InfoField
            icon={IdentificationIcon}
            label="Pag-IBIG Number"
            value={formData.pagibig_number}
          />
          <InfoField
            icon={IdentificationIcon}
            label="PhilHealth Number"
            value={formData.philhealth_number}
          />
          <InfoField
            icon={IdentificationIcon}
            label="TIN Number"
            value={formData.tin_number}
          />
        </div>
      </div>
    </div>
  );
}
