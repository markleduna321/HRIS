import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '../layout';
import axios from 'axios';
import { Button, IconButton, showDeleteConfirm, showSuccess } from '@/app/components';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import JobPostingModal from './_sections/JobPostingModal';
import JobApplicationsModal from './_sections/JobApplicationsModal';

export default function JobManagementPage() {
  const [jobs, setJobs] = useState([]);
  const [loading,setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [viewingApplications, setViewingApplications] = useState(null);
  const [isApplicationsModalOpen, setIsApplicationsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');

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

  return (
    <AppLayout>
      <Head title="Job Management" />
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-2xl font-semibold text-gray-900">Job Management</h1>
            <p className="mt-2 text-sm text-gray-700">
              Manage job postings and view applications.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <Button onClick={() => handleOpenModal()} icon={<PlusIcon className="h-5 w-5" />}>
              Post New Job
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-6 flex gap-4">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">All Status</option>
            <option value="open">Open</option>
            <option value="closed">Closed</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        {/* Jobs Table */}
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">Title</th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Department</th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Type</th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Salary</th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Applications</th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Status</th>
                      <th className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Closing Date</th>
                      <th className="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span className="sr-only">Actions</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {loading ? (
                      <tr>
                        <td colSpan="8" className="py-12 text-center text-gray-500">
                          Loading jobs...
                        </td>
                      </tr>
                    ) : jobs.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="py-12 text-center text-gray-500">
                          No jobs found. Create your first job posting to get started.
                        </td>
                      </tr>
                    ) : (
                      jobs.map((job) => (
                        <tr key={job.id} className="hover:bg-gray-50">
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm sm:pl-6">
                            <div className="font-medium text-gray-900">{job.title}</div>
                            {job.location && (
                              <div className="text-gray-500 text-xs">{job.location}</div>
                            )}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {job.department?.name || '-'}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 capitalize">
                            {job.employment_type}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {formatSalary(job.salary_min, job.salary_max)}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            <button
                              onClick={() => handleViewApplications(job)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              {job.applications?.length || 0} applications
                            </button>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm">
                            <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ${getStatusBadge(job.status)}`}>
                              {job.status}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                            {formatDate(job.closing_date)}
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <div className="flex gap-2 justify-end">
                              <IconButton
                                variant="ghost-primary"
                                size="sm"
                                onClick={() => handleViewApplications(job)}
                                title="View applications"
                              >
                                <EyeIcon />
                              </IconButton>
                              <IconButton
                                variant="ghost-primary"
                                size="sm"
                                onClick={() => handleOpenModal(job)}
                                title="Edit job"
                              >
                                <PencilIcon />
                              </IconButton>
                              <IconButton
                                variant="ghost-danger"
                                size="sm"
                                onClick={() => handleDelete(job)}
                                title="Delete job"
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
      </div>

      <JobPostingModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editingJob={editingJob}
        onSuccess={fetchJobs}
      />

      <JobApplicationsModal
        isOpen={isApplicationsModalOpen}
        onClose={handleCloseApplications}
        job={viewingApplications}
      />
    </AppLayout>
  );
}
