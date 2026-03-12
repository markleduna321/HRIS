import React, { useState, useMemo } from 'react';
import AppLayout from '../layout';
import { Head, useForm, router } from '@inertiajs/react';
import { FormModal, showDeleteConfirm, showSuccess } from '@/app/components';
import UsersTabSection from './_sections/UsersTabSection';
import RolesTabSection from './_sections/RolesTabSection';
import UserFormSection from './_sections/UserFormSection';
import RoleFormSection from './_sections/RoleFormSection';

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

  const { data, setData, post, put, processing, errors, reset } = useForm({
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

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || user.roles.includes(filterRole);
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'active' && user.is_active) || 
                         (filterStatus === 'inactive' && !user.is_active);
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Filter roles
  const filteredRoles = roles.filter(role => {
    const matchesSearch = role.name.toLowerCase().includes(roleSearchQuery.toLowerCase()) ||
                         (role.description && role.description.toLowerCase().includes(roleSearchQuery.toLowerCase()));
    const matchesLevel = filterLevel === 'all' || role.level === parseInt(filterLevel);
    return matchesSearch && matchesLevel;
  });

  // Role stats
  const roleStats = useMemo(() => ({
    totalRoles: roles.length,
    activeRoles: roles.length,
    usersAssigned: roles.reduce((sum, role) => sum + role.users_count, 0),
    customRoles: roles.filter(r => !['super_admin', 'admin', 'hr_manager', 'manager', 'employee'].includes(r.name)).length,
  }), [roles]);

  const openCreateModal = () => {
    reset();
    setEditingUser(null);
    setEditingRole(null);
    
    if (activeTab === 'roles') {
      setData({ name: '', level: 1, description: '', permissions: [] });
    } else {
      setData({ name: '', email: '', password: '', password_confirmation: '', is_active: true, roles: [] });
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
      const onSuccess = () => {
        closeModal();
        showSuccess({
          title: editingUser ? 'User Updated' : 'User Created',
          content: `User has been ${editingUser ? 'updated' : 'created'} successfully.`,
        });
      };
      
      if (editingUser) {
        put(route('users.update', editingUser.id), { onSuccess });
      } else {
        post(route('users.store'), { onSuccess });
      }
    } else if (activeTab === 'roles') {
      const onSuccess = () => {
        closeModal();
        showSuccess({
          title: editingRole ? 'Role Updated' : 'Role Created',
          content: `Role has been ${editingRole ? 'updated' : 'created'} successfully.`,
        });
      };
      
      if (editingRole) {
        put(route('roles.update', editingRole.id), { onSuccess });
      } else {
        post(route('roles.store'), { onSuccess });
      }
    }
  };

  const handleDelete = (item) => {
    showDeleteConfirm({
      title: `Delete ${activeTab === 'users' ? 'User' : 'Role'}?`,
      content: `Are you sure you want to delete this ${activeTab === 'users' ? 'user' : 'role'}? This action cannot be undone.`,
      onOk: () => {
        if (activeTab === 'users') {
          router.delete(route('users.destroy', item.id), {
            onSuccess: () => showSuccess({ title: 'User Deleted', content: 'User has been deleted successfully.' })
          });
        } else {
          router.delete(route('roles.destroy', item.id), {
            onSuccess: () => showSuccess({ title: 'Role Deleted', content: 'Role has been deleted successfully.' })
          });
        }
      }
    });
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
      newPerms = newPerms.filter(p => !groupPerms.includes(p));
    } else {
      groupPerms.forEach(p => {
        if (!newPerms.includes(p)) newPerms.push(p);
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
    return name.split(' ').map(word => word[0]).join('').toUpperCase().substring(0, 2);
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
          <UsersTabSection
            filteredUsers={filteredUsers}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filterRole={filterRole}
            setFilterRole={setFilterRole}
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            allRoles={allRoles}
            openCreateModal={openCreateModal}
            openEditModal={openEditModal}
            handleDelete={handleDelete}
            getRoleBadgeColor={getRoleBadgeColor}
            getInitials={getInitials}
          />
        )}

        {/* Roles & Permissions Tab */}
        {activeTab === 'roles' && (
          <RolesTabSection
            filteredRoles={filteredRoles}
            roleSearchQuery={roleSearchQuery}
            setRoleSearchQuery={setRoleSearchQuery}
            filterLevel={filterLevel}
            setFilterLevel={setFilterLevel}
            roleStats={roleStats}
            openCreateModal={openCreateModal}
            openEditModal={openEditModal}
            handleDelete={handleDelete}
            getLevelBadge={getLevelBadge}
          />
        )}
      </div>

      {/* Modal */}
      <FormModal
        open={isModalOpen}
        onClose={closeModal}
        onSubmit={handleSubmit}
        title={activeTab === 'users' 
          ? (editingUser ? 'Edit User' : 'Create New User')
          : (editingRole ? 'Edit Role' : 'Create New Role')
        }
        size="lg"
        submitText={activeTab === 'users' 
          ? (editingUser ? 'Update User' : 'Create User')
          : (editingRole ? 'Update Role' : 'Create Role')
        }
        loading={processing}
      >
        {/* User Form */}
        {activeTab === 'users' && (
          <UserFormSection
            data={data}
            setData={setData}
            errors={errors}
            editingUser={editingUser}
            allRoles={allRoles}
            toggleRole={toggleRole}
          />
        )}

        {/* Role Form */}
        {activeTab === 'roles' && (
          <RoleFormSection
            data={data}
            setData={setData}
            errors={errors}
            groupedPermissions={groupedPermissions}
            togglePermission={togglePermission}
            toggleGroupPermissions={toggleGroupPermissions}
          />
        )}
      </FormModal>
    </AppLayout>
  );
}
