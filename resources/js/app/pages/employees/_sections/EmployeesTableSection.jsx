import React from 'react';
import { useDispatch } from 'react-redux';
import { Button, IconButton, showDeleteConfirm, showSuccess } from '@/app/components';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { deleteEmployee as deleteEmployeeThunk } from '../_redux';

export default function EmployeesTableSection({ 
  employees,
  onOpenModal,
  onViewDetails
}) {
  const dispatch = useDispatch();

  const handleDelete = (employee) => {
    showDeleteConfirm({
      title: `Delete ${employee.first_name} ${employee.last_name}?`,
      content: 'Are you sure you want to delete this employee? This action cannot be undone.',
      onOk: async () => {
        try {
          await dispatch(deleteEmployeeThunk(employee.id)).unwrap();
          showSuccess({ 
            title: 'Employee Deleted', 
            content: `${employee.first_name} ${employee.last_name} has been deleted successfully.`
          });
        } catch (error) {
          console.error('Delete failed:', error);
        }
      }
    });
  };
  return (
    <>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Employee Management</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage employee records and information.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Button onClick={() => onOpenModal()} icon={<PlusIcon className="h-5 w-5" />}>
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
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium sm:pl-6">
                          <button
                            onClick={() => onViewDetails(employee)}
                            className="text-blue-600 hover:text-blue-900 hover:underline transition-colors"
                            title="View employee details"
                          >
                            {employee.employee_number}
                          </button>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                          {employee.first_name} {employee.middle_name ? employee.middle_name + ' ' : ''}{employee.last_name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{employee.email}</td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {employee.department?.name || '-'}
                        </td>
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
                              variant="ghost-primary"
                              size="sm"
                              onClick={() => onOpenModal(employee)}
                              title="Edit employee"
                            >
                              <PencilIcon />
                            </IconButton>
                            <IconButton
                              variant="ghost-danger"
                              size="sm"
                              onClick={() => handleDelete(employee)}
                              title="Delete employee"
                            >
                              <TrashIcon />
                            </IconButton>
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
    </>
  );
}
