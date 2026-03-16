import { Modal, Button } from '@/app/components';
import { 
  BriefcaseIcon, 
  MapPinIcon, 
  ClockIcon, 
  CurrencyDollarIcon, 
  CalendarDaysIcon,
  CheckCircleIcon,
  AcademicCapIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';

export default function ViewJobModal({ isOpen, onClose, job, onApply, hasApplied }) {
  if (!job) return null;

  const formatDate = (dateString) => {
    if (!dateString) return null;
    try {
      return format(new Date(dateString), 'M/d/yyyy');
    } catch {
      return dateString;
    }
  };

  const formatSalary = (min, max) => {
    if (!min && !max) return 'Competitive';
    const formatNumber = (num) => `₱${parseFloat(num).toLocaleString('en-PH', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
    if (!max) return `${formatNumber(min)}+`;
    return `${formatNumber(min)} - ${formatNumber(max)}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return 'bg-green-500 text-white';
      case 'closed':
        return 'bg-gray-500 text-white';
      case 'draft':
        return 'bg-yellow-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const parseRequirements = (requirementsText) => {
    if (!requirementsText) return [];
    // Split by newlines and filter out empty lines
    return requirementsText.split('\n').filter(req => req.trim());
  };

  const handleApplyClick = () => {
    onClose();
    onApply(job);
  };

  return (
    <Modal open={isOpen} onClose={onClose} size="lg" title={job.title}>
      {/* Status and Applicants */}
      <div className="flex items-center gap-3 mb-6">
        <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusColor(job.status)}`}>
          {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
        </span>
        <span className="text-sm text-gray-600">
          {job.applications_count || 0} applicants
        </span>
      </div>

      {/* Job Details Grid */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Department */}
        {job.department && (
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-gray-600">
              <BriefcaseIcon className="h-5 w-5" />
              <span className="text-sm font-medium">Department</span>
            </div>
            <p className="text-gray-900 font-medium ml-7">{job.department.name}</p>
          </div>
        )}

        {/* Location */}
        {job.location && (
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-gray-600">
              <MapPinIcon className="h-5 w-5" />
              <span className="text-sm font-medium">Location</span>
            </div>
            <p className="text-gray-900 font-medium ml-7">{job.location}</p>
          </div>
        )}

        {/* Employment Type */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-gray-600">
            <ClockIcon className="h-5 w-5" />
            <span className="text-sm font-medium">Employment Type</span>
          </div>
          <p className="text-gray-900 font-medium ml-7">
            {job.employment_type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('-')}
          </p>
        </div>

        {/* Salary Range */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-gray-600">
            <CurrencyDollarIcon className="h-5 w-5" />
            <span className="text-sm font-medium">Salary Range</span>
          </div>
          <p className="text-gray-900 font-medium ml-7">{formatSalary(job.salary_min, job.salary_max)}</p>
        </div>

        {/* Posted Date */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-gray-600">
            <CalendarDaysIcon className="h-5 w-5" />
            <span className="text-sm font-medium">Posted Date</span>
          </div>
          <p className="text-gray-900 font-medium ml-7">{formatDate(job.created_at)}</p>
        </div>

        {/* Deadline */}
        {job.closing_date && (
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-gray-600">
              <CalendarDaysIcon className="h-5 w-5" />
              <span className="text-sm font-medium">Deadline</span>
            </div>
            <p className="text-gray-900 font-medium ml-7">{formatDate(job.closing_date)}</p>
          </div>
        )}
      </div>

      {/* Job Description */}
      {job.description && (
        <div className="mb-6">
          <h3 className="text-base font-semibold text-gray-900 mb-3">Job Description</h3>
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
            {job.description}
          </p>
        </div>
      )}

      {/* Requirements */}
      {job.requirements && (
        <div className="mb-6">
          <h3 className="text-base font-semibold text-gray-900 mb-3">Requirements</h3>
          <ul className="space-y-2">
            {parseRequirements(job.requirements).map((requirement, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                <CheckCircleIcon className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                <span>{requirement}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Experience and Education */}
      <div className="grid grid-cols-2 gap-6 mb-6 p-4 bg-gray-50 rounded-lg">
        <div>
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <BriefcaseIcon className="h-5 w-5" />
            <h4 className="font-semibold">Experience</h4>
          </div>
          <p className="text-sm text-gray-600">
            {job.experience_requirements || 'As per requirements'}
          </p>
        </div>
        <div>
          <div className="flex items-center gap-2 text-purple-600 mb-2">
            <AcademicCapIcon className="h-5 w-5" />
            <h4 className="font-semibold">Education</h4>
          </div>
          <p className="text-sm text-gray-600">
            {job.education_requirements || 'As per requirements'}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t">
        <Button
          type="button"
          variant="secondary"
          onClick={onClose}
          className="flex-1"
        >
          Close
        </Button>
        {hasApplied ? (
          <div className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg text-green-700 font-medium">
            <CheckCircleIcon className="h-5 w-5" />
            Already Applied
          </div>
        ) : (
          <Button
            type="button"
            variant="primary"
            onClick={handleApplyClick}
            className="flex-1"
            icon={
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            }
          >
            Apply for this Position
          </Button>
        )}
      </div>
    </Modal>
  );
}
