import { Button, Input, Select, TextArea } from '@/app/components';

export default function PersonalInfoSection({
  formData,
  errors,
  loading,
  onFieldChange,
  onSubmit,
}) {
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onFieldChange(name, value);
  };

  return (
    <form onSubmit={onSubmit} className="bg-white shadow rounded-lg p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h2>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <Input
          label="First Name"
          name="first_name"
          value={formData.first_name}
          onChange={handleInputChange}
          required
          error={errors.first_name?.[0]}
        />

        <Input
          label="Last Name"
          name="last_name"
          value={formData.last_name}
          onChange={handleInputChange}
          required
          error={errors.last_name?.[0]}
        />

        <Input
          label="Email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
          required
          error={errors.email?.[0]}
        />

        <Input
          label="Phone"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={handleInputChange}
          error={errors.phone?.[0]}
        />

        <Input
          label="Date of Birth"
          name="date_of_birth"
          type="date"
          value={formData.date_of_birth}
          onChange={handleInputChange}
          error={errors.date_of_birth?.[0]}
        />

        <Select
          label="Gender"
          name="gender"
          value={formData.gender}
          onChange={handleInputChange}
          placeholder="Select Gender"
          options={[
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
            { value: 'other', label: 'Other' },
          ]}
          error={errors.gender?.[0]}
        />

        <Select
          label="Marital Status"
          name="marital_status"
          value={formData.marital_status}
          onChange={handleInputChange}
          placeholder="Select Status"
          options={[
            { value: 'single', label: 'Single' },
            { value: 'married', label: 'Married' },
            { value: 'divorced', label: 'Divorced' },
            { value: 'widowed', label: 'Widowed' },
          ]}
          error={errors.marital_status?.[0]}
        />

        <Input
          label="Nationality"
          name="nationality"
          value={formData.nationality}
          onChange={handleInputChange}
          error={errors.nationality?.[0]}
        />

        <div className="sm:col-span-2">
          <TextArea
            label="Current Address"
            name="current_address"
            rows={3}
            value={formData.current_address}
            onChange={handleInputChange}
            error={errors.current_address?.[0]}
          />
        </div>

        <div className="sm:col-span-2">
          <TextArea
            label="Permanent Address"
            name="permanent_address"
            rows={3}
            value={formData.permanent_address}
            onChange={handleInputChange}
            error={errors.permanent_address?.[0]}
          />
        </div>

        <div className="sm:col-span-2">
          <TextArea
            label="Bio"
            name="bio"
            rows={4}
            value={formData.bio}
            onChange={handleInputChange}
            placeholder="Tell us about yourself..."
            error={errors.bio?.[0]}
          />
        </div>

        <Input
          label="LinkedIn URL"
          name="linkedin_url"
          type="url"
          value={formData.linkedin_url}
          onChange={handleInputChange}
          placeholder="https://linkedin.com/in/username"
          error={errors.linkedin_url?.[0]}
        />

        <Input
          label="Portfolio URL"
          name="portfolio_url"
          type="url"
          value={formData.portfolio_url}
          onChange={handleInputChange}
          placeholder="https://yourportfolio.com"
          error={errors.portfolio_url?.[0]}
        />
      </div>

      <div className="mt-6 flex justify-end">
        <Button
          type="submit"
          variant="primary"
          loading={loading}
        >
          Save Changes
        </Button>
      </div>
    </form>
  );
}
