import React from 'react';
import { Modal, Button } from '@/app/components';
import { 
  XMarkIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  UsersIcon,
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';

const StatusBadge = ({ status }) => {
  const variants = {
    open: 'bg-emerald-100 text-emerald-700',
    closed: 'bg-red-100 text-red-700',
    draft: 'bg-gray-100 text-gray-700',
  };

  const labels = {
    open: 'Active',
    closed: 'Closed',
    draft: 'Draft',
  };

  return (
    <span className={`px-3 py-1 text-sm font-medium rounded ${variants[status] || variants.draft}`}>
      {labels[status] || status}
    </span>
  );
};

const InfoField = ({ label, value }) => (
  <div>
    <p className="text-sm text-gray-600 mb-1">{label}</p>
    <p className="text-base font-medium text-gray-900">{value || 'N/A'}</p>
  </div>
);

export default function JobPostingViewModal({ 
  isOpen, 
  onClose, 
  job,
  onEdit,
  onDelete,
}) {
  if (!job) return null;

  return (
    <Modal 
      open={isOpen} 
      onClose={onClose} 
      size="xl"
      title=""
      footer={null}
      closable={false}
      styles={{ body: { padding: 0, maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' } }}
    >
      <div className="relative bg-white">
        {/* Header */}
        <div className="flex items-start justify-between px-7 pt-7 pb-5 border-b border-gray-200">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-2xl font-bold text-gray-900">{job.title}</h2>
              <StatusBadge status={job.status} />
            </div>
            {job.job_requisition && (
              <p className="text-sm text-gray-500 mb-3">
                📋 Linked to requisition: {job.job_requisition.requisition_number}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-7 space-y-6">
          {/* Basic Info Grid */}
          <div className="grid grid-cols-4 gap-x-6 gap-y-4">
            <InfoField 
              label="Department" 
              value={job.department?.name} 
            />
            <InfoField 
              label="Location" 
              value={job.location} 
            />
            <InfoField 
              label="Employment Type" 
              value={job.employment_type?.split('-').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
              ).join('-')} 
            />
            <InfoField 
              label="Positions Available" 
              value={job.positions_available} 
            />
          </div>

          {/* Secondary Info Grid */}
          <div className="grid grid-cols-4 gap-x-6 gap-y-4">
            <InfoField 
              label="Salary Range" 
              value={job.salary_min && job.salary_max 
                ? `₱${parseFloat(job.salary_min).toLocaleString()} - ₱${parseFloat(job.salary_max).toLocaleString()}` 
                : job.salary_min 
                  ? `₱${parseFloat(job.salary_min).toLocaleString()}+` 
                  : 'Competitive'
              } 
            />
            <InfoField 
              label="Target Audience" 
              value={job.target_audience === 'both' ? 'Both Applicants & Employees' 
                : job.target_audience === 'applicants' ? 'Applicants Only' 
                : 'Employees Only'
              } 
            />
            <InfoField 
              label="Posted By" 
              value={job.posted_by?.name} 
            />
            <InfoField 
              label="Closing Date" 
              value={job.closing_date ? format(new Date(job.closing_date), 'MMMM d, yyyy') : 'No deadline'} 
            />
          </div>

          {/* Job Description */}
          <div>
            <h3 className="text-base font-semibold text-gray-900 mb-3">Job Description</h3>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
              {job.description || 'No description provided.'}
            </p>
          </div>

          {/* Requirements */}
          {job.requirements && (
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-3">Requirements</h3>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {job.requirements}
              </p>
            </div>
          )}

          {/* Responsibilities */}
          {job.responsibilities && (
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-3">Responsibilities</h3>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {job.responsibilities}
              </p>
            </div>
          )}

          {/* Applications Count */}
          {job.applications_count !== undefined && (
            <div className="bg-indigo-50 rounded-lg p-4">
              <p className="text-sm font-medium text-gray-900">
                📊 {job.applications_count} application{job.applications_count !== 1 ? 's' : ''} received
              </p>
            </div>
          )}
        </div>

        {/* Footer with Actions */}
        <div className="flex items-center justify-between gap-3 px-7 py-4 border-t border-gray-200 bg-gray-50">
          <div className="flex gap-2">
            {onEdit && (
              <Button
                variant="primary"
                onClick={() => onEdit(job)}
              >
                Edit
              </Button>
            )}
            {onDelete && (
              <Button
                variant="danger"
                onClick={() => onDelete(job)}
              >
                Delete
              </Button>
            )}
          </div>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
