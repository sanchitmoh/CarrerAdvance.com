"use client";
import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import JobCard from '@/components/JobCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, MapPin, Filter, Briefcase, TrendingUp, Lightbulb, X, DollarSign, Clock, TrendingUp as TrendingUpIcon } from 'lucide-react';
import { jobsApiService, Job } from '@/lib/jobs-api';

const jobTypes = ['All Jobs', 'Full-time', 'Part-time', 'Contract', 'Remote', 'Internship'];
const locations = ['All Locations', 'San Francisco', 'New York', 'Los Angeles', 'Remote', 'Austin', 'Seattle'];

// Debounce hook for search optimization
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default function JobsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [employerNameCache, setEmployerNameCache] = useState<Record<string, string>>({});
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
  const [searchSuggestions, setSearchSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [searchStartTime, setSearchStartTime] = useState<number>(0);

  // Debounced search values for real-time search
  const debouncedTitle = useDebounce(title, 500);
  const debouncedLocation = useDebounce(location, 500);

  // Generate search suggestions based on job titles and companies
  const generateSuggestions = useCallback((query: string, jobs: Job[]) => {
    if (!query || query.length < 2) return [];
    
    const suggestions = new Set<string>();
    const lowerQuery = query.toLowerCase();
    
    jobs.forEach(job => {
      // Add job titles that match
      if (job.title && job.title.toLowerCase().includes(lowerQuery)) {
        suggestions.add(job.title);
      }
      // Add company names that match
      if (job.company_name && job.company_name.toLowerCase().includes(lowerQuery)) {
        suggestions.add(job.company_name);
      }
      // Add skills/keywords from description
      if (job.description) {
        const skills = job.description.toLowerCase().match(/\b\w{3,}\b/g) || [];
        skills.forEach(skill => {
          if (skill.includes(lowerQuery) && skill.length > 3) {
            suggestions.add(skill.charAt(0).toUpperCase() + skill.slice(1));
          }
        });
      }
    });
    
    return Array.from(suggestions).slice(0, 8);
  }, []);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  // Save recent searches to localStorage
  const saveRecentSearch = useCallback((searchTerm: string) => {
    if (!searchTerm.trim()) return;
    
    const updated = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem('recentSearches', JSON.stringify(updated));
  }, [recentSearches]);

  // Update suggestions when jobs or search query changes
  useEffect(() => {
    if (title.length >= 2) {
      const suggestions = generateSuggestions(title, jobs);
      setSearchSuggestions(suggestions);
      setShowSuggestions(suggestions.length > 0);
    } else {
      setSearchSuggestions([]);
      setShowSuggestions(false);
    }
  }, [title, jobs, generateSuggestions]);

  // Auto-search when debounced values change
  useEffect(() => {
    if (debouncedTitle || debouncedLocation) {
      setIsSearching(true);
      setSearchStartTime(Date.now());
      fetchJobs(debouncedTitle, debouncedLocation, type, 1, sortBy);
    }
  }, [debouncedTitle, debouncedLocation, type, sortBy]);

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
        const rawJobs: any[] = data.data.jobs || [];
        const toText = (v: any) => {
          if (v === null || v === undefined) return '';
          if (typeof v === 'string') return v;
          if (typeof v === 'number' || typeof v === 'boolean') return String(v);
          return '';
        };
        const toNum = (v: any) => {
          const n = parseFloat(v);
          return isNaN(n) ? undefined : n;
        };
        const normalized = rawJobs.map((j: any) => {
          // Derive company name from multiple shapes
          let companyName: any = '';
          const cn = j?.company_name;
          if (typeof cn === 'string') companyName = cn;
          else if (cn && typeof cn === 'object') companyName = cn.company_name || cn.name || '';
          if (!companyName) companyName = j?.company || j?.companyName || j?.employer_name || '';
          if (!companyName && j?.employer && typeof j.employer === 'object') {
            companyName = j.employer.company_name || j.employer.name || '';
          }
          const salaryMin = j?.salary_min ?? j?.min_salary ?? j?.minSalary;
          const salaryMax = j?.salary_max ?? j?.max_salary ?? j?.maxSalary;
          const loc = j?.location || j?.city_name || j?.city || '';
          return {
            ...j,
            company_name: toText(companyName),
            title: toText(j?.title),
            location: toText(loc),
            job_type: toText(j?.job_type),
            description: toText(j?.description),
            requirements: toText(j?.requirements),
            benefits: toText(j?.benefits),
            posted_date: toText(j?.posted_date || j?.created_date),
            salary_min: toNum(salaryMin),
            salary_max: toNum(salaryMax),
          };
        });

        // Find employer IDs that need lookup
        const idsToLookup = Array.from(
          new Set(
            normalized
              .filter((j: any) => (!j.company_name || j.company_name.trim() === '') && j.company_id)
              .map((j: any) => String(j.company_id))
          )
        ).filter((id) => !(id in employerNameCache));

        if (idsToLookup.length > 0) {
          try {
            const results = await Promise.all(
              idsToLookup.map(async (id) => ({ id, name: await fetchEmployerName(id) }))
            );
            const update: Record<string, string> = { ...employerNameCache };
            for (const r of results) {
              if (r.name) update[r.id] = r.name;
            }
            setEmployerNameCache(update);
            const enriched = normalized.map((j: any) => ({
              ...j,
              company_name: j.company_name || (j.company_id ? update[String(j.company_id)] || '' : '')
            }));
            setJobs(enriched);
          } catch (_) {
            setJobs(normalized);
          }
        } else {
          // Use cache to fill any missing names
          const enriched = normalized.map((j: any) => ({
            ...j,
            company_name: j.company_name || (j.company_id ? employerNameCache[String(j.company_id)] || '' : '')
          }));
          setJobs(enriched);
        }
        setTotal(data.data.total || 0);
        setTotalPages(data.data.total_pages || 1);
        setCurrentPage(page);
        setIsSearching(false);
      } else {
        setError('Failed to fetch jobs.');
        setIsSearching(false);
      }
    } catch (err) {
      setError('Failed to fetch jobs.');
      setIsSearching(false);
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
    setShowSuggestions(false);
    
    // Save search to recent searches
    if (title.trim()) {
      saveRecentSearch(title.trim());
    }
    
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

  // Handle suggestion selection
  const handleSuggestionClick = (suggestion: string) => {
    setTitle(suggestion);
    setShowSuggestions(false);
    setCurrentPage(1);
    saveRecentSearch(suggestion);
    fetchJobs(suggestion, location, type, 1, sortBy);
    
    // Update active filters
    const filters = [];
    filters.push(`Title: ${suggestion}`);
    if (location) filters.push(`Location: ${location}`);
    if (type && type !== 'All Jobs') filters.push(`Type: ${type}`);
    setActiveFilters(filters);
  };

  // Handle input focus
  const handleInputFocus = () => {
    if (title.length >= 2) {
      setShowSuggestions(true);
    }
  };

  // Handle input blur with delay to allow suggestion clicks
  const handleInputBlur = () => {
    setTimeout(() => setShowSuggestions(false), 200);
  };

  // Handle keyboard navigation for suggestions
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    const allSuggestions = [...searchSuggestions, ...recentSearches.slice(0, 3)];
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => 
          prev < allSuggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedSuggestionIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedSuggestionIndex >= 0 && selectedSuggestionIndex < allSuggestions.length) {
          handleSuggestionClick(allSuggestions[selectedSuggestionIndex]);
        } else {
          handleSearch(e as any);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        setSelectedSuggestionIndex(-1);
        break;
    }
  };

  // Reset suggestion index when suggestions change
  useEffect(() => {
    setSelectedSuggestionIndex(-1);
  }, [searchSuggestions, recentSearches]);

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
                    onFocus={handleInputFocus}
                    onBlur={handleInputBlur}
                    onKeyDown={handleKeyDown}
                    autoComplete="off"
                  />
                  
                  {/* Search Suggestions Dropdown */}
                  {showSuggestions && (searchSuggestions.length > 0 || recentSearches.length > 0) && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-80 overflow-y-auto">
                      {searchSuggestions.length > 0 && (
                        <div className="p-2">
                          <div className="flex items-center px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            <TrendingUpIcon className="h-4 w-4 mr-2" />
                            Suggestions
                          </div>
                          {searchSuggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              type="button"
                              className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center ${
                                selectedSuggestionIndex === index
                                  ? 'bg-emerald-100 text-emerald-900'
                                  : 'hover:bg-emerald-50'
                              }`}
                              onClick={() => handleSuggestionClick(suggestion)}
                            >
                              <Search className="h-4 w-4 mr-3 text-gray-400" />
                              <span className="text-gray-900">{suggestion}</span>
                            </button>
                          ))}
                        </div>
                      )}
                      
                      {recentSearches.length > 0 && title.length < 2 && (
                        <div className="p-2 border-t border-gray-100">
                          <div className="flex items-center px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            <Clock className="h-4 w-4 mr-2" />
                            Recent Searches
                          </div>
                          {recentSearches.slice(0, 3).map((search, index) => {
                            const adjustedIndex = searchSuggestions.length + index;
                            return (
                              <button
                                key={index}
                                type="button"
                                className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center ${
                                  selectedSuggestionIndex === adjustedIndex
                                    ? 'bg-emerald-100 text-emerald-900'
                                    : 'hover:bg-emerald-50'
                                }`}
                                onClick={() => handleSuggestionClick(search)}
                              >
                                <Clock className="h-4 w-4 mr-3 text-gray-400" />
                                <span className="text-gray-900">{search}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}
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
                
                <Button 
                  type="submit" 
                  className="bg-gradient-to-r from-lime-500 to-yellow-500 hover:from-lime-600 hover:to-yellow-600 h-14 px-8 text-lg font-semibold shadow-lg hover:shadow-lime-200 transition-all duration-300 transform hover:scale-105 rounded-xl"
                  disabled={isSearching}
                >
                  {isSearching ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5 mr-2" />
                      Search Jobs
                    </>
                  )}
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
            <div className="text-center py-12">
              <div className="bg-gray-50 rounded-2xl p-8 max-w-md mx-auto">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No jobs found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your search criteria or filters</p>
                <Button 
                  onClick={clearFilters}
                  variant="outline"
                  className="border-emerald-300 text-emerald-600 hover:bg-emerald-50"
                >
                  Clear All Filters
                </Button>
              </div>
            </div>
          ) : (
            jobs.map((job: any) => (
              <div key={job.id} className="rounded-xl border border-gray-200 bg-white p-4 hover:shadow-lg transition-shadow duration-300">
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