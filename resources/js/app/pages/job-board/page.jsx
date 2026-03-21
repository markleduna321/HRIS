import React, { useState, useEffect, useMemo } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { useDispatch, useSelector } from 'react-redux';
import AppLayout from '../layout';
import { BriefcaseIcon, MagnifyingGlassIcon, ChatBubbleLeftIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';
import JobCard from './_sections/JobCard';
import ViewJobModal from './_sections/ViewJobModal';
import JobApplicationModal from './_sections/JobApplicationModal';
import QuickSetupModal from './_sections/QuickSetupModal';
import MyApplicationCard from './_sections/MyApplicationCard';
import ApplicationDetailsModal from './_sections/ApplicationDetailsModal';
import { showError } from '@/app/components';
import { fetchJobBoardPostings, fetchCurrentUser, fetchUserApplications, setFilters, setSelectedJob, clearSelectedJob, setUser, setActiveTab } from './_redux';

export default function JobBoardPage({ user: pageUser }) {
  const dispatch = useDispatch();
  const { auth } = usePage().props;
  const { jobs, user, selectedJob, appliedJobIds, userApplications, activeTab, loading, filters } = useSelector((state) => state.jobBoardPage);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isQuickSetupModalOpen, setIsQuickSetupModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);

  useEffect(() => {
    // Initialize user from props if available
    if (pageUser || auth?.user) {
      dispatch(setUser(pageUser || auth.user));
    }
    dispatch(fetchJobBoardPostings());
    dispatch(fetchCurrentUser());
    dispatch(fetchUserApplications());
  }, [dispatch]);

  // Client-side filtering
  const filteredJobs = useMemo(() => {
    let filtered = jobs;

    if (filters.status !== 'all') {
      filtered = filtered.filter(job => job.status === filters.status);
    }

    if (filters.search) {
      const query = filters.search.toLowerCase();
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(query) ||
        job.department?.name.toLowerCase().includes(query) ||
        job.location?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [jobs, filters]);

  const handleViewJob = (job) => {
    dispatch(setSelectedJob(job));
    setIsViewModalOpen(true);
  };

  const handleApply = (job) => {
    const hasPhone = user?.user_information?.phone;
    const hasResume = user?.user_information?.resume_path;

    dispatch(setSelectedJob(job));
    if (!hasPhone || !hasResume) {
      setIsQuickSetupModalOpen(true);
    } else {
      setIsApplyModalOpen(true);
    }
  };

  const handleQuickSetupComplete = async () => {
    await dispatch(fetchCurrentUser()).unwrap();
    setIsQuickSetupModalOpen(false);
    setIsApplyModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    dispatch(clearSelectedJob());
  };

  const handleCloseApplyModal = () => {
    setIsApplyModalOpen(false);
    dispatch(clearSelectedJob());
  };

  const handleCloseQuickSetupModal = () => {
    setIsQuickSetupModalOpen(false);
    dispatch(clearSelectedJob());
  };

  const handleApplicationSuccess = () => {
    dispatch(fetchJobBoardPostings());
    dispatch(fetchUserApplications());
  };

  const handleViewApplication = (application) => {
    setSelectedApplication(application);
    setIsDetailsModalOpen(true);
  };

  const tabs = [
    { id: 'job-openings', name: 'Job Openings' },
    { id: 'my-applications', name: 'My Applications' },
    { id: 'messages', name: 'Messages' },
  ];

  return (
    <AppLayout>
      <Head title="Job Board" />
      <div className="px-4 sm:px-6 lg:px-8">
        {/* Tabs */}
        <div className="-mx-16 sm:-mx-16 -my-10 lg:-mx-18 border-b border-gray-200 mb-6 bg-white">
          <nav className="-mb-px flex space-x-8 pl-16 sm:pl-16 lg:pl-18" aria-label="Tabs">
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
                {tab.id === 'my-applications' && userApplications.length > 0 && (
                  <span className="ml-2 px-2 py-0.5 text-xs font-medium rounded-full bg-indigo-100 text-indigo-600">
                    {userApplications.length}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'job-openings' && (
          <>
            {/* Search and Filter */}
            <div className="mb-6">
              <div className="bg-white rounded-lg border border-gray-200 p-4 flex gap-4">
                <div className="flex-1 relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search job postings..."
                    value={filters.search}
                    onChange={(e) => dispatch(setFilters({ search: e.target.value }))}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <select
                  value={filters.status}
                  onChange={(e) => dispatch(setFilters({ status: e.target.value }))}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
                >
                  <option value="all">All Status</option>
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
            </div>

            {/* Job Listings */}
            <div className="">
              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                  <p className="text-gray-500 mt-4">Loading job postings...</p>
                </div>
              ) : filteredJobs.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                  <BriefcaseIcon className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No job openings available</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {filters.search ? 'Try adjusting your search criteria' : 'Check back later for new opportunities!'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredJobs.map((job) => (
                    <JobCard key={job.id} job={job} onClick={handleViewJob} hasApplied={appliedJobIds.includes(job.id)} />
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'my-applications' && (
          <div>
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">My Applications</h2>
              <p className="text-sm text-gray-500 mt-1">Track the progress of your job applications</p>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                <p className="text-gray-500 mt-4">Loading your applications...</p>
              </div>
            ) : userApplications.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <ClipboardDocumentListIcon className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No applications yet</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Browse job openings and submit your first application!
                </p>
                <button
                  onClick={() => dispatch(setActiveTab('job-openings'))}
                  className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <BriefcaseIcon className="h-4 w-4" />
                  Browse Jobs
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {userApplications.map((application) => (
                  <MyApplicationCard
                    key={application.id}
                    application={application}
                    onView={handleViewApplication}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'messages' && (
          <div>
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <ChatBubbleLeftIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No messages</h3>
              <p className="mt-1 text-sm text-gray-500">Messages from recruiters will appear here.</p>
            </div>
          </div>
        )}

      </div>

      {/* Modals */}
      <ViewJobModal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        job={selectedJob}
        onApply={handleApply}
        hasApplied={selectedJob ? appliedJobIds.includes(selectedJob.id) : false}
      />

      <JobApplicationModal
        isOpen={isApplyModalOpen}
        onClose={handleCloseApplyModal}
        job={selectedJob}
        user={user}
        onSuccess={handleApplicationSuccess}
      />

      <QuickSetupModal
        isOpen={isQuickSetupModalOpen}
        onClose={handleCloseQuickSetupModal}
        onComplete={handleQuickSetupComplete}
        user={user}
      />

      <ApplicationDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => { setIsDetailsModalOpen(false); setSelectedApplication(null); }}
        application={selectedApplication}
      />
    </AppLayout>
  );
}
