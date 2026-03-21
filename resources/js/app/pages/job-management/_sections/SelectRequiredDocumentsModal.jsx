import React, { useState, useEffect } from 'react';
import { Modal, Button } from '@/app/components';
import { fetchDocumentTypes } from '@/app/services/document-type-service';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

export default function SelectRequiredDocumentsModal({ isOpen, onClose, onConfirm, application }) {
  const [documentTypes, setDocumentTypes] = useState([]);
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadDocumentTypes();
    }
  }, [isOpen]);

  const loadDocumentTypes = async () => {
    setLoading(true);
    try {
      const data = await fetchDocumentTypes({ active_only: true });
      setDocumentTypes(data);
      
      // Pre-select first 6 as required by default
      const defaultSelection = data.slice(0, 6).map(doc => ({
        document_type_id: doc.id,
        document_type_key: doc.key,
        document_type_name: doc.name,
        is_required: true
      }));
      setSelectedDocs(defaultSelection);
    } catch (error) {
      console.error('Failed to load document types:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleDocumentSelection = (docType) => {
    const existing = selectedDocs.find(d => d.document_type_id === docType.id);
    
    if (existing) {
      // If already selected, remove it
      setSelectedDocs(selectedDocs.filter(d => d.document_type_id !== docType.id));
    } else {
      // Add as required by default
      setSelectedDocs([...selectedDocs, {
        document_type_id: docType.id,
        document_type_key: docType.key,
        document_type_name: docType.name,
        is_required: true
      }]);
    }
  };

  const toggleRequired = (docTypeId) => {
    setSelectedDocs(selectedDocs.map(doc =>
      doc.document_type_id === docTypeId
        ? { ...doc, is_required: !doc.is_required }
        : doc
    ));
  };

  const handleConfirm = () => {
    if (selectedDocs.length === 0) {
      alert('Please select at least one document type.');
      return;
    }
    onConfirm(selectedDocs);
  };

  const isSelected = (docTypeId) => selectedDocs.some(d => d.document_type_id === docTypeId);
  const isRequired = (docTypeId) => selectedDocs.find(d => d.document_type_id === docTypeId)?.is_required;

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      size="lg"
      title="Select Required Pre-Employment Documents"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleConfirm}>
            Proceed to Pre-Employment Documents ({selectedDocs.length} selected)
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-700">
            <strong>Instructions:</strong> Select which documents {application?.applicant_name || 'the applicant'} needs to submit for pre-employment verification. 
            Check the box next to each document you want to require, then toggle whether it's mandatory or optional.
          </p>
        </div>

        {loading ? (
          <div className="py-12 text-center text-gray-500">
            Loading document types...
          </div>
        ) : documentTypes.length === 0 ? (
          <div className="py-12 text-center text-gray-500">
            No document types found. Please add document types first.
          </div>
        ) : (
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {documentTypes.map((docType) => {
              const selected = isSelected(docType.id);
              const required = isRequired(docType.id);

              return (
                <div
                  key={docType.id}
                  className={`border rounded-lg p-4 transition-colors ${
                    selected
                      ? 'border-indigo-300 bg-indigo-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Checkbox to select/deselect */}
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => toggleDocumentSelection(docType)}
                      className="mt-1 h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <label className="text-sm font-medium text-gray-900 cursor-pointer">
                          {docType.name}
                        </label>
                        {selected && (
                          <CheckCircleIcon className="h-5 w-5 text-indigo-600" />
                        )}
                      </div>
                      {docType.description && (
                        <p className="mt-1 text-xs text-gray-500">{docType.description}</p>
                      )}

                      {/* Required/Optional toggle (only visible when selected) */}
                      {selected && (
                        <div className="mt-2 flex items-center gap-2">
                          <button
                            onClick={() => toggleRequired(docType.id)}
                            className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                              required
                                ? 'bg-red-100 text-red-700 border border-red-300 hover:bg-red-200'
                                : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                            }`}
                          >
                            {required ? '* Required' : 'Optional'}
                          </button>
                          <span className="text-xs text-gray-500">
                            {required ? 'Applicant must submit this document' : 'Applicant can skip this document'}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Summary */}
        {selectedDocs.length > 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Summary</h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Total selected:</span>
                <span className="ml-2 font-medium text-gray-900">{selectedDocs.length}</span>
              </div>
              <div>
                <span className="text-gray-600">Required:</span>
                <span className="ml-2 font-medium text-red-700">
                  {selectedDocs.filter(d => d.is_required).length}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
