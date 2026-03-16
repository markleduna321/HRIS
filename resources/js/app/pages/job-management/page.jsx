import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '../layout';
import axios from 'axios';
import { Button, showDeleteConfirm, showSuccess } from '@/app/components';
import { PlusIcon } from '@heroicons/react/24/outline';
import JobPostingModal from './_sections/JobPostingModal';
import JobPostingCard from './_sections/JobPostingCard';
import JobPostingViewModal from './_sections/JobPostingViewModal';
import JobApplicationsModal from './_sections/JobApplicationsModal';

export default function JobManagementPage() {
  const [jobs, setJobs] = useState([]);
  const [loading,setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [viewingJob, setViewingJob] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingApplications, setViewingApplications] = useState(null);
  const [isApplicationsModalOpen, setIsApplicationsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [activeTab, setActiveTab] = useState('active-postings');

  useEffect(() => {
    fetchJobs();
  }, [filterStatus]);

  const fetchJobs = async () => {
    try {
      const params = {};
      if (filterStatus) params.status = filterStatus;
      
      const response = await axios.get('/api/job-postings', { params });
      setJobs(response.data);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (job = null) => {
    setEditingJob(job);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingJob(null);
  };

  const handleView = (job) => {
    setViewingJob(job);
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setViewingJob(null);
  };

  const handleEdit = (job) => {
    setIsViewModalOpen(false);
    setIsViewModalOpen(false);
    setViewingJob(null);
    setEditingJob(job);
    setIsModalOpen(true);
  };

  const handleViewApplications = (job) => {
    setViewingApplications(job);
    setIsApplicationsModalOpen(true);
  };

  const handleCloseApplications = () => {
    setIsApplicationsModalOpen(false);
    setViewingApplications(null);
  };

  const handleDelete = (job) => {
    showDeleteConfirm({
      title: `Delete ${job.title}?`,
      content: 'Are you sure you want to delete this job posting? All applications will also be deleted.',
      onOk: async () => {
        try {
          await axios.delete(`/api/job-postings/${job.id}`);
          showSuccess({
            title: 'Job Deleted',
            content: `${job.title} has been deleted successfully.`,
          });
          fetchJobs();
        } catch (error) {
          console.error('Delete failed:', error);
        }
      },
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString();
  };

  const formatSalary = (min, max) => {
    if (!min && !max) return 'Competitive';
    if (!max) return `₱${parseFloat(min).toLocaleString()}+`;
    return `₱${parseFloat(min).toLocaleString()} - ₱${parseFloat(max).toLocaleString()}`;
  };

  const getStatusBadge = (status) => {
    const badges = {
      open: 'bg-green-50 text-green-700',
      closed: 'bg-red-50 text-red-700',
      draft: 'bg-gray-50 text-gray-700',
    };
    return badges[status] || badges.draft;
  };

  const tabs = [
    { id: 'dashboard', name: 'Dashboard' },
    { id: 'active-postings', name: 'Active Postings' },
    { id: 'applicants', name: 'Applicants' },
    { id: 'interviews', name: 'Interviews' },
  ];

  return (
    <AppLayout>
      <Head title="Job Management" />
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                  ${
                    activeTab === tab.id
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Active Postings Tab */}
        {activeTab === 'active-postings' && (
          <div>
            <div className="sm:flex sm:items-center mb-6">
              <div className="sm:flex-auto">
                <h1 className="text-2xl font-semibold text-gray-900">Active Job Postings</h1>
                <p className="mt-2 text-sm text-gray-700">
                  Manage and track all job postings
                </p>
              </div>
              <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
                <Button onClick={() => handleOpenModal()} icon={<PlusIcon className="h-5 w-5" />}>
                  Create Job Post
                </Button>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="flex gap-4 mb-6">
              <input
                type="search"
                placeholder="Search job postings..."
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">All Status</option>
                <option value="open">Active</option>
                <option value="closed">Closed</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            {/* Job Postings List */}
            {loading && jobs.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading job postings...</p>
                </div>
              </div>
            ) : jobs.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <div className="text-gray-400 text-5xl mb-4">💼</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No job postings found</h3>
                <p className="text-gray-600 mb-6">Get started by creating your first job posting.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {jobs.map((job) => (
                  <JobPostingCard
                    key={job.id}
                    job={job}
                    onView={handleView}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Dashboard</h2>
            <p className="text-gray-600">Dashboard coming soon...</p>
          </div>
        )}

        {/* Applicants Tab */}
        {activeTab === 'applicants' && (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Applicants</h2>
            <p className="text-gray-600">Applicants view coming soon...</p>
          </div>
        )}

        {/* Interviews Tab */}
        {activeTab === 'interviews' && (
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Interviews</h2>
            <p className="text-gray-600">Interviews schedule coming soon...</p>
          </div>
        )}
      </div>

      <JobPostingModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editingJob={editingJob}
        onSuccess={fetchJobs}
      />

      <JobPostingViewModal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        job={viewingJob}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <JobApplicationsModal
        isOpen={isApplicationsModalOpen}
        onClose={handleCloseApplications}
        job={viewingApplications}
      />
    </AppLayout>
  );
}
