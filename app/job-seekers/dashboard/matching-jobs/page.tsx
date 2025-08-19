'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Target, Search, Filter, MapPin, Building, Calendar, DollarSign, Heart, ExternalLink, Briefcase } from 'lucide-react'

interface Job {
  id: string
  title: string
  company: string
  location: string
  salary: string
  jobType: 'full-time' | 'part-time' | 'contract' | 'internship'
  remote: boolean
  postedDate: string
  description: string
  requirements: string[]
  matchScore: number
  industry: string
  experienceLevel: string
}

export default function MatchingJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)

  // Load matching jobs on component mount
  useEffect(() => {
    const loadMatchingJobs = async () => {
      try {
        // Get jobseeker ID from localStorage (set after login)
        const jobseekerId = localStorage.getItem('jobseeker_id');
        
        if (!jobseekerId) {
          console.error('No jobseeker ID found. Please login again.');
          setLoading(false);
          return;
        }

        const response = await fetch(`/api/seeker/profile/get_matching_jobs?jobseeker_id=${jobseekerId}`);
        const data = await response.json();
        
        if (data.success && data.data) {
          const formattedJobs = data.data.map((job: any) => ({
            id: job.id.toString(),
            title: job.title,
            company: job.company,
            location: job.location,
            salary: job.salary,
            jobType: job.job_type,
            remote: job.remote === 1,
            postedDate: job.created_at,
            description: job.description,
            requirements: job.requirements ? JSON.parse(job.requirements) : [],
            matchScore: job.match_score || 75,
            industry: job.industry || 'Technology',
            experienceLevel: job.experience_level || 'Mid-Level'
          }));
          setJobs(formattedJobs);
        }
      } catch (error) {
        console.error('Error loading matching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMatchingJobs();
  }, []);

  const [searchTerm, setSearchTerm] = useState('')
  const [locationFilter, setLocationFilter] = useState('all')
  const [industryFilter, setIndustryFilter] = useState('all')
  const [experienceFilter, setExperienceFilter] = useState('all')
  const [remoteOnly, setRemoteOnly] = useState(false)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)

  const locations = ['all', 'New York, NY', 'San Francisco, CA', 'Los Angeles, CA', 'Austin, TX', 'Seattle, WA']
  const industries = ['all', 'Technology', 'Design', 'Finance', 'Healthcare', 'Marketing']
  const experienceLevels = ['all', 'Entry-Level', 'Mid-Level', 'Senior', 'Executive']

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLocation = locationFilter === 'all' || job.location === locationFilter
    const matchesIndustry = industryFilter === 'all' || job.industry === industryFilter
    const matchesExperience = experienceFilter === 'all' || job.experienceLevel === experienceFilter
    const matchesRemote = !remoteOnly || job.remote
    
    return matchesSearch && matchesLocation && matchesIndustry && matchesExperience && matchesRemote
  }).sort((a, b) => b.matchScore - a.matchScore)

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100 border-green-200'
    if (score >= 80) return 'text-emerald-600 bg-emerald-100 border-emerald-200'
    if (score >= 70) return 'text-yellow-600 bg-yellow-100 border-yellow-200'
    return 'text-orange-600 bg-orange-100 border-orange-200'
  }

  const handleApply = async (jobId: string) => {
    try {
      const jobseekerId = localStorage.getItem('jobseeker_id');
      
      if (!jobseekerId) {
        console.error('No jobseeker ID found. Please login again.');
        return;
      }

      const response = await fetch('/api/seeker/profile/apply_job', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jobseeker_id: jobseekerId,
          job_id: jobId
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        // You can add a toast notification here
        console.log('Application submitted successfully');
      } else {
        console.error('Failed to apply:', data.message);
      }
    } catch (error) {
      console.error('Error applying to job:', error);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 rounded-2xl p-6 text-white">
        <div className="flex items-center space-x-3">
          <Target className="h-8 w-8" />
          <div>
            <h1 className="text-2xl font-bold">Matching Jobs</h1>
            <p className="text-emerald-100">Jobs tailored to your profile and preferences</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-emerald-200 shadow-lg">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by job title or company..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 border-emerald-300 focus:border-emerald-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Select value={locationFilter} onValueChange={setLocationFilter}>
                  <SelectTrigger className="border-emerald-300 focus:border-emerald-500">
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => (
                      <SelectItem key={location} value={location}>
                        {location === 'all' ? 'All Locations' : location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={industryFilter} onValueChange={setIndustryFilter}>
                  <SelectTrigger className="border-emerald-300 focus:border-emerald-500">
                    <SelectValue placeholder="Industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry === 'all' ? 'All Industries' : industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={experienceFilter} onValueChange={setExperienceFilter}>
                  <SelectTrigger className="border-emerald-300 focus:border-emerald-500">
                    <SelectValue placeholder="Experience" />
                  </SelectTrigger>
                  <SelectContent>
                    {experienceLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level === 'all' ? 'All Levels' : level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remote"
                    checked={remoteOnly}
                    onCheckedChange={checked => setRemoteOnly(checked === true)}
                  />
                  <label htmlFor="remote" className="text-sm font-medium text-gray-700">
                    Remote Only
                  </label>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Jobs List */}
      <div className="space-y-4">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <Card key={job.id} className="border-gray-200 hover:border-emerald-300 transition-colors shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <Building className="h-5 w-5 text-emerald-600" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                        <p className="text-emerald-600 font-medium">{job.company}</p>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={getMatchScoreColor(job.matchScore)}
                      >
                        {job.matchScore}% Match
                      </Badge>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{job.location}</span>
                        {job.remote && (
                          <Badge variant="outline" className="ml-2 border-blue-200 text-blue-700">
                            Remote
                          </Badge>
                        )}
                      </div>
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-4 w-4" />
                        <span>{job.salary}</span>
                      </div>
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Posted {formatDate(job.postedDate)}</span>
                      </div>
                    </div>

                    <p className="text-gray-700 text-sm line-clamp-2 mb-3">
                      {job.description}
                    </p>

                    <div className="flex items-center space-x-3 mb-3">
                      <Badge variant="outline" className="border-gray-200 text-gray-700 capitalize">
                        {job.jobType.replace('-', ' ')}
                      </Badge>
                      <Badge variant="outline" className="border-gray-200 text-gray-700">
                        {job.industry}
                      </Badge>
                      <Badge variant="outline" className="border-gray-200 text-gray-700">
                        {job.experienceLevel}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {job.requirements.slice(0, 4).map((req, index) => (
                        <Badge key={index} variant="secondary" className="bg-emerald-100 text-emerald-700 text-xs">
                          {req}
                        </Badge>
                      ))}
                      {job.requirements.length > 4 && (
                        <Badge variant="secondary" className="bg-gray-100 text-gray-700 text-xs">
                          +{job.requirements.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2 ml-4">
                    <Button
                      onClick={() => handleApply(job.id)}
                      className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white"
                    >
                      Apply Now
                    </Button>
                    
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-200 text-gray-600 hover:bg-gray-50"
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                      
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedJob(job)}
                            className="border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                          >
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="text-emerald-800">
                              {selectedJob?.title}
                            </DialogTitle>
                            <DialogDescription className="text-emerald-600">
                              {selectedJob?.company} • {selectedJob?.location}
                            </DialogDescription>
                          </DialogHeader>
                          {selectedJob && (
                            <div className="space-y-6">
                              <div className="flex items-center space-x-4">
                                <Badge 
                                  variant="outline" 
                                  className={getMatchScoreColor(selectedJob.matchScore)}
                                >
                                  {selectedJob.matchScore}% Match
                                </Badge>
                                <Badge variant="outline" className="border-gray-200 text-gray-700 capitalize">
                                  {selectedJob.jobType.replace('-', ' ')}
                                </Badge>
                                {selectedJob.remote && (
                                  <Badge variant="outline" className="border-blue-200 text-blue-700">
                                    Remote
                                  </Badge>
                                )}
                              </div>

                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="font-medium text-gray-700">Salary:</span>
                                  <p className="text-gray-600">{selectedJob.salary}</p>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-700">Posted:</span>
                                  <p className="text-gray-600">{formatDate(selectedJob.postedDate)}</p>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-700">Industry:</span>
                                  <p className="text-gray-600">{selectedJob.industry}</p>
                                </div>
                                <div>
                                  <span className="font-medium text-gray-700">Experience Level:</span>
                                  <p className="text-gray-600">{selectedJob.experienceLevel}</p>
                                </div>
                              </div>

                              <div>
                                <h4 className="font-medium text-gray-900 mb-2">Job Description</h4>
                                <p className="text-gray-700 leading-relaxed">
                                  {selectedJob.description}
                                </p>
                              </div>

                              <div>
                                <h4 className="font-medium text-gray-900 mb-2">Requirements</h4>
                                <div className="flex flex-wrap gap-2">
                                  {selectedJob.requirements.map((req, index) => (
                                    <Badge key={index} variant="outline" className="border-emerald-200 text-emerald-700">
                                      {req}
                                    </Badge>
                                  ))}
                                </div>
                              </div>

                              <div className="flex justify-between">
                                <Button
                                  variant="outline"
                                  className="border-gray-200 text-gray-600 hover:bg-gray-50"
                                >
                                  <Heart className="h-4 w-4 mr-2" />
                                  Save Job
                                </Button>
                                <div className="flex space-x-3">
                                  <Button
                                    variant="outline"
                                    className="border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                                  >
                                    <ExternalLink className="h-4 w-4 mr-2" />
                                    View Original
                                  </Button>
                                  <Button
                                    onClick={() => handleApply(selectedJob.id)}
                                    className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white"
                                  >
                                    Apply Now
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="border-2 border-dashed border-emerald-300 bg-emerald-50/50">
            <CardContent className="p-12 text-center">
              <Target className="h-16 w-16 text-emerald-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No matching jobs found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search criteria or update your profile to get better matches
              </p>
              <Button className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white">
                Update Profile
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Match Statistics */}
      <Card className="border-emerald-200 shadow-lg">
        <CardHeader>
          <CardTitle className="text-emerald-800">Match Statistics</CardTitle>
          <CardDescription className="text-emerald-600">
            Your profile compatibility with available jobs
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {jobs.filter(job => job.matchScore >= 90).length}
              </div>
              <div className="text-sm text-gray-600">Excellent Match (90%+)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-600 mb-1">
                {jobs.filter(job => job.matchScore >= 80 && job.matchScore < 90).length}
              </div>
              <div className="text-sm text-gray-600">Good Match (80-89%)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-600 mb-1">
                {jobs.filter(job => job.matchScore >= 70 && job.matchScore < 80).length}
              </div>
              <div className="text-sm text-gray-600">Fair Match (70-79%)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600 mb-1">
                {jobs.filter(job => job.matchScore < 70).length}
              </div>
              <div className="text-sm text-gray-600">Low Match ({'<'}70%)</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
