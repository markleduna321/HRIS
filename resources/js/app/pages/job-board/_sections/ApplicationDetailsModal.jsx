import { Modal } from '@/app/components';
import { format } from 'date-fns';
import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/solid';
import { CalendarIcon, ClockIcon, MapPinIcon, VideoCameraIcon, LinkIcon, CloudArrowUpIcon, UserIcon } from '@heroicons/react/24/outline';
import PreEmploymentDocumentsModal from '@/app/pages/job-management/_sections/PreEmploymentDocumentsModal';
import { useState } from 'react';

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
  const [isDocsModalOpen, setIsDocsModalOpen] = useState(false);
  
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
    <Modal 
      open={isOpen} 
      onClose={onClose} 
      size="full"
      title=""
      footer={null}
      closable={false}
      styles={{ body: { padding: 0, maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' } }}
    >
      <div className="relative bg-white">
        {/* Header */}
        <div className="flex items-start justify-between px-7 pt-7 pb-5 border-b border-gray-200">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">{job?.title || 'Unknown Position'}</h2>
            <p className="text-sm text-gray-500 mb-3">
              {job?.department?.name}{job?.location ? ` · ${job.location}` : ''} · Applied {formatDate(application.created_at)}
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg border border-gray-200">
              <span className={`w-2 h-2 rounded-full ${
                isRejected ? 'bg-red-500' :
                application.status === 'accepted' || application.status === 'hired' ? 'bg-green-500' :
                'bg-blue-500'
              }`} />
              <span className="text-sm font-medium text-gray-700">
                {application.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Two Column Content */}
        <div className="grid grid-cols-3 gap-6 p-7 max-h-[calc(100vh-280px)] overflow-y-auto">
          {/* Left Column - Main Details */}
          <div className="col-span-2 space-y-6">
            {/* Rejected Banner */}
            {isRejected && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
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

            {/* Position Details */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-3">Position Details</h3>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3">
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
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-3">Your Submitted Information</h3>
              <div className="grid grid-cols-2 gap-x-6 gap-y-3">
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
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-3">Cover Letter</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{application.cover_letter_text}</p>
                </div>
              </div>
            )}

            {/* Pre-Employment Documents Section */}
            {application.status === 'pre_employment_documents' && (
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-3">Pre-Employment Documents</h3>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <CloudArrowUpIcon className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-blue-900">Document Submission Required</p>
                      <p className="text-xs text-blue-700 mt-1">
                        Please upload the required pre-employment documents. HR will review them before finalizing your employment.
                      </p>
                      <button
                        onClick={() => setIsDocsModalOpen(true)}
                        className="mt-3 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        <CloudArrowUpIcon className="h-4 w-4" />
                        Upload Documents
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notes */}
            {application.notes && !isRejected && (
              <div>
                <h3 className="text-base font-semibold text-gray-900 mb-3">Notes</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{application.notes}</p>
              </div>
            )}
          </div>

          {/* Right Column - Timeline */}
          <div className="col-span-1 border-l border-gray-200 pl-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">📋</span>
              <h3 className="text-base font-bold text-gray-900">Application Progress</h3>
            </div>

            <div className="space-y-0">
              {progressSteps.map((step, index) => {
                const isCompleted = !isRejected && index <= currentStepIndex;
                const isCurrent = !isRejected && index === currentStepIndex;
                const interview = getInterviewForStep(step.key);
                
                return (
                  <div key={step.key} className="relative pb-8 last:pb-0">
                    {/* Connector Line */}
                    {index < progressSteps.length - 1 && (
                      <div
                        className={`absolute left-[15px] top-[30px] w-0.5 h-full ${
                          isCompleted && !isCurrent ? 'bg-blue-600' : 'bg-gray-200'
                        }`}
                      />
                    )}

                    <div className="relative flex gap-3">
                      {/* Circle */}
                      <div className="flex-shrink-0 z-10">
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
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                          {step.label}
                        </p>
                        <p className={`text-xs mt-0.5 ${isCompleted ? 'text-gray-500' : 'text-gray-400'}`}>
                          {step.description}
                        </p>

                        {/* Interview details */}
                        {(step.key === 'interview' || step.key === 'final_interview') && isCompleted && interview && (
                          <div className="mt-2 bg-blue-50 border border-blue-200 rounded-lg p-3 space-y-1.5">
                            <div className="flex items-center gap-2 text-xs text-blue-800">
                              <CalendarIcon className="h-3.5 w-3.5" />
                              <span className="font-medium">
                                {formatDate(interview.interview_date)} at {formatTime(interview.interview_time)}
                              </span>
                            </div>
                            {interview.mode === 'online' && interview.meeting_link && (
                              <div className="flex items-center gap-2 text-xs text-blue-700">
                                <VideoCameraIcon className="h-3.5 w-3.5" />
                                <a
                                  href={interview.meeting_link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="underline hover:text-blue-900 break-all"
                                >
                                  {interview.meeting_link}
                                </a>
                              </div>
                            )}
                            {interview.mode === 'in-person' && interview.location && (
                              <div className="flex items-center gap-2 text-xs text-blue-700">
                                <MapPinIcon className="h-3.5 w-3.5" />
                                <span>{interview.location}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2 text-xs text-blue-600">
                              <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium ${
                                interview.mode === 'online' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                              }`}>
                                {interview.mode === 'online' ? 'Online' : 'In-Person'}
                              </span>
                            </div>
                            {interview.notes && (
                              <p className="text-xs text-blue-600 italic">{interview.notes}</p>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Pre-Employment Documents Modal */}
      <PreEmploymentDocumentsModal
        isOpen={isDocsModalOpen}
        onClose={() => setIsDocsModalOpen(false)}
        application={application}
        onSuccess={() => {
          // Refresh application data
        }}
      />
    </Modal>
  );
}
