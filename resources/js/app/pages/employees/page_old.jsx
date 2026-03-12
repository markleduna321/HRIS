import React, { useState } from 'react';
import AppLayout from '../layout';
import { Head, useForm, router } from '@inertiajs/react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Button, IconButton, FormModal, Input, Select, showDeleteConfirm, showSuccess } from '@/app/components';

export default function EmployeesPage({ employees = [], departments = [] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);

  const { data, setData, post, put, processing, errors, reset } = useForm({
    employee_number: '',
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

  const handleOpenModal = (employee = null) => {
    if (employee) {
      setEditingEmployee(employee);
      setData({
        employee_number: employee.employee_number || '',
        department_id: employee.department_id || '',
        position: employee.position || '',
        first_name: employee.first_name || '',
        middle_name: employee.middle_name || '',
        last_name: employee.last_name || '',
        email: employee.email || '',
        phone: employee.phone || '',
        date_of_birth: employee.date_of_birth || '',
        gender: employee.gender || '',
        address: employee.address || '',
        city: employee.city || '',
        state: employee.state || '',
        zip_code: employee.zip_code || '',
        country: employee.country || 'Philippines',
        date_hired: employee.date_hired || '',
        employment_status: employee.employment_status || 'active',
        sss_number: employee.sss_number || '',
        tin_number: employee.tin_number || '',
        philhealth_number: employee.philhealth_number || '',
        pagibig_number: employee.pagibig_number || '',
        emergency_contact_name: employee.emergency_contact_name || '',
        emergency_contact_phone: employee.emergency_contact_phone || '',
        emergency_contact_relationship: employee.emergency_contact_relationship || '',
      });
    } else {
      setEditingEmployee(null);
      reset();
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEmployee(null);
    reset();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const onSuccess = () => {
      handleCloseModal();
      showSuccess({
        title: editingEmployee ? 'Employee Updated' : 'Employee Created',
        content: `Employee has been ${editingEmployee ? 'updated' : 'created'} successfully.`,
      });
    };
    
    if (editingEmployee) {
      put(route('employees.update', editingEmployee.id), { onSuccess });
    } else {
      post(route('employees.store'), { onSuccess });
    }
  };

  const handleDelete = (employee) => {
    showDeleteConfirm({
      title: `Delete ${employee.full_name}?`,
      content: 'Are you sure you want to delete this employee? This will also delete the associated user account. This action cannot be undone.',
      onOk: () => {
        router.delete(route('employees.destroy', employee.id), {
          onSuccess: () => showSuccess({ 
            title: 'Employee Deleted', 
            content: `${employee.full_name} has been deleted successfully.`
          })
        });
      }
    });
  };

  return (
    <AppLayout>
      <Head title="Employees" />
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Employee Management</h1>
            <p className="mt-2 text-sm text-gray-700">
              Manage employee records and information.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <Button onClick={() => handleOpenModal()} icon={<PlusIcon className="h-5 w-5" />}>
              Add Employee
            </Button>
          </div>
        </div>

        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Employee #</th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Name</th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Email</th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Department</th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Position</th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                      <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {employees.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="py-12 text-center text-gray-500">
                          No employees found. Add your first employee to get started.
                        </td>
                      </tr>
                    ) : (
                      employees.map((employee) => (
                        <tr key={employee.id} className="hover:bg-gray-50">
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                            {employee.employee_number}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">{employee.full_name}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{employee.user_email}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{employee.department_name}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{employee.position}</td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm">
                            <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                              employee.employment_status === 'active' ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-700'
                            }`}>
                              {employee.employment_status}
                            </span>
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <div className="flex gap-2 justify-end">
                              <IconButton
                                icon={<PencilIcon />}
                                variant="ghost-primary"
                                size="sm"
                                onClick={() => handleOpenModal(employee)}
                                title="Edit employee"
                              />
                              <IconButton
                                icon={<TrashIcon />}
                                variant="ghost-danger"
                                size="sm"
                                onClick={() => handleDelete(employee)}
                                title="Delete employee"
                              />
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Employee Modal */}
      <FormModal
        open={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        title={editingEmployee ? 'Edit Employee' : 'Add New Employee'}
        size="xl"
        submitText={editingEmployee ? 'Update Employee' : 'Create Employee'}
        loading={processing}
      >
        <div className="space-y-6">
          <p className="text-sm text-gray-500">
            {editingEmployee ? 'Update employee information' : 'Fill in the employee details. A user account will be created automatically.'}
          </p>

          {/* Basic Information */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Basic Information</h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Input
                label="Employee Number"
                value={data.employee_number}
                onChange={(e) => setData('employee_number', e.target.value)}
                error={errors.employee_number}
                required
              />
              
              <Select
                label="Department"
                value={data.department_id}
                onChange={(e) => setData('department_id', e.target.value)}
                error={errors.department_id}
                placeholder="Select Department"
                required
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept.id} value={dept.id}>{dept.name}</option>
                ))}
              </Select>
              
              <Input
                label="Position"
                value={data.position}
                onChange={(e) => setData('position', e.target.value)}
                error={errors.position}
                required
              />
            </div>
          </div>

          {/* Personal Information */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Personal Information</h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Input
                label="First Name"
                value={data.first_name}
                onChange={(e) => setData('first_name', e.target.value)}
                error={errors.first_name}
                required
              />
              
              <Input
                label="Middle Name"
                value={data.middle_name}
                onChange={(e) => setData('middle_name', e.target.value)}
              />
              
              <Input
                label="Last Name"
                value={data.last_name}
                onChange={(e) => setData('last_name', e.target.value)}
                error={errors.last_name}
                required
              />
              
              <Input
                label="Email"
                type="email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                error={errors.email}
                required
              />
              
              <Input
                label="Phone"
                type="tel"
                value={data.phone}
                onChange={(e) => setData('phone', e.target.value)}
                error={errors.phone}
                required
              />
              
              <Input
                label="Date of Birth"
                type="date"
                value={data.date_of_birth}
                onChange={(e) => setData('date_of_birth', e.target.value)}
                error={errors.date_of_birth}
                required
              />
              
              <Select
                label="Gender"
                value={data.gender}
                onChange={(e) => setData('gender', e.target.value)}
                error={errors.gender}
                placeholder="Select Gender"
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </Select>
            </div>
          </div>

          {/* Address Information */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Address Information</h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="sm:col-span-2 lg:col-span-3">
                <Input
                  label="Address"
                  value={data.address}
                  onChange={(e) => setData('address', e.target.value)}
                  error={errors.address}
                  required
                />
              </div>
              
              <Input
                label="City"
                value={data.city}
                onChange={(e) => setData('city', e.target.value)}
                error={errors.city}
                required
              />
              
              <Input
                label="State/Province"
                value={data.state}
                onChange={(e) => setData('state', e.target.value)}
                error={errors.state}
                required
              />
              
              <Input
                label="Zip Code"
                value={data.zip_code}
                onChange={(e) => setData('zip_code', e.target.value)}
                error={errors.zip_code}
                required
              />
            </div>
          </div>

          {/* Employment Information */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Employment Information</h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Date Hired"
                type="date"
                value={data.date_hired}
                onChange={(e) => setData('date_hired', e.target.value)}
                error={errors.date_hired}
                required
              />
              
              <Select
                label="Employment Status"
                value={data.employment_status}
                onChange={(e) => setData('employment_status', e.target.value)}
                error={errors.employment_status}
                required
              >
                <option value="active">Active</option>
                <option value="on_leave">On Leave</option>
                <option value="resigned">Resigned</option>
                <option value="terminated">Terminated</option>
              </Select>
            </div>
          </div>

          {/* Government IDs */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Government IDs (Philippines)</h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="SSS Number"
                value={data.sss_number}
                onChange={(e) => setData('sss_number', e.target.value)}
                error={errors.sss_number}
              />
              
              <Input
                label="TIN Number"
                value={data.tin_number}
                onChange={(e) => setData('tin_number', e.target.value)}
                error={errors.tin_number}
              />
              
              <Input
                label="PhilHealth Number"
                value={data.philhealth_number}
                onChange={(e) => setData('philhealth_number', e.target.value)}
                error={errors.philhealth_number}
              />
              
              <Input
                label="Pag-IBIG Number"
                value={data.pagibig_number}
                onChange={(e) => setData('pagibig_number', e.target.value)}
                error={errors.pagibig_number}
              />
            </div>
          </div>

          {/* Emergency Contact */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-4">Emergency Contact</h4>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Input
                label="Contact Name"
                value={data.emergency_contact_name}
                onChange={(e) => setData('emergency_contact_name', e.target.value)}
                error={errors.emergency_contact_name}
                required
              />
              
              <Input
                label="Contact Phone"
                type="tel"
                value={data.emergency_contact_phone}
                onChange={(e) => setData('emergency_contact_phone', e.target.value)}
                error={errors.emergency_contact_phone}
                required
              />
              
              <Input
                label="Relationship"
                value={data.emergency_contact_relationship}
                onChange={(e) => setData('emergency_contact_relationship', e.target.value)}
                error={errors.emergency_contact_relationship}
                required
              />
            </div>
          </div>
        </div>
      </FormModal>
    </AppLayout>
  );
}
