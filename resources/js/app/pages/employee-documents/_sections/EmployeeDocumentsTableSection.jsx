import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button, IconButton, Select, showDeleteConfirm, showSuccess } from '@/app/components';
import { 
  PlusIcon, 
  DocumentArrowDownIcon, 
  PencilIcon, 
  TrashIcon,
  FunnelIcon,
  EyeIcon
} from '@heroicons/react/24/outline';
import {
  deleteEmployeeDocument,
  downloadEmployeeDocument,
  fetchEmployeeDocuments
} from '../_redux';

export default function EmployeeDocumentsTableSection({
  documents,
  employees,
  loading,
  onOpenModal,
  onPreview,
  filterEmployeeId,
  setFilterEmployeeId,
  filterDocumentType,
  setFilterDocumentType
}) {
  const dispatch = useDispatch();
  const { documentTypes } = useSelector((state) => state.employeeDocumentsPage);

  const handleDelete = (document) => {
    showDeleteConfirm({
      title: `Delete ${document.document_name}?`,
      content: 'Are you sure you want to delete this document? This action cannot be undone.',
      onOk: async () => {
        try {
          await dispatch(deleteEmployeeDocument(document.id)).unwrap();
          showSuccess({
            title: 'Document Deleted',
            content: `${document.document_name} has been deleted successfully.`
          });
        } catch (error) {
          console.error('Delete failed:', error);
        }
      }
    });
  };

  const handleDownload = async (document) => {
    try {
      const fileName = `${document.document_name}.${document.file_type}`;
      await downloadEmployeeDocument(document.id, fileName);
      showSuccess({
        title: 'Download Started',
        content: `Downloading ${document.document_name}...`
      });
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const clearFilters = () => {
    setFilterEmployeeId(null);
    setFilterDocumentType(null);
  };

  const hasActiveFilters = filterEmployeeId || filterDocumentType;

  const employeeOptions = [
    { value: '', label: 'All Employees' },
    ...employees.map(emp => ({
      value: emp.id,
      label: `${emp.first_name} ${emp.last_name} (${emp.employee_number})`
    }))
  ];

  const documentTypeOptions = [
    { value: '', label: 'All Document Types' },
    ...documentTypes.map(type => ({
      value: type,
      label: type
    }))
  ];

  return (
    <>
      <div className="sm:flex sm:items-center sm:justify-between">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">201 Files - Employee Documents</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage employee documents and personnel records.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Button onClick={() => onOpenModal()} icon={<PlusIcon className="h-5 w-5" />}>
            Upload Document
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-6 bg-white p-4 rounded-lg shadow">
        <div className="flex items-center gap-2 mb-3">
          <FunnelIcon className="h-5 w-5 text-gray-400" />
          <h3 className="text-sm font-medium text-gray-900">Filters</h3>
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="ml-auto text-sm text-blue-600 hover:text-blue-800"
            >
              Clear filters
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Employee"
            value={filterEmployeeId || ''}
            onChange={(e) => setFilterEmployeeId(e.target.value || null)}
            options={employeeOptions}
          />
          <Select
            label="Document Type"
            value={filterDocumentType || ''}
            onChange={(e) => setFilterDocumentType(e.target.value || null)}
            options={documentTypeOptions}
          />
        </div>
      </div>

      {/* Documents Table */}
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Employee</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Document Type</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Document Name</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">File Size</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Uploaded By</th>
                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Uploaded Date</th>
                    <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="py-12 text-center text-gray-500">
                        Loading documents...
                      </td>
                    </tr>
                  ) : documents.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="py-12 text-center text-gray-500">
                        {hasActiveFilters 
                          ? 'No documents found matching your filters.'
                          : 'No documents uploaded yet. Upload your first document to get started.'}
                      </td>
                    </tr>
                  ) : (
                    documents.map((document) => (
                      <tr key={document.id} className="hover:bg-gray-50">
                        <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                          <div className="font-medium text-gray-900">
                            {document.employee?.first_name} {document.employee?.last_name}
                          </div>
                          <div className="text-gray-500 text-xs">
                            {document.employee?.employee_number}
                          </div>
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-900">
                          <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700">
                            {document.document_type}
                          </span>
                        </td>
                        <td className="px-3 py-4 text-sm text-gray-900">
                          <div className="font-medium">{document.document_name}</div>
                          {document.description && (
                            <div className="text-gray-500 text-xs mt-1 truncate max-w-xs">
                              {document.description}
                            </div>
                          )}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {formatFileSize(document.file_size)}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {document.uploader?.name || 'System'}
                        </td>
                        <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {new Date(document.created_at).toLocaleDateString()}
                        </td>
                        <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <div className="flex gap-2 justify-end">
                            <IconButton
                              variant="ghost-primary"
                              size="sm"
                              onClick={() => onPreview(document)}
                              title="Preview document"
                            >
                              <EyeIcon />
                            </IconButton>
                            <IconButton
                              variant="ghost-primary"
                              size="sm"
                              onClick={() => handleDownload(document)}
                              title="Download document"
                            >
                              <DocumentArrowDownIcon />
                            </IconButton>
                            <IconButton
                              variant="ghost-primary"
                              size="sm"
                              onClick={() => onOpenModal(document)}
                              title="Edit document"
                            >
                              <PencilIcon />
                            </IconButton>
                            <IconButton
                              variant="ghost-danger"
                              size="sm"
                              onClick={() => handleDelete(document)}
                              title="Delete document"
                            >
                              <TrashIcon />
                            </IconButton>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Helper function to format file size
function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + units[i];
}
