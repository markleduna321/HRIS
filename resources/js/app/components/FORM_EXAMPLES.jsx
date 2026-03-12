import React, { useState } from 'react';
import { Input, TextArea, Select, Checkbox, Radio, RadioGroup } from './index';
import { MagnifyingGlassIcon, EnvelopeIcon, LockClosedIcon } from '@heroicons/react/24/outline';

/**
 * Form Components Showcase
 * Demonstrates all input field components
 */
export default function FormExamples() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    bio: '',
    country: '',
    role: '',
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

  const countries = [
    { value: 'us', label: 'United States' },
    { value: 'uk', label: 'United Kingdom' },
    { value: 'ca', label: 'Canada' },
    { value: 'ph', label: 'Philippines' },
  ];

  const roleOptions = [
    { value: 'admin', label: 'Administrator', helperText: 'Full system access' },
    { value: 'manager', label: 'Manager', helperText: 'Team management access' },
    { value: 'user', label: 'User', helperText: 'Basic user access' },
  ];

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-12">
      <div>
        <h1 className="text-3xl font-bold mb-2">Form Components</h1>
        <p className="text-gray-600">Complete set of form input components with validation support</p>
      </div>

      {/* Input Examples */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold border-b pb-2">Input Fields</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Full Name"
            placeholder="Enter your full name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
          />

          <Input
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            leftIcon={<EnvelopeIcon className="h-5 w-5" />}
            required
          />
        </div>

        <Input
          label="Password"
          type="password"
          placeholder="Enter your password"
          value={formData.password}
          onChange={(e) => handleChange('password', e.target.value)}
          leftIcon={<LockClosedIcon className="h-5 w-5" />}
          helperText="Must be at least 8 characters"
          required
        />

        <Input
          label="Search"
          placeholder="Search users..."
          leftIcon={<MagnifyingGlassIcon className="h-5 w-5" />}
        />

        <Input
          label="Input with Error"
          placeholder="This has an error"
          error="This field is required"
        />

        <Input
          label="Disabled Input"
          placeholder="This is disabled"
          value="Cannot edit this"
          disabled
        />
      </section>

      {/* Input Sizes */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold border-b pb-2">Input Sizes</h2>
        
        <div className="space-y-4">
          <Input
            label="Small Input"
            size="sm"
            placeholder="Small size"
          />
          <Input
            label="Medium Input (Default)"
            size="md"
            placeholder="Medium size"
          />
          <Input
            label="Large Input"
            size="lg"
            placeholder="Large size"
          />
        </div>
      </section>

      {/* TextArea */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold border-b pb-2">TextArea</h2>
        
        <TextArea
          label="Biography"
          placeholder="Tell us about yourself..."
          value={formData.bio}
          onChange={(e) => handleChange('bio', e.target.value)}
          rows={4}
          helperText="Maximum 500 characters"
        />

        <TextArea
          label="Comments (No Resize)"
          placeholder="Enter your comments..."
          rows={3}
          resize={false}
        />

        <TextArea
          label="TextArea with Error"
          placeholder="This has an error"
          error="Please provide more details"
        />
      </section>

      {/* Select */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold border-b pb-2">Select Dropdown</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Country"
            options={countries}
            value={formData.country}
            onChange={(e) => handleChange('country', e.target.value)}
            placeholder="Select your country"
            required
          />

          <Select
            label="Role"
            value={formData.role}
            onChange={(e) => handleChange('role', e.target.value)}
            placeholder="Select a role"
          >
            <option value="admin">Admin</option>
            <option value="user">User</option>
            <option value="manager">Manager</option>
          </Select>
        </div>

        <Select
          label="Disabled Select"
          options={countries}
          disabled
          value="us"
        />

        <Select
          label="Select with Error"
          options={countries}
          error="Please select a country"
        />
      </section>

      {/* Checkbox */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold border-b pb-2">Checkboxes</h2>
        
        <Checkbox
          label="Enable email notifications"
          checked={formData.notifications}
          onChange={(e) => handleChange('notifications', e.target.checked)}
          helperText="Receive updates about your account activity"
        />

        <Checkbox
          label="I agree to the terms and conditions"
          checked={formData.terms}
          onChange={(e) => handleChange('terms', e.target.checked)}
          required
        />

        <Checkbox
          label="Checkbox with Error"
          error="You must agree to continue"
        />

        <Checkbox
          label="Disabled Checkbox"
          disabled
        />

        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700">Checkbox Sizes</p>
          <Checkbox label="Small Checkbox" size="sm" />
          <Checkbox label="Medium Checkbox (Default)" size="md" />
          <Checkbox label="Large Checkbox" size="lg" />
        </div>
      </section>

      {/* Radio */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold border-b pb-2">Radio Buttons</h2>
        
        <div className="space-y-3">
          <p className="text-sm font-medium text-gray-700">Select Payment Method</p>
          <Radio
            label="Credit Card"
            name="payment"
            value="credit"
            helperText="Visa, Mastercard, Amex"
          />
          <Radio
            label="PayPal"
            name="payment"
            value="paypal"
            helperText="Pay with your PayPal account"
          />
          <Radio
            label="Bank Transfer"
            name="payment"
            value="bank"
            helperText="Direct bank transfer"
          />
        </div>

        <Radio
          label="Disabled Radio"
          disabled
        />
      </section>

      {/* RadioGroup */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold border-b pb-2">Radio Group</h2>
        
        <RadioGroup
          label="Select User Role"
          options={roleOptions}
          value={formData.role}
          onChange={(value) => handleChange('role', value)}
          required
        />

        <RadioGroup
          label="Horizontal Radio Group"
          options={[
            { value: 'yes', label: 'Yes' },
            { value: 'no', label: 'No' },
            { value: 'maybe', label: 'Maybe' },
          ]}
          direction="horizontal"
        />

        <RadioGroup
          label="Radio Group with Error"
          options={roleOptions}
          error="Please select a role"
        />
      </section>

      {/* Complete Form Example */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold border-b pb-2">Complete Form Example</h2>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="First Name"
              placeholder="John"
              required
            />
            <Input
              label="Last Name"
              placeholder="Doe"
              required
            />
          </div>

          <Input
            label="Email"
            type="email"
            placeholder="john@example.com"
            leftIcon={<EnvelopeIcon className="h-5 w-5" />}
            required
          />

          <Select
            label="Country"
            options={countries}
            placeholder="Select country"
            required
          />

          <TextArea
            label="Message"
            placeholder="Your message here..."
            rows={4}
          />

          <Checkbox
            label="Subscribe to newsletter"
            helperText="Get updates about new features"
          />

          <Checkbox
            label="I agree to the terms and conditions"
            required
          />
        </div>
      </section>
    </div>
  );
}
