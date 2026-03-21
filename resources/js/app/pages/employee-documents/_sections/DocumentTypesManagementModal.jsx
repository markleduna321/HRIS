import React, { useState, useEffect } from 'react';
import { Modal, Button, showSuccess, showError } from '@/app/components';
import { PlusIcon, TrashIcon, PencilIcon, Bars3Icon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { fetchDocumentTypes, createDocumentType, updateDocumentType, deleteDocumentType, reorderDocumentTypes } from '@/app/services/document-type-service';

export default function DocumentTypesManagementModal({ isOpen, onClose }) {
  const [documentTypes, setDocumentTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingDoc, setEditingDoc] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', is_active: true });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadDocumentTypes();
    }
  }, [isOpen]);

  const loadDocumentTypes = async () => {
    setLoading(true);
    try {
      const data = await fetchDocumentTypes();
      setDocumentTypes(data);
    } catch (error) {
      showError({ title: 'Error', content: 'Failed to load document types.' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      showError({ title: 'Validation Error', content: 'Document name is required.' });
      return;
    }

    try {
      if (editingDoc) {
        await updateDocumentType(editingDoc.id, formData);
        showSuccess({ title: 'Updated', content: 'Document type updated successfully.' });
      } else {
        await createDocumentType(formData);
        showSuccess({ title: 'Created', content: 'Document type created successfully.' });
      }
      
      setFormData({ name: '', description: '', is_active: true });
      setEditingDoc(null);
      setShowForm(false);
      loadDocumentTypes();
    } catch (error) {
      showError({ title: 'Error', content: error.response?.data?.message || 'Failed to save document type.' });
    }
  };

  const handleEdit = (doc) => {
    setEditingDoc(doc);
    setFormData({
      name: doc.name,
      description: doc.description || '',
      is_active: doc.is_active
    });
    setShowForm(true);
  };

  const handleDelete = async (doc) => {
    if (!confirm(`Are you sure you want to delete "${doc.name}"?`)) return;
    
    try {
      await deleteDocumentType(doc.id);
      showSuccess({ title: 'Deleted', content: 'Document type deleted successfully.' });
      loadDocumentTypes();
    } catch (error) {
      showError({ 
        title: 'Error', 
        content: error.response?.data?.message || 'Failed to delete document type.' 
      });
    }
  };

  const handleToggleActive = async (doc) => {
    try {
      await updateDocumentType(doc.id, { is_active: !doc.is_active });
      showSuccess({ 
        title: 'Updated', 
        content: `Document type ${!doc.is_active ? 'activated' : 'deactivated'}.` 
      });
      loadDocumentTypes();
    } catch (error) {
      showError({ title: 'Error', content: 'Failed to update document type.' });
    }
  };

  const handleCancelForm = () => {
    setFormData({ name: '', description: '', is_active: true });
    setEditingDoc(null);
    setShowForm(false);
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      size="xl"
      title="Manage Document Types"
      footer={null}
    >
      <div className="space-y-4">
        {/* Add New Button */}
        {!showForm && (
          <div className="flex justify-end">
            <Button
              variant="primary"
              onClick={() => setShowForm(true)}
              icon={<PlusIcon className="h-4 w-4" />}
            >
              Add Document Type
            </Button>
          </div>
        )}

        {/* Add/Edit Form */}
        {showForm && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              {editingDoc ? 'Edit Document Type' : 'Add New Document Type'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Document Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g., Drug Test Certificate"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Brief description of this document"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="is_active" className="text-sm text-gray-700">
                  Active (available for use)
                </label>
              </div>

              <div className="flex gap-2 justify-end">
                <Button variant="secondary" onClick={handleCancelForm} type="button">
                  Cancel
                </Button>
                <Button variant="primary" type="submit">
                  {editingDoc ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Document Types Table */}
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Document Type
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : documentTypes.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                    No document types found. Add one to get started.
                  </td>
                </tr>
              ) : (
                documentTypes.map((doc) => (
                  <tr key={doc.id} className={!doc.is_active ? 'bg-gray-50 opacity-60' : ''}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Bars3Icon className="h-4 w-4 text-gray-400 cursor-move" title="Drag to reorder" />
                        <span className="text-sm font-medium text-gray-900">{doc.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm text-gray-500">{doc.description || '—'}</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleToggleActive(doc)}
                        className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${
                          doc.is_active
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {doc.is_active ? (
                          <>
                            <CheckIcon className="h-3 w-3" />
                            Active
                          </>
                        ) : (
                          <>
                            <XMarkIcon className="h-3 w-3" />
                            Inactive
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs px-2 py-1 rounded ${
                        doc.is_system_default
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {doc.is_system_default ? 'System' : 'Custom'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleEdit(doc)}
                          className="p-1 text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 rounded"
                          title="Edit"
                        >
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        {!doc.is_system_default && (
                          <button
                            onClick={() => handleDelete(doc)}
                            className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50 rounded"
                            title="Delete"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-700">
            <strong>Note:</strong> System default document types cannot be deleted but can be deactivated. 
            Active documents will appear in pre-employment document uploads.
          </p>
        </div>
      </div>
    </Modal>
  );
}
