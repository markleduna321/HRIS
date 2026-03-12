import React, { useState } from 'react';
import { Button, IconButton, ButtonGroup } from './index';
import { PlusIcon, TrashIcon, PencilIcon, CogIcon, UserPlusIcon } from '@heroicons/react/24/outline';

/**
 * Button Component Showcase
 * Demonstrates all button variants and features
 */
export default function ButtonExamples() {
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="p-8 space-y-8 max-w-6xl">
      <div>
        <h2 className="text-2xl font-bold mb-4">Button Variants</h2>
        <div className="flex flex-wrap gap-3">
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="success">Success</Button>
          <Button variant="warning">Warning</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="outline-danger">Outline Danger</Button>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Button Sizes</h2>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="xs">Extra Small</Button>
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
          <Button size="xl">Extra Large</Button>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Buttons with Icons</h2>
        <div className="flex flex-wrap gap-3">
          <Button icon={<PlusIcon className="h-5 w-5" />}>Create User</Button>
          <Button variant="danger" icon={<TrashIcon className="h-5 w-5" />}>Delete</Button>
          <Button variant="secondary" icon={<UserPlusIcon className="h-5 w-5" />} iconPosition="right">
            Add Member
          </Button>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Button States</h2>
        <div className="flex flex-wrap gap-3">
          <Button disabled>Disabled</Button>
          <Button loading={loading} onClick={handleClick}>
            {loading ? 'Loading...' : 'Click to Load'}
          </Button>
          <Button variant="danger" disabled>Disabled Danger</Button>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Icon Buttons</h2>
        <div className="flex flex-wrap gap-3">
          <IconButton title="Edit" variant="ghost-primary">
            <PencilIcon />
          </IconButton>
          <IconButton title="Delete" variant="ghost-danger">
            <TrashIcon />
          </IconButton>
          <IconButton title="Settings" variant="ghost">
            <CogIcon />
          </IconButton>
          <IconButton title="Add" variant="primary">
            <PlusIcon />
          </IconButton>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Icon Button Sizes</h2>
        <div className="flex flex-wrap items-center gap-3">
          <IconButton size="xs" title="Extra Small">
            <PencilIcon />
          </IconButton>
          <IconButton size="sm" title="Small">
            <PencilIcon />
          </IconButton>
          <IconButton size="md" title="Medium">
            <PencilIcon />
          </IconButton>
          <IconButton size="lg" title="Large">
            <PencilIcon />
          </IconButton>
          <IconButton size="xl" title="Extra Large">
            <PencilIcon />
          </IconButton>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Button Groups</h2>
        <div className="space-y-3">
          <ButtonGroup>
            <Button variant="secondary">View</Button>
            <Button variant="secondary">Edit</Button>
            <Button variant="outline-danger">Delete</Button>
          </ButtonGroup>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">Full Width Button</h2>
        <Button fullWidth variant="primary">Full Width Button</Button>
      </div>
    </div>
  );
}
