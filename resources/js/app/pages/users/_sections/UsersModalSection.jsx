import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { FormModal, showSuccess } from '@/app/components';
import UserFormSection from './UserFormSection';
import {
  createUser as createUserThunk,
  updateUser as updateUserThunk,
} from '../_redux/user-management-thunk';

export default function UsersModalSection({ 
  isOpen, 
  onClose, 
  editingUser,
  roles 
}) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    first_name: editingUser?.first_name || '',
    last_name: editingUser?.last_name || '',
    email: editingUser?.email || '',
    password: '',
    password_confirmation: '',
    roles: editingUser?.roles?.map((role) => role.name) || [],
    is_active: editingUser?.is_active ?? true,
  });
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);

  // Update form data when editing user changes
  React.useEffect(() => {
    if (editingUser) {
      setFormData({
        first_name: editingUser.first_name || '',
        last_name: editingUser.last_name || '',
        email: editingUser.email || '',
        password: '',
        password_confirmation: '',
        roles: editingUser.roles?.map((role) => role.name) || [],
        is_active: editingUser.is_active ?? true,
      });
    } else {
      setFormData({
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        password_confirmation: '',
        roles: [],
        is_active: true,
      });
    }
    setErrors({});
  }, [editingUser, isOpen]);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setProcessing(true);
    setErrors({});
    
    try {
      if (editingUser) {
        await dispatch(updateUserThunk({ 
          id: editingUser.id, 
          data: formData 
        })).unwrap();
        showSuccess({
          title: 'User Updated',
          content: 'User has been updated successfully.',
        });
      } else {
        await dispatch(createUserThunk(formData)).unwrap();
        showSuccess({
          title: 'User Created',
          content: 'User has been created successfully.',
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

  const toggleRole = (roleName) => {
    const currentRoles = [...formData.roles];
    const index = currentRoles.indexOf(roleName);
    if (index > -1) {
      currentRoles.splice(index, 1);
    } else {
      currentRoles.push(roleName);
    }
    setFormData(prev => ({ ...prev, roles: currentRoles }));
  };

  return (
    <FormModal
      open={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title={editingUser ? 'Edit User' : 'Add New User'}
      submitText={editingUser ? 'Update User' : 'Create User'}
      loading={processing}
      size="lg"
    >
      <UserFormSection
        data={formData}
        setData={handleSetData}
        errors={errors}
        allRoles={roles}
        toggleRole={toggleRole}
        editingUser={editingUser}
      />
    </FormModal>
  );
}
