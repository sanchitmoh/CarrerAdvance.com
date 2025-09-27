'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Briefcase, Search, Filter, Eye, Calendar, MapPin, Building, ExternalLink } from 'lucide-react'

interface Application {
  id: string
  jobTitle: string
  company: string
  location: string
  appliedDate: string
  status: 'applied' | 'reviewing' | 'interview' | 'rejected' | 'offer'
  jobDescription: string
  salary?: string
  jobType: 'full-time' | 'part-time' | 'contract' | 'internship'
  remote: boolean
}

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load applications on component mount
  useEffect(() => {
    const loadApplications = async () => {
      try {
        // Get jobseeker ID from localStorage (set after login)
        const jobseekerId = localStorage.getItem('jobseeker_id');
        
        if (!jobseekerId) {
          setError('No jobseeker ID found. Please login again.');
          setLoading(false);
          return;
        }

        const response = await fetch(`/api/seeker/profile/get_applications?jobseeker_id=${jobseekerId}`);
        const data = await response.json();
        
        if (data.success && data.data) {
          const formattedApplications = data.data.map((app: any) => ({
            id: app.id?.toString() || '',
            jobTitle: app.job_title || 'Untitled Position',
            company: app.company || 'Unknown Company',
            location: app.location || 'Location not specified',
            appliedDate: app.applied_at || new Date().toISOString(),
            status: app.status || 'applied',
            jobDescription: app.job_description || 'No description available',
            salary: app.salary || 'Salary not specified',
            jobType: app.job_type || 'full-time',
            remote: app.remote === 1
          }));
          setApplications(formattedApplications);
        }
      } catch (error) {
        console.error('Error loading applications:', error);
        setError('Failed to load applications. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadApplications();
  }, []);

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null)

  const statusColors = {
    applied: 'bg-blue-100 text-blue-700 border-blue-200',
    reviewing: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    interview: 'bg-purple-100 text-purple-700 border-purple-200',
    rejected: 'bg-red-100 text-red-700 border-red-200',
    offer: 'bg-green-100 text-green-700 border-green-200'
  }

  const statusLabels = {
    applied: 'Applied',
    reviewing: 'Under Review',
    interview: 'Interview',
    rejected: 'Rejected',
    offer: 'Offer Received'
  }

  const filteredApplications = applications.filter(app => {
    const matchesSearch = (app.jobTitle?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (app.company?.toLowerCase() || '').includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Date not available';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch (error) {
      return 'Invalid date';
    }
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white">
        <div className="flex items-center space-x-3">
          <Briefcase className="h-6 w-6 sm:h-8 sm:w-8" />
          <div>
            <h1 className="text-xl sm:text-2xl font-bold">My Applications</h1>
            <p className="text-sm sm:text-base text-emerald-100">Track your job applications and their status</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-emerald-200 shadow-lg">
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by job title or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-emerald-300 focus:border-emerald-500 text-sm sm:text-base"
                />
              </div>
            </div>
            <div className="w-full sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="border-emerald-300 focus:border-emerald-500 text-sm sm:text-base">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="applied">Applied</SelectItem>
                  <SelectItem value="reviewing">Under Review</SelectItem>
                  <SelectItem value="interview">Interview</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="offer">Offer Received</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="text-red-800 text-center">
              <p className="font-medium">{error}</p>
              <Button 
                variant="outline" 
                className="mt-2 border-red-300 text-red-700 hover:bg-red-100"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {loading && (
        <Card className="border-emerald-200 bg-emerald-50">
          <CardContent className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
            <p className="text-emerald-800 font-medium">Loading applications...</p>
          </CardContent>
        </Card>
      )}

      {/* Applications List */}
      <div className="space-y-3 sm:space-y-4">
        {!loading && filteredApplications.length > 0 ? (
          filteredApplications.map((application) => (
            <Card key={application.id} className="border-gray-200 hover:border-emerald-300 transition-colors shadow-lg">
              <CardContent className="p-4 sm:p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0">
                  <div className="flex-1">
                    <div className="flex items-start space-x-3 mb-3">
                      <Building className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="text-base sm:text-lg font-semibold text-gray-900 leading-tight">{application.jobTitle}</h3>
                        <p className="text-sm sm:text-base text-emerald-600 font-medium">{application.company}</p>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-2 sm:space-y-0 text-xs sm:text-sm text-gray-600 mb-3">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        <span className="break-words">{application.location}</span>
                        {application.remote && (
                          <Badge variant="outline" className="ml-2 border-blue-200 text-blue-700 text-xs flex-shrink-0">
                            Remote
                          </Badge>
                        )}
                      </div>
                      <span className="hidden sm:inline">•</span>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                        <span>Applied {formatDate(application.appliedDate)}</span>
                      </div>
                      {application.salary && (
                        <>
                          <span className="hidden sm:inline">•</span>
                          <span className="text-xs sm:text-sm">{application.salary}</span>
                        </>
                      )}
                    </div>

                    <p className="text-gray-700 text-xs sm:text-sm line-clamp-2 mb-3 leading-relaxed">
                      {application.jobDescription}
                    </p>

                    <div className="flex flex-wrap items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className={`${statusColors[application.status]} text-xs`}
                      >
                        {statusLabels[application.status]}
                      </Badge>
                      <Badge variant="outline" className="border-gray-200 text-gray-700 capitalize text-xs">
                        {application.jobType.replace('-', ' ')}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex justify-end lg:ml-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedApplication(application)}
                          className="border-emerald-200 text-emerald-600 hover:bg-emerald-50 text-xs sm:text-sm px-3 py-2"
                        >
                          <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                          <span className="hidden sm:inline">View Job</span>
                          <span className="sm:hidden">View</span>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col mx-2 sm:mx-4">
                        <DialogHeader className="flex-shrink-0">
                          <DialogTitle className="text-emerald-800 text-lg sm:text-xl">
                            {selectedApplication?.jobTitle}
                          </DialogTitle>
                          <DialogDescription className="text-emerald-600 text-sm sm:text-base">
                            {selectedApplication?.company} • {selectedApplication?.location}
                          </DialogDescription>
                        </DialogHeader>
                        {selectedApplication && (
                          <div className="flex-1 overflow-y-auto space-y-4 sm:space-y-6 pr-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge
                                variant="outline"
                                className={`${statusColors[selectedApplication.status]} text-xs`}
                              >
                                {statusLabels[selectedApplication.status]}
                              </Badge>
                              <Badge variant="outline" className="border-gray-200 text-gray-700 capitalize text-xs">
                                {selectedApplication.jobType.replace('-', ' ')}
                              </Badge>
                              {selectedApplication.remote && (
                                <Badge
                                  variant="outline"
                                  className="border-blue-200 text-blue-700 text-xs flex-shrink-0"
                                >
                                  Remote
                                </Badge>
                              )}
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                              <div>
                                <span className="font-medium text-gray-700">Applied Date:</span>
                                <p className="text-gray-600">{formatDate(selectedApplication.appliedDate)}</p>
                              </div>
                              {selectedApplication.salary && (
                                <div>
                                  <span className="font-medium text-gray-700">Salary:</span>
                                  <p className="text-gray-600">{selectedApplication.salary}</p>
                                </div>
                              )}
                            </div>

                            <div>
                              <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">Job Description</h4>
                              <p className="text-gray-700 leading-relaxed text-sm sm:text-base whitespace-pre-wrap">
                                {selectedApplication.jobDescription}
                              </p>
                            </div>

                            <div className="flex justify-end pt-4 border-t flex-shrink-0">
                              <Button
                                variant="outline"
                                className="border-emerald-200 text-emerald-600 hover:bg-emerald-50 bg-transparent text-sm px-4 py-2"
                              >
                                <ExternalLink className="h-4 w-4 mr-2" />
                                View Original Posting
                              </Button>
                            </div>
                          </div>
                        )}
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : !loading && (
          <Card className="border-2 border-dashed border-emerald-300 bg-emerald-50/50">
            <CardContent className="p-8 sm:p-12 text-center">
              <Briefcase className="h-12 w-12 sm:h-16 sm:w-16 text-emerald-400 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                {searchTerm || statusFilter !== 'all' ? 'No applications found' : 'No applications yet'}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-6">
                {searchTerm || statusFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria'
                  : 'Start applying to jobs to track your applications here'}
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <Button className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white text-sm sm:text-base px-4 py-2">
                  Browse Jobs
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Statistics */}
      {!loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {Object.entries(statusLabels).map(([status, label]) => {
            const count = applications.filter(app => app.status === status).length
            return (
              <Card key={status} className="border-emerald-200">
                <CardContent className="p-3 sm:p-4 text-center">
                  <div className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{count}</div>
                  <div className="text-xs sm:text-sm text-gray-600">{label}</div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
