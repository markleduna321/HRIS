import React, { useState, Fragment } from 'react';
import AppLayout from '../layout';
import { Head, useForm } from '@inertiajs/react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';

export default function RolesPage({ roles = [], permissions = [] }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);

  const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
    name: '',
    permissions: [],
  });

  const openCreateModal = () => {
    reset();
    setEditingRole(null);
    setIsModalOpen(true);
  };

  const openEditModal = (role) => {
    setEditingRole(role);
    setData({
      name: role.name,
      permissions: role.permissions,
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingRole(null);
    reset();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingRole) {
      put(route('admin.roles.update', editingRole.id), { onSuccess: () => closeModal() });
    } else {
      post(route('admin.roles.store'), { onSuccess: () => closeModal() });
    }
  };

  const handleDelete = (role) => {
    if (confirm(`Are you sure you want to delete the ${role.name} role?`)) {
      destroy(route('admin.roles.destroy', role.id));
    }
  };

  const togglePermission = (permissionName) => {
    const currentPerms = [...data.permissions];
    const index = currentPerms.indexOf(permissionName);
    if (index > -1) {
      currentPerms.splice(index, 1);
    } else {
      currentPerms.push(permissionName);
    }
    setData('permissions', currentPerms);
  };

  return (
    <AppLayout>
      <Head title="Role Management" />
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Role Management</h1>
            <p className="mt-2 text-sm text-gray-700">Manage roles and their permissions.</p>
          </div>
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <button onClick={openCreateModal} className="flex items-center gap-2 rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500">
              <PlusIcon className="h-5 w-5" />
              Add Role
            </button>
          </div>
        </div>

        <div className="mt-8 flow-root">
          <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Role Name</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Permissions</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Users</th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Created</th>
                  <th className="relative py-3.5 pl-3 pr-4 sm:pr-6"><span className="sr-only">Actions</span></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {roles.map((role) => (
                  <tr key={role.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">{role.name}</td>
                    <td className="px-3 py-4 text-sm text-gray-500">{role.permissions_count}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{role.users_count}</td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{role.created_at}</td>
                    <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right sm:pr-6">
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => openEditModal(role)} className="text-indigo-600 hover:text-indigo-900">
                          <PencilIcon className="h-5 w-5" />
                        </button>
                        <button onClick={() => handleDelete(role)} className="text-red-600 hover:text-red-900">
                          <TrashIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
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
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 shadow-xl">
                  <Dialog.Title className="text-lg font-medium text-gray-900 flex justify-between">
                    {editingRole ? 'Edit Role' : 'Create New Role'}
                    <button onClick={closeModal}><XMarkIcon className="h-6 w-6 text-gray-400" /></button>
                  </Dialog.Title>
                  <form onSubmit={handleSubmit} className="mt-4">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Role Name</label>
                        <input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500" required />
                        {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                      </div>
                     <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
                        <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto border rounded p-3">
                          {permissions.map((perm) => (
                            <label key={perm.id} className="flex items-center">
                              <input type="checkbox" checked={data.permissions.includes(perm.name)} onChange={() => togglePermission(perm.name)} className="h-4 w-4 text-indigo-600 rounded" />
                              <span className="ml-2 text-sm text-gray-700">{perm.name}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 flex gap-3 justify-end">
                      <button type="button" onClick={closeModal} className="rounded-md border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">Cancel</button>
                      <button type="submit" disabled={processing} className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50">
                        {processing ? 'Saving...' : editingRole ? 'Update' : 'Create'}
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
