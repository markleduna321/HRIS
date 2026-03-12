import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AppLayout from '../layout';
import { Head } from '@inertiajs/react';
import EmployeesTableSection from './_sections/EmployeesTableSection';
import EmployeesModalSection from './_sections/EmployeesModalSection';
import EmployeeDetailsModal from './_sections/EmployeeDetailsModal';
import DocumentPreviewModal from '../employee-documents/_sections/DocumentPreviewModal';
import { fetchEmployees } from './_redux';
import { fetchDepartments } from '../departments/_redux';

export default function EmployeesPage() {
  const dispatch = useDispatch();
  const { employees, loading } = useSelector((state) => state.employeesPage);
  const { departments } = useSelector((state) => state.departmentsPage);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [viewingEmployee, setViewingEmployee] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [previewDocument, setPreviewDocument] = useState(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchEmployees());
    dispatch(fetchDepartments());
  }, [dispatch]);

  const handleOpenModal = (employee = null) => {
    setEditingEmployee(employee);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingEmployee(null);
  };

  const handleViewDetails = (employee) => {
    setViewingEmployee(employee);
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsModalOpen(false);
    setViewingEmployee(null);
  };

  const handlePreviewDocument = (document) => {
    setPreviewDocument(document);
    setIsPreviewOpen(true);
  };

  const handleClosePreview = () => {
    setIsPreviewOpen(false);
    setPreviewDocument(null);
  };

  return (
    <AppLayout>
      <Head title="Employees" />
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Loading employees...</div>
          </div>
        ) : (
          <EmployeesTableSection
            employees={employees}
            onOpenModal={handleOpenModal}
            onViewDetails={handleViewDetails}
          />
        )}
      </div>

      <EmployeesModalSection
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editingEmployee={editingEmployee}
        departments={departments}
        employees={employees}
      />

      <EmployeeDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetails}
        employee={viewingEmployee}
        onPreviewDocument={handlePreviewDocument}
      />

      <DocumentPreviewModal
        isOpen={isPreviewOpen}
        onClose={handleClosePreview}
        document={previewDocument}
      />
    </AppLayout>
  );
}
