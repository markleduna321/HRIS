import { BriefcaseIcon, MapPinIcon, CalendarDaysIcon, ClockIcon } from '@heroicons/react/24/outline';
import { DocumentTextIcon } from '@heroicons/react/24/solid';
import { format } from 'date-fns';

const statusConfig = {
  pending: { label: 'pending', bg: 'bg-gray-100 text-gray-700 border-gray-200' },
  reviewing: { label: 'Reviewing', bg: 'bg-blue-100 text-blue-700 border-blue-200' },
  shortlisted: { label: 'Shortlisted', bg: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  interview: { label: 'Interview', bg: 'bg-purple-100 text-purple-700 border-purple-200' },
  rejected: { label: 'Rejected', bg: 'bg-red-100 text-red-700 border-red-200' },
  accepted: { label: 'Accepted', bg: 'bg-green-100 text-green-700 border-green-200' },
};

export default function MyApplicationCard({ application, onView }) {
  const job = application.job_posting;

  const formatDate = (dateString) => {
    if (!dateString) return null;
    try {
      return format(new Date(dateString), 'M/d/yyyy');
    } catch {
      return dateString;
    }
  };

  const status = statusConfig[application.status] || statusConfig.pending;

  return (
    <div
      onClick={() => onView(application)}
      className="bg-white border border-gray-200 rounded-lg px-6 py-5 hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          {/* Title + Status */}
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-base font-medium text-gray-900">{job?.title || 'Unknown Position'}</h3>
            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium rounded border ${status.bg}`}>
              <DocumentTextIcon className="h-3.5 w-3.5" />
              {status.label}
            </span>
          </div>

          {/* Details Row */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
            {job?.department && (
              <div className="flex items-center gap-1.5">
                <BriefcaseIcon className="h-4 w-4" />
                <span>{job.department.name}</span>
              </div>
            )}
            {job?.location && (
              <div className="flex items-center gap-1.5">
                <MapPinIcon className="h-4 w-4" />
                <span>{job.location}</span>
              </div>
            )}
            <div className="flex items-center gap-1.5">
              <CalendarDaysIcon className="h-4 w-4" />
              <span>Applied {formatDate(application.created_at)}</span>
            </div>
            {application.reviewed_at && (
              <div className="flex items-center gap-1.5">
                <ClockIcon className="h-4 w-4" />
                <span>Updated {formatDate(application.reviewed_at)}</span>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
