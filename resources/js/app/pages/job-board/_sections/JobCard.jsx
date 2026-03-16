import { BriefcaseIcon, MapPinIcon, ClockIcon, CurrencyDollarIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';

export default function JobCard({ job, onClick }) {
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

  const getStatusLabel = (status) => {
    switch (status) {
      case 'open': return 'Active';
      case 'closed': return 'Closed';
      case 'draft': return 'Draft';
      default: return status;
    }
  };

  const formatEmploymentType = (type) => {
    if (!type) return '';
    return type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('-');
  };

  return (
    <div
      onClick={() => onClick(job)}
      className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer"
    >
      {/* Title Row */}
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-base font-semibold text-gray-900">{job.title}</h3>
        <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getStatusColor(job.status)}`}>
          {getStatusLabel(job.status)}
        </span>
        {job.target_audience && (
          <span className="px-2.5 py-0.5 text-xs font-medium rounded bg-purple-100 text-purple-700 border border-purple-200 flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            {job.target_audience === 'both' ? 'Both' : job.target_audience === 'applicants' ? 'Applicants' : 'Employees'}
          </span>
        )}
      </div>

      {/* Details Row */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-600 mb-4">
        {job.department && (
          <div className="flex items-center gap-1.5">
            <BriefcaseIcon className="h-4 w-4 text-gray-400" />
            <span>{job.department.name}</span>
          </div>
        )}
        {job.location && (
          <div className="flex items-center gap-1.5">
            <MapPinIcon className="h-4 w-4 text-gray-400" />
            <span>{job.location}</span>
          </div>
        )}
        {job.employment_type && (
          <div className="flex items-center gap-1.5">
            <ClockIcon className="h-4 w-4 text-gray-400" />
            <span>{formatEmploymentType(job.employment_type)}</span>
          </div>
        )}
        <div className="flex items-center gap-1.5">
          <CurrencyDollarIcon className="h-4 w-4 text-gray-400" />
          <span>{formatSalary(job.salary_min, job.salary_max)}</span>
        </div>
      </div>

      {/* Dates Row */}
      <div className="flex justify-between text-xs text-gray-500">
        <span>Posted: {formatDate(job.created_at)}</span>
        {job.closing_date && <span>Deadline: {formatDate(job.closing_date)}</span>}
      </div>
    </div>
  );
}
