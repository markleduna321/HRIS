import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEmployeeDocuments, fetchDocumentTypes } from './_redux';
import { fetchEmployees } from '../employees/_redux';
import EmployeeDocumentsTableSection from './_sections/EmployeeDocumentsTableSection';
import EmployeeDocumentsModalSection from './_sections/EmployeeDocumentsModalSection';
import DocumentPreviewModal from './_sections/DocumentPreviewModal';
import AppLayout from '../layout';

export default function EmployeeDocumentsPage() {
  const dispatch = useDispatch();
  const { documents, loading } = useSelector((state) => state.employeeDocumentsPage);
  const { employees } = useSelector((state) => state.employeesPage);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState(null);
  const [filterEmployeeId, setFilterEmployeeId] = useState(null);
  const [filterDocumentType, setFilterDocumentType] = useState(null);
  const [previewDocument, setPreviewDocument] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    // Fetch all documents and employees on mount
    dispatch(fetchEmployeeDocuments());
    dispatch(fetchEmployees());
    dispatch(fetchDocumentTypes());
  }, [dispatch]);

  // Filter documents when filters change
  useEffect(() => {
    const params = {};
    if (filterEmployeeId) params.employee_id = filterEmployeeId;
    if (filterDocumentType) params.document_type = filterDocumentType;
    
    dispatch(fetchEmployeeDocuments(params));
  }, [filterEmployeeId, filterDocumentType, dispatch]);

  const handleOpenModal = (document = null) => {
    setEditingDocument(document);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingDocument(null);
    setIsModalOpen(false);
  };

  const handlePreview = (document) => {
    setPreviewDocument(document);
    setIsPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    setPreviewDocument(null);
  };

  return (
    <AppLayout>
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <EmployeeDocumentsTableSection
        documents={documents}
        employees={employees}
        loading={loading}
        onOpenModal={handleOpenModal}
        onPreview={handlePreview}
        filterEmployeeId={filterEmployeeId}
        setFilterEmployeeId={setFilterEmployeeId}
        filterDocumentType={filterDocumentType}
        setFilterDocumentType={setFilterDocumentType}
      />
      
      <EmployeeDocumentsModalSection
        open={isModalOpen}
        onClose={handleCloseModal}
        editingDocument={editingDocument}
        employees={employees}
      />

      <DocumentPreviewModal
        isOpen={isPreviewOpen}
        onClose={handleClosePreview}
        document={previewDocument}
      />
    </div>
    </AppLayout>
  );
}
