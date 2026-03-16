import React, { useState, useEffect } from 'react';
import { Head, usePage } from '@inertiajs/react';
import AppLayout from '../layout';
import axios from 'axios';
import { BriefcaseIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import JobCard from './_sections/JobCard';
import ViewJobModal from './_sections/ViewJobModal';
import JobApplicationModal from './_sections/JobApplicationModal';
import QuickSetupModal from './_sections/QuickSetupModal';
import { showError } from '@/app/components';

export default function JobBoardPage({ user: pageUser }) {
  const { auth } = usePage().props;
  const [user, setUser] = useState(pageUser || auth?.user);
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  const [isQuickSetupModalOpen, setIsQuickSetupModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('open');

  const fetchUser = async () => {
    try {
      const response = await axios.get('/api/user/profile');
      setUser(response.data);
    } catch (error) {
      console.error('Failed to fetch user:', error);
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchUser();
  }, []);

  useEffect(() => {
    filterJobs();
  }, [jobs, searchQuery, statusFilter]);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/job-postings');
      // Filter to only show open jobs for applicants or jobs with target_audience 'both' or 'applicants'
      const openJobs = response.data.filter(job => 
        job.status === 'open' && 
        (job.target_audience === 'both' || job.target_audience === 'applicants' || !job.target_audience)
      );
      setJobs(openJobs);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
      showError({
        title: 'Error',
        content: 'Failed to load job postings.',
      });
    } finally {
      setLoading(false);
    }
  };

  const filterJobs = () => {
    let filtered = jobs;

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(job => job.status === statusFilter);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(query) ||
        job.department?.name.toLowerCase().includes(query) ||
        job.location?.toLowerCase().includes(query)
      );
    }

    setFilteredJobs(filtered);
  };

  const handleViewJob = (job) => {
    setSelectedJob(job);
    setIsViewModalOpen(true);
  };

  const handleApply = (job) => {
    // Check if user has phone number and resume
    const hasPhone = user?.user_information?.phone;
    const hasResume = user?.user_information?.resume_path;

    if (!hasPhone || !hasResume) {
      // Show quick setup modal
      setSelectedJob(job);
      setIsQuickSetupModalOpen(true);
    } else {
      // Show apply modal directly
      setSelectedJob(job);
      setIsApplyModalOpen(true);
    }
  };

  const handleQuickSetupComplete = async () => {
    await fetchUser();
    setIsQuickSetupModalOpen(false);
    setIsApplyModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedJob(null);
  };

  const handleCloseApplyModal = () => {
    setIsApplyModalOpen(false);
    setSelectedJob(null);
  };

  const handleCloseQuickSetupModal = () => {
    setIsQuickSetupModalOpen(false);
    setSelectedJob(null);
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
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
                {searchQuery ? 'Try adjusting your search criteria' : 'Check back later for new opportunities!'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredJobs.map((job) => (
                <JobCard key={job.id} job={job} onClick={handleViewJob} />
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
      />

      <JobApplicationModal
        isOpen={isApplyModalOpen}
        onClose={handleCloseApplyModal}
        job={selectedJob}
        user={user}
        onSuccess={fetchJobs}
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
