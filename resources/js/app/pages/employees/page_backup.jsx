import React, { useState } from 'react';
import AppLayout from '../layout';
import { Head, useForm, router } from '@inertiajs/react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

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
    
    if (editingEmployee) {
      put(route('employees.update', editingEmployee.id), {
        onSuccess: () => {
          handleCloseModal();
        },
      });
    } else {
      post(route('employees.store'), {
        onSuccess: () => {
          handleCloseModal();
        },
      });
    }
  };

  const handleDelete = (employee) => {
    if (confirm(`Are you sure you want to delete ${employee.full_name}?`)) {
      router.delete(route('employees.destroy', employee.id));
    }
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
            <button
              type="button"
              onClick={() => handleOpenModal()}
              className="inline-flex items-center gap-x-1.5 rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500"
            >
              <PlusIcon className="-ml-0.5 h-5 w-5" />
              Add Employee
            </button>
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
                        <tr key={employee.id}>
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
                            <button
                              onClick={() => handleOpenModal(employee)}
                              className="text-blue-600 hover:text-blue-900 mr-4"
                            >
                              <PencilIcon className="h-5 w-5" />
                            </button>
                            <button
                              onClick={() => handleDelete(employee)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <TrashIcon className="h-5 w-5" />
                            </button>
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
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center px-4 pt-4 pb-20 text-center sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={handleCloseModal}></div>

            <div className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full sm:p-6">
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {editingEmployee ? 'Update employee information' : 'Fill in the employee details. A user account will be created automatically.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 max-h-96 overflow-y-auto px-1">
                  {/* Employee Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Employee Number*</label>
                    <input
                      type="text"
                      value={data.employee_number}
                      onChange={(e) => setData('employee_number', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      required
                    />
                    {errors.employee_number && <p className="mt-1 text-sm text-red-600">{errors.employee_number}</p>}
                  </div>

                  {/* Department */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Department*</label>
                    <select
                      value={data.department_id}
                      onChange={(e) => setData('department_id', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      required
                    >
                      <option value="">Select Department</option>
                      {departments.map((dept) => (
                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                      ))}
                    </select>
                    {errors.department_id && <p className="mt-1 text-sm text-red-600">{errors.department_id}</p>}
                  </div>

                  {/* Position */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Position*</label>
                    <input
                      type="text"
                      value={data.position}
                      onChange={(e) => setData('position', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      required
                    />
                    {errors.position && <p className="mt-1 text-sm text-red-600">{errors.position}</p>}
                  </div>

                  {/* First Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">First Name*</label>
                    <input
                      type="text"
                      value={data.first_name}
                      onChange={(e) => setData('first_name', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      required
                    />
                    {errors.first_name && <p className="mt-1 text-sm text-red-600">{errors.first_name}</p>}
                  </div>

                  {/* Middle Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Middle Name</label>
                    <input
                      type="text"
                      value={data.middle_name}
                      onChange={(e) => setData('middle_name', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                  </div>

                  {/* Last Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Name*</label>
                    <input
                      type="text"
                      value={data.last_name}
                      onChange={(e) => setData('last_name', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      required
                    />
                    {errors.last_name && <p className="mt-1 text-sm text-red-600">{errors.last_name}</p>}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email*</label>
                    <input
                      type="email"
                      value={data.email}
                      onChange={(e) => setData('email', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      required
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Phone*</label>
                    <input
                      type="text"
                      value={data.phone}
                      onChange={(e) => setData('phone', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      required
                    />
                    {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                  </div>

                  {/* Date of Birth */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date of Birth*</label>
                    <input
                      type="date"
                      value={data.date_of_birth}
                      onChange={(e) => setData('date_of_birth', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      required
                    />
                    {errors.date_of_birth && <p className="mt-1 text-sm text-red-600">{errors.date_of_birth}</p>}
                  </div>

                  {/* Gender */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Gender*</label>
                    <select
                      value={data.gender}
                      onChange={(e) => setData('gender', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                    {errors.gender && <p className="mt-1 text-sm text-red-600">{errors.gender}</p>}
                  </div>

                  {/* Address */}
                  <div className="sm:col-span-2 lg:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">Address*</label>
                    <input
                      type="text"
                      value={data.address}
                      onChange={(e) => setData('address', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      required
                    />
                    {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                  </div>

                  {/* City */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">City*</label>
                    <input
                      type="text"
                      value={data.city}
                      onChange={(e) => setData('city', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      required
                    />
                    {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
                  </div>

                  {/* State/Province */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">State/Province*</label>
                    <input
                      type="text"
                      value={data.state}
                      onChange={(e) => setData('state', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      required
                    />
                    {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state}</p>}
                  </div>

                  {/* Zip Code */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Zip Code*</label>
                    <input
                      type="text"
                      value={data.zip_code}
                      onChange={(e) => setData('zip_code', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      required
                    />
                    {errors.zip_code && <p className="mt-1 text-sm text-red-600">{errors.zip_code}</p>}
                  </div>

                  {/* Date Hired */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Date Hired*</label>
                    <input
                      type="date"
                      value={data.date_hired}
                      onChange={(e) => setData('date_hired', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      required
                    />
                    {errors.date_hired && <p className="mt-1 text-sm text-red-600">{errors.date_hired}</p>}
                  </div>

                  {/* Employment Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Employment Status*</label>
                    <select
                      value={data.employment_status}
                      onChange={(e) => setData('employment_status', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      required
                    >
                      <option value="active">Active</option>
                      <option value="on_leave">On Leave</option>
                      <option value="resigned">Resigned</option>
                      <option value="terminated">Terminated</option>
                    </select>
                    {errors.employment_status && <p className="mt-1 text-sm text-red-600">{errors.employment_status}</p>}
                  </div>

                  {/* Government IDs */}
                  <div className="sm:col-span-2 lg:col-span-3 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900 mb-4">Government IDs (Philippines)</h4>
                  </div>

                  {/* SSS Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">SSS Number</label>
                    <input
                      type="text"
                      value={data.sss_number}
                      onChange={(e) => setData('sss_number', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                    {errors.sss_number && <p className="mt-1 text-sm text-red-600">{errors.sss_number}</p>}
                  </div>

                  {/* TIN Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">TIN Number</label>
                    <input
                      type="text"
                      value={data.tin_number}
                      onChange={(e) => setData('tin_number', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                    {errors.tin_number && <p className="mt-1 text-sm text-red-600">{errors.tin_number}</p>}
                  </div>

                  {/* PhilHealth Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">PhilHealth Number</label>
                    <input
                      type="text"
                      value={data.philhealth_number}
                      onChange={(e) => setData('philhealth_number', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                    {errors.philhealth_number && <p className="mt-1 text-sm text-red-600">{errors.philhealth_number}</p>}
                  </div>

                  {/* Pag-IBIG Number */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Pag-IBIG Number</label>
                    <input
                      type="text"
                      value={data.pagibig_number}
                      onChange={(e) => setData('pagibig_number', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    />
                    {errors.pagibig_number && <p className="mt-1 text-sm text-red-600">{errors.pagibig_number}</p>}
                  </div>

                  {/* Emergency Contact */}
                  <div className="sm:col-span-2 lg:col-span-3 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-900 mb-4">Emergency Contact</h4>
                  </div>

                  {/* Emergency Contact Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Contact Name*</label>
                    <input
                      type="text"
                      value={data.emergency_contact_name}
                      onChange={(e) => setData('emergency_contact_name', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      required
                    />
                    {errors.emergency_contact_name && <p className="mt-1 text-sm text-red-600">{errors.emergency_contact_name}</p>}
                  </div>

                  {/* Emergency Contact Phone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Contact Phone*</label>
                    <input
                      type="text"
                      value={data.emergency_contact_phone}
                      onChange={(e) => setData('emergency_contact_phone', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      required
                    />
                    {errors.emergency_contact_phone && <p className="mt-1 text-sm text-red-600">{errors.emergency_contact_phone}</p>}
                  </div>

                  {/* Emergency Contact Relationship */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Relationship*</label>
                    <input
                      type="text"
                      value={data.emergency_contact_relationship}
                      onChange={(e) => setData('emergency_contact_relationship', e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      required
                      placeholder="e.g., Spouse, Parent, Sibling"
                    />
                    {errors.emergency_contact_relationship && <p className="mt-1 text-sm text-red-600">{errors.emergency_contact_relationship}</p>}
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                    disabled={processing}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 disabled:opacity-50"
                    disabled={processing}
                  >
                    {processing ? 'Saving...' : (editingEmployee ? 'Update Employee' : 'Add Employee')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

