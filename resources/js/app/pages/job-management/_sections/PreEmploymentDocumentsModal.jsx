import React, { useState, useEffect } from 'react';
import { Modal, Button, showSuccess, showError } from '@/app/components';
import { DocumentTextIcon, TrashIcon, CloudArrowUpIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { uploadJobApplicationDocument, fetchJobApplicationDocuments, deleteJobApplicationDocument } from '@/app/services/job-application-document-service';

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
      showError({ title: 'Upload Failed', content: error.response?.data?.message || 'Failed to upload document.' });
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

  const getDocumentForType = (docType) => {
    return documents.find(d => d.document_type === docType);
  };

  const allRequiredUploaded = REQUIRED_DOCUMENTS
    .filter(d => d.required)
    .every(d => getDocumentForType(d.key));

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
          Upload all required pre-employment documents before finalizing the hire.
        </p>

        {/* Document Checklist */}
        <div className="space-y-3">
          {REQUIRED_DOCUMENTS.map((docReq) => {
            const uploadedDoc = getDocumentForType(docReq.key);
            const isUploading = uploading[docReq.key];

            return (
              <div key={docReq.key} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    {uploadedDoc ? (
                      <CheckCircleIcon className="h-5 w-5 text-green-600 flex-shrink-0" />
                    ) : (
                      <DocumentTextIcon className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-gray-900">{docReq.label}</p>
                        {docReq.required && <span className="text-xs text-red-600">*</span>}
                      </div>
                      {uploadedDoc && (
                        <p className="text-xs text-gray-500 mt-0.5 truncate">{uploadedDoc.original_filename}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {uploadedDoc ? (
                      <>
                        <a
                          href={`/storage/${uploadedDoc.file_path}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-indigo-600 hover:text-indigo-700 underline"
                        >
                          View
                        </a>
                        <button
                          onClick={() => handleDelete(uploadedDoc.id)}
                          className="text-red-600 hover:text-red-700"
                          title="Delete"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <label className="relative cursor-pointer">
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => handleFileUpload(docReq.key, e.target.files[0])}
                          disabled={isUploading}
                        />
                        <Button
                          variant="secondary"
                          size="sm"
                          as="span"
                          icon={<CloudArrowUpIcon className="h-4 w-4" />}
                          disabled={isUploading}
                        >
                          {isUploading ? 'Uploading...' : 'Upload'}
                        </Button>
                      </label>
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
            {allRequiredUploaded ? (
              <span className="text-green-600 font-medium">✓ All required documents uploaded</span>
            ) : (
              <span>Upload all required documents (*) to proceed</span>
            )}
          </p>
          <Button
            variant="primary"
            onClick={() => {
              onSuccess?.();
              onClose();
            }}
            disabled={!allRequiredUploaded}
          >
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
}
