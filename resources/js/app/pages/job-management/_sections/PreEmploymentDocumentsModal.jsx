import React, { useState, useEffect } from 'react';
import { Modal, Button, showSuccess, showError } from '@/app/components';
import { DocumentTextIcon, TrashIcon, CloudArrowUpIcon, CheckCircleIcon, XCircleIcon, ClockIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { uploadJobApplicationDocument, fetchJobApplicationDocuments, deleteJobApplicationDocument, approveJobApplicationDocument, rejectJobApplicationDocument } from '@/app/services/job-application-document-service';
import { usePage } from '@inertiajs/react';

const REQUIRED_DOCUMENTS = [
  { key: 'nbi_clearance', label: 'NBI Clearance', required: true },
  { key: 'police_clearance', label: 'Police Clearance', required: true },
  { key: 'barangay_clearance', label: 'Barangay Clearance', required: true },
  { key: 'medical_certificate', label: 'Medical Certificate', required: true },
  { key: 'birth_certificate', label: 'Birth Certificate', required: true },
  { key: 'valid_id', label: 'Valid ID (2 copies)', required: true },
  { key: 'sss_form', label: 'SSS E-1 Form', required: false },
  { key: 'philhealth_form', label: 'PhilHealth MDR Form', required: false },
  { key: 'pagibig_form', label: 'Pag-IBIG MDF', required: false },
  { key: 'tin_id', label: 'TIN ID / 1902 Form', required: false },
];

export default function PreEmploymentDocumentsModal({ isOpen, onClose, application, onSuccess }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState({});
  const [rejectingDoc, setRejectingDoc] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const { auth } = usePage().props;
  const user = auth?.user;
  
  // Check if user has HR role (super_admin, admin, or hr)
  const isHR = React.useMemo(() => {
    if (!user || !user.roles || !Array.isArray(user.roles)) {
      return false;
    }
    
    const hrRoles = ['super_admin', 'admin', 'hr'];
    // Roles in Inertia are strings, not objects
    return user.roles.some(role => hrRoles.includes(role));
  }, [user]);

  useEffect(() => {
    if (isOpen && application) {
      fetchDocuments();
    }
  }, [isOpen, application]);

  const fetchDocuments = async () => {
    try {
      const data = await fetchJobApplicationDocuments({ job_application_id: application.id });
      setDocuments(data);
    } catch (error) {
      console.error('Failed to fetch documents:', error);
      if (error.response?.status === 403) {
        showError({ title: 'Access Denied', content: 'You do not have permission to view these documents.' });
      }
    }
  };

  const handleFileUpload = async (documentType, file) => {
    if (!file) return;

    setUploading(prev => ({ ...prev, [documentType]: true }));
    try {
      const formData = new FormData();
      formData.append('job_application_id', application.id);
      formData.append('document_type', documentType);
      formData.append('file', file);

      await uploadJobApplicationDocument(formData);
      showSuccess({ title: 'Document Uploaded', content: 'Pre-employment document uploaded successfully.' });
      await fetchDocuments();
    } catch (error) {
      console.error('Upload error:', error);
      let errorMessage = 'Failed to upload document.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.data?.errors) {
        const errors = Object.values(error.response.data.errors).flat();
        errorMessage = errors.join(' ');
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      showError({ title: 'Upload Failed', content: errorMessage });
    } finally {
      setUploading(prev => ({ ...prev, [documentType]: false }));
    }
  };

  const handleDelete = async (docId) => {
    try {
      await deleteJobApplicationDocument(docId);
      showSuccess({ title: 'Document Deleted', content: 'Document removed successfully.' });
      await fetchDocuments();
    } catch (error) {
      showError({ title: 'Delete Failed', content: 'Failed to delete document.' });
    }
  };

  const handleApprove = async (docId) => {
    try {
      await approveJobApplicationDocument(docId);
      showSuccess({ title: 'Document Approved', content: 'Document has been approved.' });
      await fetchDocuments();
      onSuccess?.();
    } catch (error) {
      showError({ title: 'Approval Failed', content: 'Failed to approve document.' });
    }
  };

  const handleRejectClick = (doc) => {
    setRejectingDoc(doc);
    setRejectionReason('');
  };

  const handleRejectSubmit = async () => {
    if (!rejectionReason.trim()) {
      showError({ title: 'Rejection Reason Required', content: 'Please provide a reason for rejection.' });
      return;
    }

    try {
      await rejectJobApplicationDocument(rejectingDoc.id, rejectionReason);
      showSuccess({ title: 'Document Rejected', content: 'Document has been rejected. Applicant can re-upload.' });
      setRejectingDoc(null);
      setRejectionReason('');
      await fetchDocuments();
      onSuccess?.();
    } catch (error) {
      showError({ title: 'Rejection Failed', content: 'Failed to reject document.' });
    }
  };

  const getDocumentForType = (docType) => {
    return documents.find(d => d.document_type === docType);
  };

  const allRequiredApproved = REQUIRED_DOCUMENTS
    .filter(d => d.required)
    .every(d => {
      const doc = getDocumentForType(d.key);
      return doc && doc.status === 'approved';
    });

  if (!application) return null;

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      size="lg"
      title=""
      footer={null}
      closable={false}
      styles={{ body: { padding: 0, maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' } }}
    >
      {/* Blue Header */}
      <div className="bg-indigo-600 px-6 py-4 -mt-6 -mx-6 mb-0 flex items-start justify-between rounded-t-lg">
        <div>
          <h2 className="text-lg font-semibold text-white">Pre-Employment Documents</h2>
          <p className="text-sm text-indigo-200 mt-0.5">{application.applicant_name}</p>
        </div>
        <button onClick={onClose} className="text-white/80 hover:text-white transition-colors mt-1">
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="px-6 py-5">
        <p className="text-sm text-gray-600 mb-4">
          {isHR ? 'Review and approve/reject pre-employment documents.' : 'Upload all required pre-employment documents.'}
        </p>

        {/* Document Checklist */}
        <div className="space-y-3">
          {REQUIRED_DOCUMENTS.map((docReq) => {
            const uploadedDoc = getDocumentForType(docReq.key);
            const isUploading = uploading[docReq.key];
            const canReupload = uploadedDoc && (uploadedDoc.status === 'rejected' || !isHR);

            return (
              <div key={docReq.key} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    {/* Status Icon */}
                    {uploadedDoc ? (
                      uploadedDoc.status === 'approved' ? (
                        <CheckCircleIcon className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      ) : uploadedDoc.status === 'rejected' ? (
                        <XCircleIcon className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <ClockIcon className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                      )
                    ) : (
                      <DocumentTextIcon className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                    )}

                    {/* Document Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-medium text-gray-900">{docReq.label}</p>
                        {docReq.required && <span className="text-xs text-red-600">*</span>}
                        
                        {/* Status Badge */}
                        {uploadedDoc && (
                          <span className={`inline-flex px-2 py-0.5 text-xs font-medium rounded-full ${
                            uploadedDoc.status === 'approved' ? 'bg-green-100 text-green-700' :
                            uploadedDoc.status === 'rejected' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {uploadedDoc.status === 'approved' ? 'Approved' :
                             uploadedDoc.status === 'rejected' ? 'Rejected' : 'Pending Review'}
                          </span>
                        )}
                      </div>
                      
                      {uploadedDoc && (
                        <>
                          <p className="text-xs text-gray-500 mt-0.5 truncate">{uploadedDoc.original_filename}</p>
                          {uploadedDoc.rejection_reason && (
                            <p className="text-xs text-red-600 mt-1 italic">Reason: {uploadedDoc.rejection_reason}</p>
                          )}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {uploadedDoc ? (
                      <>
                        <a
                          href={`/storage/${uploadedDoc.file_path}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                        >
                          View
                        </a>
                        
                        {/* HR Approve/Reject Buttons */}
                        {isHR && uploadedDoc.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(uploadedDoc.id)}
                              className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-green-700 bg-green-50 border border-green-300 rounded hover:bg-green-100"
                              title="Approve"
                            >
                              <CheckIcon className="h-3.5 w-3.5" />
                              Approve
                            </button>
                            <button
                              onClick={() => handleRejectClick(uploadedDoc)}
                              className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-red-700 bg-red-50 border border-red-300 rounded hover:bg-red-100"
                              title="Reject"
                            >
                              <XMarkIcon className="h-3.5 w-3.5" />
                              Reject
                            </button>
                          </>
                        )}
                        
                        {/* Delete/Re-upload for applicant or rejected docs */}
                        {canReupload && (
                          <>
                            {uploadedDoc.status === 'rejected' && (
                              <>
                                <input
                                  type="file"
                                  className="hidden"
                                  accept=".pdf,.jpg,.jpeg,.png"
                                  onChange={(e) => {
                                    handleDelete(uploadedDoc.id).then(() => {
                                      handleFileUpload(docReq.key, e.target.files[0]);
                                    });
                                  }}
                                  disabled={isUploading}
                                  id={`file-reupload-${docReq.key}`}
                                />
                                <button
                                  type="button"
                                  onClick={() => document.getElementById(`file-reupload-${docReq.key}`).click()}
                                  disabled={isUploading}
                                  className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-indigo-700 bg-indigo-50 border border-indigo-300 rounded hover:bg-indigo-100"
                                >
                                  <CloudArrowUpIcon className="h-3.5 w-3.5" />
                                  Re-upload
                                </button>
                              </>
                            )}
                            {!isHR && uploadedDoc.status !== 'approved' && (
                              <button
                                onClick={() => handleDelete(uploadedDoc.id)}
                                className="text-red-600 hover:text-red-700"
                                title="Delete"
                              >
                                <TrashIcon className="h-4 w-4" />
                              </button>
                            )}
                          </>
                        )}
                      </>
                    ) : (
                      <div className="flex items-center gap-2">
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileUpload(docReq.key, e.target.files[0])}
                          disabled={isUploading}
                          id={`file-input-${docReq.key}`}
                        />
                        <button
                          type="button"
                          onClick={() => document.getElementById(`file-input-${docReq.key}`).click()}
                          disabled={isUploading}
                          className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <CloudArrowUpIcon className="h-4 w-4" />
                          {isUploading ? 'Uploading...' : 'Upload'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            {allRequiredApproved ? (
              <span className="text-green-600 font-medium">✓ All required documents approved</span>
            ) : (
              <span>
                {isHR ? 'Review and approve all required documents (*)' : 'Upload all required documents (*)'}
              </span>
            )}
          </p>
          <Button
            variant="primary"
            onClick={() => {
              onSuccess?.();
              onClose();
            }}
          >
            {isHR ? 'Close' : 'Done'}
          </Button>
        </div>
      </div>

      {/* Rejection Reason Modal */}
      {rejectingDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setRejectingDoc(null)}>
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reject Document</h3>
            <p className="text-sm text-gray-600 mb-4">
              Please provide a reason for rejecting <strong>{rejectingDoc.original_filename}</strong>. The applicant will be able to re-upload.
            </p>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              rows="4"
              placeholder="e.g., Document is expired, not clear, wrong type, etc."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
            <div className="flex justify-end gap-3 mt-4">
              <Button variant="secondary" onClick={() => setRejectingDoc(null)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleRejectSubmit}>
                Reject Document
              </Button>
            </div>
          </div>
        </div>
      )}
    </Modal>
  );
}
