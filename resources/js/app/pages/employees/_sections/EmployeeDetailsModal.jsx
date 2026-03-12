import React, { useEffect, useState } from 'react';
import { Modal } from '@/app/components';
import { XMarkIcon, DocumentArrowDownIcon, EyeIcon } from '@heroicons/react/24/outline';
import axios from 'axios';

export default function EmployeeDetailsModal({ isOpen, onClose, employee, onPreviewDocument }) {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('details'); // 'details' or 'documents'

  useEffect(() => {
    if (isOpen && employee) {
      fetchEmployeeDocuments();
    }
  }, [isOpen, employee]);

  const fetchEmployeeDocuments = async () => {
    if (!employee?.id) return;
    
    setLoading(true);
    try {
      const response = await axios.get('/api/employee-documents', {
        params: { employee_id: employee.id }
      });
      console.log('Documents fetched for employee:', employee.id, response.data);
      setDocuments(response.data || []);
    } catch (error) {
      console.error('Failed to fetch documents:', error);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (document) => {
    try {
      const response = await axios.get(`/api/employee-documents/${document.id}/download`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${document.document_name}.${document.file_type}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB'];
    const k = 1024;
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + units[i];
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  if (!employee) return null;

  return (
    <Modal open={isOpen} onClose={onClose} size="xl" title={`${employee.first_name} ${employee.last_name} #${employee.employee_number} - Details`}>
      

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('details')}
            className={`${
              activeTab === 'details'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
          >
            Employee Details
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`${
              activeTab === 'documents'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
          >
            Documents ({documents.length})
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
        {activeTab === 'details' ? (
          <div className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Email</label>
                  <p className="mt-1 text-sm text-gray-900">{employee.email || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Phone</label>
                  <p className="mt-1 text-sm text-gray-900">{employee.phone || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Date of Birth</label>
                  <p className="mt-1 text-sm text-gray-900">{formatDate(employee.date_of_birth)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Gender</label>
                  <p className="mt-1 text-sm text-gray-900 capitalize">{employee.gender || '-'}</p>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-500">Address</label>
                  <p className="mt-1 text-sm text-gray-900">{employee.address || '-'}</p>
                </div>
              </div>
            </div>

            {/* Employment Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Employment Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Department</label>
                  <p className="mt-1 text-sm text-gray-900">{employee.department?.name || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Position</label>
                  <p className="mt-1 text-sm text-gray-900">{employee.position || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Employment Status</label>
                  <p className="mt-1">
                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${
                      employee.employment_status === 'active' ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-700'
                    }`}>
                      {employee.employment_status}
                    </span>
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Employment Type</label>
                  <p className="mt-1 text-sm text-gray-900 capitalize">{employee.employment_type || '-'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Date Hired</label>
                  <p className="mt-1 text-sm text-gray-900">{formatDate(employee.date_hired)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Basic Salary</label>
                  <p className="mt-1 text-sm text-gray-900">
                    {employee.basic_salary ? `₱${parseFloat(employee.basic_salary).toLocaleString()}` : '-'}
                  </p>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            {(employee.emergency_contact_name || employee.emergency_contact_phone) && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Contact Name</label>
                    <p className="mt-1 text-sm text-gray-900">{employee.emergency_contact_name || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Contact Phone</label>
                    <p className="mt-1 text-sm text-gray-900">{employee.emergency_contact_phone || '-'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500">Relationship</label>
                    <p className="mt-1 text-sm text-gray-900">{employee.emergency_contact_relationship || '-'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            {loading ? (
              <div className="text-center py-12 text-gray-500">
                Loading documents...
              </div>
            ) : documents.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No documents uploaded for this employee yet.
              </div>
            ) : (
              <div className="space-y-3">
                {documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-sm font-semibold text-gray-900 truncate">
                            {doc.document_name}
                          </h4>
                          <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 shrink-0">
                            {doc.document_type}
                          </span>
                        </div>
                        {doc.description && (
                          <p className="text-sm text-gray-600 mb-2">{doc.description}</p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>{formatFileSize(doc.file_size)}</span>
                          <span>•</span>
                          <span>Uploaded {formatDate(doc.created_at)}</span>
                          {doc.uploader && (
                            <>
                              <span>•</span>
                              <span>by {doc.uploader.name}</span>
                            </>
                          )}
                        </div>
                        {(doc.issue_date || doc.expiry_date) && (
                          <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                            {doc.issue_date && <span>Issued: {formatDate(doc.issue_date)}</span>}
                            {doc.expiry_date && (
                              <>
                                {doc.issue_date && <span>•</span>}
                                <span>Expires: {formatDate(doc.expiry_date)}</span>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4 shrink-0">
                        <button
                          onClick={() => onPreviewDocument(doc)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                          title="Preview document"
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => handleDownload(doc)}
                          className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
                          title="Download document"
                        >
                          <DocumentArrowDownIcon className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
