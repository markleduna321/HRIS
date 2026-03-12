# Global Components Library

Reusable components for the HRIS application.

## Component Categories

### Button Components
Three button components with full icon support:
- **Button**: Standard button with text and optional icons
- **IconButton**: Icon-only button (no text)
- **ButtonGroup**: Groups multiple buttons together

### Modal Components
Three modal components using Ant Design:
- **Modal**: Basic scrollable modal with customizable size
- **FormModal**: Pre-configured modal for forms with submit/cancel actions
- **Modal Helpers**: Utility functions for confirm, delete, success, error modals

**See [MODAL_README.md](./MODAL_README.md) for complete modal documentation.**

### Form Components
Six form input components with validation support:
- **Input**: Text input with label, icons, and validation
- **TextArea**: Multi-line text input
- **Select**: Dropdown select with options
- **Checkbox**: Single checkbox with label
- **Radio**: Single radio button
- **RadioGroup**: Group of radio buttons

**See [FORM_README.md](./FORM_README.md) for complete form documentation.**

## Installation
All components are located in `resources/js/app/components/`

## Import
```jsx
// Buttons
import { Button, IconButton, ButtonGroup } from '@/components';
import { PlusIcon, TrashIcon, PencilIcon } from '@heroicons/react/24/outline';

// Modals
import { Modal, FormModal, showConfirm, showDeleteConfirm, showSuccess } from '@/components';

// Forms
import { Input, TextArea, Select, Checkbox, Radio, RadioGroup } from '@/components';
```

## Button Component

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | string | 'primary' | primary, secondary, danger, success, warning, ghost, link, outline, outline-danger, outline-secondary |
| size | string | 'md' | xs, sm, md, lg, xl |
| type | string | 'button' | button, submit, reset |
| disabled | boolean | false | Disable the button |
| loading | boolean | false | Show loading spinner |
| icon | ReactNode | null | Icon component to display |
| iconPosition | string | 'left' | left, right |
| fullWidth | boolean | false | Make button full width |
| onClick | function | - | Click handler |
| className | string | '' | Additional CSS classes |

### Usage Examples

#### Basic Button
```jsx
<Button>Click Me</Button>
<Button variant="primary">Save</Button>
<Button variant="danger">Delete</Button>
```

#### Button with Icon
```jsx
<Button icon={<PlusIcon className="h-5 w-5" />}>
  Create User
</Button>

<Button 
  variant="danger" 
  icon={<TrashIcon className="h-5 w-5" />}
  iconPosition="right"
>
  Delete
</Button>
```

#### Loading State
```jsx
<Button loading={processing} onClick={handleSubmit}>
  Submit
</Button>
```

#### Form Submit Button
```jsx
<Button type="submit" variant="primary" disabled={!isValid}>
  Save Changes
</Button>
```

## IconButton Component

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| variant | string | 'ghost' | primary, secondary, danger, success, ghost, ghost-danger, ghost-primary |
| size | string | 'md' | xs, sm, md, lg, xl |
| type | string | 'button' | button, submit, reset |
| disabled | boolean | false | Disable the button |
| loading | boolean | false | Show loading spinner |
| title | string | - | Tooltip text |
| onClick | function | - | Click handler |
| className | string | '' | Additional CSS classes |

### Usage Examples

#### Basic Icon Button
```jsx
<IconButton title="Edit">
  <PencilIcon />
</IconButton>

<IconButton variant="ghost-danger" title="Delete">
  <TrashIcon />
</IconButton>
```

#### Different Sizes
```jsx
<IconButton size="sm" title="Small Edit">
  <PencilIcon />
</IconButton>

<IconButton size="lg" variant="primary" title="Add">
  <PlusIcon />
</IconButton>
```

## ButtonGroup Component

### Usage
```jsx
<ButtonGroup>
  <Button variant="secondary">View</Button>
  <Button variant="secondary">Edit</Button>
  <Button variant="outline-danger">Delete</Button>
</ButtonGroup>
```

## Icon Support

### Yes, all buttons are icon-ready!

The components work seamlessly with:
- **Heroicons** (recommended)
- **Font Awesome**
- **Lucide Icons**
- Any React icon library

### Icon Best Practices

1. **Always specify icon size** for Button component:
```jsx
<Button icon={<PlusIcon className="h-5 w-5" />}>Create</Button>
```

2. **IconButton auto-sizes icons** based on the `size` prop:
```jsx
<IconButton size="md">
  <PlusIcon /> {/* Auto-sized to h-5 w-5 */}
</IconButton>
```

3. **Recommended icon sizes per button size:**
| Button Size | Icon Size Class |
|------------|----------------|
| xs | h-3 w-3 |
| sm | h-4 w-4 |
| md | h-5 w-5 |
| lg | h-6 w-6 |
| xl | h-7 w-7 |

## Common Patterns

### Action Buttons in Table
```jsx
<ButtonGroup>
  <IconButton title="Edit" onClick={() => handleEdit(item)}>
    <PencilIcon />
  </IconButton>
  <IconButton variant="ghost-danger" title="Delete" onClick={() => handleDelete(item)}>
    <TrashIcon />
  </IconButton>
</ButtonGroup>
```

### Form Actions
```jsx
<div className="flex gap-3 justify-end">
  <Button variant="secondary" onClick={handleCancel}>
    Cancel
  </Button>
  <Button type="submit" loading={processing}>
    Save Changes
  </Button>
</div>
```

### Create Button
```jsx
<Button 
  variant="primary" 
  icon={<UserPlusIcon className="h-5 w-5" />}
  onClick={openModal}
>
  Create User
</Button>
```
