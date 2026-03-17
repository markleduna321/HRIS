import { Modal } from '@/app/components';
import { format } from 'date-fns';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import { CalendarIcon, ClockIcon, MapPinIcon, VideoCameraIcon, LinkIcon } from '@heroicons/react/24/outline';

const progressSteps = [
  { key: 'pending', label: 'Application Submitted', description: 'Your application has been received' },
  { key: 'reviewing', label: 'Under Review', description: 'HR is reviewing your application' },
  { key: 'interview', label: 'Initial Interview', description: 'First interview scheduled' },
  { key: 'shortlisted', label: 'Interview Passed', description: 'Moved to next round' },
  { key: 'final_interview', label: 'Final Interview', description: 'Final interview scheduled' },
  { key: 'job_offer', label: 'Job Offer', description: 'You have received a job offer' },
  { key: 'accepted', label: 'Contract Signing', description: 'Preparing contract' },
  { key: 'pre_employment_documents', label: 'Pre-Employment Documents', description: 'Submitting required clearances' },
  { key: 'hired', label: 'Hired!', description: 'Welcome to the team!' },
];

const statusOrder = {
  pending: 0,
  reviewing: 1,
  interview: 2,
  shortlisted: 3,
  final_interview: 4,
  job_offer: 5,
  accepted: 6,
  pre_employment_documents: 7,
  hired: 8,
};

