import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AppLayout from '../layout';
import { Head } from '@inertiajs/react';
import DepartmentsTableSection from './_sections/DepartmentsTableSection';
import DepartmentsModalSection from './_sections/DepartmentsModalSection';
import { fetchDepartments } from './_redux';

export default function DepartmentsPage() {
  const dispatch = useDispatch();
  const { departments, loading } = useSelector((state) => state.departmentsPage);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState(null);

  useEffect(() => {
    dispatch(fetchDepartments());
  }, [dispatch]);

  const handleOpenModal = (department = null) => {
    setEditingDepartment(department);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingDepartment(null);
  };

  return (
    <AppLayout>
      <Head title="Departments" />
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Loading departments...</div>
          </div>
        ) : (
          <DepartmentsTableSection
            departments={departments}
            onOpenModal={handleOpenModal}
          />
        )}
      </div>

      <DepartmentsModalSection
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editingDepartment={editingDepartment}
      />
    </AppLayout>
  );
}
