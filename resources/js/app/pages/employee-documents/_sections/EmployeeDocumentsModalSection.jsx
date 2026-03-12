import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FormModal, Input, Select, TextArea, showSuccess } from '@/app/components';
import { uploadEmployeeDocument, updateEmployeeDocument } from '../_redux';

export default function EmployeeDocumentsModalSection({ isOpen, onClose, editingDocument, employees }) {
  const dispatch = useDispatch();
  const { documentTypes, loading } = useSelector((state) => state.employeeDocumentsPage);
  
  const [formData, setFormData] = useState({
    employee_id: '',
    document_type: '',
    document_name: '',
    file: null,
    description: '',
    issue_date: '',
    expiry_date: '',
  });
  
  const [errors, setErrors] = useState({});
  const [fileName, setFileName] = useState('');

  // Reset form when modal opens/closes or editing document changes
  useEffect(() => {
    if (isOpen && editingDocument) {
      setFormData({
        employee_id: editingDocument.employee_id || '',
        document_type: editingDocument.document_type || '',
        document_name: editingDocument.document_name || '',
        file: null,
        description: editingDocument.description || '',
        issue_date: editingDocument.issue_date || '',
        expiry_date: editingDocument.expiry_date || '',
      });
      setFileName('');
    } else if (isOpen && !editingDocument) {
      setFormData({
        employee_id: '',
        document_type: '',
        document_name: '',
        file: null,
        description: '',
        issue_date: '',
        expiry_date: '',
      });
      setFileName('');
    }
    setErrors({});
  }, [isOpen, editingDocument]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (2MB = 2 * 1024 * 1024 bytes)
      const maxSize = 2 * 1024 * 1024; // 2MB
      if (file.size > maxSize) {
        setErrors(prev => ({ 
          ...prev, 
          file: `File size must not exceed 2MB. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB.` 
        }));
        e.target.value = ''; // Clear the file input
        return;
      }
      
      setFormData(prev => ({ ...prev, file }));
      setFileName(file.name);
      
      // Clear any previous file errors
      if (errors.file) {
        setErrors(prev => ({ ...prev, file: null }));
      }
      
      // Auto-fill document name if empty
      if (!formData.document_name) {
        // Remove file extension from name
        const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
        setFormData(prev => ({ ...prev, document_name: nameWithoutExt }));
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!editingDocument && !formData.file) {
      newErrors.file = 'File is required';
    }
    if (!formData.employee_id) {
      newErrors.employee_id = 'Please select an employee';
    }
    if (!formData.document_type) {
      newErrors.document_type = 'Please select a document type';
    }
    if (!formData.document_name.trim()) {
      newErrors.document_name = 'Document name is required';
    }
    if (formData.issue_date && formData.expiry_date) {
      if (new Date(formData.expiry_date) < new Date(formData.issue_date)) {
        newErrors.expiry_date = 'Expiry date must be after issue date';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      if (editingDocument) {
        // Update metadata only
        await dispatch(updateEmployeeDocument({
          id: editingDocument.id,
          data: {
            document_type: formData.document_type,
            document_name: formData.document_name,
            description: formData.description,
            issue_date: formData.issue_date || null,
            expiry_date: formData.expiry_date || null,
          }
        })).unwrap();
        
        showSuccess({
          title: 'Document Updated',
          content: `${formData.document_name} has been updated successfully.`
        });
      } else {
        // Upload new document
        const uploadFormData = new FormData();
        uploadFormData.append('file', formData.file);
        uploadFormData.append('employee_id', formData.employee_id);
        uploadFormData.append('document_type', formData.document_type);
        uploadFormData.append('document_name', formData.document_name);
        if (formData.description) uploadFormData.append('description', formData.description);
        if (formData.issue_date) uploadFormData.append('issue_date', formData.issue_date);
        if (formData.expiry_date) uploadFormData.append('expiry_date', formData.expiry_date);
        
        console.log('📤 Submitting form data:', {
          employee_id: formData.employee_id,
          document_type: formData.document_type,
          document_name: formData.document_name,
          file: formData.file?.name,
          description: formData.description,
          issue_date: formData.issue_date,
          expiry_date: formData.expiry_date,
        });
        
        await dispatch(uploadEmployeeDocument(uploadFormData)).unwrap();
        
        showSuccess({
          title: 'Document Uploaded',
          content: `${formData.document_name} has been uploaded successfully.`
        });
      }
      
      onClose();
    } catch (error) {
      console.error('Form submission error:', error);
      console.error('Error response:', error.response);
      console.error('Error response data:', error.response?.data);
      
      // Handle Laravel validation errors
      if (error?.errors) {
        console.log('Validation errors from backend:', error.errors);
        setErrors(error.errors);
      } else if (error?.response?.data?.errors) {
        console.log('Validation errors from response:', error.response.data.errors);
        setErrors(error.response.data.errors);
      } else {
        // Show generic error message
        const errorMessage = error?.message || error?.response?.data?.message || 'Failed to upload document';
        console.error('Upload error:', errorMessage);
      }
    }
  };

  const employeeOptions = employees.map(emp => ({
    value: emp.id,
    label: `${emp.first_name} ${emp.last_name} (${emp.employee_number})`
  }));

  const documentTypeOptions = documentTypes.map(type => ({
    value: type,
    label: type
  }));

  return (
    <FormModal
      open={isOpen}
      onClose={onClose}
      onSubmit={handleSubmit}
      title={editingDocument ? 'Edit Document Details' : 'Upload Employee Document'}
      submitText={editingDocument ? 'Update' : 'Upload'}
      loading={loading}
    >
      <div className="space-y-4">
        <Select
          label="Employee"
          name="employee_id"
          value={formData.employee_id}
          onChange={handleChange}
          options={employeeOptions}
          placeholder="Select employee"
          error={errors.employee_id}
          required
          disabled={editingDocument} // Can't change employee for existing documents
        />

        <Select
          label="Document Type"
          name="document_type"
          value={formData.document_type}
          onChange={handleChange}
          options={documentTypeOptions}
          placeholder="Select document type"
          error={errors.document_type}
          required
        />

        <Input
          label="Document Name"
          name="document_name"
          value={formData.document_name}
          onChange={handleChange}
          placeholder="e.g., John Doe - Resume 2026"
          error={errors.document_name}
          required
        />

        {!editingDocument && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              File <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              name="file"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none focus:border-blue-500"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            />
            {fileName && (
              <p className="mt-1 text-sm text-gray-500">Selected: {fileName}</p>
            )}
            {errors.file && (
              <p className="mt-1 text-sm text-red-600">{errors.file}</p>
            )}
            <p className="mt-1 text-xs text-gray-500">
              Accepted formats: PDF, DOC, DOCX, JPG, PNG (Max 2MB)
            </p>
          </div>
        )}

        {editingDocument && (
          <div className="bg-gray-50 p-3 rounded-md">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Note:</span> You cannot change the file itself. 
              To replace the file, delete this document and upload a new one.
            </p>
          </div>
        )}

        <TextArea
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Additional notes about this document"
          rows={3}
          error={errors.description}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Issue Date"
            name="issue_date"
            type="date"
            value={formData.issue_date}
            onChange={handleChange}
            error={errors.issue_date}
          />

          <Input
            label="Expiry Date"
            name="expiry_date"
            type="date"
            value={formData.expiry_date}
            onChange={handleChange}
            error={errors.expiry_date}
          />
        </div>
      </div>
    </FormModal>
  );
}
