import React from 'react';
import { Input, Select, Button } from '@/app/components';
import { MagnifyingGlassIcon, PlusIcon } from '@heroicons/react/24/outline';

const statusOptions = [
  { value: '', label: 'All Status' },
  { value: 'pending', label: 'Pending Review' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'filled', label: 'Filled' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default function FiltersSection({ filters, onFilterChange, onSearch, onNewRequisition }) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4 items-end">
        <div className="flex-1">
          <Input
            placeholder="Search by position, requisition #, or department..."
            leftIcon={<MagnifyingGlassIcon className="h-5 w-5" />}
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                onSearch();
              }
            }}
          />
        </div>
        <div className="w-full md:w-48">
          <Select
            options={statusOptions}
            value={filters.status}
            onChange={(e) => onFilterChange({ status: e.target.value })}
          />
        </div>
        <Button
          variant="primary"
          icon={<PlusIcon className="h-5 w-5" />}
          onClick={onNewRequisition}
        >
          New Requisition
        </Button>
      </div>
    </div>
  );
}
