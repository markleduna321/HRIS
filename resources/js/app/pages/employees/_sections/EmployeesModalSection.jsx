import React, { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { FormModal, showSuccess } from '@/app/components';
import EmployeeFormSection from './EmployeeFormSection';
import {
  createEmployee as createEmployeeThunk,
  updateEmployee as updateEmployeeThunk,
} from '../_redux';

export default function EmployeesModalSection({ 
  isOpen, 
  onClose, 
  editingEmployee,
  departments,
  employees 
}) {
  const dispatch = useDispatch();
  
  // Generate next employee number
  const generateEmployeeNumber = useCallback(() => {
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2); // Last 2 digits
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); // 01-12
    const day = now.getDate().toString().padStart(2, '0'); // 01-31
    const datePrefix = `${year}${month}${day}`; // e.g., 260312
    
    // Find all employees created today
    const todayEmployees = employees.filter(emp => 
      emp.employee_number && emp.employee_number.startsWith(datePrefix)
    );
    
    if (todayEmployees.length === 0) {
      return `${datePrefix}01`; // First employee of the day
    }
    
    // Extract sequential numbers (last 2 digits)
    const numbers = todayEmployees.map(emp => {
      const numPart = emp.employee_number.slice(-2); // Last 2 digits
      return parseInt(numPart) || 0;
    });
    
    const maxNumber = Math.max(...numbers);
    const nextNumber = (maxNumber + 1).toString().padStart(2, '0');
    
    return `${datePrefix}${nextNumber}`;
  }, [employees]);

  const [formData, setFormData] = useState({
    employee_number: editingEmployee?.employee_number || generateEmployeeNumber(),
    department_id: editingEmployee?.department_id || '',
    position: editingEmployee?.position || '',
    first_name: editingEmployee?.first_name || '',
    middle_name: editingEmployee?.middle_name || '',
    last_name: editingEmployee?.last_name || '',
    email: editingEmployee?.email || '',
    phone: editingEmployee?.phone || '',
    date_of_birth: editingEmployee?.date_of_birth || '',
    gender: editingEmployee?.gender || '',
    address: editingEmployee?.address || '',
    city: editingEmployee?.city || '',
    state: editingEmployee?.state || '',
    zip_code: editingEmployee?.zip_code || '',
    country: editingEmployee?.country || 'Philippines',
    date_hired: editingEmployee?.date_hired || '',
    employment_status: editingEmployee?.employment_status || 'active',
    sss_number: editingEmployee?.sss_number || '',
    tin_number: editingEmployee?.tin_number || '',
    philhealth_number: editingEmployee?.philhealth_number || '',
    pagibig_number: editingEmployee?.pagibig_number || '',
    emergency_contact_name: editingEmployee?.emergency_contact_name || '',
    emergency_contact_phone: editingEmployee?.emergency_contact_phone || '',
    emergency_contact_relationship: editingEmployee?.emergency_contact_relationship || '',
  });
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);

  // Update form data when editing employee changes
  React.useEffect(() => {
    if (editingEmployee) {
      setFormData({
        employee_number: editingEmployee.employee_number || '',
        department_id: editingEmployee.department_id || '',
        position: editingEmployee.position || '',
        first_name: editingEmployee.first_name || '',
        middle_name: editingEmployee.middle_name || '',
        last_name: editingEmployee.last_name || '',
        email: editingEmployee.email || '',
        phone: editingEmployee.phone || '',
        date_of_birth: editingEmployee.date_of_birth || '',
        gender: editingEmployee.gender || '',
        address: editingEmployee.address || '',
        city: editingEmployee.city || '',
        state: editingEmployee.state || '',
        zip_code: editingEmployee.zip_code || '',
        country: editingEmployee.country || 'Philippines',
        date_hired: editingEmployee.date_hired || '',
        employment_status: editingEmployee.employment_status || 'active',
        sss_number: editingEmployee.sss_number || '',
        tin_number: editingEmployee.tin_number || '',
        philhealth_number: editingEmployee.philhealth_number || '',
        pagibig_number: editingEmployee.pagibig_number || '',
        emergency_contact_name: editingEmployee.emergency_contact_name || '',
        emergency_contact_phone: editingEmployee.emergency_contact_phone || '',
        emergency_contact_relationship: editingEmployee.emergency_contact_relationship || '',
      });
    } else {
      setFormData({
        employee_number: generateEmployeeNumber(),
        department_id: '',
        position: '',
        first_name: '',
        middle_name: '',
        last_name: '',
        email: '',
        phone: '',
        date_of_birth: '',
        gender: '',
        address: '',
        city: '',
        state: '',
        zip_code: '',
        country: 'Philippines',
        date_hired: '',
        employment_status: 'active',
        sss_number: '',
        tin_number: '',
        philhealth_number: '',
        pagibig_number: '',
        emergency_contact_name: '',
        emergency_contact_phone: '',
        emergency_contact_relationship: '',
      });
    }
    setErrors({});
  }, [editingEmployee, isOpen, generateEmployeeNumber]);

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setProcessing(true);
    setErrors({});
    
    try {
      if (editingEmployee) {
        await dispatch(updateEmployeeThunk({ 
          id: editingEmployee.id, 
          data: formData 
        })).unwrap();
        showSuccess({
          title: 'Employee Updated',
          content: 'Employee has been updated successfully.',
        });
      } else {
        await dispatch(createEmployeeThunk(formData)).unwrap();
        showSuccess({
          title: 'Employee Created',
          content: 'Employee has been created successfully.',
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

  return (
    <FormModal
      open={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title={editingEmployee ? 'Edit Employee' : 'Add New Employee'}
      submitText={editingEmployee ? 'Update Employee' : 'Create Employee'}
      loading={processing}
      size="xl"
    >
      <EmployeeFormSection
        data={formData}
        setData={handleSetData}
        errors={errors}
        departments={departments}
        editingEmployee={editingEmployee}
      />
    </FormModal>
  );
}
