import React, { useState, Fragment, useMemo } from 'react';
import AppLayout from '../layout';
import { Head, useForm, router } from '@inertiajs/react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, PencilIcon, TrashIcon, UserPlusIcon, MagnifyingGlassIcon, ShieldCheckIcon, CheckIcon } from '@heroicons/react/24/outline';

export default function UserManagementPage({ users = [], roles = [], permissions = [], allRoles = [], allPermissions = [] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editingRole, setEditingRole] = useState(null);
  const [activeTab, setActiveTab] = useState('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterLevel, setFilterLevel] = useState('all');
  const [roleSearchQuery, setRoleSearchQuery] = useState('');

  const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    is_active: true,
    roles: [],
    permissions: [],
    level: 1,
    description: '',
  });

  // Group permissions by module
  const groupedPermissions = useMemo(() => {
    const groups = {};
    
    allPermissions.forEach(permission => {
      const parts = permission.name.split(' ');
      const action = parts[0];
      const module = parts.slice(1).join(' ');
      
      // Determine group name
      let groupName = 'Other';
      if (module.includes('user')) groupName = 'User Management';
      else if (module.includes('role') || module.includes('permission')) groupName = 'Role & Permission Management';
      else if (module.includes('employee')) groupName = 'Employee Management';
      else if (module.includes('department')) groupName = 'Department Management';
      else if (module.includes('attendance') || module.includes('own attendance')) groupName = 'Attendance Management';
      else if (module.includes('leave') || module.includes('own leave')) groupName = 'Leave Management';
      else if (module.includes('payroll') || module.includes('own payroll')) groupName = 'Payroll Management';
      else if (module.includes('performance') || module.includes('own performance')) groupName = 'Performance Management';
      
      if (!groups[groupName]) {
        groups[groupName] = [];
      }
      
      groups[groupName].push({
        id: permission.id,
        name: permission.name,
        displayName: permission.name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
      });
    });
    
    return groups;
  }, [allPermissions]);

  // Filter users based on search and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || user.roles.includes(filterRole);
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && user.is_active) || 
                         (filterStatus === 'inactive' && !user.is_active);
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Filter roles based on search and filters
  const filteredRoles = roles.filter(role => {
    const matchesSearch = role.name.toLowerCase().includes(roleSearchQuery.toLowerCase()) ||
                         (role.description && role.description.toLowerCase().includes(roleSearchQuery.toLowerCase()));
    const matchesLevel = filterLevel === 'all' || role.level === parseInt(filterLevel);
    const matchesStatus = filterStatus === 'all'; // All roles are active by default
    return matchesSearch && matchesLevel && matchesStatus;
  });

  // Calculate stats for roles
  const roleStats = useMemo(() => {
    const totalRoles = roles.length;
    const activeRoles = roles.length; // All roles are active
    const usersAssigned = roles.reduce((sum, role) => sum + role.users_count, 0);
    const customRoles = roles.filter(r => !['super_admin', 'admin', 'hr_manager', 'manager', 'employee'].includes(r.name)).length;
    
    return {
      totalRoles,
      activeRoles,
      usersAssigned,
      customRoles
    };
  }, [roles]);

  const openCreateModal = () => {
    reset();
    setEditingUser(null);
    setEditingRole(null);
    
    if (activeTab === 'roles') {
      setData({ name: '', level: 1, description: '', permissions: [] });
    } else {
      setData({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        is_active: true,
        roles: [],
      });
    }
    
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    if (activeTab === 'users') {
      setEditingUser(item);
      setEditingRole(null);
      setData({
        name: item.name,
        email: item.email,
        password: '',
        password_confirmation: '',
        is_active: item.is_active,
        roles: item.roles,
      });
    } else if (activeTab === 'roles') {
      setEditingRole(item);
      setEditingUser(null);
      setData({
        name: item.name,
        level: item.level || 1,
        description: item.description || '',
        permissions: item.permissions,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setEditingRole(null);
    reset();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (activeTab === 'users') {
      if (editingUser) {
        put(route('users.update', editingUser.id), { onSuccess: () => closeModal() });
      } else {
        post(route('users.store'), { onSuccess: () => closeModal() });
      }
    } else if (activeTab === 'roles') {
      if (editingRole) {
        put(route('roles.update', editingRole.id), { onSuccess: () => closeModal() });
      } else {
        post(route('roles.store'), { onSuccess: () => closeModal() });
      }
    }
  };

  const handleDelete = (item) => {
    if (!confirm(`Are you sure you want to delete this ${activeTab === 'users' ? 'user' : 'role'}?`)) return;
    
    if (activeTab === 'users') {
      destroy(route('users.destroy', item.id));
    } else if (activeTab === 'roles') {
      destroy(route('roles.destroy', item.id));
    }
  };

  const toggleRole = (roleName) => {
    const currentRoles = [...data.roles];
    const index = currentRoles.indexOf(roleName);
    
    if (index > -1) {
      currentRoles.splice(index, 1);
    } else {
      currentRoles.push(roleName);
    }
    
    setData('roles', currentRoles);
  };

  const togglePermission = (permissionName) => {
    const currentPerms = [...data.permissions];
    const index = currentPerms.indexOf(permissionName);
    
    if (index > -1) {
      currentPerms.splice(index, 1);
    } else {
      currentPerms.push(permissionName);
    }
    
    setData('permissions', currentPerms);
  };

  const toggleGroupPermissions = (groupName) => {
    const groupPerms = groupedPermissions[groupName].map(p => p.name);
    const allSelected = groupPerms.every(p => data.permissions.includes(p));
    
    let newPerms = [...data.permissions];
    
    if (allSelected) {
      // Deselect all in group
      newPerms = newPerms.filter(p => !groupPerms.includes(p));
    } else {
      // Select all in group
      groupPerms.forEach(p => {
        if (!newPerms.includes(p)) {
          newPerms.push(p);
        }
      });
    }
    
    setData('permissions', newPerms);
  };

  const getRoleBadgeColor = (roleName) => {
    const colors = {
      'super_admin': 'bg-purple-100 text-purple-700',
      'admin': 'bg-red-100 text-red-700',
      'hr_manager': 'bg-red-100 text-red-700',
      'manager': 'bg-blue-100 text-blue-700',
      'employee': 'bg-blue-100 text-blue-700',
    };
    return colors[roleName] || 'bg-gray-100 text-gray-700';
  };

  const getLevelBadge = (level) => {
    const colors = {
      5: 'bg-purple-100 text-purple-700',
      4: 'bg-red-100 text-red-700',
      3: 'bg-yellow-100 text-yellow-700',
      2: 'bg-blue-100 text-blue-700',
      1: 'bg-gray-100 text-gray-700',
    };
    return colors[level] || 'bg-gray-100 text-gray-700';
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <AppLayout>
      <Head title="User Management" />
      
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('users')}
              className={`${
                activeTab === 'users'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
            >
              Users
            </button>
            <button
              onClick={() => setActiveTab('roles')}
              className={`${
                activeTab === 'roles'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              } whitespace-nowrap border-b-2 py-4 px-1 text-sm font-medium`}
            >
              Roles & Permissions
            </button>
          </nav>
        </div>

        {/* Users Tab */}
        {activeTab === 'users' && (
          <>
            <div className="sm:flex sm:items-center sm:justify-between mb-6">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Users</h1>
                <p className="mt-1 text-sm text-gray-500">Manage user accounts and their access to the system.</p>
              </div>
              <div className="mt-4 sm:mt-0">
                <button
                  onClick={openCreateModal}
                  className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                >
                  <UserPlusIcon className="h-5 w-5" />
                  Create User
                </button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Roles</option>
                {allRoles.map(role => (
                  <option key={role.id} value={role.name}>{role.name}</option>
                ))}
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Users Table */}
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">User</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Roles</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="py-12 text-center text-sm text-gray-500">
                        No users found.
                      </td>
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
                              <span key={role} className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${getRoleBadgeColor(role)}`}>
                                {role === 'super_admin' ? 'Super Administrator' : role === 'hr_manager' ? 'HR Manager' : role.replace('_', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
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
                            <button 
                              onClick={() => openEditModal(user)} 
                              className="inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                            >
                              View
                            </button>
                            <button 
                              onClick={() => handleDelete(user)} 
                              className="inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium text-red-600 bg-white border border-red-300 hover:bg-red-50"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Roles & Permissions Tab */}
        {activeTab === 'roles' && (
          <>
            <div className="sm:flex sm:items-center sm:justify-between mb-6">
              <div>
                <h1 className="text-2xl font-semibold text-gray-900">Roles & Permissions</h1>
                <p className="mt-1 text-sm text-gray-500">Manage user roles and define what each role can access in the system.</p>
              </div>
              <div className="mt-4 sm:mt-0">
                <button
                  onClick={openCreateModal}
                  className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                >
                  Create Role
                </button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex gap-4 mb-6">
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search roles..."
                  value={roleSearchQuery}
                  onChange={(e) => setRoleSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <select
                value={filterLevel}
                onChange={(e) => setFilterLevel(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Levels</option>
                <option value="5">Level 5</option>
                <option value="4">Level 4</option>
                <option value="3">Level 3</option>
                <option value="2">Level 2</option>
                <option value="1">Level 1</option>
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
              </select>
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
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Permission Summary</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                    <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredRoles.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-12 text-center text-sm text-gray-500">
                        No roles found.
                      </td>
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
                            <span className="text-xs text-gray-500">users assigned</span>
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
                          <span className="inline-flex items-center rounded-md px-2 py-1 text-xs font-medium bg-green-100 text-green-700">
                            Active
                          </span>
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <div className="flex gap-2 justify-end">
                            <button 
                              onClick={() => openEditModal(role)} 
                              className="inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
                            >
                              View
                            </button>
                            <button 
                              onClick={() => openEditModal(role)} 
                              className="inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium text-blue-600 bg-white border border-blue-300 hover:bg-blue-50"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDelete(role)} 
                              className="inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium text-red-600 bg-white border border-red-300 hover:bg-red-50"
                            >
                              Delete
                            </button>
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
        )}
      </div>

      {/* Modal */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95" enterTo="opacity-100 scale-100" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100" leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white text-left align-middle shadow-xl transition-all">
                  <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <Dialog.Title as="h3" className="text-lg font-semibold text-gray-900">
                      {activeTab === 'users' && (editingUser ? 'Edit User' : 'Create New User')}
                      {activeTab === 'roles' && (editingRole ? 'Edit Role' : 'Create New Role')}
                    </Dialog.Title>
                    <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="px-6 py-4">
                    {/* User Form */}
                    {activeTab === 'users' && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input type="text" id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                          </div>
                          <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input type="email" id="email" value={data.email} onChange={(e) => setData('email', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required />
                            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password {editingUser && '(leave blank to keep current)'}</label>
                            <input type="password" id="password" value={data.password} onChange={(e) => setData('password', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required={!editingUser} />
                            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                          </div>
                          <div>
                            <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                            <input type="password" id="password_confirmation" value={data.password_confirmation} onChange={(e) => setData('password_confirmation', e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" required={!editingUser} />
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Roles</label>
                          <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-3">
                            {allRoles.map((role) => (
                              <label key={role.id} className="flex items-center hover:bg-gray-50 p-2 rounded cursor-pointer">
                                <input type="checkbox" checked={data.roles.includes(role.name)} onChange={() => toggleRole(role.name)} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                                <span className="ml-3 text-sm text-gray-700">{role.name}</span>
                              </label>
                            ))}
                          </div>
                          {errors.roles && <p className="mt-1 text-sm text-red-600">{errors.roles}</p>}
                        </div>
                        <div className="flex items-center">
                          <input type="checkbox" id="is_active" checked={data.is_active} onChange={(e) => setData('is_active', e.target.checked)} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                          <label htmlFor="is_active" className="ml-2 block text-sm text-gray-700">Active</label>
                        </div>
                      </div>
                    )}

                    {/* Role Form */}
                    {activeTab === 'roles' && (
                      <div className="space-y-6">
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 mb-4">Basic Information</h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label htmlFor="role_name" className="block text-sm font-medium text-gray-700 mb-1">Role Name *</label>
                              <input 
                                type="text" 
                                id="role_name" 
                                placeholder="e.g. Asset Manager, IT Technician"
                                value={data.name} 
                                onChange={(e) => setData('name', e.target.value)} 
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" 
                                required 
                              />
                              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                            </div>
                            <div>
                              <label htmlFor="role_level" className="block text-sm font-medium text-gray-700 mb-1">Role Level *</label>
                              <select
                                id="role_level"
                                value={data.level}
                                onChange={(e) => setData('level', parseInt(e.target.value))}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                              >
                                <option value="">Select Level</option>
                                <option value="1">Level 1</option>
                                <option value="2">Level 2</option>
                                <option value="3">Level 3</option>
                                <option value="4">Level 4</option>
                                <option value="5">Level 5</option>
                              </select>
                            </div>
                          </div>
                          <div className="mt-4">
                            <label htmlFor="role_description" className="block text-sm font-medium text-gray-700 mb-1">Role Description</label>
                            <textarea
                              id="role_description"
                              rows="3"
                              placeholder="Describe the role's responsibilities and purpose..."
                              value={data.description}
                              onChange={(e) => setData('description', e.target.value)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            />
                          </div>
                        </div>

                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 mb-2">Permissions</h4>
                          <p className="text-sm text-gray-500 mb-4">
                            Select the permissions this role should have. Users with this role will only be able to access the selected features.
                          </p>
                          <div className="border border-gray-300 rounded-lg p-4 max-h-80 overflow-y-auto space-y-4">
                            {Object.entries(groupedPermissions).map(([groupName, permissions]) => (
                              <div key={groupName} className="space-y-2">
                                <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                                  <span className="text-sm font-medium text-gray-900">{groupName}</span>
                                  <button
                                    type="button"
                                    onClick={() => toggleGroupPermissions(groupName)}
                                    className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                                  >
                                    Select All
                                  </button>
                                </div>
                                <div className="grid grid-cols-2 gap-2 pl-4">
                                  {permissions.map((permission) => (
                                    <label key={permission.id} className="flex items-center hover:bg-gray-50 p-2 rounded cursor-pointer">
                                      <input 
                                        type="checkbox" 
                                        checked={data.permissions.includes(permission.name)} 
                                        onChange={() => togglePermission(permission.name)} 
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
                                      />
                                      <div className="ml-3">
                                        <span className="text-sm text-gray-900">{permission.displayName}</span>
                                        <p className="text-xs text-gray-500">{permission.name.split(' ').slice(1).join(' ')}</p>
                                      </div>
                                    </label>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                          <div className="mt-3 text-sm text-blue-600">
                            Selected Permissions: {data.permissions.length} permissions selected
                          </div>
                          {errors.permissions && <p className="mt-1 text-sm text-red-600">{errors.permissions}</p>}
                        </div>
                      </div>
                    )}
                    
                    <div className="mt-6 flex gap-3 justify-end border-t border-gray-200 pt-4">
                      <button type="button" onClick={closeModal} className="rounded-lg px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50">
                        Cancel
                      </button>
                      <button type="submit" disabled={processing} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
                        {processing ? 'Saving...' : (editingUser || editingRole ? (activeTab === 'roles' ? 'Update Role' : 'Update User') : (activeTab === 'roles' ? 'Create Role' : 'Create User'))}
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </AppLayout>
  );
}
