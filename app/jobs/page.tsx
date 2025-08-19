"use client";
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import JobCard from '@/components/JobCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Filter, Briefcase, TrendingUp, Lightbulb, X } from 'lucide-react';
import { jobsApiService, Job } from '@/lib/jobs-api';

const jobTypes = ['All Jobs', 'Full-time', 'Part-time', 'Contract', 'Remote', 'Internship'];
const locations = ['All Locations', 'San Francisco', 'New York', 'Los Angeles', 'Remote', 'Austin', 'Seattle'];

export default function JobsPage() {
  const searchParams = useSearchParams();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [type, setType] = useState('All Jobs');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // Fetch jobs from backend
  const fetchJobs = async (searchTitle = '', searchLocation = '', searchType = 'All Jobs') => {
    setLoading(true);
    setError('');
    try {
      const params: any = {};
      if (searchTitle) params.title = searchTitle;
      if (searchLocation) params.location = searchLocation;
      if (searchType && searchType !== 'All Jobs') params.type = searchType;
      
      const data = await jobsApiService.getJobs(params);
      if (data.success) {
        setJobs(data.data.jobs || []);
        setTotal(data.data.total || 0);
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
    fetchJobs(title, location, type);
    
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
    setActiveFilters([]);
    fetchJobs();
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
    
    fetchJobs(newTitle, newLocation, newType);
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
                    onClick={() => setType(jt)}
                  >
                    {jt}
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Advanced Filters */}
            <div className="flex items-end">
              <Button variant="outline" className="flex items-center gap-2 h-10 px-6 border-2 border-gray-200 hover:border-emerald-300 rounded-xl">
                <Filter className="h-4 w-4" />
                More Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <h2 className="text-2xl font-bold text-gray-900">
              {loading ? 'Loading...' : `${total} Jobs Found`}
            </h2>
            <div className="flex items-center text-emerald-600">
              <TrendingUp className="h-5 w-5 mr-1" />
              <span className="text-sm font-medium">+12% this week</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500" aria-label="Sort jobs">
              <option>Most Recent</option>
              <option>Salary: High to Low</option>
              <option>Salary: Low to High</option>
              <option>Most Relevant</option>
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
            jobs.map((job: any) => <JobCard key={job.id} job={job} />)
          )}
        </div>

        {/* Load More (not implemented) */}
        <div className="text-center">
          <Button size="lg" variant="outline" className="px-8 py-3 text-lg font-semibold border-2 border-gray-300 hover:border-emerald-500 hover:bg-emerald-50 rounded-xl" disabled>
            Load More Jobs
          </Button>
        </div>

        {/* Test API Connection */}
        <div className="text-center mt-8">
          <Button 
            onClick={async () => {
              try {
                const result = await jobsApiService.testConnection();
                alert(`API Test: ${result.message}`);
              } catch (error) {
                alert('API Test Failed: ' + error);
              }
            }}
            variant="outline" 
            className="px-6 py-2 text-sm border-2 border-blue-300 hover:border-blue-500 hover:bg-blue-50 rounded-lg"
          >
            Test API Connection
          </Button>
        </div>
      </div>
    </div>
  );
}
