import React, { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AppLayout from '../layout';
import axios from 'axios';
import { BriefcaseIcon, MapPinIcon, ClockIcon, CurrencyDollarIcon, CalendarIcon } from '@heroicons/react/24/outline';
import JobApplicationModal from './_sections/JobApplicationModal';

export default function JobBoardPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await axios.get('/api/job-postings');
      setJobs(response.data);
    } catch (error) {
      console.error('Failed to fetch jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = (job) => {
    setSelectedJob(job);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedJob(null);
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString();
  };

  const formatSalary = (min, max) => {
    if (!min && !max) return 'Competitive';
    if (!max) return `₱${parseFloat(min).toLocaleString()}+`;
    return `₱${parseFloat(min).toLocaleString()} - ₱${parseFloat(max).toLocaleString()}`;
  };

  return (
    <AppLayout>
      <Head title="Job Board" />
      <div className="bg-gray-50">
        {/* Hero Section */}
        <div className="bg-indigo-700 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white mb-4">
                Find Your Dream Job
              </h1>
              <p className="text-xl text-indigo-100">
                Explore open positions and join our team
              </p>
            </div>
          </div>
        </div>

        {/* Jobs Listing */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Loading job openings...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow">
              <BriefcaseIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No openings available</h3>
              <p className="mt-1 text-sm text-gray-500">
                Check back later for new opportunities!
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900">{job.title}</h3>
                          {job.department && (
                            <p className="mt-1 text-sm text-gray-600">
                              Department: {job.department.name}
                            </p>
                          )}
                        </div>
                        <span className={`inline-flex items-center rounded-md px-3 py-1 text-xs font-medium ${
                          job.employment_type === 'full-time' ? 'bg-green-50 text-green-700' :
                          job.employment_type === 'part-time' ? 'bg-blue-50 text-blue-700' :
                          job.employment_type === 'contract' ? 'bg-yellow-50 text-yellow-700' :
                          'bg-purple-50 text-purple-700'
                        }`}>
                          {job.employment_type}
                        </span>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-4 text-sm text-gray-500">
                        {job.location && (
                          <div className="flex items-center">
                            <MapPinIcon className="h-5 w-5 mr-1" />
                            {job.location}
                          </div>
                        )}
                        <div className="flex items-center">
                          <CurrencyDollarIcon className="h-5 w-5 mr-1" />
                          {formatSalary(job.salary_min, job.salary_max)}
                        </div>
                        {job.closing_date && (
                          <div className="flex items-center">
                            <CalendarIcon className="h-5 w-5 mr-1" />
                            Closes: {formatDate(job.closing_date)}
                          </div>
                        )}
                        <div className="flex items-center">
                          <BriefcaseIcon className="h-5 w-5 mr-1" />
                          {job.positions_available} {job.positions_available === 1 ? 'position' : 'positions'}
                        </div>
                      </div>

                      <div className="mt-4">
                        <h4 className="text-sm font-semibold text-gray-900">Description</h4>
                        <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                          {job.description}
                        </p>
                      </div>

                      {job.requirements && (
                        <div className="mt-4">
                          <h4 className="text-sm font-semibold text-gray-900">Requirements</h4>
                          <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                            {job.requirements}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="mt-6 lg:mt-0 lg:ml-6 flex-shrink-0">
                      <button
                        onClick={() => handleApply(job)}
                        className="w-full lg:w-auto px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 transition-colors shadow-sm"
                      >
                        Apply Now
                      </button>
                      <p className="mt-2 text-xs text-gray-500 text-center lg:text-left">
                        Posted {formatDate(job.created_at)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <JobApplicationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        job={selectedJob}
        onSuccess={fetchJobs}
      />
    </AppLayout>
  );
}
