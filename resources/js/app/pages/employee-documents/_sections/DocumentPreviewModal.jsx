import React from 'react';
import { Modal } from '@/app/components';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function DocumentPreviewModal({ isOpen, onClose, document }) {
  if (!document) return null;

  const fileUrl = `/storage/${document.file_path}`;
  const fileType = document.file_type?.toLowerCase();

  const isImage = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(fileType);
  const isPdf = fileType === 'pdf';
  const isPreviewable = isImage || isPdf;

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{document.document_name}</h3>
            <p className="text-sm text-gray-500 mt-1">
              {document.employee?.first_name} {document.employee?.last_name} • {document.document_type}
            </p>
          </div>
        </div>
      }
      size="full"
      footer={null}
    >
      <div className="relative" style={{ height: 'calc(100vh - 200px)' }}>
        {isPreviewable ? (
          <div className="h-full w-full">
            {isImage && (
              <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
                <img
                  src={fileUrl}
                  alt={document.document_name}
                  className="max-h-full max-w-full object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.parentElement.innerHTML = '<div class="text-center text-gray-500"><p>Failed to load image</p><p class="text-sm mt-2">The file may have been moved or deleted.</p></div>';
                  }}
                />
              </div>
            )}
            
            {isPdf && (
              <iframe
                src={fileUrl}
                className="w-full h-full border-0 rounded-lg"
                title={document.document_name}
                onError={(e) => {
                  console.error('PDF load error:', e);
                }}
              />
            )}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="mx-auto h-12 w-12 text-gray-400">
                <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">Preview Not Available</h3>
              <p className="mt-1 text-sm text-gray-500">
                This file type (.{fileType}) cannot be previewed in the browser.
              </p>
              <p className="mt-1 text-sm text-gray-500">
                Please download the file to view its contents.
              </p>
              <div className="mt-6">
                <a
                  href={fileUrl}
                  download={`${document.document_name}.${document.file_type}`}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Download File
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Document Info Panel */}
        {document.description && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Description</h4>
            <p className="text-sm text-gray-600">{document.description}</p>
          </div>
        )}

        {(document.issue_date || document.expiry_date) && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 mb-2">Document Dates</h4>
            <div className="grid grid-cols-2 gap-4">
              {document.issue_date && (
                <div>
                  <p className="text-xs text-gray-500">Issue Date</p>
                  <p className="text-sm text-gray-900">{new Date(document.issue_date).toLocaleDateString()}</p>
                </div>
              )}
              {document.expiry_date && (
                <div>
                  <p className="text-xs text-gray-500">Expiry Date</p>
                  <p className="text-sm text-gray-900">{new Date(document.expiry_date).toLocaleDateString()}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
