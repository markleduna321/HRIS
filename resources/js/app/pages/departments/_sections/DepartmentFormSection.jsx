import React from 'react';
import { Input, TextArea } from '@/app/components';

export default function DepartmentFormSection({ 
  data, 
  setData, 
  errors, 
  editingDepartment 
}) {
  return (
    <div className="space-y-4">
      <Input
        label="Department Name"
        value={data.name}
        onChange={(e) => setData({ ...data, name: e.target.value })}
        error={errors.name}
        required
        placeholder="e.g., Human Resources, IT, Finance"
      />
      <Input
        label="Department Code"
        value={data.code}
        onChange={(e) => setData({ ...data, code: e.target.value.toUpperCase() })}
        error={errors.code}
        required
        placeholder="e.g., HR, IT, FIN"
        maxLength={10}
      />
      <TextArea
        label="Description"
        value={data.description}
        onChange={(e) => setData({ ...data, description: e.target.value })}
        error={errors.description}
        placeholder="Brief description of the department's purpose and responsibilities"
        rows={3}
      />
    </div>
  );
}
