import { EnvelopeIcon, PhoneIcon, BriefcaseIcon, CalendarDaysIcon, EyeIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';

const statusConfig = {
  pending: { label: 'New', bg: 'bg-gray-100 text-gray-700' },
  reviewing: { label: 'Reviewing', bg: 'bg-blue-100 text-blue-700' },
  shortlisted: { label: 'Shortlisted', bg: 'bg-indigo-100 text-indigo-700' },
  interview: { label: 'Interview', bg: 'bg-orange-100 text-orange-700' },
  rejected: { label: 'Rejected', bg: 'bg-red-100 text-red-700' },
  accepted: { label: 'Hired', bg: 'bg-green-100 text-green-700' },
};

export default function ApplicantCard({ application, onView }) {
  const status = statusConfig[application.status] || statusConfig.pending;

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try { return format(new Date(dateString), 'M/d/yyyy'); } catch { return dateString; }
  };

  const initials = application.applicant_name
    ? application.applicant_name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : '?';

  return (
    <div className="bg-white border border-gray-200 rounded-lg px-6 py-5 hover:shadow-sm transition-all">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 min-w-0">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
            <span className="text-sm font-semibold text-gray-600">{initials}</span>
          </div>

          {/* Name & Position */}
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <h3 className="text-base font-semibold text-gray-900 truncate">{application.applicant_name}</h3>
              <span className={`inline-flex px-2.5 py-0.5 text-xs font-semibold rounded-full ${status.bg}`}>
                {status.label}
              </span>
            </div>
            <p className="text-sm text-gray-500 truncate">{application.job_posting?.title || 'Unknown Position'}</p>
          </div>
        </div>

        {/* Right side: details + view button */}
        <div className="flex items-center gap-6 flex-shrink-0 ml-4">
          <div className="hidden lg:flex items-center gap-5 text-sm text-gray-500">
            <div className="flex items-center gap-1.5">
              <EnvelopeIcon className="h-4 w-4" />
              <span>{application.email}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <PhoneIcon className="h-4 w-4" />
              <span>{application.phone}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <BriefcaseIcon className="h-4 w-4" />
              <span>{application.experience || 'Not specified experience'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CalendarDaysIcon className="h-4 w-4" />
              <span>Applied: {formatDate(application.created_at)}</span>
            </div>
          </div>

          <button
            onClick={() => onView(application)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <EyeIcon className="h-4 w-4" />
            View
          </button>
        </div>
      </div>

      {/* Mobile details */}
      <div className="lg:hidden flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500 mt-3 ml-14">
        <span className="flex items-center gap-1"><EnvelopeIcon className="h-4 w-4" />{application.email}</span>
        <span className="flex items-center gap-1"><PhoneIcon className="h-4 w-4" />{application.phone}</span>
        <span className="flex items-center gap-1"><CalendarDaysIcon className="h-4 w-4" />Applied: {formatDate(application.created_at)}</span>
      </div>
    </div>
  );
}
