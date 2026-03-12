import React, { useState } from 'react';
import { Button, FormModal, showDeleteConfirm, showSuccess } from '@/components';
import { PlusIcon } from '@heroicons/react/24/outline';

/**
 * Quick Start Example: User Management with Modal
 * 
 * This example shows how to use Modal components in a real application:
 * - Create user with FormModal
 * - Delete confirmation with showDeleteConfirm
 * - Success notification with showSuccess
 */

export default function UserManagementExample() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
  ]);

  // Create new user
  const handleCreateUser = async () => {
    setLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setLoading(false);
    setIsCreateModalOpen(false);
    
    showSuccess({
      title: 'User Created!',
      content: 'New user has been created successfully.',
    });
  };

  // Delete user with confirmation
  const handleDeleteUser = (user) => {
    showDeleteConfirm({
      title: `Delete ${user.name}`,
      content: `Are you sure you want to delete ${user.name}? This action cannot be undone.`,
      onOk: async () => {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Remove from state
        setUsers(users.filter(u => u.id !== user.id));
        
        showSuccess({
          title: 'Deleted!',
          content: `${user.name} has been removed from the system.`,
        });
      },
    });
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Button 
          icon={<PlusIcon className="h-5 w-5" />}
          onClick={() => setIsCreateModalOpen(true)}
        >
          Create User
        </Button>
      </div>

      {/* User List */}
      <div className="bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map(user => (
              <tr key={user.id}>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{user.name}</td>
                <td className="px-6 py-4 text-sm text-gray-500">{user.email}</td>
                <td className="px-6 py-4 text-right">
                  <Button 
                    variant="outline-danger" 
                    size="sm"
                    onClick={() => handleDeleteUser(user)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create User Modal */}
      <FormModal
        open={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateUser}
        title="Create New User"
        submitText="Create User"
        loading={loading}
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter full name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="user@example.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role *
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="">Select a role</option>
              <option value="admin">Admin</option>
              <option value="user">User</option>
              <option value="manager">Manager</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password *
            </label>
            <input
              type="password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter password"
              required
            />
          </div>
        </div>
      </FormModal>
    </div>
  );
}
