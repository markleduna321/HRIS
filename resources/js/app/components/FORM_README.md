# Form Components Documentation

## Overview
Complete set of form input components with validation, error handling, and consistent styling.

## Components
1. **Input**: Text input with label, icons, and validation
2. **TextArea**: Multi-line text input
3. **Select**: Dropdown select with options
4. **Checkbox**: Single checkbox with label
5. **Radio**: Single radio button
6. **RadioGroup**: Group of radio buttons

---

## Installation & Import

```jsx
import { 
  Input, 
  TextArea, 
  Select, 
  Checkbox, 
  Radio, 
  RadioGroup 
} from '@/components';
```

---

## Input Component

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| label | string | - | Input label |
| error | string | - | Error message |
| helperText | string | - | Helper text below input |
| size | string | 'md' | sm, md, lg |
| required | boolean | false | Show required asterisk |
| leftIcon | ReactNode | - | Icon on the left |
| rightIcon | ReactNode | - | Icon on the right |
| disabled | boolean | false | Disable the input |
| className | string | '' | Additional CSS classes |

### Usage

#### Basic Input
```jsx
<Input
  label="Full Name"
  placeholder="Enter your name"
  value={name}
  onChange={(e) => setName(e.target.value)}
  required
/>
```

#### Input with Icon
```jsx
import { EnvelopeIcon } from '@heroicons/react/24/outline';

<Input
  label="Email"
  type="email"
  leftIcon={<EnvelopeIcon className="h-5 w-5" />}
  placeholder="you@example.com"
/>
```

#### Input with Error
```jsx
<Input
  label="Username"
  value={username}
  onChange={(e) => setUsername(e.target.value)}
  error="Username is already taken"
/>
```

#### Input with Helper Text
```jsx
<Input
  label="Password"
  type="password"
  helperText="Must be at least 8 characters"
/>
```

---

## TextArea Component

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| label | string | - | TextArea label |
| error | string | - | Error message |
| helperText | string | - | Helper text |
| rows | number | 4 | Number of rows |
| required | boolean | false | Show required asterisk |
| disabled | boolean | false | Disable the textarea |
| resize | boolean | true | Allow manual resize |

### Usage

```jsx
<TextArea
  label="Description"
  placeholder="Enter description..."
  rows={5}
  value={description}
  onChange={(e) => setDescription(e.target.value)}
  helperText="Maximum 500 characters"
/>

// No resize
<TextArea
  label="Comments"
  resize={false}
  rows={3}
/>
```

---

## Select Component

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| label | string | - | Select label |
| error | string | - | Error message |
| helperText | string | - | Helper text |
| size | string | 'md' | sm, md, lg |
| required | boolean | false | Show required asterisk |
| disabled | boolean | false | Disable the select |
| options | Array | [] | Array of {value, label} |
| placeholder | string | 'Select an option' | Placeholder text |

### Usage

#### With Options Array
```jsx
const countries = [
  { value: 'us', label: 'United States' },
  { value: 'uk', label: 'United Kingdom' },
  { value: 'ca', label: 'Canada' },
];

<Select
  label="Country"
  options={countries}
  value={country}
  onChange={(e) => setCountry(e.target.value)}
  placeholder="Select your country"
  required
/>
```

#### With Children
```jsx
<Select
  label="Role"
  value={role}
  onChange={(e) => setRole(e.target.value)}
>
  <option value="admin">Admin</option>
  <option value="user">User</option>
  <option value="manager">Manager</option>
</Select>
```

---

## Checkbox Component

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| label | string | - | Checkbox label |
| error | string | - | Error message |
| helperText | string | - | Helper text |
| disabled | boolean | false | Disable checkbox |
| size | string | 'md' | sm, md, lg |

### Usage

```jsx
<Checkbox
  label="I agree to the terms and conditions"
  checked={agreed}
  onChange={(e) => setAgreed(e.target.checked)}
  required
/>

<Checkbox
  label="Enable notifications"
  checked={notifications}
  onChange={(e) => setNotifications(e.target.checked)}
  helperText="Receive email updates"
/>
```

---

## Radio Component

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| label | string | - | Radio label |
| error | string | - | Error message |
| helperText | string | - | Helper text |
| disabled | boolean | false | Disable radio |
| size | string | 'md' | sm, md, lg |

