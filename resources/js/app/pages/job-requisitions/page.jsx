import React, { useEffect, useState } from 'react';
import { Head } from '@inertiajs/react';
import { useDispatch, useSelector } from 'react-redux';
import AppLayout from '../layout';
import StatisticsSection from './_sections/StatisticsSection';
import FiltersSection from './_sections/FiltersSection';
import RequisitionCard from './_sections/RequisitionCard';
import RequisitionFormModal from './_sections/RequisitionFormModal';
import RequisitionViewModal from './_sections/RequisitionViewModal';
import { showSuccess, showError, showDeleteConfirm, showConfirm } from '@/app/components';
import {
  fetchJobRequisitions,
  fetchStatistics,
  fetchDepartments,
  fetchExistingPositions,
  createJobRequisition,
  updateJobRequisition,
  deleteJobRequisition,
  approveJobRequisition,
  rejectJobRequisition,
  setFilters,
  clearError,
} from './_redux';

export default function JobRequisitionsPage() {
  const dispatch = useDispatch();
  const {
    requisitions,
    statistics,
    departments,
    existingPositions,
    loading,
    error,
    filters,
  } = useSelector((state) => state.jobRequisitionsPage);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingRequisition, setEditingRequisition] = useState(null);
  const [viewingRequisition, setViewingRequisition] = useState(null);
  const [formErrors, setFormErrors] = useState({});
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!initialized) {
      loadData();
      setInitialized(true);
    }
  }, [initialized]);

  useEffect(() => {
    if (initialized) {
      dispatch(fetchJobRequisitions(filters));
    }
  }, [filters, initialized]);

  useEffect(() => {
    if (error) {
      if (typeof error === 'object' && error.errors) {
        setFormErrors(error.errors);
      } else {
        showError(error.message || 'An error occurred');
      }
      dispatch(clearError());
    }
  }, [error]);

  const loadData = () => {
    dispatch(fetchStatistics());
    dispatch(fetchDepartments());
    dispatch(fetchExistingPositions());
    dispatch(fetchJobRequisitions(filters));
  };

  const handleFilterChange = (newFilters) => {
    dispatch(setFilters(newFilters));
  };

  const handleSearch = () => {
    dispatch(fetchJobRequisitions(filters));
  };

  const handleNewRequisition = () => {
    setEditingRequisition(null);
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleView = (requisition) => {
    setViewingRequisition(requisition);
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setViewingRequisition(null);
  };

  const handleEdit = (requisition) => {
    setViewingRequisition(null);
    setIsViewModalOpen(false);
    setEditingRequisition(requisition);
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingRequisition(null);
    setFormErrors({});
  };

  const handleSubmit = async (formData) => {
    setFormErrors({});
    
    try {
      if (editingRequisition) {
        await dispatch(updateJobRequisition({ 
          id: editingRequisition.id, 
          data: formData 
        })).unwrap();
        showSuccess({ title: 'Success', content: 'Requisition updated successfully' });
      } else {
        await dispatch(createJobRequisition(formData)).unwrap();
        showSuccess({ title: 'Success', content: 'Requisition created successfully' });
      }
      
      handleCloseModal();
      // Refresh data to ensure everything is in sync
      await dispatch(fetchStatistics());
      await dispatch(fetchJobRequisitions(filters));
    } catch (err) {
      // Error will be handled by useEffect
      console.error('Submit error:', err);
      if (err && typeof err === 'object' && err.errors) {
        setFormErrors(err.errors);
      }
    }
  };

  const handleDelete = (requisition) => {
    showDeleteConfirm({
      title: 'Delete Job Requisition',
      content: `Are you sure you want to delete requisition "${requisition.requisition_number}"? This action cannot be undone.`,
      onOk: async () => {
        try {
          await dispatch(deleteJobRequisition(requisition.id)).unwrap();
          showSuccess({ title: 'Success', content: 'Requisition deleted successfully' });
          setIsViewModalOpen(false);
          setViewingRequisition(null);
          dispatch(fetchStatistics());
        } catch (err) {
          showError({ title: 'Error', content: 'Failed to delete requisition' });
        }
      },
    });
  };

  const handleApprove = (requisition) => {
    showConfirm({
      title: 'Approve Job Requisition',
      content: `Are you sure you want to approve requisition "${requisition.requisition_number}"?`,
      okText: 'Approve',
      okType: 'primary',
      onOk: async () => {
        try {
          await dispatch(approveJobRequisition(requisition.id)).unwrap();
          showSuccess({ title: 'Success', content: 'Requisition approved successfully' });
          setIsViewModalOpen(false);
          setViewingRequisition(null);
          dispatch(fetchStatistics());
        } catch (err) {
          showError({ title: 'Error', content: 'Failed to approve requisition' });
        }
      },
    });
  };

  const handleReject = (requisition) => {
    // TODO: Add a proper input modal for rejection reason
    // For now, using a simple confirmation
    showConfirm({
      title: 'Reject Job Requisition',
      content: `Are you sure you want to reject requisition "${requisition.requisition_number}"?\n\nNote: You can add a rejection reason in the future update.`,
      okText: 'Reject',
      okType: 'danger',
      onOk: async () => {
        try {
          const reason = 'Not approved'; // TODO: Get from input
          await dispatch(rejectJobRequisition({ id: requisition.id, reason })).unwrap();
          showSuccess({ title: 'Success', content: 'Requisition rejected' });
          setIsViewModalOpen(false);
          setViewingRequisition(null);
          dispatch(fetchStatistics());
        } catch (err) {
          showError({ title: 'Error', content: 'Failed to reject requisition' });
        }
      },
    });
  };

  return (
    <AppLayout>
      <Head title="Job Requisitions" />
      
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Job Requisition</h1>
          <p className="text-gray-600 mt-1">Manage all job requisitions</p>
        </div>

        {/* Statistics */}
        <StatisticsSection statistics={statistics} />

        {/* Filters */}
        <FiltersSection
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
          onNewRequisition={handleNewRequisition}
        />

        {/* Requisitions List */}
        {loading && requisitions.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading requisitions...</p>
            </div>
          </div>
        ) : requisitions.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <div className="text-gray-400 text-5xl mb-4">📋</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No requisitions found</h3>
            <p className="text-gray-600 mb-6">Get started by creating your first job requisition.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {requisitions.map((requisition) => (
              <RequisitionCard
                key={requisition.id}
                requisition={requisition}
                onView={handleView}
              />
            ))}
          </div>
        )}
      </div>

      {/* Form Modal */}
      <RequisitionFormModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        requisition={editingRequisition}
        departments={departments}
        existingPositions={existingPositions}
        loading={loading}
        errors={formErrors}
      />

      {/* View Modal */}
      <RequisitionViewModal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        requisition={viewingRequisition}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </AppLayout>
  );
}
