import React, { useState, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { FormModal, showSuccess } from '@/app/components';
import RoleFormSection from './RoleFormSection';
import {
  createRole as createRoleThunk,
  updateRole as updateRoleThunk,
} from '../_redux/roles-thunk';

export default function RolesModalSection({ 
  isOpen, 
  onClose, 
  editingRole,
  permissions 
}) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: editingRole?.name || '',
    level: editingRole?.level || '',
    description: editingRole?.description || '',
    permissions: editingRole?.permissions?.map((perm) => perm.name) || [],
  });
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);

  // Group permissions by module
  const groupedPermissions = useMemo(() => {
    const groups = {};
    
    permissions.forEach(permission => {
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
  }, [permissions]);

  // Update form data when editing role changes
  React.useEffect(() => {
    if (editingRole) {
      setFormData({
        name: editingRole.name || '',
        level: editingRole.level || '',
        description: editingRole.description || '',
        permissions: editingRole.permissions?.map((perm) => perm.name) || [],
      });
    } else {
      setFormData({
        name: '',
        level: '',
        description: '',
        permissions: [],
      });
    }
    setErrors({});
  }, [editingRole, isOpen]);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setProcessing(true);
    setErrors({});
    
    try {
      if (editingRole) {
        await dispatch(updateRoleThunk({ 
          id: editingRole.id, 
          data: formData 
        })).unwrap();
        showSuccess({
          title: 'Role Updated',
          content: 'Role has been updated successfully.',
        });
      } else {
        await dispatch(createRoleThunk(formData)).unwrap();
        showSuccess({
          title: 'Role Created',
          content: 'Role has been created successfully.',
        });
      }
      onClose();
    } catch (error) {
      setErrors(error.errors || {});
    } finally {
      setProcessing(false);
    }
  };

  const handleSetData = (key, value) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const togglePermission = (permissionName) => {
    const currentPerms = [...formData.permissions];
    const index = currentPerms.indexOf(permissionName);
    if (index > -1) {
      currentPerms.splice(index, 1);
    } else {
      currentPerms.push(permissionName);
    }
    setFormData(prev => ({ ...prev, permissions: currentPerms }));
  };

  const toggleGroupPermissions = (groupName) => {
    const groupPerms = groupedPermissions[groupName].map(p => p.name);
    const allSelected = groupPerms.every(p => formData.permissions.includes(p));
    
    let newPerms = [...formData.permissions];
    if (allSelected) {
      newPerms = newPerms.filter(p => !groupPerms.includes(p));
    } else {
      groupPerms.forEach(p => {
        if (!newPerms.includes(p)) newPerms.push(p);
      });
    }
    setFormData(prev => ({ ...prev, permissions: newPerms }));
  };

  return (
    <FormModal
      open={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title={editingRole ? 'Edit Role' : 'Add New Role'}
      submitText={editingRole ? 'Update Role' : 'Create Role'}
      loading={processing}
      size="xl"
    >
      <RoleFormSection
        data={formData}
        setData={handleSetData}
        errors={errors}
        groupedPermissions={groupedPermissions}
        togglePermission={togglePermission}
        toggleGroupPermissions={toggleGroupPermissions}
        editingRole={editingRole}
      />
    </FormModal>
  );
}