### Usage

```jsx
<div className="space-y-3">
  <Radio
    label="Credit Card"
    name="payment"
    value="credit"
    checked={payment === 'credit'}
    onChange={(e) => setPayment(e.target.value)}
    helperText="Visa, Mastercard, Amex"
  />
  <Radio
    label="PayPal"
    name="payment"
    value="paypal"
    checked={payment === 'paypal'}
    onChange={(e) => setPayment(e.target.value)}
  />
</div>
```

---

## RadioGroup Component

Convenient wrapper for multiple radio options.

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| label | string | - | Group label |
| error | string | - | Error message |
| options | Array | [] | Array of {value, label, helperText} |
| value | string | - | Selected value |
| onChange | function | - | Change handler |
| required | boolean | false | Show required asterisk |
| direction | string | 'vertical' | horizontal, vertical |

### Usage

```jsx
const roleOptions = [
  { value: 'admin', label: 'Administrator', helperText: 'Full system access' },
  { value: 'manager', label: 'Manager', helperText: 'Team management' },
  { value: 'user', label: 'User', helperText: 'Basic access' },
];

<RadioGroup
  label="User Role"
  options={roleOptions}
  value={role}
  onChange={setRole}
  required
/>

// Horizontal layout
<RadioGroup
  label="Confirm Action"
  options={[
    { value: 'yes', label: 'Yes' },
    { value: 'no', label: 'No' },
  ]}
  direction="horizontal"
  value={confirm}
  onChange={setConfirm}
/>
```

---

## Form Validation Example

```jsx
import { useState } from 'react';
import { Input, TextArea, Select, Checkbox, Button } from '@/components';

function UserForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: '',
    bio: '',
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
    
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.role) newErrors.role = 'Please select a role';
    if (!formData.terms) newErrors.terms = 'You must accept the terms';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log('Form submitted:', formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Full Name"
        value={formData.name}
        onChange={(e) => handleChange('name', e.target.value)}
        error={errors.name}
        required
      />

      <Input
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) => handleChange('email', e.target.value)}
        error={errors.email}
        required
      />

      <Select
        label="Role"
        value={formData.role}
        onChange={(e) => handleChange('role', e.target.value)}
        error={errors.role}
        required
      >
        <option value="">Select role</option>
        <option value="admin">Admin</option>
        <option value="user">User</option>
      </Select>

      <TextArea
        label="Bio"
        value={formData.bio}
        onChange={(e) => handleChange('bio', e.target.value)}
        rows={4}
      />

      <Checkbox
        label="I agree to the terms"
        checked={formData.terms}
        onChange={(e) => handleChange('terms', e.target.checked)}
        error={errors.terms}
        required
      />

      <Button type="submit">Submit</Button>
    </form>
  );
}
```

---

## Using with React Hook Form

```jsx
import { useForm } from 'react-hook-form';
import { Input, Select, Button } from '@/components';

function MyForm() {
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Name"
        {...register('name', { required: 'Name is required' })}
        error={errors.name?.message}
      />

      <Input
        label="Email"
        type="email"
        {...register('email', { 
          required: 'Email is required',
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: 'Invalid email address'
          }
        })}
        error={errors.email?.message}
      />

      <Button type="submit">Submit</Button>
    </form>
  );
}
```

---

## Key Features

✅ **Consistent Design**: All components follow the same design pattern
✅ **Built-in Validation**: Error and helper text support
✅ **Accessible**: Proper labels and ARIA attributes
✅ **Icon Support**: Left/right icons for Input fields
✅ **Flexible Sizing**: sm, md, lg sizes for all components
✅ **Required Indicators**: Automatic asterisk for required fields
✅ **Disabled States**: All components support disabled state
✅ **Forward Refs**: All components use forwardRef for React Hook Form compatibility
✅ **Auto-generated IDs**: Automatic ID generation for accessibility

---

## Styling Customization

All components accept `className` prop for additional styling:

```jsx
<Input
  label="Custom Styled Input"
  className="border-2 border-purple-500"
/>
```

You can also override individual styles in your CSS or use Tailwind's variant modifiers.
