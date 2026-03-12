# Modal Components Documentation

## Overview
Modal components built with Ant Design, featuring scrollable content and various utility functions.

## Components
1. **Modal**: Basic modal with customizable size and scrollable content
2. **FormModal**: Pre-configured modal for forms with submit/cancel actions
3. **Modal Helpers**: Utility functions for confirmation, success, error, and info modals

## Installation
Ant Design is already installed. Import Ant Design icons if needed:
```bash
npm install @ant-design/icons
```

## Import

```jsx
import { 
  Modal, 
  FormModal, 
  showConfirm, 
  showDeleteConfirm, 
  showSuccess,
  showError,
  showInfo,
  showWarning
} from '@/components';
```

---

## Modal Component

### Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| open | boolean | false | Controls modal visibility |
| onClose | function | - | Callback when modal closes |
| title | string | '' | Modal title |
| children | ReactNode | - | Modal content |
| footer | ReactNode | null | Custom footer (buttons, etc.) |
| size | string | 'md' | Modal size: sm, md, lg, xl, full |
| centered | boolean | true | Center modal vertically |
| closable | boolean | true | Show close button |
| maskClosable | boolean | true | Close on outside click |
| destroyOnClose | boolean | true | Destroy content on close |

### Sizes
- `sm`: 400px
- `md`: 600px (default)
- `lg`: 800px
- `xl`: 1000px
- `full`: 90% of viewport

### Usage

#### Basic Modal
```jsx
import { useState } from 'react';
import { Modal, Button } from '@/components';

function MyComponent() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Modal</Button>
      
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="My Modal"
        footer={
          <Button onClick={() => setOpen(false)}>Close</Button>
        }
      >
        <p>Modal content goes here.</p>
        <p>The content area is scrollable.</p>
      </Modal>
    </>
  );
}
```

#### Modal with Custom Footer
```jsx
<Modal
  open={open}
  onClose={() => setOpen(false)}
  title="Confirm Action"
  footer={
    <div className="flex gap-3 justify-end">
      <Button variant="secondary" onClick={() => setOpen(false)}>
        Cancel
      </Button>
      <Button onClick={handleSubmit}>
        Confirm
      </Button>
    </div>
  }
>
  <p>Are you sure you want to proceed?</p>
</Modal>
```

#### Large Scrollable Modal
```jsx
<Modal
  open={open}
  onClose={() => setOpen(false)}
  title="Large Content"
  size="lg"
>
  <div className="space-y-4">
    {/* Lots of content */}
    {data.map(item => (
      <div key={item.id}>{item.content}</div>
    ))}
  </div>
</Modal>
```

---

## FormModal Component

Pre-configured modal specifically for forms with built-in submit/cancel actions.

### Props
Inherits all Modal props, plus:

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| onSubmit | function | - | Form submit handler |
| submitText | string | 'Submit' | Submit button text |
| cancelText | string | 'Cancel' | Cancel button text |
| submitVariant | string | 'primary' | Submit button variant |
| loading | boolean | false | Show loading state |

### Usage

```jsx
import { useState } from 'react';
import { FormModal, Button } from '@/components';

function CreateUserModal() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    // Submit form data
    await saveUser(formData);
    setLoading(false);
    setOpen(false);
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Create User</Button>
      
      <FormModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit}
        title="Create New User"
        submitText="Create"
        loading={loading}
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input 
              type="text" 
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input 
              type="email" 
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </div>
      </FormModal>
    </>
  );
}
```

---

## Modal Helper Functions

Utility functions for common modal scenarios. These don't require state management.

### showConfirm
General confirmation dialog.

```jsx
import { showConfirm } from '@/components';

showConfirm({
  title: 'Confirm Action',
  content: 'Are you sure you want to proceed?',
  onOk: () => {
    console.log('User confirmed');
  },
  onCancel: () => {
    console.log('User cancelled');
  },
  okText: 'Yes',
  cancelText: 'No',
});
```

