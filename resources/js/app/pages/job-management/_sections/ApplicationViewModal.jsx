import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Modal, Button, showSuccess } from '@/app/components';
import { DocumentTextIcon, EyeIcon, ArrowRightIcon, CalendarIcon, XCircleIcon, CheckCircleIcon, ArrowPathIcon, HandThumbUpIcon, HandThumbDownIcon, DocumentCheckIcon, PencilSquareIcon, CloudArrowUpIcon } from '@heroicons/react/24/outline';
import { format } from 'date-fns';
import { updateJobApplication, fetchJobApplications } from '../_redux';
import ScheduleInterviewModal from './ScheduleInterviewModal';
import PreEmploymentDocumentsModal from './PreEmploymentDocumentsModal';

const statusConfig = {
  pending: { label: 'New', bg: 'bg-gray-100 text-gray-700 border-gray-200' },
  reviewing: { label: 'Reviewed', bg: 'bg-cyan-100 text-cyan-700 border-cyan-200' },
  interview: { label: 'Initial Interview', bg: 'bg-orange-100 text-orange-700 border-orange-200' },
  shortlisted: { label: 'Interview Passed', bg: 'bg-indigo-100 text-indigo-700 border-indigo-200' },
  final_interview: { label: 'Final Interview', bg: 'bg-purple-100 text-purple-700 border-purple-200' },
  job_offer: { label: 'Job Offer', bg: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  accepted: { label: 'Contract Signing', bg: 'bg-teal-100 text-teal-700 border-teal-200' },
  pre_employment_documents: { label: 'Pre-Employment Docs', bg: 'bg-blue-100 text-blue-700 border-blue-200' },
  hired: { label: 'Hired', bg: 'bg-green-100 text-green-700 border-green-200' },
  rejected: { label: 'Rejected', bg: 'bg-red-100 text-red-700 border-red-200' },
};

export default function ApplicationViewModal({ isOpen, onClose, application, onStatusChange }) {
  const dispatch = useDispatch();
  const [isNextStepOpen, setIsNextStepOpen] = useState(false);
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [isDocsModalOpen, setIsDocsModalOpen] = useState(false);
  const [scheduleType, setScheduleType] = useState('initial');
  const [nextStepLoading, setNextStepLoading] = useState(false);

  if (!application) return null;

  const job = application.job_posting;
  const status = statusConfig[application.status] || statusConfig.pending;

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    try { return format(new Date(dateString), 'M/d/yyyy'); } catch { return dateString; }
  };

  const handleViewResume = async () => {
    if (!application.resume_path) return;

    // Open resume in new tab
    window.open(`/storage/${application.resume_path}`, '_blank');

    // Auto-update status to reviewing if currently pending
    if (application.status === 'pending') {
      try {
        await dispatch(updateJobApplication({ id: application.id, data: { status: 'reviewing' } })).unwrap();
        onStatusChange?.();
      } catch (error) {
        console.error('Failed to update status:', error);
      }
    }
  };

  const resumeFilename = application.resume_path
    ? application.resume_path.split('/').pop()
    : null;

  const canProceed = application.status !== 'pending';

  const handleNextStepAction = async (newStatus, successTitle, successContent) => {
    setNextStepLoading(true);
    try {
      await dispatch(updateJobApplication({ id: application.id, data: { status: newStatus } })).unwrap();
      showSuccess({ title: successTitle, content: successContent });
      setIsNextStepOpen(false);
      onStatusChange?.();
      onClose();
    } catch (error) {
      console.error('Failed to update status:', error);
    } finally {
      setNextStepLoading(false);
    }
  };

  // Build next step options based on current status
  const getNextStepOptions = () => {
    const name = application.applicant_name;

    if (application.status === 'reviewing') {
      return [
        {
          key: 'schedule',
          label: 'Schedule Initial Interview',
          description: 'Move applicant to the interview stage',
          icon: CalendarIcon,
          iconBg: 'bg-indigo-100 group-hover:bg-indigo-200',
          iconColor: 'text-indigo-600',
          action: () => { setScheduleType('initial'); setIsNextStepOpen(false); setIsScheduleOpen(true); },
        },
        {
          key: 'reject',
          label: 'Reject Application',
          description: 'Mark this application as rejected',
          icon: XCircleIcon,
          iconBg: 'bg-red-100 group-hover:bg-red-200',
          iconColor: 'text-red-600',
          hoverBorder: 'hover:border-red-500 hover:bg-red-50',
          action: () => handleNextStepAction('rejected', 'Application Rejected', `${name}'s application has been rejected.`),
        },
      ];
    }

    if (application.status === 'interview') {
      return [
        {
          key: 'reschedule',
          label: 'Reschedule Interview',
          description: 'Change the interview date/time',
          icon: ArrowPathIcon,
          iconBg: 'bg-amber-100 group-hover:bg-amber-200',
          iconColor: 'text-amber-600',
          hoverBorder: 'hover:border-amber-500 hover:bg-amber-50',
          action: () => { setScheduleType('initial'); setIsNextStepOpen(false); setIsScheduleOpen(true); },
        },
        {
          key: 'pass',
          label: 'Pass Initial Interview',
          description: 'Move applicant to Interview Passed',
          icon: CheckCircleIcon,
          iconBg: 'bg-green-100 group-hover:bg-green-200',
          iconColor: 'text-green-600',
          hoverBorder: 'hover:border-green-500 hover:bg-green-50',
          action: () => handleNextStepAction('shortlisted', 'Interview Passed', `${name} has passed the initial interview.`),
        },
        {
          key: 'fail',
          label: 'Fail Initial Interview',
          description: 'Mark applicant as rejected',
          icon: XCircleIcon,
          iconBg: 'bg-red-100 group-hover:bg-red-200',
          iconColor: 'text-red-600',
          hoverBorder: 'hover:border-red-500 hover:bg-red-50',
          action: () => handleNextStepAction('rejected', 'Interview Failed', `${name} did not pass the initial interview.`),
        },
      ];
    }

    if (application.status === 'shortlisted') {
      return [
        {
          key: 'schedule-final',
          label: 'Schedule Final Interview',
          description: 'Proceed to the final interview stage',
          icon: CalendarIcon,
          iconBg: 'bg-purple-100 group-hover:bg-purple-200',
          iconColor: 'text-purple-600',
          hoverBorder: 'hover:border-purple-500 hover:bg-purple-50',
          action: () => { setScheduleType('final'); setIsNextStepOpen(false); setIsScheduleOpen(true); },
        },
        {
          key: 'reject',
          label: 'Reject Application',
          description: 'Mark this application as rejected',
          icon: XCircleIcon,
          iconBg: 'bg-red-100 group-hover:bg-red-200',
          iconColor: 'text-red-600',
          hoverBorder: 'hover:border-red-500 hover:bg-red-50',
          action: () => handleNextStepAction('rejected', 'Application Rejected', `${name}'s application has been rejected.`),
        },
      ];
    }

    if (application.status === 'final_interview') {
      return [
        {
          key: 'reschedule-final',
          label: 'Reschedule Final Interview',
          description: 'Change the final interview date/time',
          icon: ArrowPathIcon,
          iconBg: 'bg-amber-100 group-hover:bg-amber-200',
          iconColor: 'text-amber-600',
          hoverBorder: 'hover:border-amber-500 hover:bg-amber-50',
          action: () => { setScheduleType('final'); setIsNextStepOpen(false); setIsScheduleOpen(true); },
        },
        {
          key: 'pass-final',
          label: 'Pass Final Interview',
          description: 'Send job offer to applicant',
          icon: CheckCircleIcon,
          iconBg: 'bg-green-100 group-hover:bg-green-200',
          iconColor: 'text-green-600',
          hoverBorder: 'hover:border-green-500 hover:bg-green-50',
          action: () => handleNextStepAction('job_offer', 'Final Interview Passed', `${name} has passed the final interview. Job offer sent.`),
        },
        {
          key: 'fail-final',
          label: 'Fail Final Interview',
          description: 'Mark applicant as rejected',
          icon: XCircleIcon,
          iconBg: 'bg-red-100 group-hover:bg-red-200',
          iconColor: 'text-red-600',
          hoverBorder: 'hover:border-red-500 hover:bg-red-50',
          action: () => handleNextStepAction('rejected', 'Final Interview Failed', `${name} did not pass the final interview.`),
        },
      ];
    }

    if (application.status === 'job_offer') {
      return [
        {
          key: 'accept-offer',
          label: 'Offer Accepted',
          description: 'Applicant accepted the job offer',
          icon: HandThumbUpIcon,
          iconBg: 'bg-green-100 group-hover:bg-green-200',
          iconColor: 'text-green-600',
          hoverBorder: 'hover:border-green-500 hover:bg-green-50',
          action: () => handleNextStepAction('accepted', 'Offer Accepted', `${name} has accepted the job offer. Proceed to contract signing.`),
        },
        {
          key: 'decline-offer',
          label: 'Offer Declined',
          description: 'Applicant declined the job offer',
          icon: HandThumbDownIcon,
          iconBg: 'bg-red-100 group-hover:bg-red-200',
          iconColor: 'text-red-600',
          hoverBorder: 'hover:border-red-500 hover:bg-red-50',
          action: () => handleNextStepAction('rejected', 'Offer Declined', `${name} has declined the job offer.`),
        },
      ];
    }

    if (application.status === 'accepted') {
      return [
        {
          key: 'contract-signed',
          label: 'Mark Contract Signed',
          description: 'Move to pre-employment documents collection',
          icon: DocumentCheckIcon,
          iconBg: 'bg-teal-100 group-hover:bg-teal-200',
          iconColor: 'text-teal-600',
          hoverBorder: 'hover:border-teal-500 hover:bg-teal-50',
          action: () => handleNextStepAction('pre_employment_documents', 'Contract Signed', `${name} has signed the contract. Proceed to upload pre-employment documents.`),
        },
      ];
    }

    if (application.status === 'pre_employment_documents') {
      const hasAllDocs = application.pre_employment_documents?.length >= 6; // At least 6 required docs
      
      return [
        {
          key: 'upload-docs',
          label: 'Upload Pre-Employment Documents',
          description: 'Upload NBI, Police Clearance, Medical Cert, etc.',
          icon: CloudArrowUpIcon,
          iconBg: 'bg-blue-100 group-hover:bg-blue-200',
          iconColor: 'text-blue-600',
          hoverBorder: 'hover:border-blue-500 hover:bg-blue-50',
          action: () => { setIsNextStepOpen(false); setIsDocsModalOpen(true); },
        },
        {
          key: 'mark-hired',
          label: 'Mark as Hired',
          description: hasAllDocs ? 'All documents uploaded — create employee record' : 'Upload all required documents first',
          icon: CheckCircleIcon,
          iconBg: hasAllDocs ? 'bg-green-100 group-hover:bg-green-200' : 'bg-gray-100',
          iconColor: hasAllDocs ? 'text-green-600' : 'text-gray-400',
          hoverBorder: hasAllDocs ? 'hover:border-green-500 hover:bg-green-50' : 'opacity-50 cursor-not-allowed',
          action: hasAllDocs ? () => handleNextStepAction('hired', 'Applicant Hired!', `${name} has been hired. Employee record created automatically.`) : () => {},
          disabled: !hasAllDocs,
        },
      ];
    }

    return [];
  };

  const nextStepOptions = getNextStepOptions().filter(opt => !opt.disabled);

  return (
    <>
    <Modal
      open={isOpen}
      onClose={onClose}
      size="md"
      title=""
      footer={null}
      closable={false}
      styles={{ body: { padding: 0, maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' } }}
    >
      {/* Blue Header */}
      <div className="bg-indigo-600 px-6 py-4 flex items-center justify-between rounded-t-lg -mt-6 -mx-6 mb-0">
        <h2 className="text-lg font-semibold text-white">Application Details</h2>
        <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="px-6 py-5 space-y-6">
        {/* Applicant Information */}
        <div>
          <h3 className="text-base font-bold text-gray-900 mb-3">Applicant Information</h3>
          <div className="space-y-2.5">
            <div className="flex">
              <span className="text-sm text-gray-500 w-32 flex-shrink-0">Name:</span>
              <span className="text-sm font-medium text-gray-900">{application.applicant_name}</span>
            </div>
            <div className="flex">
              <span className="text-sm text-gray-500 w-32 flex-shrink-0">Email:</span>
              <span className="text-sm font-medium text-gray-900">{application.email}</span>
            </div>
            <div className="flex">
              <span className="text-sm text-gray-500 w-32 flex-shrink-0">Phone:</span>
              <span className="text-sm font-medium text-gray-900">{application.phone || '-'}</span>
            </div>
            <div className="flex">
              <span className="text-sm text-gray-500 w-32 flex-shrink-0">Applied Date:</span>
              <span className="text-sm font-medium text-gray-900">{formatDate(application.created_at)}</span>
            </div>
            <div className="flex items-center">
              <span className="text-sm text-gray-500 w-32 flex-shrink-0">Status:</span>
              <span className={`inline-flex px-2.5 py-0.5 text-xs font-semibold rounded-full border ${status.bg}`}>
                {status.label}
              </span>
            </div>
          </div>
        </div>

        {/* Position Details */}
        <div>
          <h3 className="text-base font-bold text-gray-900 mb-3">Position Details</h3>
          <div className="space-y-2.5">
            <div className="flex">
              <span className="text-sm text-gray-500 w-32 flex-shrink-0">Job Title:</span>
              <span className="text-sm font-medium text-gray-900">{job?.title || '-'}</span>
            </div>
            <div className="flex">
              <span className="text-sm text-gray-500 w-32 flex-shrink-0">Department:</span>
              <span className="text-sm font-medium text-gray-900">{job?.department?.name || '-'}</span>
            </div>
            <div className="flex">
              <span className="text-sm text-gray-500 w-32 flex-shrink-0">Location:</span>
              <span className="text-sm font-medium text-gray-900">{job?.location || '-'}</span>
            </div>
          </div>
        </div>

        {/* Cover Letter */}
        {application.cover_letter_text && (
          <div>
            <h3 className="text-base font-bold text-gray-900 mb-3">Cover Letter</h3>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-700 whitespace-pre-wrap">{application.cover_letter_text}</p>
            </div>
          </div>
        )}

        {/* Resume */}
        {resumeFilename && (
          <div>
            <h3 className="text-base font-bold text-gray-900 mb-3">Resume</h3>
            <div className="inline-flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
              <DocumentTextIcon className="h-5 w-5 text-gray-500 flex-shrink-0" />
              <span className="text-sm text-gray-700 break-all">{resumeFilename}</span>
              <button
                onClick={handleViewResume}
                className="text-gray-400 hover:text-indigo-600 transition-colors flex-shrink-0"
                title="View Resume"
              >
                <EyeIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center gap-3 px-6 py-4 border-t border-gray-200">
        <Button variant="secondary" onClick={onClose} size="sm">
          Close
        </Button>
        <Button
          variant="primary"
          disabled={!canProceed || nextStepOptions.length === 0}
          onClick={() => setIsNextStepOpen(true)}
          className="flex-1"
          icon={<ArrowRightIcon className="h-4 w-4" />}
          title={!canProceed ? 'Review the resume first before proceeding' : nextStepOptions.length === 0 ? 'No available actions for this status' : ''}
        >
          Next Step
        </Button>
      </div>
    </Modal>

    {/* Next Step Modal */}
    <Modal
      open={isNextStepOpen}
      onClose={() => setIsNextStepOpen(false)}
      size="sm"
      title="Choose Next Step"
    >
      <p className="text-sm text-gray-600 mb-6">
        Select an action for <span className="font-semibold">{application.applicant_name}</span>'s application:
      </p>
      <div className="space-y-3">
        {nextStepOptions.map((option) => (
          <button
            key={option.key}
            onClick={option.action}
            disabled={nextStepLoading}
            className={`w-full flex items-center gap-4 p-4 border border-gray-200 rounded-lg ${option.hoverBorder || 'hover:border-indigo-500 hover:bg-indigo-50'} transition-colors text-left group`}
          >
            <div className={`w-10 h-10 rounded-full ${option.iconBg} flex items-center justify-center flex-shrink-0 transition-colors`}>
              <option.icon className={`h-5 w-5 ${option.iconColor}`} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{option.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{option.description}</p>
            </div>
          </button>
        ))}
      </div>
    </Modal>

    {/* Schedule Interview Modal */}
    <ScheduleInterviewModal
      isOpen={isScheduleOpen}
      onClose={() => setIsScheduleOpen(false)}
      application={application}
      interviewType={scheduleType}
      onSuccess={() => {
        onStatusChange?.();
        onClose();
      }}
    />

    {/* Pre-Employment Documents Modal */}
    <PreEmploymentDocumentsModal
      isOpen={isDocsModalOpen}
      onClose={() => setIsDocsModalOpen(false)}
      application={application}
      onSuccess={() => {
        onStatusChange?.();
      }}
    />
    </>
  );
}
