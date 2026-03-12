import React from 'react';
import { useDispatch } from 'react-redux';
import { Button, Input, Select, showDeleteConfirm, showSuccess } from '@/app/components';
import { ShieldCheckIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { deleteRole as deleteRoleThunk } from '../_redux/roles-thunk';

export default function RolesTabSection({ 
  filteredRoles,
  roleSearchQuery,
  setRoleSearchQuery,
  filterLevel,
  setFilterLevel,
  roleStats,
  openCreateModal,
  openEditModal,
  getLevelBadge
}) {
  const dispatch = useDispatch();

  const handleDelete = (role) => {
    showDeleteConfirm({
      title: `Delete ${role.name}?`,
      content: 'Are you sure you want to delete this role? This action cannot be undone.',
      onOk: async () => {
        try {
          await dispatch(deleteRoleThunk(role.id)).unwrap();
          showSuccess({ 
            title: 'Role Deleted', 
            content: `${role.name} has been deleted successfully.`
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
          <h1 className="text-2xl font-semibold text-gray-900">Roles & Permissions</h1>
          <p className="mt-1 text-sm text-gray-500">Manage user roles and define what each role can access.</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Button onClick={openCreateModal} icon={<ShieldCheckIcon className="h-5 w-5" />}>
            Create Role
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1">
          <Input
            placeholder="Search roles..."
            value={roleSearchQuery}
            onChange={(e) => setRoleSearchQuery(e.target.value)}
            leftIcon={<MagnifyingGlassIcon className="h-5 w-5" />}
          />
        </div>
        <Select
          value={filterLevel}
          onChange={(e) => setFilterLevel(e.target.value)}
          className="w-40"
        >
          <option value="all">All Levels</option>
          <option value="5">Level 5</option>
          <option value="4">Level 4</option>
          <option value="3">Level 3</option>
          <option value="2">Level 2</option>
          <option value="1">Level 1</option>
        </Select>
      </div>

      {/* Roles Table */}
      <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg mb-8">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Role Name</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Level</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Users</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Permissions</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Summary</th>
              <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
              <th className="relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">Actions</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {filteredRoles.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-12 text-center text-sm text-gray-500">No roles found.</td>
              </tr>
            ) : (
              filteredRoles.map((role) => (
                <tr key={role.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">
                          {role.name === 'super_admin' ? 'Super Administrator' : role.name.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                        </span>
                        {role.level === 5 && (
                          <span className="inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium bg-purple-100 text-purple-700">System</span>
                        )}
                      </div>
                      {role.description && (
                        <span className="text-xs text-gray-500 mt-1">{role.description.substring(0, 50)}{role.description.length > 50 ? '...' : ''}</span>
                      )}
                      <span className="text-xs text-gray-400 mt-1">Created: {role.created_at}</span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${getLevelBadge(role.level)}`}>
                      Level {role.level}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                    <div className="flex flex-col">
                      <span className="font-medium">{role.users_count}</span>
                      <span className="text-xs text-gray-500">assigned</span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                    <div className="flex flex-col">
                      <span className="font-medium">{role.permissions_count}</span>
                      <span className="text-xs text-gray-500">permissions</span>
                    </div>
                  </td>
                  <td className="px-3 py-4 text-sm text-gray-500 max-w-xs">
                    <div className="line-clamp-2">{role.permission_summary || 'No permissions'}</div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm">
                    <span className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium bg-green-100 text-green-700">Active</span>
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                    <div className="flex gap-2 justify-end">
                      <Button variant="outline" size="sm" onClick={() => openEditModal(role)}>View</Button>
                      <Button variant="primary" size="sm" onClick={() => openEditModal(role)}>Edit</Button>
                      <Button variant="outline-danger" size="sm" onClick={() => handleDelete(role)}>Delete</Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900">{roleStats.totalRoles}</div>
          <div className="text-sm text-gray-500 mt-1">Total Roles</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900">{roleStats.activeRoles}</div>
          <div className="text-sm text-gray-500 mt-1">Active Roles</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900">{roleStats.usersAssigned}</div>
          <div className="text-sm text-gray-500 mt-1">Users Assigned</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900">{roleStats.customRoles}</div>
          <div className="text-sm text-gray-500 mt-1">Custom Roles</div>
        </div>
      </div>
    </>
  );
}
