import React, { useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AppLayout from '../layout';
import { Head } from '@inertiajs/react';
import UsersTabSection from './_sections/UsersTabSection';
import RolesTabSection from './_sections/RolesTabSection';
import UsersModalSection from './_sections/UsersModalSection';
import RolesModalSection from './_sections/RolesModalSection';
import {
  fetchUsers,
} from './_redux/user-management-thunk';
import {
  fetchRoles,
  fetchPermissions,
} from './_redux/roles-thunk';

export default function UserManagementPage() {
  const dispatch = useDispatch();
  const { users, loading: usersLoading } = useSelector((state) => state.users);
  const { roles, permissions, loading: rolesLoading } = useSelector((state) => state.roles);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editingRole, setEditingRole] = useState(null);
  const [activeTab, setActiveTab] = useState('users');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterLevel, setFilterLevel] = useState('all');
  const [roleSearchQuery, setRoleSearchQuery] = useState('');

  // Fetch data on mount
  useEffect(() => {
    dispatch(fetchUsers());
    dispatch(fetchRoles());
    dispatch(fetchPermissions());
  }, [dispatch]);

  // Extract all roles for filter dropdown
  const allRoles = useMemo(() => {
    return roles.map(role => role.name);
  }, [roles]);

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = (user.name || '').toLowerCase().includes(searchQuery.toLowerCase()) || 
                         (user.email || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || (user.roles && user.roles.some(role => role.name === filterRole));
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
    usersAssigned: roles.reduce((sum, role) => sum + (role.users_count || 0), 0),
    customRoles: roles.filter(r => !['super_admin', 'admin', 'hr_manager', 'manager', 'employee'].includes(r.name)).length,
  }), [roles]);

  const openCreateModal = () => {
    setEditingUser(null);
    setEditingRole(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    if (activeTab === 'users') {
      setEditingUser(item);
      setEditingRole(null);
    } else if (activeTab === 'roles') {
      setEditingRole(item);
      setEditingUser(null);
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
    setEditingRole(null);
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

  const loading = usersLoading || rolesLoading;

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

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Loading...</div>
          </div>
        ) : (
          <>
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
                getLevelBadge={getLevelBadge}
              />
            )}
          </>
        )}
      </div>

      {/* Modals */}
      <UsersModalSection
        isOpen={isModalOpen && activeTab === 'users'}
        onClose={closeModal}
        editingUser={editingUser}
        roles={roles}
      />
      
      <RolesModalSection
        isOpen={isModalOpen && activeTab === 'roles'}
        onClose={closeModal}
        editingRole={editingRole}
        permissions={permissions}
      />
    </AppLayout>
  );
}
