import React, { useState } from 'react';
import { Modal, FormModal, showConfirm, showDeleteConfirm, showSuccess } from './index';
import { Button } from './index';

/**
 * Modal Component Showcase
 * Demonstrates all modal features
 */
export default function ModalExamples() {
  const [basicOpen, setBasicOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [largeOpen, setLargeOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleFormSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setFormOpen(false);
      showSuccess({
        title: 'Success!',
        content: 'Form submitted successfully.',
      });
    }, 2000);
  };

  const handleDelete = () => {
    showDeleteConfirm({
      title: 'Delete User',
      content: 'Are you sure you want to delete this user? This action cannot be undone.',
      onOk: () => {
        console.log('User deleted');
        showSuccess({
          title: 'Deleted!',
          content: 'User has been deleted successfully.',
        });
      },
    });
  };

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold mb-8">Modal Examples</h1>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Basic Modals</h2>
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => setBasicOpen(true)}>
            Open Basic Modal
          </Button>
          <Button variant="secondary" onClick={() => setFormOpen(true)}>
            Open Form Modal
          </Button>
          <Button variant="success" onClick={() => setLargeOpen(true)}>
            Open Large Modal
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Confirmation Modals</h2>
        <div className="flex flex-wrap gap-3">
          <Button 
            variant="outline"
            onClick={() => showConfirm({
              title: 'Are you sure?',
              content: 'This is a confirmation modal.',
              onOk: () => console.log('Confirmed'),
            })}
          >
            Show Confirm
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Show Delete Confirm
          </Button>
          <Button 
            variant="success"
            onClick={() => showSuccess({
              title: 'Success!',
              content: 'This is a success message.',
            })}
          >
            Show Success
          </Button>
        </div>
      </div>

      {/* Basic Modal */}
      <Modal
        open={basicOpen}
        onClose={() => setBasicOpen(false)}
        title="Basic Modal"
        size="md"
        footer={
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" onClick={() => setBasicOpen(false)}>
              Close
            </Button>
            <Button onClick={() => setBasicOpen(false)}>
              OK
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <p>This is a basic modal with scrollable content.</p>
          <p>You can put any content here.</p>
          <div className="bg-gray-100 p-4 rounded">
            <h3 className="font-semibold mb-2">Example Content</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </div>
        </div>
      </Modal>

      {/* Form Modal */}
      <FormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleFormSubmit}
        title="Create New User"
        submitText="Create User"
        loading={loading}
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter email"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option>Admin</option>
              <option>User</option>
              <option>Manager</option>
            </select>
          </div>
        </div>
      </FormModal>

      {/* Large Modal with Scrollable Content */}
      <Modal
        open={largeOpen}
        onClose={() => setLargeOpen(false)}
        title="Large Modal with Scrollable Content"
        size="lg"
        footer={
          <Button onClick={() => setLargeOpen(false)}>
            Close
          </Button>
        }
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            This is a large modal with lots of content to demonstrate scrolling.
          </p>
          {[...Array(20)].map((_, i) => (
            <div key={i} className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-900">Section {i + 1}</h4>
              <p className="text-gray-600 mt-2">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod 
                tempor incididunt ut labore et dolore magna aliqua.
              </p>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}
