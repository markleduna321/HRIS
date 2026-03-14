import React from 'react';
import { 
  BuildingOfficeIcon, 
  MapPinIcon, 
  UserGroupIcon, 
  CurrencyDollarIcon,
  CalendarIcon,
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';

const StatusBadge = ({ status }) => {
  const variants = {
    pending: 'bg-amber-100 text-amber-700 border-amber-200',
    approved: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    rejected: 'bg-red-100 text-red-700 border-red-200',
    in_progress: 'bg-violet-100 text-violet-700 border-violet-200',
    filled: 'bg-blue-100 text-blue-700 border-blue-200',
    cancelled: 'bg-gray-100 text-gray-700 border-gray-200',
  };

  const labels = {
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    in_progress: 'In Progress',
    filled: 'Filled',
    cancelled: 'Cancelled',
  };

  return (
    <span className={`px-3 py-1 text-xs font-medium rounded-full border ${variants[status] || variants.pending}`}>
      {labels[status] || status}
    </span>
  );
};

const PriorityBadge = ({ priority }) => {
  const variants = {
    low: 'bg-gray-100 text-gray-600',
    medium: 'bg-blue-100 text-blue-600',
    high: 'bg-orange-100 text-orange-600',
    urgent: 'bg-red-100 text-red-600',
  };

  const labels = {
    low: 'Low',
    medium: 'Medium',
    high: 'High',
    urgent: 'Urgent',
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded ${variants[priority] || variants.medium}`}>
      {labels[priority] || priority}
    </span>
  );
};

export default function RequisitionCard({ requisition, onView }) {
  const createdDate = requisition.created_at ? format(new Date(requisition.created_at), 'M/d/yyyy') : '';
  
  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-indigo-300 transition-all cursor-pointer"
      onClick={() => onView(requisition)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{requisition.position_title}</h3>
            <StatusBadge status={requisition.status} />
            <PriorityBadge priority={requisition.priority} />
            {requisition.is_new && (
              <span className="px-2 py-1 text-xs font-medium rounded bg-yellow-100 text-yellow-700 flex items-center gap-1">
                ✨ New
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 font-mono">{requisition.requisition_number}</p>
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <BuildingOfficeIcon className="w-4 h-4 flex-shrink-0" />
          <span>{requisition.department?.name || 'N/A'}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPinIcon className="w-4 h-4 flex-shrink-0" />
          <span>{requisition.location || 'N/A'}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <UserGroupIcon className="w-4 h-4 flex-shrink-0" />
          <span>{requisition.positions_filled || 0}/{requisition.number_of_positions} filled</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <CurrencyDollarIcon className="w-4 h-4 flex-shrink-0" />
          <span>{requisition.salary_range || 'Not specified'}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            👤 {requisition.requested_by?.name || 'Unknown'}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <CalendarIcon className="w-4 h-4" />
            {createdDate}
          </span>
        </div>
        {requisition.job_postings?.length > 0 && (
          <div className="flex items-center gap-1 text-sm text-gray-600">
            🎯 {requisition.job_postings.length} event{requisition.job_postings.length > 1 ? 's' : ''}
          </div>
        )}
      </div>
    </div>
  );
}
