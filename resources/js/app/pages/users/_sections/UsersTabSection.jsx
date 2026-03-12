import React from 'react';
import { useDispatch } from 'react-redux';
import { Button, Input, Select, showDeleteConfirm, showSuccess } from '@/app/components';
import { UserPlusIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { deleteUser as deleteUserThunk } from '../_redux/user-management-thunk';

export default function UsersTabSection({ 
  filteredUsers, 
  searchQuery, 
  setSearchQuery, 
  filterRole, 
  setFilterRole, 
  filterStatus, 
  setFilterStatus,
  allRoles,
  openCreateModal,
  openEditModal,
  getRoleBadgeColor,
  getInitials
}) {
  const dispatch = useDispatch();

  const handleDelete = (user) => {
    showDeleteConfirm({
      title: `Delete ${user.name}?`,
      content: 'Are you sure you want to delete this user? This action cannot be undone.',
      onOk: async () => {
        try {
          await dispatch(deleteUserThunk(user.id)).unwrap();
          showSuccess({ 
            title: 'User Deleted', 
            content: `${user.name} has been deleted successfully.`
          });
        } catch (error) {
          console.error('Delete failed:', error);
        }
      }
    });
  };
  return (
    <>
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
          <p className="mt-1 text-sm text-gray-500">Manage user accounts and their access to the system.</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button onClick={openCreateModal} icon={<UserPlusIcon className="h-5 w-5" />}>
            Create User
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<MagnifyingGlassIcon className="h-5 w-5" />}
          />
        </div>
        <Select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
          className="w-48"
        >
          <option value="all">All Roles</option>
          {allRoles.map(role => (
            <option key={role} value={role}>{role}</option>
          ))}
        </Select>
        <Select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="w-40"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </Select>
      </div>

      {/* Users Table */}
      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">User</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Roles</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-12 text-center text-sm text-gray-500">No users found.</td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                          {getInitials(user.name)}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-4 text-sm">
                    <div className="flex flex-wrap gap-1">
                      {user.roles.map((role) => (
                        <span key={role.id} className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${getRoleBadgeColor(role.name)}`}>
                          {role.name === 'super_admin' ? 'Super Admin' : role.name === 'hr_manager' ? 'HR Manager' : role.name.replace('_', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <div className="flex items-center gap-2">
                      <span className={`h-2 w-2 rounded-full ${user.is_active ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                      <span className="text-gray-900">{user.is_active ? 'Active' : 'Inactive'}</span>
                    </div>
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" size="sm" onClick={() => openEditModal(user)}>View</Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDelete(user)}>Delete</Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
