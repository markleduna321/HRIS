import React from 'react';
import { 
  BuildingOfficeIcon, 
  MapPinIcon, 
  UserGroupIcon, 
  CurrencyDollarIcon,
  CalendarIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';

const StatusBadge = ({ status }) => {
  const variants = {
    open: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    closed: 'bg-red-100 text-red-700 border-red-200',
    draft: 'bg-gray-100 text-gray-700 border-gray-200',
  };

  const labels = {
    open: 'Active',
    closed: 'Closed',
    draft: 'Draft',
  };

  return (
    <span className={`px-3 py-1 text-xs font-medium rounded-full border ${variants[status] || variants.draft}`}>
      {labels[status] || status}
    </span>
  );
};

const AudienceBadge = ({ audience }) => {
  const variants = {
    both: 'bg-purple-100 text-purple-700',
    applicants: 'bg-blue-100 text-blue-700',
    employees: 'bg-orange-100 text-orange-700',
  };

  const labels = {
    both: 'Both',
    applicants: 'Applicants Only',
    employees: 'Employees Only',
  };

  const icons = {
    both: '👥',
    applicants: '🌐',
    employees: '🏢',
  };

  return (
    <span className={`px-2 py-1 text-xs font-medium rounded ${variants[audience] || variants.both}`}>
      {icons[audience]} {labels[audience] || audience}
    </span>
  );
};

export default function JobPostingCard({ job, onView }) {
  const postedDate = job.created_at ? format(new Date(job.created_at), 'M/d/yyyy') : '';
  const closingDate = job.closing_date ? format(new Date(job.closing_date), 'M/d/yyyy') : '';

  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-lg hover:border-indigo-300 transition-all cursor-pointer"
      onClick={() => onView(job)}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
            <StatusBadge status={job.status} />
            {job.target_audience && <AudienceBadge audience={job.target_audience} />}
          </div>
          {job.job_requisition && (
            <p className="text-xs text-gray-500 mb-1">
              📋 Linked to: {job.job_requisition.requisition_number}
            </p>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <BuildingOfficeIcon className="w-4 h-4 flex-shrink-0" />
          <span>{job.department?.name || 'No department'}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPinIcon className="w-4 h-4 flex-shrink-0" />
          <span>{job.location || 'Not specified'}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <UserGroupIcon className="w-4 h-4 flex-shrink-0" />
          <span className="capitalize">{job.employment_type?.replace('-', ' ')}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <UsersIcon className="w-4 h-4 flex-shrink-0" />
          <span>{job.positions_available} position(s)</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            👤 {job.posted_by?.name || 'Unknown'}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            📅 Posted: {postedDate}
          </span>
        </div>
        {job.applications_count !== undefined && (
          <div className="flex items-center gap-1 text-sm font-medium text-indigo-600">
            {job.applications_count} applicant{job.applications_count !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      {closingDate && (
        <div className="mt-2 text-xs text-gray-500">
          Deadline: {closingDate}
        </div>
      )}
    </div>
  );
}
