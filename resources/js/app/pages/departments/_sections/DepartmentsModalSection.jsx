import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { FormModal, showSuccess } from '@/app/components';
import DepartmentFormSection from './DepartmentFormSection';
import {
  createDepartment as createDepartmentThunk,
  updateDepartment as updateDepartmentThunk,
} from '../_redux';

export default function DepartmentsModalSection({ 
  isOpen, 
  onClose, 
  editingDepartment 
}) {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: editingDepartment?.name || '',
    code: editingDepartment?.code || '',
    description: editingDepartment?.description || '',
  });
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);

  // Update form data when editing department changes
  React.useEffect(() => {
    if (editingDepartment) {
      setFormData({
        name: editingDepartment.name || '',
        code: editingDepartment.code || '',
        description: editingDepartment.description || '',
      });
    } else {
      setFormData({
        name: '',
        code: '',
        description: '',
      });
    }
    setErrors({});
  }, [editingDepartment, isOpen]);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setProcessing(true);
    setErrors({});
    
    try {
      if (editingDepartment) {
        await dispatch(updateDepartmentThunk({ 
          id: editingDepartment.id, 
          data: formData 
        })).unwrap();
        showSuccess({
          title: 'Department Updated',
          content: 'Department has been updated successfully.',
        });
      } else {
        await dispatch(createDepartmentThunk(formData)).unwrap();
        showSuccess({
          title: 'Department Created',
          content: 'Department has been created successfully.',
        });
      }
      onClose();
    } catch (error) {
      setErrors(error.errors || {});
    } finally {
      setProcessing(false);
    }
  };

  return (
    <FormModal
      open={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title={editingDepartment ? 'Edit Department' : 'Add New Department'}
      submitText={editingDepartment ? 'Update Department' : 'Create Department'}
      loading={processing}
    >
      <DepartmentFormSection
        data={formData}
        setData={setFormData}
        errors={errors}
        editingDepartment={editingDepartment}
      />
    </FormModal>
  );
}
