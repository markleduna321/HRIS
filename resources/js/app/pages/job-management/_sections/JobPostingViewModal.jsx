import React from 'react';
import { Modal, Button } from '@/app/components';
import { 
  XMarkIcon,
  BuildingOfficeIcon,
  MapPinIcon,
  CalendarIcon,
  CurrencyDollarIcon,
  ClockIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';

const StatusBadge = ({ status }) => {
  const variants = {
    open: 'bg-emerald-500 text-white',
    closed: 'bg-red-100 text-red-700',
    draft: 'bg-gray-100 text-gray-700',
  };

  const labels = {
    open: 'Active',
    closed: 'Closed',
    draft: 'Draft',
  };

  return (
    <span className={`px-3 py-1 text-sm font-semibold rounded-full ${variants[status] || variants.draft}`}>
      {labels[status] || status}
    </span>
  );
};

export default function JobPostingViewModal({ 
  isOpen, 
  onClose, 
  job,
  onEdit,
  onDelete,
  onViewApplicants,
}) {
  if (!job) return null;

  const formatSalary = (min, max) => {
    if (min && max) return `₱${parseFloat(min).toLocaleString()} - ₱${parseFloat(max).toLocaleString()}`;
    if (min) return `₱${parseFloat(min).toLocaleString()}+`;
    return 'Competitive';
  };

  const formatEmploymentType = (type) => {
    if (!type) return 'N/A';
    return type.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join('-');
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try { return format(new Date(dateString), 'M/d/yyyy'); } catch { return dateString; }
  };

  // Parse requirements into list items (split by newline)
  const requirementsList = job.requirements
    ? job.requirements.split('\n').map(r => r.replace(/^[-•*]\s*/, '').trim()).filter(Boolean)
    : [];

  return (
    <Modal 
      open={isOpen} 
      onClose={onClose} 
      size="lg"
      title={job.title}
      footer={
        <div className="flex items-center gap-3 w-full">
          <Button variant="secondary" onClick={onClose} className="flex-1">
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => onViewApplicants?.(job)}
            className="flex-1"
          >
            View Applicants
          </Button>
        </div>
      }
    >
      {/* Status + Applicant Count */}
      <div className="flex items-center gap-3 mb-6">
        <StatusBadge status={job.status} />
        <span className="text-sm text-gray-500">
          {job.applications_count ?? 0} applicant{(job.applications_count ?? 0) !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Info Grid */}
      <div className="bg-gray-50 rounded-xl p-5 mb-6">
        <div className="grid grid-cols-2 gap-y-5 gap-x-8">
          <div className="flex items-start gap-3">
            <BuildingOfficeIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500">Department</p>
              <p className="text-sm font-semibold text-indigo-600">{job.department?.name || 'N/A'}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <MapPinIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500">Location</p>
              <p className="text-sm font-semibold text-gray-900">{job.location || 'N/A'}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <ClockIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500">Employment Type</p>
              <p className="text-sm font-semibold text-gray-900">{formatEmploymentType(job.employment_type)}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CurrencyDollarIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500">Salary Range</p>
              <p className="text-sm font-semibold text-gray-900">{formatSalary(job.salary_min, job.salary_max)}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CalendarIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500">Posted Date</p>
              <p className="text-sm font-semibold text-gray-900">{formatDate(job.created_at)}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <ClockIcon className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-500">Deadline</p>
              <p className="text-sm font-semibold text-gray-900">{job.closing_date ? formatDate(job.closing_date) : 'No deadline'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Job Description */}
      <div className="mb-6">
        <h3 className="text-base font-bold text-gray-900 mb-3">Job Description</h3>
        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
          {job.description || 'No description provided.'}
        </p>
      </div>

      {/* Requirements */}
      {requirementsList.length > 0 && (
        <div className="mb-6">
          <h3 className="text-base font-bold text-gray-900 mb-3">Requirements</h3>
          <ul className="space-y-2">
            {requirementsList.map((req, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">{req}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Responsibilities */}
      {job.responsibilities && (
        <div className="mb-6">
          <h3 className="text-base font-bold text-gray-900 mb-3">Responsibilities</h3>
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
            {job.responsibilities}
          </p>
        </div>
      )}

      {/* Experience & Education Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-indigo-50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <BriefcaseIcon className="h-5 w-5 text-indigo-600" />
            <span className="text-sm font-semibold text-indigo-600">Experience</span>
          </div>
          <p className="text-sm text-gray-700">
            {job.experience || 'Not specified'}
          </p>
        </div>
        <div className="bg-purple-50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <AcademicCapIcon className="h-5 w-5 text-purple-600" />
            <span className="text-sm font-semibold text-purple-600">Education</span>
          </div>
          <p className="text-sm text-gray-700">
            {job.education || 'Not specified'}
          </p>
        </div>
      </div>
    </Modal>
  );
}
