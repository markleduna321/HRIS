import React, { useState, useEffect, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import { useDispatch, useSelector } from 'react-redux';
import AppLayout from '../layout';
import { Button, showDeleteConfirm, showSuccess } from '@/app/components';
import { PlusIcon, MagnifyingGlassIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import JobPostingModal from './_sections/JobPostingModal';
import JobPostingCard from './_sections/JobPostingCard';
import JobPostingViewModal from './_sections/JobPostingViewModal';
import JobApplicationsModal from './_sections/JobApplicationsModal';
import ApplicationViewModal from './_sections/ApplicationViewModal';
import ApplicantCard from './_sections/ApplicantCard';
import { fetchJobPostings, fetchJobApplications, deleteJobPosting, setFilters, setActiveTab } from './_redux';

export default function JobManagementPage() {
  const dispatch = useDispatch();
  const { jobPostings, applications, loading, filters, activeTab } = useSelector((state) => state.jobManagementPage);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [viewingJob, setViewingJob] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewingApplications, setViewingApplications] = useState(null);
  const [isApplicationsModalOpen, setIsApplicationsModalOpen] = useState(false);
  const [applicantSearch, setApplicantSearch] = useState('');
  const [applicantJobFilter, setApplicantJobFilter] = useState('');
  const [applicantStatusFilter, setApplicantStatusFilter] = useState('');
  const [viewingApplication, setViewingApplication] = useState(null);
  const [isAppViewModalOpen, setIsAppViewModalOpen] = useState(false);

  useEffect(() => {
    const params = {};
    if (filters.status) params.status = filters.status;
    dispatch(fetchJobPostings(params));
  }, [dispatch, filters.status]);

  // Fetch all applications when on the applicants tab
  useEffect(() => {
    if (activeTab === 'applicants') {
      const params = {};
      if (applicantJobFilter) params.job_posting_id = applicantJobFilter;
      if (applicantStatusFilter) params.status = applicantStatusFilter;
      dispatch(fetchJobApplications(params));
    }
  }, [dispatch, activeTab, applicantJobFilter, applicantStatusFilter]);

  // Client-side search filtering for applicants
  const filteredApplications = useMemo(() => {
    if (!applicantSearch) return applications;
    const q = applicantSearch.toLowerCase();
    return applications.filter(a =>
      a.applicant_name?.toLowerCase().includes(q) ||
      a.email?.toLowerCase().includes(q) ||
      a.phone?.includes(q)
    );
  }, [applications, applicantSearch]);

  // Status counts for applicant tab cards
  const statusCounts = useMemo(() => {
    const counts = { all: applications.length, pending: 0, reviewing: 0, interview: 0, shortlisted: 0, final_interview: 0, job_offer: 0, accepted: 0, pre_employment_documents: 0, hired: 0, rejected: 0 };
    applications.forEach(a => { if (counts[a.status] !== undefined) counts[a.status]++; });
    return counts;
  }, [applications]);

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

  const handleViewApplicantsTab = (job) => {
    setIsViewModalOpen(false);
    setViewingJob(null);
    setApplicantJobFilter(String(job.id));
    setApplicantStatusFilter('');
    dispatch(setActiveTab('applicants'));
  };

  const handleDelete = (job) => {
    showDeleteConfirm({
      title: `Delete ${job.title}?`,
      content: 'Are you sure you want to delete this job posting? All applications will also be deleted.',
      onOk: async () => {
        try {
          await dispatch(deleteJobPosting(job.id)).unwrap();
          showSuccess({
            title: 'Job Deleted',
            content: `${job.title} has been deleted successfully.`,
          });
        } catch (error) {
          console.error('Delete failed:', error);
        }
      },
    });
  };

  const handleSuccess = () => {
    const params = {};
    if (filters.status) params.status = filters.status;
    dispatch(fetchJobPostings(params));
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
                onClick={() => dispatch(setActiveTab(tab.id))}
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
                value={filters.status}
                onChange={(e) => dispatch(setFilters({ status: e.target.value }))}
                className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              >
                <option value="">All Status</option>
                <option value="open">Active</option>
                <option value="closed">Closed</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            {/* Job Postings List */}
            {loading && jobPostings.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading job postings...</p>
                </div>
              </div>
            ) : jobPostings.length === 0 ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <div className="text-gray-400 text-5xl mb-4">💼</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No job postings found</h3>
                <p className="text-gray-600 mb-6">Get started by creating your first job posting.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {jobPostings.map((job) => (
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
          <div>
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-gray-900">Applicant Management</h1>
              <p className="mt-2 text-sm text-gray-700">Review and manage job applications</p>
            </div>

            <div className="grid grid-cols-5 gap-3 mb-3">
              {[
                { key: '', label: 'All', count: statusCounts.all },
                { key: 'pending', label: 'New', count: statusCounts.pending },
                { key: 'reviewing', label: 'Reviewing', count: statusCounts.reviewing },
                { key: 'interview', label: 'Initial Interview', count: statusCounts.interview },
                { key: 'shortlisted', label: 'Interview Passed', count: statusCounts.shortlisted },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => setApplicantStatusFilter(item.key)}
                  className={`rounded-lg border p-3 text-center transition-colors ${
                    applicantStatusFilter === item.key
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <p className={`text-xs ${applicantStatusFilter === item.key ? 'text-indigo-600' : 'text-gray-500'}`}>
                    {item.label}
                  </p>
                  <p className={`text-xl font-bold mt-1 ${applicantStatusFilter === item.key ? 'text-indigo-600' : 'text-gray-900'}`}>
                    {item.count}
                  </p>
                </button>
              ))}
            </div>
            <div className="grid grid-cols-6 gap-3 mb-6">
              {[
                { key: 'final_interview', label: 'Final Interview', count: statusCounts.final_interview },
                { key: 'job_offer', label: 'Job Offer', count: statusCounts.job_offer },
                { key: 'accepted', label: 'Contract Signing', count: statusCounts.accepted },
                { key: 'pre_employment_documents', label: 'Pre-Employment Docs', count: statusCounts.pre_employment_documents },
                { key: 'hired', label: 'Hired', count: statusCounts.hired },
                { key: 'rejected', label: 'Rejected', count: statusCounts.rejected },
              ].map((item) => (
                <button
                  key={item.label}
                  onClick={() => setApplicantStatusFilter(item.key)}
                  className={`rounded-lg border p-3 text-center transition-colors ${
                    applicantStatusFilter === item.key
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <p className={`text-xs ${applicantStatusFilter === item.key ? 'text-indigo-600' : 'text-gray-500'}`}>
                    {item.label}
                  </p>
                  <p className={`text-xl font-bold mt-1 ${applicantStatusFilter === item.key ? 'text-indigo-600' : 'text-gray-900'}`}>
                    {item.count}
                  </p>
                </button>
              ))}
            </div>

            {/* Search & Filters */}
            <div className="bg-white rounded-lg border border-gray-200 p-4 flex gap-4 mb-6">
              <div className="flex-1 relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search applicants..."
                  value={applicantSearch}
                  onChange={(e) => setApplicantSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent sm:text-sm"
                />
              </div>
              <select
                value={applicantJobFilter}
                onChange={(e) => setApplicantJobFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white sm:text-sm"
              >
                <option value="">All Positions</option>
                {jobPostings.map((jp) => (
                  <option key={jp.id} value={jp.id}>{jp.title}</option>
                ))}
              </select>
              <select
                value={applicantStatusFilter}
                onChange={(e) => setApplicantStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white sm:text-sm"
              >
                <option value="">All Status</option>
                <option value="pending">New</option>
                <option value="reviewing">Reviewing</option>
                <option value="interview">Initial Interview</option>
                <option value="shortlisted">Interview Passed</option>
                <option value="final_interview">Final Interview</option>
                <option value="job_offer">Job Offer</option>
                <option value="accepted">Contract Signing</option>
                <option value="hired">Hired</option>
                <option value="rejected">Rejected</option>
              </select>
              <button className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                <ArrowDownTrayIcon className="h-4 w-4" />
                Export
              </button>
            </div>

            {/* Applicant List */}
            {loading && applications.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Loading applicants...</p>
                </div>
              </div>
            ) : filteredApplications.length === 0 ? (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No applicants found</h3>
                <p className="text-gray-600">
                  {applicantSearch || applicantJobFilter || applicantStatusFilter
                    ? 'Try adjusting your search or filters'
                    : 'No applications have been submitted yet.'}
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredApplications.map((app) => (
                  <ApplicantCard
                    key={app.id}
                    application={app}
                    onView={(application) => {
                      setViewingApplication(application);
                      setIsAppViewModalOpen(true);
                    }}
                  />
                ))}
              </div>
            )}
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
        onSuccess={handleSuccess}
      />

      <JobPostingViewModal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        job={viewingJob}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onViewApplicants={handleViewApplicantsTab}
      />

      <JobApplicationsModal
        isOpen={isApplicationsModalOpen}
        onClose={handleCloseApplications}
        job={viewingApplications}
      />

      <ApplicationViewModal
        isOpen={isAppViewModalOpen}
        onClose={() => { setIsAppViewModalOpen(false); setViewingApplication(null); }}
        application={viewingApplication}
        onStatusChange={() => {
          const params = {};
          if (applicantJobFilter) params.job_posting_id = applicantJobFilter;
          if (applicantStatusFilter) params.status = applicantStatusFilter;
          dispatch(fetchJobApplications(params));
        }}
      />
    </AppLayout>
  );
}
