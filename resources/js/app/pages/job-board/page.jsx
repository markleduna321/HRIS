import React, { useState, useEffect, useMemo } from 'react';
import { Head, usePage } from '@inertiajs/react';
import { useDispatch, useSelector } from 'react-redux';
import AppLayout from '../layout';
import { BriefcaseIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import JobCard from './_sections/JobCard';
import ViewJobModal from './_sections/ViewJobModal';
import JobApplicationModal from './_sections/JobApplicationModal';
import QuickSetupModal from './_sections/QuickSetupModal';
import { showError } from '@/app/components';
import { fetchJobBoardPostings, fetchCurrentUser, fetchUserApplications, setFilters, setSelectedJob, clearSelectedJob, setUser } from './_redux';

export default function JobBoardPage({ user: pageUser }) {
  const dispatch = useDispatch();
  const { auth } = usePage().props;
  const { jobs, user, selectedJob, appliedJobIds, loading, filters } = useSelector((state) => state.jobBoardPage);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isQuickSetupModalOpen, setIsQuickSetupModalOpen] = useState(false);

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

  return (
    <AppLayout>
      <Head title="Job Openings" />
      
        {/* Header */}
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
          <h1 className="text-2xl font-bold text-gray-900">Active Job Postings</h1>
          <p className="text-gray-500 mt-1">Manage and track all job postings</p>
        </div>

        {/* Search and Filter */}
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 mt-6">
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
        <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
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
    </AppLayout>
  );
}
