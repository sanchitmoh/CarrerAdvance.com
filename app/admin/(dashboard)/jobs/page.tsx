"use client"

import { useState, useEffect } from "react"
import { getApiUrl, getBackendUrl } from "@/lib/api-config"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import BackButton from "@/components/back-button"
import Link from "next/link"
import {
  Search,
  Filter,
  MoreHorizontal,
  Briefcase,
  Users,
  DollarSign,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  Building,
  MapPin,
  Clock,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
} from "lucide-react"

interface Job {
  id: number
  title: string
  company: string
  location: string
  type: string
  salary: string
  status: "Active" | "Pending" | "Expired"
  applications: number
  datePosted: string
  description?: string
  requirements?: string[]
  benefits?: string[]
  contactEmail?: string
  contactPhone?: string
}

type IconType = React.ComponentType<{ className?: string }>

interface DashboardStat {
  title: string
  value: string
  icon: IconType
  color: string
  bgColor: string
}

// Helper function to validate and normalize job data
const normalizeJob = (job: any): Job => {
  return {
    id: Number(job.id) || Date.now(),
    title: job.title || "Untitled Job",
    company: job.company || "Unknown Company",
    location: job.location || "Remote",
    type: job.type || "Full-time",
    salary: job.salary || "$0 - $0",
    status: (job.status as "Active" | "Pending" | "Expired") || "Pending",
    applications: Number(job.applications) || 0,
    datePosted: job.datePosted || new Date().toISOString().split('T')[0],
    description: job.description || "",
    requirements: Array.isArray(job.requirements) ? job.requirements : [],
    benefits: Array.isArray(job.benefits) ? job.benefits : [],
    contactEmail: job.contactEmail || "",
    contactPhone: job.contactPhone || ""
  }
}

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("all")
  const [jobs, setJobs] = useState<Job[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalJobs, setTotalJobs] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const jobsPerPage = 10

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true)
      setError(null)
      
      try {
        const controller = new AbortController()
        const url = `${getBackendUrl()}/api/jobs/list?page=${currentPage}&limit=${jobsPerPage}`
        const response = await fetch(url, { 
          signal: controller.signal, 
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          }
        })
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        
        const json = await response.json()
        
        if (json.success && Array.isArray(json.data?.jobs)) {
          const mappedJobs = json.data.jobs.map((j: any) => {
            // Build location string from city_name and country_name
            const locationParts = []
            if (j.city_name) locationParts.push(j.city_name)
            if (j.country_name) locationParts.push(j.country_name)
            const location = locationParts.length > 0 ? locationParts.join(', ') : 'Remote'
            
            return normalizeJob({
          id: j.id,
          title: j.title ?? j.job_title,
          company: j.company ?? j.company_name,
              location: j.location ?? location,
          type: j.type ?? j.job_type ?? 'Full-time',
          salary: j.salary ?? '$0 - $0',
          status: j.status ?? 'Active',
              applications: j.applications ?? j.app_count ?? j.applied_count ?? j.total_applications ?? 0,
          datePosted: j.datePosted ?? j.created_at,
          description: j.description,
          requirements: j.requirements,
          benefits: j.benefits,
          contactEmail: j.contactEmail,
          contactPhone: j.contactPhone
            })
          })
          setJobs(mappedJobs)
          setTotalJobs(json.data?.total || mappedJobs.length)
          setTotalPages(json.data?.total_pages || Math.ceil(mappedJobs.length / jobsPerPage))
        } else {
          setJobs([])
          setTotalJobs(0)
          setTotalPages(0)
        }
      } catch (err) {
        console.error('Error fetching jobs:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch jobs')
        setJobs([])
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [currentPage])

  // Pagination calculations - now from backend metadata
  const indexOfLastJob = currentPage * jobsPerPage
  const indexOfFirstJob = indexOfLastJob - jobsPerPage + 1

  const activeJobs = jobs.filter((job) => job.status === "Active")
  const totalApplications = jobs.reduce((sum, job) => sum + job.applications, 0)
  const avgSalary =
    jobs.length > 0
      ? Math.round(
          jobs.reduce((sum, job) => {
            const salaryMatch = job.salary.match(/\$(\d+(?:,\d+)?)/g)
            if (salaryMatch) {
              const salaries = salaryMatch.map((s) => Number.parseInt(s.replace(/[$,]/g, "")))
              return sum + (salaries.length > 1 ? (salaries[0] + salaries[1]) / 2 : salaries[0])
            }
            return sum
          }, 0) / jobs.length,
        )
      : 0

  const stats: DashboardStat[] = [
    { title: "Total Jobs", value: jobs.length.toString(), icon: Briefcase, color: "text-blue-600", bgColor: "bg-blue-50" },
    { title: "Active Jobs", value: activeJobs.length.toString(), icon: TrendingUp, color: "text-green-600", bgColor: "bg-green-50" },
    { title: "Total Applications", value: totalApplications.toString(), icon: Users, color: "text-purple-600", bgColor: "bg-purple-50" },
    { title: "Avg. Salary", value: avgSalary > 0 ? `$${avgSalary.toLocaleString()}` : "$0", icon: DollarSign, color: "text-orange-600", bgColor: "bg-orange-50" },
  ]

  const filterTabs = [
    { id: "all", label: "All Jobs", count: jobs.length },
    { id: "active", label: "Active", count: activeJobs.length },
    { id: "pending", label: "Pending", count: jobs.filter((job) => job.status === "Pending").length },
    { id: "expired", label: "Expired", count: jobs.filter((job) => job.status === "Expired").length },
  ]

  // For backend pagination, we work directly with the fetched jobs
  const currentJobs = jobs

  // Reset to first page when search or filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, activeTab])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 border-green-200"
      case "Pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "Expired":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  // Pagination handlers
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber)
  }

  // Handle view job details
  const handleViewJob = (job: Job) => {
    setSelectedJob(job)
    setIsViewDialogOpen(true)
  }

  // Handle delete job
  const handleDeleteJob = async (jobId: number) => {
    if (!confirm(`Are you sure you want to delete this job?`)) {
      return
    }

    try {
      const response = await fetch(getApiUrl(`jobs/delete/${jobId}`), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      })

      const data = await response.json()

      if (data.success) {
        // Remove job from local state
    const updatedJobs = jobs.filter(job => job.id !== jobId)
    setJobs(updatedJobs)
        
        // Refresh the jobs list by refetching
        const fetchJobs = async () => {
          setLoading(true)
          setError(null)
          
          try {
            const controller = new AbortController()
            const url = `${getBackendUrl()}/api/jobs/list?page=${currentPage}&limit=${jobsPerPage}`
            const response = await fetch(url, { 
              signal: controller.signal, 
              credentials: 'include',
              headers: {
              'Content-Type': 'application/json',
              }
            })
            
            if (!response.ok) {
              throw new Error(`HTTP ${response.status}: ${response.statusText}`)
            }
            
            const json = await response.json()
            
            if (json.success && Array.isArray(json.data?.jobs)) {
              const mappedJobs = json.data.jobs.map((j: any) => {
                // Build location string from city_name and country_name
                const locationParts = []
                if (j.city_name) locationParts.push(j.city_name)
                if (j.country_name) locationParts.push(j.country_name)
                const location = locationParts.length > 0 ? locationParts.join(', ') : 'Remote'
                
                return normalizeJob({
                  id: j.id,
                  title: j.title ?? j.job_title,
                  company: j.company ?? j.company_name,
                  location: j.location ?? location,
                  type: j.type ?? j.job_type ?? 'Full-time',
                  salary: j.salary ?? '$0 - $0',
                  status: j.status ?? 'Active',
                  applications: j.applications ?? j.app_count ?? j.applied_count ?? j.total_applications ?? 0,
                  datePosted: j.datePosted ?? j.created_at,
                  description: j.description,
                  requirements: j.requirements,
                  benefits: j.benefits,
                  contactEmail: j.contactEmail,
                  contactPhone: j.contactPhone
                })
              })
              setJobs(mappedJobs)
              setTotalJobs(json.data?.total || mappedJobs.length)
              setTotalPages(json.data?.total_pages || Math.ceil(mappedJobs.length / jobsPerPage))
            } else {
              setJobs([])
              setTotalJobs(0)
              setTotalPages(0)
            }
          } catch (err) {
            console.error('Error fetching jobs:', err)
            setError(err instanceof Error ? err.message : 'Failed to fetch jobs')
            setJobs([])
          } finally {
            setLoading(false)
          }
        }

        fetchJobs()
      } else {
        alert(`Failed to delete job: ${data.message}`)
      }
    } catch (error) {
      console.error('Error deleting job:', error)
      alert('Error deleting job. Please try again.')
    }
  }

  // Safe access to arrays with fallbacks
  const getSafeRequirements = (job: Job | null) => {
    if (!job || !job.requirements) return []
    return Array.isArray(job.requirements) ? job.requirements : []
  }

  const getSafeBenefits = (job: Job | null) => {
    if (!job || !job.benefits) return []
    return Array.isArray(job.benefits) ? job.benefits : []
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-3 sm:px-4 md:px-6 lg:px-8 pt-3 sm:pt-4">
        <BackButton />
      </div>

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-3 sm:px-4 md:px-6 lg:px-8 py-3 sm:py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">Job Management</h1>
            <p className="text-sm sm:text-base text-gray-600">Manage job postings and applications</p>
          </div>
        </div>
      </div>

      <div className="p-3 sm:p-4 md:p-6 lg:p-8 space-y-4 sm:space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow border-0 shadow-sm">
              <CardContent className="p-3 sm:p-4 md:p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-xs sm:text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-2 sm:p-3 rounded-full ${stat.bgColor}`}>
                    <stat.icon className={`h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search & Filter */}
        <Card className="border-0 shadow-sm">
          <CardContent className="p-3 sm:p-4 md:p-6">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-3 w-3 sm:h-4 sm:w-4" />
                <Input
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 sm:pl-10 text-sm sm:text-base h-10 sm:h-11"
                />
              </div>
              <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                <SelectTrigger className="w-full sm:w-[160px] md:w-[180px] h-10 sm:h-11 text-sm sm:text-base">
                  <Filter className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Jobs</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-1 sm:gap-2 mb-4 sm:mb-6">
              {filterTabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "outline"}
                  onClick={() => setActiveTab(tab.id)}
                  className={`text-xs sm:text-sm px-2 sm:px-3 py-1 h-8 sm:h-9 ${
                    activeTab === tab.id
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                      : "text-gray-600 hover:text-gray-900 border-gray-300"
                  }`}
                >
                  {tab.label} 
                  <span className="ml-1 bg-white/20 px-1.5 py-0.5 rounded-full text-xs">
                    {tab.count}
                  </span>
                </Button>
              ))}
            </div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-8 sm:py-12">
                <div className="inline-block animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-emerald-600"></div>
                <p className="mt-2 text-sm sm:text-base text-gray-600">Loading jobs...</p>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-6 sm:py-8">
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4">
                  <p className="text-red-600 font-medium text-sm sm:text-base">Error loading jobs</p>
                  <p className="text-red-500 text-xs sm:text-sm mt-1">{error}</p>
                  <Button 
                    onClick={() => window.location.reload()} 
                    className="mt-2 bg-red-600 hover:bg-red-700 h-8 sm:h-9 text-xs sm:text-sm"
                  >
                    Retry
                  </Button>
                </div>
              </div>
            )}

            {/* Results count */}
            {!loading && !error && (
            <div className="mb-3 sm:mb-4">
              <p className="text-xs sm:text-sm text-gray-600">
                  Showing {indexOfFirstJob}-{Math.min(indexOfLastJob, totalJobs)} of {totalJobs} jobs
              </p>
            </div>
            )}

            {/* Jobs Table - visible on lg+ */}
            {!loading && !error && (
            <div className="hidden lg:block border border-gray-200 rounded-lg overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Job Title</th>
                    <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Company</th>
                    <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Location</th>
                    <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Type</th>
                    <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Salary</th>
                    <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                    <th className="px-3 sm:px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Applications</th>
                    <th className="px-3 sm:px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentJobs.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-8 text-gray-500 text-sm">
                        No jobs found
                      </td>
                    </tr>
                  ) : (
                    currentJobs.map((job) => (
                      <tr key={job.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-3 sm:px-4 py-3 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{job.title}</div>
                        </td>
                        <td className="px-3 sm:px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-600">{job.company}</div>
                        </td>
                        <td className="px-3 sm:px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-600">{job.location}</div>
                        </td>
                        <td className="px-3 sm:px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-600">{job.type}</div>
                        </td>
                        <td className="px-3 sm:px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-600">{job.salary}</div>
                        </td>
                        <td className="px-3 sm:px-4 py-3 whitespace-nowrap">
                          <Badge variant="outline" className={getStatusColor(job.status)}>
                            {job.status}
                          </Badge>
                        </td>
                        <td className="px-3 sm:px-4 py-3 whitespace-nowrap">
                          <div className="text-sm text-gray-600">{job.applications}</div>
                        </td>
                        <td className="px-3 sm:px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem onClick={() => handleViewJob(job)} className="text-sm">
                                <Eye className="h-4 w-4 mr-2" /> View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-red-600 text-sm"
                                onClick={() => handleDeleteJob(job.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" /> Delete Job
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            )}

            {/* Tablet cards (md to lg) */}
            {!loading && !error && (
            <div className="hidden md:block lg:hidden space-y-3">
              {currentJobs.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-sm">No jobs found</div>
              ) : (
                currentJobs.map((job) => (
                  <Card key={job.id} className="shadow-sm hover:shadow-md transition-shadow border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-bold text-gray-900 truncate">{job.title}</h3>
                          <div className="flex items-center gap-2 mt-1 flex-wrap">
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <Building className="h-3 w-3 flex-shrink-0" /> 
                              <span className="truncate">{job.company}</span>
                            </p>
                            <span className="text-gray-300">•</span>
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <MapPin className="h-3 w-3 flex-shrink-0" /> 
                              <span className="truncate">{job.location}</span>
                            </p>
                          </div>
                          
                          <div className="flex items-center gap-3 mt-2 flex-wrap">
                            <Badge variant="outline" className={getStatusColor(job.status)}>
                              {job.status}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {job.type}
                            </Badge>
                            <span className="text-sm font-medium text-gray-700">{job.salary}</span>
                          </div>
                          
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {job.applications} applications
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(job.datePosted)}
                            </span>
                          </div>
                        </div>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 flex-shrink-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem onClick={() => handleViewJob(job)} className="text-sm">
                              <Eye className="h-4 w-4 mr-2" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="text-red-600 text-sm"
                              onClick={() => handleDeleteJob(job.id)}
                            >
                              <Trash2 className="h-4 w-4 mr-2" /> Delete Job
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
            )}

            {/* Mobile cards (xs to md) */}
            {!loading && !error && (
            <div className="md:hidden space-y-3">
              {currentJobs.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-sm">No jobs found</div>
              ) : (
                currentJobs.map((job) => (
                  <Card key={job.id} className="shadow-sm hover:shadow-md transition-shadow border border-gray-200">
                    <CardContent className="p-3">
                      <div className="space-y-2">
                        <div className="flex justify-between items-start">
                          <h3 className="text-sm font-bold text-gray-900 leading-tight">{job.title}</h3>
                          <Badge variant="outline" className={getStatusColor(job.status)}>
                            {job.status}
                          </Badge>
                        </div>
                        
                        <div className="space-y-1">
                          <p className="text-xs text-gray-600 flex items-center gap-1">
                            <Building className="h-3 w-3 flex-shrink-0" />
                            {job.company}
                          </p>
                          <p className="text-xs text-gray-600 flex items-center gap-1">
                            <MapPin className="h-3 w-3 flex-shrink-0" />
                            {job.location}
                          </p>
                        </div>
                        
                        <div className="flex items-center justify-between pt-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="secondary" className="text-xs">
                              {job.type}
                            </Badge>
                            <span className="text-xs font-medium text-gray-700">{job.salary}</span>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <Users className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{job.applications}</span>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                          <p className="text-xs text-gray-500">
                            Posted {formatDate(job.datePosted)}
                          </p>
                          <div className="flex gap-1">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-7 px-2 text-xs"
                              onClick={() => handleViewJob(job)}
                            >
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-7 px-2 text-xs text-red-600 hover:text-red-700"
                              onClick={() => handleDeleteJob(job.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
            )}

            {/* Pagination */}
            {!loading && !error && totalPages > 1 && (
              <div className="flex flex-col xs:flex-row items-center justify-between gap-3 mt-4 sm:mt-6">
                <div className="text-xs sm:text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex items-center gap-1 sm:gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm flex items-center gap-1"
                  >
                    <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden xs:inline">Previous</span>
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNumber
                      if (totalPages <= 5) {
                        pageNumber = i + 1
                      } else if (currentPage <= 3) {
                        pageNumber = i + 1
                      } else if (currentPage >= totalPages - 2) {
                        pageNumber = totalPages - 4 + i
                      } else {
                        pageNumber = currentPage - 2 + i
                      }

                      return (
                        <Button
                          key={pageNumber}
                          variant={currentPage === pageNumber ? "default" : "outline"}
                          size="sm"
                          onClick={() => handlePageClick(pageNumber)}
                          className={`h-8 w-8 sm:h-9 sm:w-9 p-0 text-xs sm:text-sm ${
                            currentPage === pageNumber 
                              ? "bg-emerald-600 text-white" 
                              : "hover:bg-emerald-50 hover:text-emerald-700"
                          }`}
                        >
                          {pageNumber}
                        </Button>
                      )
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="h-8 sm:h-9 px-2 sm:px-3 text-xs sm:text-sm flex items-center gap-1"
                  >
                    <span className="hidden xs:inline">Next</span>
                    <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* View Job Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl w-[95vw] sm:w-[90vw] md:w-[85vw] max-h-[90vh] overflow-y-auto p-3 sm:p-4 md:p-6">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-lg sm:text-xl md:text-2xl">Job Details</DialogTitle>
            <DialogDescription className="text-sm sm:text-base">
              Complete information about the job posting
            </DialogDescription>
          </DialogHeader>
          
          {selectedJob && (
            <div className="space-y-4 sm:space-y-6">
              {/* Header Section */}
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4 md:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4">
                  <div className="flex-1 space-y-2">
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900">{selectedJob.title}</h3>
                    <p className="text-sm sm:text-base text-gray-600">at {selectedJob.company}</p>
                    
                    <div className="flex flex-wrap gap-1 sm:gap-2 mt-2">
                      <Badge variant="outline" className={getStatusColor(selectedJob.status)}>
                        {selectedJob.status}
                      </Badge>
                      <Badge variant="secondary" className="text-xs sm:text-sm">
                        {selectedJob.type}
                      </Badge>
                      <span className="text-sm font-medium text-gray-700">{selectedJob.salary}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-1 sm:gap-2">
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                      <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>{selectedJob.applications} applications</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span>Posted {formatDate(selectedJob.datePosted)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                <div className="space-y-1 sm:space-y-2">
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base flex items-center gap-2">
                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                    Location
                  </h4>
                  <p className="text-gray-600 text-sm sm:text-base">{selectedJob.location}</p>
                </div>
                
                <div className="space-y-1 sm:space-y-2">
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base flex items-center gap-2">
                    <Building className="h-3 w-3 sm:h-4 sm:w-4" />
                    Company
                  </h4>
                  <p className="text-gray-600 text-sm sm:text-base">{selectedJob.company}</p>
                </div>
              </div>

              {/* Job Description */}
              {selectedJob.description && (
                <div className="space-y-2 sm:space-y-3">
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Job Description</h4>
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{selectedJob.description}</p>
                </div>
              )}

              {/* Requirements - Using safe access */}
              {getSafeRequirements(selectedJob).length > 0 && (
                <div className="space-y-2 sm:space-y-3">
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Requirements</h4>
                  <ul className="space-y-1 sm:space-y-2">
                    {getSafeRequirements(selectedJob).map((req, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-600 text-sm sm:text-base">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-1.5 sm:mt-2 flex-shrink-0" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Benefits - Using safe access */}
              {getSafeBenefits(selectedJob).length > 0 && (
                <div className="space-y-2 sm:space-y-3">
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Benefits</h4>
                  <ul className="space-y-1 sm:space-y-2">
                    {getSafeBenefits(selectedJob).map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-600 text-sm sm:text-base">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 sm:mt-2 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Contact Information */}
              {(selectedJob.contactEmail || selectedJob.contactPhone) && (
                <div className="space-y-2 sm:space-y-3">
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Contact Information</h4>
                  <div className="space-y-1 sm:space-y-2">
                    {selectedJob.contactEmail && (
                      <div className="flex items-center gap-2 text-gray-600 text-sm sm:text-base">
                        <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="font-medium">Email:</span>
                        <a href={`mailto:${selectedJob.contactEmail}`} className="text-emerald-600 hover:underline break-all">
                          {selectedJob.contactEmail}
                        </a>
                      </div>
                    )}
                    {selectedJob.contactPhone && (
                      <div className="flex items-center gap-2 text-gray-600 text-sm sm:text-base">
                        <Phone className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="font-medium">Phone:</span>
                        <a href={`tel:${selectedJob.contactPhone}`} className="text-emerald-600 hover:underline">
                          {selectedJob.contactPhone}
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4">
                <Button 
                  onClick={() => setIsViewDialogOpen(false)} 
                  variant="outline" 
                  className="flex-1 text-sm sm:text-base h-10 sm:h-11"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}