### showDeleteConfirm
Pre-configured delete confirmation (red icon, danger button).

```jsx
import { showDeleteConfirm } from '@/components';

const handleDelete = (id) => {
  showDeleteConfirm({
    title: 'Delete User',
    content: 'Are you sure you want to delete this user? This action cannot be undone.',
    onOk: async () => {
      await deleteUser(id);
      showSuccess({
        title: 'Deleted!',
        content: 'User has been deleted successfully.',
      });
    },
  });
};
```

### showSuccess
Success message modal.

```jsx
import { showSuccess } from '@/components';

showSuccess({
  title: 'Success!',
  content: 'User created successfully.',
  onOk: () => {
    // Optional callback
  },
});
```

### showError
Error message modal.

```jsx
import { showError } from '@/components';

showError({
  title: 'Error',
  content: 'Failed to save user. Please try again.',
});
```

### showInfo
Information modal.

```jsx
import { showInfo } from '@/components';

showInfo({
  title: 'Information',
  content: 'This feature is coming soon!',
});
```

### showWarning
Warning modal.

```jsx
import { showWarning } from '@/components';

showWarning({
  title: 'Warning',
  content: 'This action may have side effects.',
});
```

---

## Common Patterns

### Delete Confirmation in Table
```jsx
import { showDeleteConfirm, showSuccess } from '@/components';
import { IconButton } from '@/components';
import { TrashIcon } from '@heroicons/react/24/outline';

function UserTable({ users }) {
  const handleDelete = (user) => {
    showDeleteConfirm({
      title: `Delete ${user.name}`,
      content: `Are you sure you want to delete ${user.name}? This action cannot be undone.`,
      onOk: async () => {
        await deleteUser(user.id);
        showSuccess({
          title: 'Deleted!',
          content: `${user.name} has been deleted successfully.`,
        });
      },
    });
  };

  return (
    <table>
      <tbody>
        {users.map(user => (
          <tr key={user.id}>
            <td>{user.name}</td>
            <td>
              <IconButton 
                variant="ghost-danger" 
                onClick={() => handleDelete(user)}
              >
                <TrashIcon />
              </IconButton>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
```

### Edit Form Modal
```jsx
import { useState } from 'react';
import { FormModal, Button, showSuccess } from '@/components';

function EditUserModal({ user }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(user);

  const handleSubmit = async () => {
    setLoading(true);
    await updateUser(user.id, formData);
    setLoading(false);
    setOpen(false);
    showSuccess({
      title: 'Updated!',
      content: 'User updated successfully.',
    });
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>Edit</Button>
      
      <FormModal
        open={open}
        onClose={() => setOpen(false)}
        onSubmit={handleSubmit}
        title="Edit User"
        submitText="Save Changes"
        loading={loading}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input 
              type="text" 
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
        </div>
      </FormModal>
    </>
  );
}
```

---

## Key Features

✅ **Scrollable Content**: Modal body has `maxHeight: 70vh` with auto scroll
✅ **Centered by Default**: Modals are vertically centered
✅ **Responsive Sizes**: 5 preset sizes (sm to full)
✅ **Destroy on Close**: Content is destroyed when modal closes (saves memory)
✅ **Loading States**: Built-in loading support in FormModal
✅ **Accessible**: Ant Design modals are fully accessible
✅ **Customizable**: Override any prop or style as needed

---

## Styling Note

The Modal component uses Ant Design's default styles. You can customize by:

1. **Adding className**:
```jsx
<Modal className="custom-modal" />
```

2. **Custom styles**:
```jsx
<Modal
  styles={{
    body: { padding: '32px', maxHeight: '80vh' },
    header: { borderBottom: '2px solid #eee' },
  }}
/>
```

3. **Global Ant Design theme** (in your main CSS file):
```css
.ant-modal-header {
  background: #f5f5f5;
}
```
