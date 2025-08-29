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
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 rounded-2xl p-6 text-white">
        <div className="flex items-center space-x-3">
          <Briefcase className="h-8 w-8" />
          <div>
            <h1 className="text-2xl font-bold">My Applications</h1>
            <p className="text-emerald-100">Track your job applications and their status</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-emerald-200 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
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
            <div className="w-full md:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="border-emerald-300 focus:border-emerald-500">
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
      <div className="space-y-4">
        {!loading && filteredApplications.length > 0 ? (
          filteredApplications.map((application) => (
            <Card key={application.id} className="border-gray-200 hover:border-emerald-300 transition-colors shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <Building className="h-5 w-5 text-emerald-600" />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">{application.jobTitle}</h3>
                        <p className="text-emerald-600 font-medium">{application.company}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{application.location}</span>
                        {application.remote && (
                          <Badge variant="outline" className="ml-2 border-blue-200 text-blue-700">
                            Remote
                          </Badge>
                        )}
                      </div>
                      <span>•</span>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4" />
                        <span>Applied {formatDate(application.appliedDate)}</span>
                      </div>
                      {application.salary && (
                        <>
                          <span>•</span>
                          <span>{application.salary}</span>
                        </>
                      )}
                    </div>

                    <p className="text-gray-700 text-sm line-clamp-2 mb-3">
                      {application.jobDescription}
                    </p>

                    <div className="flex items-center space-x-3">
                      <Badge 
                        variant="outline" 
                        className={statusColors[application.status] || 'bg-gray-100 text-gray-700 border-gray-200'}
                      >
                        {statusLabels[application.status] || 'Unknown Status'}
                      </Badge>
                      <Badge variant="outline" className="border-gray-200 text-gray-700 capitalize">
                        {application.jobType ? application.jobType.replace('-', ' ') : 'Full-time'}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex space-x-2 ml-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedApplication(application)}
                          className="border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Job
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle className="text-emerald-800">
                            {selectedApplication?.jobTitle}
                          </DialogTitle>
                          <DialogDescription className="text-emerald-600">
                            {selectedApplication?.company} • {selectedApplication?.location}
                          </DialogDescription>
                        </DialogHeader>
                        {selectedApplication && (
                          <div className="space-y-6">
                            <div className="flex items-center space-x-4">
                              <Badge 
                                variant="outline" 
                                className={statusColors[selectedApplication.status] || 'bg-gray-100 text-gray-700 border-gray-200'}
                              >
                                {statusLabels[selectedApplication.status] || 'Unknown Status'}
                              </Badge>
                              <Badge variant="outline" className="border-gray-200 text-gray-700 capitalize">
                                {selectedApplication.jobType ? selectedApplication.jobType.replace('-', ' ') : 'Full-time'}
                              </Badge>
                              {selectedApplication.remote && (
                                <Badge variant="outline" className="border-blue-200 text-blue-700">
                                  Remote
                                </Badge>
                              )}
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
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
                              <h4 className="font-medium text-gray-900 mb-2">Job Description</h4>
                              <p className="text-gray-700 leading-relaxed">
                                {selectedApplication.jobDescription}
                              </p>
                            </div>

                            <div className="flex justify-end space-x-3">
                              <Button
                                variant="outline"
                                className="border-emerald-200 text-emerald-600 hover:bg-emerald-50"
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
            <CardContent className="p-12 text-center">
              <Briefcase className="h-16 w-16 text-emerald-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchTerm || statusFilter !== 'all' ? 'No applications found' : 'No applications yet'}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'Start applying to jobs to track your applications here'
                }
              </p>
              {!searchTerm && statusFilter === 'all' && (
                <Button className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white">
                  Browse Jobs
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Statistics */}
      {!loading && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {Object.entries(statusLabels).map(([status, label]) => {
            const count = applications.filter(app => app.status === status).length
            return (
              <Card key={status} className="border-emerald-200">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-1">{count}</div>
                  <div className="text-sm text-gray-600">{label}</div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