export default function ApplicationDetailsModal({ isOpen, onClose, application }) {
  if (!application) return null;

  const job = application.job_posting;
  const currentStepIndex = statusOrder[application.status] ?? -1;

  const formatDate = (dateString) => {
    if (!dateString) return null;
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch {
      return dateString;
    }
  };

  const isRejected = application.status === 'rejected';

  // Get interviews by type
  const interviews = application.interviews || [];
  const initialInterview = interviews.find(i => i.type === 'initial') || (interviews.length > 0 ? interviews[0] : null);
  const finalInterview = interviews.find(i => i.type === 'final') || null;

  const getInterviewForStep = (stepKey) => {
    if (stepKey === 'interview') return initialInterview;
    if (stepKey === 'final_interview') return finalInterview;
    return null;
  };

  const formatTime = (timeString) => {
    if (!timeString) return '';
    try {
      const [h, m] = timeString.split(':');
      const hour = parseInt(h, 10);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;
      return `${hour12}:${m} ${ampm}`;
    } catch {
      return timeString;
    }
  };

  return (
    <Modal open={isOpen} onClose={onClose} size="md" title="Application Details">
      {/* Job Info */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-900">{job?.title || 'Unknown Position'}</h3>
        <p className="text-sm text-gray-500 mt-1">
          {job?.department?.name}{job?.location ? ` · ${job.location}` : ''}
        </p>
        <p className="text-sm text-gray-500">Applied {formatDate(application.created_at)}</p>
      </div>

      {/* Rejected Banner */}
      {isRejected && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-medium text-red-800">Application was not successful</span>
          </div>
          {application.notes && (
            <p className="text-sm text-red-700 mt-2">{application.notes}</p>
          )}
        </div>
      )}

      {/* Application Progress */}
      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-900 mb-4">Application Progress</h4>
        <div className="relative">
          {progressSteps.map((step, index) => {
            const isCompleted = !isRejected && index <= currentStepIndex;
            const isCurrent = !isRejected && index === currentStepIndex;
            const isLast = index === progressSteps.length - 1;

            return (
              <div key={step.key} className="flex items-start gap-4 relative">
                {/* Connector Line */}
                {!isLast && (
                  <div
                    className={`absolute left-[15px] top-[30px] w-0.5 h-[calc(100%-6px)] ${
                      isCompleted && !isCurrent ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  />
                )}

                {/* Circle */}
                <div className="relative z-10 flex-shrink-0">
                  {isCompleted ? (
                    <div className={`w-[30px] h-[30px] rounded-full flex items-center justify-center ${
                      isCurrent ? 'bg-blue-600 ring-4 ring-blue-100' : 'bg-blue-600'
                    }`}>
                      <CheckCircleIcon className="h-5 w-5 text-white" />
                    </div>
                  ) : (
                    <div className="w-[30px] h-[30px] rounded-full bg-gray-200 flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-gray-400" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className={`pb-8 ${isLast ? 'pb-0' : ''}`}>
                  <p className={`text-sm font-semibold ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                    {step.label}
                  </p>
                  <p className={`text-xs mt-0.5 ${isCompleted ? 'text-gray-500' : 'text-gray-400'}`}>
                    {step.description}
                  </p>

                  {/* Interview details embedded in interview steps */}
                  {(step.key === 'interview' || step.key === 'final_interview') && isCompleted && getInterviewForStep(step.key) && (() => {
                    const interviewData = getInterviewForStep(step.key);
                    return (
                    <div className="mt-2 bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-1.5">
                      <div className="flex items-center gap-2 text-xs text-blue-800">
                        <CalendarIcon className="h-3.5 w-3.5" />
                        <span className="font-medium">
                          {formatDate(interviewData.interview_date)} at {formatTime(interviewData.interview_time)}
                        </span>
                      </div>
                      {interviewData.mode === 'online' && interviewData.meeting_link && (
                        <div className="flex items-center gap-2 text-xs text-blue-700">
                          <VideoCameraIcon className="h-3.5 w-3.5" />
                          <a
                            href={interviewData.meeting_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline hover:text-blue-900 break-all"
                          >
                            {interviewData.meeting_link}
                          </a>
                        </div>
                      )}
                      {interviewData.mode === 'in-person' && interviewData.location && (
                        <div className="flex items-center gap-2 text-xs text-blue-700">
                          <MapPinIcon className="h-3.5 w-3.5" />
                          <span>{interviewData.location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2 text-xs text-blue-600">
                        <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium ${
                          interviewData.mode === 'online' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {interviewData.mode === 'online' ? 'Online' : 'In-Person'}
                        </span>
                      </div>
                      {interviewData.notes && (
                        <p className="text-xs text-blue-600 italic">{interviewData.notes}</p>
                      )}
                    </div>
                    );
                  })()}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Current Status */}
      <div className="border-t pt-4">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">Current Status</h4>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg border border-gray-200">
          <span className={`w-2 h-2 rounded-full ${
            isRejected ? 'bg-red-500' :
            application.status === 'accepted' || application.status === 'hired' ? 'bg-green-500' :
            'bg-blue-500'
          }`} />
          <span className="text-sm font-medium text-gray-700">
            {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
          </span>
        </div>
      </div>

      {/* Position Details */}
      <div className="border-t pt-4 mt-4">
        <h4 className="text-sm font-bold text-gray-900 mb-3">Position Details</h4>
        <div className="space-y-2">
          <div className="flex">
            <span className="text-sm text-gray-500 w-32 flex-shrink-0">Job Title:</span>
            <span className="text-sm text-gray-900">{job?.title || '-'}</span>
          </div>
          <div className="flex">
            <span className="text-sm text-gray-500 w-32 flex-shrink-0">Department:</span>
            <span className="text-sm text-gray-900">{job?.department?.name || '-'}</span>
          </div>
          <div className="flex">
            <span className="text-sm text-gray-500 w-32 flex-shrink-0">Location:</span>
            <span className="text-sm text-gray-900">{job?.location || '-'}</span>
          </div>
          <div className="flex">
            <span className="text-sm text-gray-500 w-32 flex-shrink-0">Applied Date:</span>
            <span className="text-sm text-gray-900">{formatDate(application.created_at) || '-'}</span>
          </div>
        </div>
      </div>

      {/* Submitted Information */}
      <div className="border-t pt-4 mt-4">
        <h4 className="text-sm font-bold text-gray-900 mb-3">Your Submitted Information</h4>
        <div className="space-y-2">
          <div className="flex">
            <span className="text-sm text-gray-500 w-32 flex-shrink-0">Name:</span>
            <span className="text-sm text-gray-900">{application.applicant_name || '-'}</span>
          </div>
          <div className="flex">
            <span className="text-sm text-gray-500 w-32 flex-shrink-0">Email:</span>
            <span className="text-sm text-gray-900">{application.email || '-'}</span>
          </div>
          <div className="flex">
            <span className="text-sm text-gray-500 w-32 flex-shrink-0">Phone:</span>
            <span className="text-sm text-gray-900">{application.phone || '-'}</span>
          </div>
          <div className="flex">
            <span className="text-sm text-gray-500 w-32 flex-shrink-0">Resume:</span>
            <span className="text-sm text-gray-900 break-all">{application.resume_path ? application.resume_path.split('/').pop() : '-'}</span>
          </div>
        </div>
      </div>

      {/* Cover Letter */}
      {application.cover_letter_text && (
        <div className="border-t pt-4 mt-4">
          <h4 className="text-sm font-bold text-gray-900 mb-3">Cover Letter</h4>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{application.cover_letter_text}</p>
          </div>
        </div>
      )}

      {/* Notes */}
      {application.notes && !isRejected && (
        <div className="border-t pt-4 mt-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Notes</h4>
          <p className="text-sm text-gray-600">{application.notes}</p>
        </div>
      )}
    </Modal>
  );
}
