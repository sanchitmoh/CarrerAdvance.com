"use client"

import { useState, useEffect } from "react"
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
  Plus,
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
    contactEmail: job.contactEmail || ""
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
  const jobsPerPage = 10

  useEffect(() => {
    // Sample data with guaranteed array structure
    const sampleJobs: Job[] = [
      {
        id: 1,
        title: "Frontend Developer",
        company: "Tech Corp",
        location: "San Francisco, CA",
        type: "Full-time",
        salary: "$90,000 - $120,000",
        status: "Active",
        applications: 24,
        datePosted: "2024-01-15",
        description: "We are looking for a skilled Frontend Developer to join our team. You will be responsible for building user interfaces and implementing design systems.",
        requirements: ["React", "TypeScript", "CSS", "5+ years experience"],
        benefits: ["Health insurance", "Remote work", "Flexible hours"],
        contactEmail: "careers@techcorp.com"
      },
      {
        id: 2,
        title: "Backend Engineer",
        company: "Data Systems",
        location: "New York, NY",
        type: "Full-time",
        salary: "$110,000 - $140,000",
        status: "Pending",
        applications: 18,
        datePosted: "2024-01-20",
        description: "Join our backend team to build scalable systems and APIs.",
        requirements: ["Node.js", "Python", "SQL", "AWS"],
        benefits: ["Stock options", "Unlimited PTO", "Learning budget"],
        contactEmail: "hiring@datasystems.com"
      },
      {
        id: 3,
        title: "UX Designer",
        company: "Creative Labs",
        location: "Remote",
        type: "Contract",
        salary: "$75,000 - $95,000",
        status: "Active",
        applications: 32,
        datePosted: "2024-01-10",
        description: "Design amazing user experiences for our products and conduct user research.",
        requirements: ["Figma", "User Research", "Prototyping"],
        benefits: ["Remote first", "Creative freedom", "Team retreats"],
        contactEmail: "design@creativelabs.com"
      },
      {
        id: 4,
        title: "Data Scientist",
        company: "AI Innovations",
        location: "Boston, MA",
        type: "Full-time",
        salary: "$100,000 - $130,000",
        status: "Expired",
        applications: 45,
        datePosted: "2023-12-01",
        description: "Work with large datasets to drive business insights and build machine learning models.",
        requirements: ["Python", "Machine Learning", "SQL", "Statistics"],
        benefits: ["Research budget", "Conference attendance", "Flexible schedule"],
        contactEmail: "jobs@aiinnovations.com"
      },
      {
        id: 5,
        title: "DevOps Engineer",
        company: "Cloud Systems",
        location: "Austin, TX",
        type: "Full-time",
        salary: "$95,000 - $125,000",
        status: "Active",
        applications: 15,
        datePosted: "2024-01-18",
        description: "Manage and optimize our cloud infrastructure and CI/CD pipelines.",
        requirements: ["Docker", "Kubernetes", "AWS", "CI/CD"],
        benefits: ["Remote work", "Equipment budget", "Health benefits"],
        contactEmail: "ops@cloudsystems.com"
      },
      {
        id: 6,
        title: "Product Manager",
        company: "Product Pro",
        location: "Chicago, IL",
        type: "Full-time",
        salary: "$85,000 - $115,000",
        status: "Pending",
        applications: 28,
        datePosted: "2024-01-22",
        description: "Lead product development from concept to launch and work with cross-functional teams.",
        requirements: ["Product Strategy", "Agile", "User Stories", "Analytics"],
        benefits: ["Bonus structure", "Professional development", "Health insurance"],
        contactEmail: "pm@productpro.com"
      },
      {
        id: 7,
        title: "Mobile Developer",
        company: "App Masters",
        location: "Remote",
        type: "Contract",
        salary: "$80,000 - $110,000",
        status: "Active",
        applications: 22,
        datePosted: "2024-01-14",
        description: "Build amazing mobile experiences for iOS and Android platforms.",
        requirements: ["React Native", "Swift", "Kotlin", "REST APIs"],
        benefits: ["Remote work", "Flexible hours", "App store credits"],
        contactEmail: "dev@appmasters.com"
      },
      {
        id: 8,
        title: "QA Engineer",
        company: "Quality First",
        location: "Denver, CO",
        type: "Full-time",
        salary: "$70,000 - $90,000",
        status: "Active",
        applications: 19,
        datePosted: "2024-01-16",
        description: "Ensure the quality of our software products through manual and automated testing.",
        requirements: ["Testing", "Automation", "Selenium", "JIRA"],
        benefits: ["Health insurance", "Paid time off", "Training budget"],
        contactEmail: "qa@qualityfirst.com"
      },
      {
        id: 9,
        title: "System Administrator",
        company: "IT Solutions",
        location: "Miami, FL",
        type: "Full-time",
        salary: "$65,000 - $85,000",
        status: "Expired",
        applications: 12,
        datePosted: "2023-12-15",
        description: "Maintain and optimize our IT infrastructure and ensure system security.",
        requirements: ["Windows Server", "Linux", "Networking", "Security"],
        benefits: ["On-call bonus", "Certification support", "Health benefits"],
        contactEmail: "it@itsolutions.com"
      },
      {
        id: 10,
        title: "Marketing Specialist",
        company: "Growth Hackers",
        location: "Seattle, WA",
        type: "Full-time",
        salary: "$60,000 - $80,000",
        status: "Active",
        applications: 35,
        datePosted: "2024-01-12",
        description: "Drive marketing campaigns and user acquisition through digital channels.",
        requirements: ["Digital Marketing", "SEO", "Social Media", "Analytics"],
        benefits: ["Performance bonus", "Remote options", "Conference budget"],
        contactEmail: "marketing@growthhackers.com"
      },
      {
        id: 11,
        title: "Senior Software Engineer",
        company: "Enterprise Tech",
        location: "Remote",
        type: "Full-time",
        salary: "$120,000 - $150,000",
        status: "Pending",
        applications: 26,
        datePosted: "2024-01-24",
        description: "Lead technical projects and mentor junior developers in our growing team.",
        requirements: ["Java", "Spring Boot", "Microservices", "8+ years experience"],
        benefits: ["Stock options", "Unlimited PTO", "Home office budget"],
        contactEmail: "senior@enterprisetech.com"
      },
      {
        id: 12,
        title: "Content Writer",
        company: "Content Creators",
        location: "Portland, OR",
        type: "Part-time",
        salary: "$45,000 - $60,000",
        status: "Active",
        applications: 41,
        datePosted: "2024-01-19",
        description: "Create engaging content for our digital platforms and marketing materials.",
        requirements: ["Writing", "SEO", "Content Strategy", "Blogging"],
        benefits: ["Flexible schedule", "Remote work", "Creative control"],
        contactEmail: "content@contentcreators.com"
      }
    ]

    try {
      const savedJobs = JSON.parse(localStorage.getItem("adminJobs") || "[]")
      // Normalize all jobs to ensure proper structure
      const validatedJobs = savedJobs.length > 0 
        ? savedJobs.map(normalizeJob)
        : sampleJobs
      
      setJobs(validatedJobs)
    } catch (error) {
      console.error("Error loading jobs:", error)
      setJobs(sampleJobs)
    }
  }, [])

  // Pagination calculations
  const totalPages = Math.ceil(jobs.length / jobsPerPage)
  const indexOfLastJob = currentPage * jobsPerPage
  const indexOfFirstJob = indexOfLastJob - jobsPerPage

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

  const stats = [
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

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTab = activeTab === "all" || job.status.toLowerCase() === activeTab
    return matchesSearch && matchesTab
  })

  // Get current jobs for pagination
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob)

  // Reset to first page when search or filter changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, activeTab])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Expired":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
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
  const handleDeleteJob = (jobId: number) => {
    const updatedJobs = jobs.filter(job => job.id !== jobId)
    setJobs(updatedJobs)
    localStorage.setItem("adminJobs", JSON.stringify(updatedJobs))
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-4 sm:px-6 md:px-8 pt-4">
        <BackButton />
      </div>

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-4 sm:px-6 md:px-8 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Job Management</h1>
            <p className="text-gray-600">Manage job postings and applications</p>
          </div>
          <Link href="/admin/jobs/add" className="self-stretch sm:self-auto">
            <Button className="bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto flex items-center justify-center">
              <Plus className="h-4 w-4 mr-2" /> Add Job
            </Button>
          </Link>
        </div>
      </div>

      <div className="p-4 sm:p-6 md:p-8 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4 sm:p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <stat.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Search & Filter */}
        <Card>
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row gap-3 mb-4 sm:mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedFilter} onValueChange={setSelectedFilter} className="w-full sm:w-[180px]">
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
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
            <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
              {filterTabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "outline"}
                  onClick={() => setActiveTab(tab.id)}
                  className={`${
                    activeTab === tab.id
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  {tab.label} ({tab.count})
                </Button>
              ))}
            </div>

            {/* Results count */}
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                Showing {indexOfFirstJob + 1}-{Math.min(indexOfLastJob, filteredJobs.length)} of {filteredJobs.length} jobs
              </p>
            </div>

            {/* Jobs Table - visible on md+ */}
            <div className="hidden md:block border rounded-lg overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Job Title</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Company</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Location</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Salary</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Applications</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentJobs.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-12 text-gray-500">
                        No jobs found
                      </td>
                    </tr>
                  ) : (
                    currentJobs.map((job) => (
                      <tr key={job.id} className="hover:bg-gray-50 border-b">
                        <td className="px-4 py-3 font-medium text-gray-900">{job.title}</td>
                        <td className="px-4 py-3 text-gray-600">{job.company}</td>
                        <td className="px-4 py-3 text-gray-600">{job.location}</td>
                        <td className="px-4 py-3 text-gray-600">{job.type}</td>
                        <td className="px-4 py-3 text-gray-600">{job.salary}</td>
                        <td className="px-4 py-3">
                          <Badge className={getStatusColor(job.status)}>{job.status}</Badge>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{job.applications}</td>
                        <td className="px-4 py-3 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewJob(job)}>
                                <Eye className="h-4 w-4 mr-2" /> View
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/admin/jobs/edit/${job.id}`}>
                                  <Edit className="h-4 w-4 mr-2" /> Edit
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => handleDeleteJob(job.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" /> Delete
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

            {/* Mobile / tablet cards */}
            <div className="md:hidden space-y-4">
              {currentJobs.length === 0 ? (
                <div className="text-center py-8 text-gray-500">No jobs found</div>
              ) : (
                currentJobs.map((job) => (
                  <Card key={job.id} className="shadow-sm hover:shadow-md">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900">{job.title}</h3>
                          <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                            <Building className="h-3 w-3" /> {job.company}
                          </p>
                          <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                            <MapPin className="h-3 w-3" /> {job.location}
                          </p>
                          <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                            <Calendar className="h-3 w-3" /> Posted {job.datePosted}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge className={getStatusColor(job.status)}>{job.status}</Badge>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewJob(job)}>
                                <Eye className="h-4 w-4 mr-2" /> View
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/admin/jobs/edit/${job.id}`}>
                                  <Edit className="h-4 w-4 mr-2" /> Edit
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={() => handleDeleteJob(job.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" /> Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        <Badge variant="outline">{job.type}</Badge>
                        <span className="text-sm font-medium text-gray-700">{job.salary}</span>
                        <span className="flex items-center gap-1 text-sm text-gray-600">
                          <Users className="h-3 w-3" /> {job.applications} applications
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
                <div className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevPage}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageClick(page)}
                        className={`h-8 w-8 p-0 ${
                          currentPage === page 
                            ? "bg-emerald-600 text-white" 
                            : "hover:bg-emerald-50 hover:text-emerald-700"
                        }`}
                      >
                        {page}
                      </Button>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* View Job Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-4xl w-[95vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-xl sm:text-2xl">Job Details</DialogTitle>
            <DialogDescription>
              Complete information about the job posting
            </DialogDescription>
          </DialogHeader>
          
          {selectedJob && (
            <div className="space-y-6">
              {/* Header Section */}
              <div className="bg-gray-50 rounded-lg p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900">{selectedJob.title}</h3>
                    <p className="text-sm sm:text-base text-gray-600 mt-1">at {selectedJob.company}</p>
                    
                    <div className="flex flex-wrap gap-2 mt-3">
                      <Badge className={getStatusColor(selectedJob.status)}>
                        {selectedJob.status}
                      </Badge>
                      <Badge variant="outline">{selectedJob.type}</Badge>
                      <span className="text-sm font-medium text-gray-700">{selectedJob.salary}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="h-4 w-4" />
                      <span>{selectedJob.applications} applications</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>Posted {selectedJob.datePosted}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Location
                  </h4>
                  <p className="text-gray-600">{selectedJob.location}</p>
                </div>
                
                <div className="space-y-2">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Building className="h-4 w-4" />
                    Company
                  </h4>
                  <p className="text-gray-600">{selectedJob.company}</p>
                </div>
              </div>

              {/* Job Description */}
              {selectedJob.description && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Job Description</h4>
                  <p className="text-gray-600 leading-relaxed">{selectedJob.description}</p>
                </div>
              )}

              {/* Requirements - Using safe access */}
              {getSafeRequirements(selectedJob).length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Requirements</h4>
                  <ul className="space-y-2">
                    {getSafeRequirements(selectedJob).map((req, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-600">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Benefits - Using safe access */}
              {getSafeBenefits(selectedJob).length > 0 && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Benefits</h4>
                  <ul className="space-y-2">
                    {getSafeBenefits(selectedJob).map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-600">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Contact Information */}
              {selectedJob.contactEmail && (
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-900">Contact Information</h4>
                  <div className="flex items-center gap-2 text-gray-600">
                    <span className="font-medium">Email:</span>
                    <a href={`mailto:${selectedJob.contactEmail}`} className="text-emerald-600 hover:underline">
                      {selectedJob.contactEmail}
                    </a>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button 
                  onClick={() => setIsViewDialogOpen(false)} 
                  variant="outline" 
                  className="flex-1"
                >
                  Close
                </Button>
                <Button asChild className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                  <Link href={`/admin/jobs/edit/${selectedJob.id}`}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Job
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}