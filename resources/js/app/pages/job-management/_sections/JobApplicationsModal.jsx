import React, { useState, useEffect } from 'react';
import { Modal, Button, showSuccess } from '@/app/components';
import { DocumentArrowDownIcon, EnvelopeIcon, PhoneIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

export default function JobApplicationsModal({ isOpen, onClose, job }) {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && job) {
      fetchApplications();
    }
  }, [isOpen, job]);

  const fetchApplications = async () => {
    if (!job?.id) return;
    
    setLoading(true);
    try {
      const response = await axios.get('/api/job-applications', {
        params: { job_posting_id: job.id }
      });
      setApplications(response.data);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (applicationId, newStatus) => {
    try {
      await axios.put(`/api/job-applications/${applicationId}`, {
        status: newStatus
      });
      showSuccess({
        title: 'Status Updated',
        content: `Application status has been updated to ${newStatus}.`,
      });
      fetchApplications();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const handleDownload = async (application, type) => {
    try {
      const path = type === 'resume' ? application.resume_path : application.cover_letter_path;
      if (!path) return;

      const response = await axios.get(`/storage/${path}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', path.split('/').pop());
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: 'bg-yellow-50 text-yellow-700',
      reviewing: 'bg-blue-50 text-blue-700',
      shortlisted: 'bg-purple-50 text-purple-700',
      interview: 'bg-indigo-50 text-indigo-700',
      rejected: 'bg-red-50 text-red-700',
      accepted: 'bg-green-50 text-green-700',
    };
    return badges[status] || badges.pending;
  };

  if (!job) return null;

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      size="2xl"
      title={`Applications for ${job.title}`}
    >
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12 text-gray-500">
            Loading applications...
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No applications received yet for this position.
          </div>
        ) : (
          <div className="space-y-4 max-h-[600px] overflow-y-auto">
            {applications.map((app) => (
              <div
                key={app.id}
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">
                        {app.applicant_name}
                      </h4>
                      <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${getStatusBadge(app.status)}`}>
                        {app.status}
                      </span>
                    </div>

                    <div className="space-y-1 text-sm text-gray-600 mb-3">
                      <div className="flex items-center gap-2">
                        <EnvelopeIcon className="h-4 w-4" />
                        <a href={`mailto:${app.email}`} className="hover:text-indigo-600">
                          {app.email}
                        </a>
                      </div>
                      {app.phone && (
                        <div className="flex items-center gap-2">
                          <PhoneIcon className="h-4 w-4" />
                          <a href={`tel:${app.phone}`} className="hover:text-indigo-600">
                            {app.phone}
                          </a>
                        </div>
                      )}
                      {app.address && (
                        <div className="text-xs text-gray-500">
                          Address: {app.address}
                        </div>
                      )}
                    </div>

                    {app.cover_letter_text && (
                      <div className="mb-3">
                        <p className="text-sm text-gray-700 line-clamp-3">
                          {app.cover_letter_text}
                        </p>
                      </div>
                    )}

                    <div className="flex gap-2 mb-3">
                      {app.resume_path && (
                        <button
                          onClick={() => handleDownload(app, 'resume')}
                          className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800"
                        >
                          <DocumentArrowDownIcon className="h-4 w-4" />
                          Download Resume
                        </button>
                      )}
                      {app.cover_letter_path && (
                        <button
                          onClick={() => handleDownload(app, 'cover_letter')}
                          className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800"
                        >
                          <DocumentArrowDownIcon className="h-4 w-4" />
                          Download Cover Letter
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>Applied: {formatDate(app.created_at)}</span>
                      {app.reviewed_at && (
                        <>
                          <span>•</span>
                          <span>Reviewed: {formatDate(app.reviewed_at)}</span>
                        </>
                      )}
                      {app.reviewed_by && (
                        <>
                          <span>•</span>
                          <span>by {app.reviewedBy?.name}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="ml-4">
                    <select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app.id, e.target.value)}
                      className="text-sm rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="reviewing">Reviewing</option>
                      <option value="shortlisted">Shortlisted</option>
                      <option value="interview">Interview</option>
                      <option value="rejected">Rejected</option>
                      <option value="accepted">Accepted</option>
                    </select>
                  </div>
                </div>

                {app.notes && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-sm text-gray-600">
                      <strong>Notes:</strong> {app.notes}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-6 flex justify-end">
        <Button onClick={onClose}>
          Close
        </Button>
      </div>
    </Modal>
  );
}
