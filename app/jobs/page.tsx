"use client";
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import JobCard from '@/components/JobCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Filter, Briefcase, TrendingUp, Lightbulb, X, DollarSign } from 'lucide-react';
import { jobsApiService, Job } from '@/lib/jobs-api';

const jobTypes = ['All Jobs', 'Full-time', 'Part-time', 'Contract', 'Remote', 'Internship'];
const locations = ['All Locations', 'San Francisco', 'New York', 'Los Angeles', 'Remote', 'Austin', 'Seattle'];

export default function JobsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('All Jobs');
  const [sortBy, setSortBy] = useState('Most Recent');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const jobsPerPage = 10;

  // Fetch jobs from backend
  const fetchJobs = async (searchTitle = '', searchLocation = '', searchType = 'All Jobs', page = 1, sort = 'Most Recent') => {
    setLoading(true);
    setError('');
    try {
      const params: any = {
        page: page,
        limit: jobsPerPage
      };
      if (searchTitle) params.title = searchTitle;
      if (searchLocation) params.location = searchLocation;
      if (searchType && searchType !== 'All Jobs') params.job_type = searchType;
      
      // Add sort parameter
      switch (sort) {
        case 'Most Recent':
          params.sort = 'posted_date';
          params.order = 'desc';
          break;
        case 'Salary: High to Low':
          params.sort = 'salary_max';
          params.order = 'desc';
          break;
        case 'Salary: Low to High':
          params.sort = 'salary_min';
          params.order = 'asc';
          break;
        case 'Most Relevant':
          params.sort = 'title';
          params.order = 'asc';
          break;
        default:
          params.sort = 'posted_date';
          params.order = 'desc';
      }
      
      const data = await jobsApiService.getJobs(params);
      if (data.success) {
        setJobs(data.data.jobs || []);
        setTotal(data.data.total || 0);
        setTotalPages(data.data.total_pages || 1);
        setCurrentPage(page);
      } else {
        setError('Failed to fetch jobs.');
      }
    } catch (err) {
      setError('Failed to fetch jobs.');
    } finally {
      setLoading(false);
    }
  };

  // Load initial jobs and read URL parameters
  useEffect(() => {
    const urlTitle = searchParams.get('title') || '';
    const urlLocation = searchParams.get('location') || '';
    
    // Set initial state from URL parameters
    setTitle(urlTitle);
    setLocation(urlLocation);
    
    // Build active filters from URL parameters
    const filters = [];
    if (urlTitle) filters.push(`Title: ${urlTitle}`);
    if (urlLocation) filters.push(`Location: ${urlLocation}`);
    setActiveFilters(filters);
    
    // Fetch jobs with URL parameters
    fetchJobs(urlTitle, urlLocation, 'All Jobs');
  }, [searchParams]);

  // Handlers
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    // If no search terms provided, fetch all jobs and reset filters
    if (!title && !location) {
      setType('All Jobs');
      setActiveFilters([]);
      fetchJobs('', '', 'All Jobs', 1, sortBy);
      return;
    }

    fetchJobs(title, location, type, 1, sortBy);

    // Update active filters
    const filters = [];
    if (title) filters.push(`Title: ${title}`);
    if (location) filters.push(`Location: ${location}`);
    if (type && type !== 'All Jobs') filters.push(`Type: ${type}`);
    setActiveFilters(filters);
  };

  const clearFilters = () => {
    setTitle('');
    setLocation('');
    setType('All Jobs');
    setSortBy('Most Recent');
    setActiveFilters([]);
    setCurrentPage(1);
    fetchJobs('', '', 'All Jobs', 1, 'Most Recent');
  };

  const removeFilter = (filterToRemove: string) => {
    const newFilters = activeFilters.filter(f => f !== filterToRemove);
    setActiveFilters(newFilters);
    
    // Update state based on remaining filters
    const newTitle = newFilters.find(f => f.startsWith('Title:'))?.replace('Title: ', '') || '';
    const newLocation = newFilters.find(f => f.startsWith('Location:'))?.replace('Location: ', '') || '';
    const newType = newFilters.find(f => f.startsWith('Type:'))?.replace('Type: ', '') || 'All Jobs';
    
    setTitle(newTitle);
    setLocation(newLocation);
    setType(newType);
    setCurrentPage(1);
    
    fetchJobs(newTitle, newLocation, newType, 1, sortBy);
  };

  // Actions
  const handleApplyJob = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      router.push('/job-seekers/login');
    } catch (_) {
      // Fallback in case router navigation is blocked
      window.location.href = '/job-seekers/login';
    }
  };

  const handleViewDetails = (job: Job, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedJob(job);
    setIsDialogOpen(true);
  };

  // Pagination handlers
  const handlePageChange = (page: number) => {
    fetchJobs(title, location, type, page, sortBy);
  };

  // Job type filter handler
  const handleJobTypeChange = (jobType: string) => {
    setType(jobType);
    setCurrentPage(1);
    fetchJobs(title, location, jobType, 1, sortBy);
    
    // Update active filters
    const filters = [];
    if (title) filters.push(`Title: ${title}`);
    if (location) filters.push(`Location: ${location}`);
    if (jobType && jobType !== 'All Jobs') filters.push(`Type: ${jobType}`);
    setActiveFilters(filters);
  };

  // Sort handler
  const handleSortChange = (sortValue: string) => {
    setSortBy(sortValue);
    setCurrentPage(1);
    fetchJobs(title, location, type, 1, sortValue);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-emerald-600 via-green-600 to-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-100 text-sm font-semibold mb-6">
            <Briefcase className="w-4 h-4 mr-2" />
            Your Next Opportunity Awaits
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Find Your
            <br />
            <span className="bg-gradient-to-r from-yellow-300 to-lime-300 bg-clip-text text-transparent">
              Dream Job
            </span>
          </h1>
          <p className="text-xl text-emerald-100 max-w-3xl mx-auto mb-8">
            Discover thousands of opportunities from top companies and take the next step in your career journey.
          </p>

          {/* Job Search Form */}
          <form className="max-w-4xl mx-auto" onSubmit={handleSearch}>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Job title, keywords, or company"
                    className="pl-12 h-14 text-lg bg-white border-2 border-gray-200 focus:border-emerald-500 rounded-xl text-gray-900"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                  />
                </div>
                <div className="flex-1 relative">
                  <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="City, state, or remote"
                    className="pl-12 h-14 text-lg bg-white border-2 border-gray-200 focus:border-emerald-500 rounded-xl text-gray-900"
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                  />
                </div>
                <Button type="submit" className="bg-gradient-to-r from-lime-500 to-yellow-500 hover:from-lime-600 hover:to-yellow-600 h-14 px-8 text-lg font-semibold shadow-lg hover:shadow-lime-200 transition-all duration-300 transform hover:scale-105 rounded-xl">
                  <Search className="w-5 h-5 mr-2" />
                  Search Jobs
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Active Filters */}
        {activeFilters.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-gray-700">Active Filters:</h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearFilters}
                className="text-emerald-600 hover:text-emerald-700"
              >
                Clear All
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {activeFilters.map((filter, index) => (
                <div key={index} className="flex items-center bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm">
                  <span>{filter}</span>
                  <button
                      onClick={() => removeFilter(filter)}
                      className="ml-2 text-emerald-600 hover:text-emerald-800"
                      aria-label={`Remove ${filter} filter`}
                      title={`Remove ${filter} filter`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row gap-6 mb-8">
            {/* Job Type Filters */}
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Job Type</h3>
              <div className="flex flex-wrap gap-2">
                {jobTypes.map((jt) => (
                  <Button
                    key={jt}
                    variant={jt === type ? 'default' : 'outline'}
                    size="sm"
                    className={`rounded-full font-medium transition-all duration-300 ${
                      jt === type
                        ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg'
                        : 'border-2 border-gray-200 hover:border-emerald-300 hover:bg-emerald-50'
                    }`}
                    onClick={() => handleJobTypeChange(jt)}
                  >
                    {jt}
                  </Button>
                ))}
              </div>
            </div>
            
            
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {loading ? 'Loading...' : `${total} Jobs Found`}
            </h2>
           
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select 
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" 
              aria-label="Sort jobs"
              value={sortBy}
              onChange={(e) => handleSortChange(e.target.value)}
            >
              <option value="Most Recent">Most Recent</option>
              <option value="Salary: High to Low">Salary: High to Low</option>
              <option value="Salary: Low to High">Salary: Low to High</option>
              <option value="Most Relevant">Most Relevant</option>
            </select>
          </div>
        </div>

        {/* Error State */}
        {error && <div className="text-red-600 mb-4">{error}</div>}

        {/* Job Listings */}
        <div className="space-y-6 mb-12">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading jobs...</p>
            </div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600">No jobs found matching your criteria.</p>
            </div>
          ) : (
            jobs.map((job: any) => (
              <div key={job.id} className="rounded-xl border border-gray-200 bg-white p-4">
                <JobCard job={job} onApply={(e?: any) => handleApplyJob()} onViewDetails={() => handleViewDetails(job)} />
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2 mb-8">
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2"
            >
              Previous
            </Button>
            
            <div className="flex space-x-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = Math.max(1, currentPage - 2) + i;
                if (pageNum > totalPages) return null;
                
                return (
                  <Button
                    key={pageNum}
                    variant={pageNum === currentPage ? "default" : "outline"}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-2 ${
                      pageNum === currentPage 
                        ? 'bg-emerald-600 text-white' 
                        : 'hover:bg-emerald-50'
                    }`}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2"
            >
              Next
            </Button>
          </div>
        )}

      
      </div>

      {/* Job Details Dialog */}
      {isDialogOpen && selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsDialogOpen(false)}></div>
          <div className="relative z-10 w-full max-w-4xl max-h-[90vh] rounded-3xl bg-white shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold">{selectedJob.title || 'Job Details'}</h3>
                  <p className="text-emerald-100 mt-1">{selectedJob.company_name}</p>
                </div>
                <button 
                  onClick={() => setIsDialogOpen(false)} 
                  className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all"
                  aria-label="Close job details"
                  title="Close"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            {/* Scrollable Content */}
            <div className="max-h-[60vh] overflow-y-auto">
              <div className="p-6 space-y-6">
                {/* Job Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedJob.location && (
                    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                      <MapPin className="h-5 w-5 text-emerald-600" />
                      <div>
                        <p className="text-sm text-gray-600">Location</p>
                        <p className="font-semibold text-gray-900">{selectedJob.location}</p>
                      </div>
                    </div>
                  )}
                  
                  {selectedJob.job_type && (
                    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                      <Briefcase className="h-5 w-5 text-emerald-600" />
                      <div>
                        <p className="text-sm text-gray-600">Job Type</p>
                        <p className="font-semibold text-gray-900">{selectedJob.job_type}</p>
                      </div>
                    </div>
                  )}
                  
                  {selectedJob.experience_level && (
                    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                      <TrendingUp className="h-5 w-5 text-emerald-600" />
                      <div>
                        <p className="text-sm text-gray-600">Experience</p>
                        <p className="font-semibold text-gray-900">{selectedJob.experience_level}</p>
                      </div>
                    </div>
                  )}
                  
                  {(selectedJob.salary_min || selectedJob.salary_max) && (
                    <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl">
                      <DollarSign className="h-5 w-5 text-emerald-600" />
                      <div>
                        <p className="text-sm text-gray-600">Salary</p>
                        <p className="font-semibold text-gray-900">
                          {selectedJob.salary_min && selectedJob.salary_max 
                            ? `$${selectedJob.salary_min}k - $${selectedJob.salary_max}k`
                            : selectedJob.salary_min 
                            ? `$${selectedJob.salary_min}k+`
                            : `Up to $${selectedJob.salary_max}k`
                          }
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Description */}
                {selectedJob.description && (
                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Lightbulb className="h-5 w-5 text-emerald-600 mr-2" />
                      Job Description
                    </h4>
                    <div className="prose prose-gray max-w-none">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">{selectedJob.description}</p>
                    </div>
                  </div>
                )}
                
                {/* Requirements */}
                {selectedJob.requirements && (
                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold text-gray-900">Requirements</h4>
                    <div className="prose prose-gray max-w-none">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">{selectedJob.requirements}</p>
                    </div>
                  </div>
                )}
                
                {/* Benefits */}
                {selectedJob.benefits && (
                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold text-gray-900">Benefits</h4>
                    <div className="prose prose-gray max-w-none">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">{selectedJob.benefits}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            {/* Footer */}
            <div className="p-6 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
              <div className="text-sm text-gray-600">
                Posted {selectedJob.posted_date ? new Date(selectedJob.posted_date).toLocaleDateString() : 'Recently'}
              </div>
              <div className="flex gap-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)} 
                  className="border-2 border-gray-300 hover:border-gray-400"
                >
                  Close
                </Button>
                <Button 
                  type="button" 
                  onClick={() => handleApplyJob()} 
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-6"
                >
                  Apply Now
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}