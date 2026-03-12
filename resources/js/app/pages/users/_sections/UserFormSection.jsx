import React from 'react';
import { Input, Checkbox } from '@/app/components';

export default function UserFormSection({ 
  data, 
  setData, 
  errors, 
  editingUser,
  allRoles,
  toggleRole
}) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Name"
          value={data.name}
          onChange={(e) => setData('name', e.target.value)}
          error={errors.name}
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
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Password"
          type="password"
          value={data.password}
          onChange={(e) => setData('password', e.target.value)}
          error={errors.password}
          helperText={editingUser ? 'Leave blank to keep current password' : ''}
          required={!editingUser}
        />
        <Input
          label="Confirm Password"
          type="password"
          value={data.password_confirmation}
          onChange={(e) => setData('password_confirmation', e.target.value)}
          required={!editingUser}
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Roles</label>
        <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-3">
          {allRoles.map((role) => (
            <label key={role.id} className="flex items-center hover:bg-gray-50 p-2 rounded cursor-pointer">
              <input
                type="checkbox"
                checked={data.roles.includes(role.name)}
                onChange={() => toggleRole(role.name)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-3 text-sm text-gray-700">{role.name}</span>
            </label>
          ))}
        </div>
        {errors.roles && <p className="mt-1 text-sm text-red-600">{errors.roles}</p>}
      </div>
      <Checkbox
        label="Active"
        checked={data.is_active}
        onChange={(e) => setData('is_active', e.target.checked)}
      />
    </div>
  );
}
