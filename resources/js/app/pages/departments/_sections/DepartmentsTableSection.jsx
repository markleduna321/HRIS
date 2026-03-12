import React from 'react';
import { useDispatch } from 'react-redux';
import { Button, IconButton, showDeleteConfirm, showSuccess } from '@/app/components';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { deleteDepartment as deleteDepartmentThunk } from '../_redux';

export default function DepartmentsTableSection({ 
  departments, 
  onOpenModal 
}) {
  const dispatch = useDispatch();

  const handleDelete = (department) => {
    showDeleteConfirm({
      title: `Delete ${department.name}?`,
      content: 'Are you sure you want to delete this department? This action cannot be undone.',
      onOk: async () => {
        try {
          await dispatch(deleteDepartmentThunk(department.id)).unwrap();
          showSuccess({ 
            title: 'Department Deleted', 
            content: `${department.name} has been deleted successfully.`
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
          <h1 className="text-2xl font-semibold text-gray-900">Department Management</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage organizational departments.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Button onClick={() => onOpenModal()}>
            Add Department
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
                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Department</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Code</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Description</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Employees</th>
                    <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {departments.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="py-12 text-center text-gray-500">
                        No departments found. Add your first department to get started.
                      </td>
                    </tr>
                  ) : (
                    departments.map((department) => (
                      <tr key={department.id} className="hover:bg-gray-50">
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {department.name}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{department.code}</td>
                        <td className="px-3 py-4 text-sm text-gray-500">
                          {department.description || '-'}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                            {department.employees_count || 0} employees
                          </span>
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <div className="flex gap-2 justify-end">
                            <IconButton
                              variant="ghost-primary"
                              size="sm"
                              onClick={() => onOpenModal(department)}
                              title="Edit department"
                            >
                              <PencilIcon />
                            </IconButton>
                            <IconButton
                              variant="ghost-danger"
                              size="sm"
                              onClick={() => handleDelete(department)}
                              title="Delete department"
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
