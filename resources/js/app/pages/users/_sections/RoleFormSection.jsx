import React from 'react';
import { Input, Select, TextArea, Button } from '@/app/components';

export default function RoleFormSection({ 
  data, 
  setData, 
  errors,
  groupedPermissions,
  togglePermission,
  toggleGroupPermissions
}) {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-4">Basic Information</h4>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Role Name"
            placeholder="e.g. Asset Manager, IT Technician"
            value={data.name}
            onChange={(e) => setData('name', e.target.value)}
            error={errors.name}
            required
          />
          <Select
            label="Role Level"
            value={data.level}
            onChange={(e) => setData('level', parseInt(e.target.value))}
            required
          >
            <option value="">Select Level</option>
            <option value="1">Level 1</option>
            <option value="2">Level 2</option>
            <option value="3">Level 3</option>
            <option value="4">Level 4</option>
            <option value="5">Level 5</option>
          </Select>
        </div>
        <div className="mt-4">
          <TextArea
            label="Role Description"
            placeholder="Describe the role's responsibilities and purpose..."
            value={data.description}
            onChange={(e) => setData('description', e.target.value)}
            rows={3}
          />
        </div>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-2">Permissions</h4>
        <p className="text-sm text-gray-500 mb-4">
          Select the permissions this role should have. Users with this role will only be able to access the selected features.
        </p>
        <div className="border border-gray-300 rounded-lg p-4 space-y-4" >
          {Object.entries(groupedPermissions).map(([groupName, permissions]) => (
            <div key={groupName} className="space-y-2">
              <div className="flex items-center justify-between border-b border-gray-200 pb-2">
                <span className="text-sm font-medium text-gray-900">{groupName}</span>
                <Button
                  variant="link"
                  size="sm"
                  onClick={() => toggleGroupPermissions(groupName)}
                >
                  {permissions.every(p => data.permissions.includes(p.name)) ? 'Deselect All' : 'Select All'}
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2 pl-4">
                {permissions.map((permission) => (
                  <label key={permission.id} className="flex items-center hover:bg-gray-50 p-2 rounded cursor-pointer">
                    <input
                      type="checkbox"
                      checked={data.permissions.includes(permission.name)}
                      onChange={() => togglePermission(permission.name)}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <div className="ml-3">
                      <span className="text-sm text-gray-900">{permission.displayName}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
          <strong>{data.permissions.length}</strong> permission{data.permissions.length !== 1 ? 's' : ''} selected
        </div>
      </div>
    </div>
  );
}
