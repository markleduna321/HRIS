import React from 'react';
import { Modal, Button } from '@/app/components';
import { 
  XMarkIcon,
  UserIcon,
  EyeIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { format } from 'date-fns';

const StatusBadge = ({ status }) => {
  const variants = {
    pending: 'bg-amber-100 text-amber-700',
    approved: 'bg-emerald-100 text-emerald-700',
    rejected: 'bg-red-100 text-red-700',
    in_progress: 'bg-violet-100 text-violet-700',
    filled: 'bg-blue-100 text-blue-700',
    cancelled: 'bg-gray-100 text-gray-700',
  };

  const labels = {
    pending: 'Pending Review',
    approved: 'Approved',
    rejected: 'Rejected',
    in_progress: 'In Progress',
    filled: 'Filled',
    cancelled: 'Cancelled',
  };

  return (
    <span className={`px-3 py-1 text-sm font-medium rounded ${variants[status] || variants.pending}`}>
      {labels[status] || status}
    </span>
  );
};

const PriorityBadge = ({ priority }) => {
  const variants = {
    low: 'bg-gray-100 text-gray-700',
    medium: 'bg-blue-100 text-blue-700',
    high: 'bg-orange-100 text-orange-700',
    urgent: 'bg-red-100 text-red-700',
  };

  const labels = {
    low: 'Low Priority',
    medium: 'Medium Priority',
    high: 'High Priority',
    urgent: 'Urgent',
  };

  return (
    <span className={`px-3 py-1 text-sm font-medium rounded ${variants[priority] || variants.medium}`}>
      {labels[priority] || priority}
    </span>
  );
};

const InfoField = ({ label, value }) => (
  <div>
    <p className="text-sm text-gray-600 mb-1">{label}</p>
    <p className="text-base font-medium text-gray-900">{value || 'N/A'}</p>
  </div>
);

const TimelineItem = ({ icon: Icon, iconBgColor, title, name, date, description }) => (
  <div className="flex gap-3">
    <div className={`flex-shrink-0 w-10 h-10 rounded-full ${iconBgColor} flex items-center justify-center`}>
      <Icon className="h-5 w-5 text-white" />
    </div>
    <div className="flex-1 pb-6">
      <p className="font-semibold text-gray-900 text-sm">{title}</p>
      <p className="text-sm text-gray-600">{name}</p>
      <p className="text-xs text-gray-500 mt-0.5">{date}</p>
      {description && (
        <p className="text-sm text-gray-700 mt-2 bg-gray-50 p-2 rounded">{description}</p>
      )}
    </div>
  </div>
);

export default function RequisitionViewModal({ 
  isOpen, 
  onClose, 
  requisition,
  onEdit,
  onDelete,
  onApprove,
  onReject,
}) {
  if (!requisition) return null;

  const canEdit = requisition.status === 'pending' || requisition.status === 'rejected';
  const canApprove = requisition.status === 'pending';

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
            <div className="flex items-center gap-3 mb-1">
              <h2 className="text-2xl font-bold text-gray-900">{requisition.position_title}</h2>
              {requisition.is_new && (
                <span className="px-2 py-0.5 text-xs font-semibold text-blue-600 bg-blue-50 rounded flex items-center gap-1">
                  ★ New Position
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 mb-3">{requisition.requisition_number}</p>
            <div className="flex items-center gap-2">
              <StatusBadge status={requisition.status} />
              <PriorityBadge priority={requisition.priority} />
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
            {/* Basic Info Grid */}
            <div className="grid grid-cols-4 gap-x-6 gap-y-4">
              <InfoField 
                label="Department" 
                value={requisition.department?.name} 
              />
              <InfoField 
                label="Location" 
                value={requisition.location} 
              />
              <InfoField 
                label="Employment Type" 
                value={requisition.employment_type?.split('-').map(word => 
                  word.charAt(0).toUpperCase() + word.slice(1)
                ).join('-')} 
              />
              <InfoField 
                label="Positions" 
                value={`${requisition.positions_filled || 0}/${requisition.number_of_positions}`} 
              />
            </div>

            {/* Secondary Info Grid */}
            <div className="grid grid-cols-4 gap-x-6 gap-y-4">
              <InfoField 
                label="Salary Range" 
                value={requisition.salary_range} 
              />
              <InfoField 
                label="Requested By" 
                value={requisition.requested_by?.name} 
              />
              <InfoField 
                label="Date Requested" 
                value={requisition.created_at ? format(new Date(requisition.created_at), 'M/d/yyyy') : null} 
              />
              <InfoField 
                label="Target Start Date" 
                value={requisition.target_start_date ? format(new Date(requisition.target_start_date), 'M/d/yyyy') : null} 
              />
            </div>

            {/* Business Justification */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-3">Business Justification</h3>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {requisition.justification || 'No justification provided.'}
              </p>
            </div>

            {/* Required Qualifications */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-3">Required Qualifications</h3>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {requisition.required_qualifications || 'None specified.'}
              </p>
            </div>

            {/* Key Responsibilities */}
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-3">Key Responsibilities</h3>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {requisition.key_responsibilities || 'None specified.'}
              </p>
            </div>
          </div>

          {/* Right Column - Timeline */}
          <div className="col-span-1 border-l border-gray-200 pl-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">⏱️</span>
              <h3 className="text-base font-bold text-gray-900">Timeline</h3>
            </div>
            
            <div className="space-y-0">
              {/* Requisition Created */}
              <TimelineItem
                icon={UserIcon}
                iconBgColor="bg-blue-500"
                title="Requisition created"
                name={requisition.requested_by?.name || 'Unknown'}
                date={requisition.created_at ? format(new Date(requisition.created_at), 'M/d/yyyy, h:mm:ss a') : 'N/A'}
                description={`Initial requisition submitted for ${requisition.position_title}`}
              />

              {/* Approval/Rejection Event */}
              {requisition.approved_by && requisition.approved_at && (
                <>
                  {requisition.status === 'approved' ? (
                    <TimelineItem
                      icon={CheckCircleIcon}
                      iconBgColor="bg-green-500"
                      title="Approved by TA Manager"
                      name={requisition.approved_by?.name || 'Unknown'}
                      date={format(new Date(requisition.approved_at), 'M/d/yyyy, h:mm:ss a')}
                      description="Approved for immediate posting. Prioritize for recruitment."
                    />
                  ) : requisition.status === 'rejected' ? (
                    <TimelineItem
                      icon={XMarkIcon}
                      iconBgColor="bg-red-500"
                      title="Rejected"
                      name={requisition.approved_by?.name || 'Unknown'}
                      date={format(new Date(requisition.approved_at), 'M/d/yyyy, h:mm:ss a')}
                      description={requisition.rejection_reason || 'Requisition was rejected.'}
                    />
                  ) : null}
                </>
              )}

              {/* In Progress */}
              {requisition.status === 'in_progress' && (
                <TimelineItem
                  icon={EyeIcon}
                  iconBgColor="bg-purple-500"
                  title="Recruitment in Progress"
                  name="HR Team"
                  date={requisition.updated_at ? format(new Date(requisition.updated_at), 'M/d/yyyy, h:mm:ss a') : 'N/A'}
                  description="Job posting created and recruitment process initiated."
                />
              )}
            </div>
          </div>
        </div>

        {/* Footer with Actions */}
        <div className="flex items-center justify-end gap-3 px-7 py-4 border-t border-gray-200 bg-gray-50">
          {canApprove && requisition.status === 'approved' && (
            <Button
              variant="primary"
              icon={<UserIcon className="h-5 w-5" />}
            >
              Update Headcount
            </Button>
          )}
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
