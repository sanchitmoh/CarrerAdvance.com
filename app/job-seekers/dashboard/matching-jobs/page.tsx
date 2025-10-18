"use client"

import { useEffect, useRef, useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Target,
  Search,
  MapPin,
  Building,
  Calendar,
  DollarSign,
  Heart,
  ExternalLink,
} from "lucide-react"

interface MatchBreakdown {
  skills?: { score?: number; matched_skills?: string[]; missing_skills?: string[] }
  experience?: { score?: number; match_type?: string }
  location?: { score?: number; match_type?: string }
  salary?: { score?: number; match_type?: string }
  job_type?: { score?: number; match_type?: string }
  industry?: { score?: number; match_type?: string }
}

interface Job {
  id: string
  title: string
  company: string
  location: string
  salary: string
  jobType: string
  remote: boolean
  postedDate: string
  description: string
  requirements: string[]
  matchScore: number
  industry: string
  experienceLevel: string
  matchBreakdown?: MatchBreakdown | null
  matchedSkills?: string[]
  missingSkills?: string[]
  url?: string
}

export default function MatchingJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)

  // Filters + UI state
  const [searchTerm, setSearchTerm] = useState("")
  const [locationFilter, setLocationFilter] = useState("all")
  const [industryFilter, setIndustryFilter] = useState("all")
  const [experienceFilter, setExperienceFilter] = useState("all")
  

  // Debounced search term
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 700) // 700ms delay to reduce rapid calls

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [locationFilter, industryFilter, experienceFilter, debouncedSearchTerm])

  // Details dialog
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  // Saved jobs persisted in localStorage
  const [savedJobs, setSavedJobs] = useState<string[]>([])

  // Load saved jobs from localStorage once
  useEffect(() => {
    try {
      const raw = localStorage.getItem("saved_jobs")
      if (raw) setSavedJobs(JSON.parse(raw))
    } catch {
      setSavedJobs([])
    }
  }, [])

  // Persist savedJobs to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("saved_jobs", JSON.stringify(savedJobs))
    } catch {
      // ignore
    }
  }, [savedJobs])

  // Track last effective query to avoid redundant fetches
  const lastQueryRef = useRef<string>("")

  // Fetch jobs from backend on mount and when certain filters change
  useEffect(() => {
    let isMounted = true
    const controller = new AbortController()

    const loadMatchingJobs = async () => {
      try {
        // get jobseeker id from localStorage (same behavior as your original)
        const jobseekerId = localStorage.getItem("jobseeker_id")

        if (!jobseekerId) {
          // preserve original behavior: show a friendly error so user re-login
          if (!isMounted) return
          setJobs([])
          setError("No jobseeker ID found. Please login again.")
          setLoading(false)
          return
        }

        // Build a stable query key to avoid duplicate requests for same params
        const queryKey = JSON.stringify({
          jobseekerId,
          page: currentPage,
          limit: 5,
          locationFilter,
          industryFilter,
          experienceFilter,
          search: debouncedSearchTerm?.trim() || ""
        })

        if (lastQueryRef.current === queryKey) {
          return
        }
        lastQueryRef.current = queryKey

        setLoading(true)
        setError(null)

        const params = new URLSearchParams()
        params.set("jobseeker_id", jobseekerId)
        params.set("page", currentPage.toString())
        params.set("limit", "5")

        // Send all filters to backend
        if (locationFilter && locationFilter !== "all")
          params.set("location", locationFilter)
        if (industryFilter && industryFilter !== "all")
          params.set("industry", industryFilter)
        if (experienceFilter && experienceFilter !== "all")
          params.set("experience", experienceFilter)
        
        if (debouncedSearchTerm) params.set("search", debouncedSearchTerm)

        const url = `/api/seeker/profile/get_matching_jobs?${params.toString()}`

        const res = await fetch(url, { signal: controller.signal })
        if (!res.ok) {
          const text = await res.text().catch(() => "")
          throw new Error(
            `Failed to fetch matching jobs (${res.status}). ${text}`
          )
        }

        // attempt to parse JSON safely
        const json = await res.json().catch(() => null)
        if (!json) throw new Error("Invalid JSON response from server")

        // Support multiple shaped responses:
        // { success: true, data: [...] } OR { success: true, jobs: [...] } OR [...]
        const rawJobs: any[] =
          (json && (json.data || json.jobs)) ||
          (Array.isArray(json) ? json : json.data || json.jobs) ||
          []

        // Handle pagination data
        if (json.pagination) {
          setCurrentPage(json.pagination.current_page)
          setTotalPages(json.pagination.total_pages)
          setTotalRecords(json.pagination.total_records)
        }

        // Map raw items to Job interface safely
        const formatted: Job[] = rawJobs.map((job: any, idx: number) => {
          const id =
            String(job.id || job._id || job.job_id || job.jobId || idx) || String(idx)
          const title = job.title || job.job_title || job.name || "Untitled Position"
          const company = job.company || job.company_name || "Unknown Company"
          const location = job.location || job.city || "Location not specified"
          const salary = job.salary || job.salary_range || "Salary not specified"
          const jobType = job.job_type || job.jobType || job.type || "full-time"
          const remote =
            job.remote === 1 ||
            job.remote === "1" ||
            job.remote === true ||
            job.is_remote === true ||
            false
          const postedDate =
            job.created_at || job.posted_at || job.postedDate || new Date().toISOString()
          const description = job.description || job.job_description || ""
          const requirements = Array.isArray(job.requirements)
            ? job.requirements
            : typeof job.requirements === "string"
            ? job.requirements.split(",").map((s: string) => s.trim())
            : []
          const matchScore = Number(job.match_score ?? job.matchScore ?? 75)
          const industry = job.industry || job.sector || "Technology"
          const experienceLevel =
            job.experience_level || job.experienceLevel || job.level || "Mid-Level"
          const matchBreakdown = job.match_breakdown || job.matchBreakdown || null
          const matchedSkills = job.matched_skills || job.matchedSkills || []
          const missingSkills = job.missing_skills || job.missingSkills || []
          const url = job.url || job.apply_url || job.link || null

          return {
            id,
            title,
            company,
            location,
            salary,
            jobType,
            remote,
            postedDate,
            description,
            requirements,
            matchScore,
            industry,
            experienceLevel,
            matchBreakdown,
            matchedSkills,
            missingSkills,
            url,
          } as Job
        })

        if (!isMounted) return
        setJobs(formatted)
      } catch (err: any) {
        if (err?.name === "AbortError") return
        console.error("Error loading matching jobs:", err)
        if (!isMounted) return
        setError(
          err?.message ||
            "Failed to load matching jobs. Please check your network or try again."
        )
        setJobs([])
      } finally {
        if (!isMounted) return
        setLoading(false)
      }
    }

    loadMatchingJobs()

    return () => {
      isMounted = false
      controller.abort()
    }
    // NOTE: searchTerm is intentionally omitted to keep search client-side (same as your previous logic).
  }, [locationFilter, industryFilter, experienceFilter, currentPage, debouncedSearchTerm])

  // No client-side filtering needed - all filtering is handled by backend
  // Just sort by match score for display
  const filteredJobs = jobs.sort((a, b) => b.matchScore - a.matchScore)

  // Dynamic select options (ensure current selection is always present even if jobs list is empty)
  let locations = ["all", ...Array.from(new Set(jobs.map((j) => j.location))).filter(Boolean)]
  if (locationFilter !== "all" && !locations.includes(locationFilter)) {
    locations = ["all", locationFilter, ...locations.filter((v) => v !== locationFilter)]
  }

  let industries = ["all", ...Array.from(new Set(jobs.map((j) => j.industry))).filter(Boolean)]
  if (industryFilter !== "all" && !industries.includes(industryFilter)) {
    industries = ["all", industryFilter, ...industries.filter((v) => v !== industryFilter)]
  }

  let experienceLevels = [
    "all",
    ...Array.from(new Set(jobs.map((j) => j.experienceLevel))).filter(Boolean),
  ]
  if (experienceFilter !== "all" && !experienceLevels.includes(experienceFilter)) {
    experienceLevels = [
      "all",
      experienceFilter,
      ...experienceLevels.filter((v) => v !== experienceFilter),
    ]
  }

  // Format date safely
  const formatDate = (dateString: string) => {
    if (!dateString) return "Date not available"
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    } catch {
      return "Invalid date"
    }
  }

  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600 bg-green-100 border-green-200"
    if (score >= 80) return "text-emerald-600 bg-emerald-100 border-emerald-200"
    if (score >= 70) return "text-yellow-600 bg-yellow-100 border-yellow-200"
    return "text-orange-600 bg-orange-100 border-orange-200"
  }

  // Apply handler - robust handling like your earlier version
  const handleApply = async (jobId: string) => {
    try {
      const jobseekerId = localStorage.getItem("jobseeker_id")
      if (!jobseekerId) {
        alert("Please login to apply for jobs.")
        console.warn("No jobseeker ID found. Please login again.")
        return
      }

      const response = await fetch("/api/seeker/profile/apply_job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobseeker_id: jobseekerId, job_id: jobId }),
      })

      const contentType = response.headers.get("content-type") || ""
      const data = contentType.includes("application/json")
        ? await response.json().catch(() => ({}))
        : {}

      if (response.ok && (!contentType || !contentType.includes("application/json"))) {
        alert("Application submitted successfully.")
        // Remove the applied job from the list without refreshing
        setJobs((prev) => prev.filter((j) => j.id !== jobId))
        if (selectedJob && selectedJob.id === jobId) {
          setDialogOpen(false)
          setSelectedJob(null)
        }
        return
      }

      if (response.ok && (data as any)?.success !== false) {
        alert("Application submitted successfully.")
        // Remove the applied job from the list without refreshing
        setJobs((prev) => prev.filter((j) => j.id !== jobId))
        if (selectedJob && selectedJob.id === jobId) {
          setDialogOpen(false)
          setSelectedJob(null)
        }
        return
      }

      const message = (data as any)?.message || "Failed to apply"
      if (typeof message === "string" && message.toLowerCase().includes("already applied")) {
        alert("You already applied to this job.")
        return
      }

      alert(message)
    } catch (err) {
      console.error("Error applying to job:", err)
      alert("An error occurred while applying. Please try again.")
    }
  }

  // Save (toggle) job locally (and attempt backend if you add an endpoint later)
  const toggleSaveJob = async (jobId: string) => {
    const jobseekerId = localStorage.getItem("jobseeker_id")
    if (!jobseekerId) {
      alert("Please login to save jobs.")
      return
    }

    // Optimistic UI update
    const wasSaved = savedJobs.includes(jobId)
    setSavedJobs((prev) => (wasSaved ? prev.filter((id) => id !== jobId) : [...prev, jobId]))

    try {
      if (wasSaved) {
        // Remove saved job
        const res = await fetch(`/api/seeker/jobs/remove_saved_job?jobseeker_id=${encodeURIComponent(jobseekerId)}&job_id=${encodeURIComponent(jobId)}`)
        if (!res.ok) {
          // revert on failure
          setSavedJobs((prev) => (prev.includes(jobId) ? prev : [...prev, jobId]))
        }
      } else {
        // Save job
        const res = await fetch("/api/seeker/jobs/save_job", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ jobseeker_id: jobseekerId, job_id: jobId }),
        })
        if (!res.ok) {
          // revert on failure
          setSavedJobs((prev) => prev.filter((id) => id !== jobId))
        }
      }
    } catch (e) {
      // revert on error
      setSavedJobs((prev) => (wasSaved ? (prev.includes(jobId) ? prev : [...prev, jobId]) : prev.filter((id) => id !== jobId)))
    }
  }

  // Open details dialog for a job
  const openDetails = (job: Job) => {
    setSelectedJob(job)
    setDialogOpen(true)
  }

  return (
    <div className="w-full min-h-screen overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 space-y-4 sm:space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white">
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Target className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-2xl font-bold break-words">Matching Jobs</h1>
              <p className="text-xs sm:text-sm text-emerald-100 break-words">
                Jobs tailored to your profile and preferences
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="border-emerald-200 shadow-lg">
          <CardContent className="p-3 sm:p-6">
            <div className="space-y-3 sm:space-y-4">
              <div className="flex flex-col gap-3 sm:gap-4">
                <div className="w-full">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400 flex-shrink-0" />
                    <Input
                      placeholder="Search jobs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-emerald-300 focus:border-emerald-500 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
                  <Select value={locationFilter} onValueChange={setLocationFilter}>
                    <SelectTrigger className="border-emerald-300 focus:border-emerald-500 text-xs sm:text-sm">
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.length === 1 && <SelectItem value="all">All Locations</SelectItem>}
                      {locations.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location === "all" ? "All Locations" : location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={industryFilter} onValueChange={setIndustryFilter}>
                    <SelectTrigger className="border-emerald-300 focus:border-emerald-500 text-xs sm:text-sm">
                      <SelectValue placeholder="Industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map((industry) => (
                        <SelectItem key={industry} value={industry}>
                          {industry === "all" ? "All Industries" : industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={experienceFilter} onValueChange={setExperienceFilter}>
                    <SelectTrigger className="border-emerald-300 focus:border-emerald-500 text-xs sm:text-sm">
                      <SelectValue placeholder="Experience" />
                    </SelectTrigger>
                    <SelectContent>
                      {experienceLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level === "all" ? "All Levels" : level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error */}
        {error && (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-4">
              <div className="text-red-800 text-center">
                <p className="font-medium">{error}</p>
                <Button
                  variant="outline"
                  className="mt-2 border-red-300 text-red-700 hover:bg-red-100"
                  onClick={() => {
                    // try refetch by toggling remoteOnly (cheap way) or reload page
                    window.location.reload()
                  }}
                >
                  Retry
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading */}
        {loading && !error && (
          <Card className="border-emerald-200 bg-emerald-50">
            <CardContent className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
              <p className="text-emerald-800 font-medium">Loading matching jobs...</p>
            </CardContent>
          </Card>
        )}

        {/* Jobs List */}
        <div className="space-y-3 sm:space-y-4">
          {!loading && filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <Card key={job.id} className="border-gray-200 hover:border-emerald-300 transition-colors shadow-lg">
                <CardContent className="p-3 sm:p-6">
                  <div className="flex flex-col space-y-3 sm:space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                          <Building className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600 flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <h3 className="text-sm sm:text-lg font-semibold text-gray-900 break-words">{job.title}</h3>
                            <p className="text-xs sm:text-sm text-emerald-600 font-medium break-words">{job.company}</p>
                          </div>
                          <Badge variant="outline" className={`${getMatchScoreColor(job.matchScore)} text-xs flex-shrink-0`}>
                            {job.matchScore}% Match
                          </Badge>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-gray-600 mb-3">
                          <div className="flex items-center space-x-1 min-w-0">
                            <MapPin className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                            <span className="break-words">{job.location}</span>
                            {job.remote && (
                              <Badge variant="outline" className="ml-1 sm:ml-2 border-blue-200 text-blue-700 text-xs flex-shrink-0">Remote</Badge>
                            )}
                          </div>
                          <span className="hidden sm:inline">•</span>
                          <div className="flex items-center space-x-1 min-w-0">
                            <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                            <span className="break-words">{job.salary}</span>
                          </div>
                          <span className="hidden sm:inline">•</span>
                          <div className="flex items-center space-x-1 min-w-0">
                            <Calendar className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                            <span className="break-words">Posted {formatDate(job.postedDate)}</span>
                          </div>
                        </div>

                        <p className="text-xs sm:text-sm text-gray-700 line-clamp-2 mb-3 break-words">{job.description}</p>

                        <div className="flex flex-wrap items-center gap-1 sm:gap-2 mb-3">
                          <Badge variant="outline" className="border-gray-200 text-gray-700 capitalize text-xs">{job.jobType}</Badge>
                          <Badge variant="outline" className="border-gray-200 text-gray-700 text-xs">{job.industry}</Badge>
                          <Badge variant="outline" className="border-gray-200 text-gray-700 text-xs">{job.experienceLevel}</Badge>
                        </div>

                        <div className="flex flex-wrap gap-1 sm:gap-2">
                          {job.requirements.slice(0, 4).map((req, idx) => (
                            <Badge key={idx} variant="secondary" className="bg-emerald-100 text-emerald-700 text-xs break-words">{req}</Badge>
                          ))}
                          {job.requirements.length > 4 && (
                            <Badge variant="secondary" className="bg-gray-100 text-gray-700 text-xs">+{job.requirements.length - 4} more</Badge>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-row sm:flex-col gap-2 sm:gap-2 sm:ml-4 flex-shrink-0">
                        <Button onClick={() => handleApply(job.id)} className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white text-xs sm:text-sm px-3 sm:px-4 py-2 flex-1 sm:flex-none">Apply Now</Button>

                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => toggleSaveJob(job.id)} className={`${savedJobs.includes(job.id) ? "bg-pink-100 border-pink-200 text-pink-600" : "border-gray-200 text-gray-600"} p-2`}>
                            <Heart className="h-3 w-3 sm:h-4 sm:w-4" />
                          </Button>

                          <Button variant="outline" size="sm" onClick={() => openDetails(job)} className="border-emerald-200 text-emerald-600 hover:bg-emerald-50 text-xs px-2 sm:px-3">
                            Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
        ) : !loading && (
          <Card className="border-2 border-dashed border-emerald-300 bg-emerald-50/50">
            <CardContent className="p-6 sm:p-12 text-center">
              <Target className="h-12 w-12 sm:h-16 sm:w-16 text-emerald-400 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 break-words">
                {searchTerm ? 'No jobs found matching your search' : 'No matching jobs found'}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-6 break-words">
                {searchTerm 
                  ? 'Try adjusting your search terms or browse other pages'
                  : 'Try adjusting your filters or update your profile to get better matches'
                }
              </p>
              {!searchTerm && (
                <Button className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white text-xs sm:text-sm">Update Profile</Button>
              )}
            </CardContent>
          </Card>
        )}
        </div>

        {/* Pagination Controls */}
        {!loading && totalPages > 1 && (
          <Card className="border-emerald-200 dark:border-emerald-800 shadow-lg bg-white dark:bg-gray-800">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Showing {filteredJobs.length} of {totalRecords} jobs (Page {currentPage} of {totalPages})
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCurrentPage(prev => Math.max(1, prev - 1))
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                    disabled={currentPage === 1}
                    className="border-emerald-300 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    {(() => {
                      const maxButtons = 5
                      const visible = Math.min(maxButtons, totalPages)
                      const half = Math.floor(maxButtons / 2)
                      const start = Math.max(1, Math.min(Math.max(1, totalPages - visible + 1), currentPage - half))
                      return Array.from({ length: visible }, (_, i) => start + i).map((pageNum) => (
                        <Button
                          key={`page-${pageNum}`}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            setCurrentPage(pageNum)
                            window.scrollTo({ top: 0, behavior: 'smooth' })
                          }}
                          className={
                            currentPage === pageNum
                              ? "bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white"
                              : "border-emerald-300 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                          }
                        >
                          {pageNum}
                        </Button>
                      ))
                    })()}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setCurrentPage(prev => Math.min(totalPages, prev + 1))
                      window.scrollTo({ top: 0, behavior: 'smooth' })
                    }}
                    disabled={currentPage === totalPages}
                    className="border-emerald-300 dark:border-emerald-700 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Match Statistics */}
        {!loading && (
          <Card className="border-emerald-200 shadow-lg">
            <CardHeader className="p-3 sm:p-6">
              <CardTitle className="text-emerald-800 text-sm sm:text-base">Match Statistics</CardTitle>
              <CardDescription className="text-emerald-600 text-xs sm:text-sm">Your profile compatibility with available jobs</CardDescription>
            </CardHeader>
            <CardContent className="p-3 sm:p-6 pt-0">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                <div className="text-center">
                  <div className="text-lg sm:text-2xl font-bold text-green-600 mb-1">{jobs.filter((job) => job.matchScore >= 90).length}</div>
                  <div className="text-xs sm:text-sm text-gray-600 break-words">Excellent Match (90%+)</div>
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-2xl font-bold text-emerald-600 mb-1">{jobs.filter((job) => job.matchScore >= 80 && job.matchScore < 90).length}</div>
                  <div className="text-xs sm:text-sm text-gray-600 break-words">Good Match (80-89%)</div>
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-2xl font-bold text-yellow-600 mb-1">{jobs.filter((job) => job.matchScore >= 70 && job.matchScore < 80).length}</div>
                  <div className="text-xs sm:text-sm text-gray-600 break-words">Fair Match (70-79%)</div>
                </div>
                <div className="text-center">
                  <div className="text-lg sm:text-2xl font-bold text-orange-600 mb-1">{jobs.filter((job) => job.matchScore < 70).length}</div>
                  <div className="text-xs sm:text-sm text-gray-600 break-words">Low Match (&lt;70%)</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Details Dialog (single controlled dialog) */}
      <Dialog open={dialogOpen} onOpenChange={(open) => { if (!open) { setSelectedJob(null) }; setDialogOpen(open) }}>
        {selectedJob && (
          <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-hidden flex flex-col mx-2 sm:mx-4">
            <DialogHeader className="flex-shrink-0">
              <DialogTitle className="text-emerald-800 text-sm sm:text-base break-words">{selectedJob.title}</DialogTitle>
              <div className="text-emerald-600 text-xs sm:text-sm break-words">{selectedJob.company} • {selectedJob.location}</div>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto space-y-4 sm:space-y-6 pr-2">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline" className={`${getMatchScoreColor(selectedJob.matchScore)} text-xs`}>{selectedJob.matchScore}% Match</Badge>
                <Badge variant="outline" className="border-gray-200 text-gray-700 capitalize text-xs">{selectedJob.jobType}</Badge>
                {selectedJob.remote && <Badge variant="outline" className="border-blue-200 text-blue-700 text-xs">Remote</Badge>}
              </div>

              {/* Match Breakdown (if available) */}
              {selectedJob.matchBreakdown && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-3">Match Breakdown</h4>
                  <div className="space-y-3">
                    {selectedJob.matchBreakdown.skills && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Skills Match</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div className="bg-emerald-500 h-2 rounded-full" style={{ width: `${selectedJob.matchBreakdown.skills.score ?? 0}%` }} />
                          </div>
                          <span className="text-sm font-medium">{selectedJob.matchBreakdown.skills.score ?? 0}%</span>
                        </div>
                      </div>
                    )}

                    {selectedJob.matchBreakdown.experience && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Experience Level</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${selectedJob.matchBreakdown.experience.score ?? 0}%` }} />
                          </div>
                          <span className="text-sm font-medium">{selectedJob.matchBreakdown.experience.score ?? 0}%</span>
                        </div>
                      </div>
                    )}

                    {selectedJob.matchBreakdown.location && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Location</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${selectedJob.matchBreakdown.location.score ?? 0}%` }} />
                          </div>
                          <span className="text-sm font-medium">{selectedJob.matchBreakdown.location.score ?? 0}%</span>
                        </div>
                      </div>
                    )}

                    {selectedJob.matchBreakdown.salary && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Salary Range</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${selectedJob.matchBreakdown.salary.score ?? 0}%` }} />
                          </div>
                          <span className="text-sm font-medium">{selectedJob.matchBreakdown.salary.score ?? 0}%</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Skills lists if present */}
                  {selectedJob.matchedSkills && selectedJob.matchedSkills.length > 0 && (
                    <div className="mt-4">
                      <h5 className="text-sm font-medium text-gray-900 mb-2">Your Matching Skills</h5>
                      <div className="flex flex-wrap gap-1">
                        {selectedJob.matchedSkills.map((s, i) => <Badge key={i} variant="secondary" className="bg-green-100 text-green-700 text-xs">{s}</Badge>)}
                      </div>
                    </div>
                  )}

                  {selectedJob.missingSkills && selectedJob.missingSkills.length > 0 && (
                    <div className="mt-3">
                      <h5 className="text-sm font-medium text-gray-900 mb-2">Skills to Develop</h5>
                      <div className="flex flex-wrap gap-1">
                        {selectedJob.missingSkills.map((s, i) => <Badge key={i} variant="outline" className="border-orange-200 text-orange-700 text-xs">{s}</Badge>)}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                <div>
                  <span className="font-medium text-gray-700">Salary:</span>
                  <p className="text-gray-600 break-words">{selectedJob.salary}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Posted:</span>
                  <p className="text-gray-600">{formatDate(selectedJob.postedDate)}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Industry:</span>
                  <p className="text-gray-600 break-words">{selectedJob.industry}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Experience Level:</span>
                  <p className="text-gray-600 break-words">{selectedJob.experienceLevel}</p>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">Job Description</h4>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-xs sm:text-sm break-words">{selectedJob.description}</p>
              </div>

              {selectedJob.requirements && selectedJob.requirements.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">Requirements</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedJob.requirements.map((req, i) => (
                      <Badge key={i} variant="outline" className="border-emerald-200 text-emerald-700 text-xs break-words">{req}</Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-4 border-t flex-shrink-0">
                <Button variant="outline" className="border-gray-200 text-gray-600 hover:bg-gray-50" onClick={() => toggleSaveJob(selectedJob.id)}>
                  <Heart className="h-4 w-4 mr-2" />
                  {savedJobs.includes(selectedJob.id) ? "Unsave" : "Save Job"}
                </Button>
                <div className="flex space-x-3">
                  {selectedJob.url && (
                    <Button asChild variant="outline" className="border-emerald-200 text-emerald-600 hover:bg-emerald-50">
                      <a href={selectedJob.url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        View Original
                      </a>
                    </Button>
                  )}
                  <Button onClick={() => handleApply(selectedJob.id)} className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white">
                    Apply Now
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  )
}
