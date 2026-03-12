import React, { useState, Fragment } from 'react';
import AppLayout from '../layout';
import { Head, useForm } from '@inertiajs/react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

export default function PermissionsPage({ permissions = [], roles = [] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPermission, setEditingPermission] = useState(null);

  const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
    name: '',
  });

  const openCreateModal = () => {
    reset();
    setEditingPermission(null);
    setIsModalOpen(true);
  };

  const openEditModal = (permission) => {
    setEditingPermission(permission);
    setData({ name: permission.name });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingPermission(null);
    reset();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingPermission) {
      put(route('admin.permissions.update', editingPermission.id), { onSuccess: () => closeModal() });
    } else {
      post(route('admin.permissions.store'), { onSuccess: () => closeModal() });
    }
  };

  const handleDelete = (permission) => {
    if (confirm(`Are you sure you want to delete the ${permission.name} permission?`)) {
      destroy(route('admin.permissions.destroy', permission.id));
    }
  };

  return (
    <AppLayout>
      <Head title="Permission Management" />
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Permission Management</h1>
            <p className="mt-2 text-sm text-gray-700">Manage system permissions.</p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button onClick={openCreateModal} className="flex items-center gap-2 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500">
              <PlusIcon className="h-5 w-5" />
              Add Permission
            </button>
          </div>
        </div>

        <div className="mt-8 flow-root">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Permission Name</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Assigned to Roles</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Created</th>
                  <th className="relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {permissions.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-12 text-center text-sm text-gray-500">No permissions found.</td>
                  </tr>
                ) : (
                  permissions.map((permission) => (
                    <tr key={permission.id}>
                      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{permission.name}</td>
                      <td className="px-3 py-4 text-sm text-gray-500">
                        <div className="flex flex-wrap gap-1">
                          {permission.roles.map((role) => (
                            <span key={role} className="inline-flex items-center rounded-full bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                              {role}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{permission.created_at}</td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right sm:pr-6">
                        <div className="flex gap-2 justify-end">
                          <button onClick={() => openEditModal(permission)} className="text-indigo-600 hover:text-indigo-900">
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button onClick={() => handleDelete(permission)} className="text-red-600 hover:text-red-900">
                            <TrashIcon className="h-5 w-5" />
                          </button>
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

      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child as={Fragment}>
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <Transition.Child as={Fragment}>
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl">
                  <Dialog.Title className="text-lg font-medium text-gray-900 flex justify-between">
                    {editingPermission ? 'Edit Permission' : 'Create New Permission'}
                    <button onClick={closeModal}><XMarkIcon className="h-6 w-6 text-gray-400" /></button>
                  </Dialog.Title>
                  <form onSubmit={handleSubmit} className="mt-4">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Permission Name</label>
                        <input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder="e.g., create-users" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" required />
                        {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                        <p className="mt-1 text-xs text-gray-500">Use kebab-case (e.g., create-users, edit-roles)</p>
                      </div>
                    </div>
                    <div className="mt-6 flex gap-3 justify-end">
                      <button type="button" onClick={closeModal} className="rounded-md border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                      <button type="submit" disabled={processing} className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50">
                        {processing ? 'Saving...' : editingPermission ? 'Update' : 'Create'}
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </AppLayout>
  );
}
