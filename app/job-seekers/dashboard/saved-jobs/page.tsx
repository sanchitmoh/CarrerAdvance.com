"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Heart, Search, MapPin, Building, Calendar, DollarSign, Trash2, ExternalLink } from "lucide-react"

interface SavedJob {
  id: string
  title: string
  company: string
  location: string
  salary: string
  jobType: "full-time" | "part-time" | "contract" | "internship"
  remote: boolean
  postedDate: string
  savedDate: string
  description: string
  requirements: string[]
  industry: string
  experienceLevel: string
  applied?: boolean
}

export default function SavedJobsPage() {
  const [savedJobs, setSavedJobs] = useState<SavedJob[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedJob, setSelectedJob] = useState<SavedJob | null>(null)

  

  const filteredJobs = savedJobs
    .filter((job) => {
      const matchesSearch =
        (job.title?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
        (job.company?.toLowerCase() || "").includes(searchTerm.toLowerCase())

      return matchesSearch
    })
    .sort((a, b) => new Date(b.savedDate).getTime() - new Date(a.savedDate).getTime())

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const handleRemoveJob = async (jobId: string) => {
    const jobseekerId = localStorage.getItem("jobseeker_id")
    if (!jobseekerId) return
    // optimistic remove
    const prev = savedJobs
    setSavedJobs(prev.filter((job) => job.id !== jobId))
    try {
      await fetch(`/api/seeker/jobs/remove_saved_job?jobseeker_id=${encodeURIComponent(jobseekerId)}&job_id=${encodeURIComponent(jobId)}`)
    } catch {
      // revert on failure
      setSavedJobs(prev)
    }
  }

  const handleApply = async (jobId: string) => {
    try {
      const jobseekerId = localStorage.getItem("jobseeker_id")
      if (!jobseekerId) {
        alert("Please login to apply for jobs.")
        return
      }

      const response = await fetch("/api/seeker/profile/apply_job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobseeker_id: jobseekerId, job_id: jobId }),
      })

      const contentType = response.headers.get("content-type") || ""
      const data = contentType.includes("application/json")
        ? await response.json().catch(() => ({} as any))
        : ({} as any)

      const markApplied = () => setSavedJobs((prev) => prev.map((j) => j.id === jobId ? { ...j, applied: true } : j))

      if (response.ok && (!contentType || !contentType.includes("application/json"))) {
        alert("Application submitted successfully.")
        markApplied()
        return
      }

      if (response.ok && data?.success !== false) {
        alert("Application submitted successfully.")
        markApplied()
        return
      }

      const message = data?.message || "Failed to apply"
      if (typeof message === "string" && message.toLowerCase().includes("already applied")) {
        alert("You already applied to this job.")
        markApplied()
        return
      }

      alert(message)
    } catch (err) {
      console.error("Error applying to job:", err)
      alert("An error occurred while applying. Please try again.")
    }
  }

  // Load saved jobs from backend
  useEffect(() => {
    let mounted = true
    const load = async () => {
      try {
        setLoading(true)
        setError(null)
        const jobseekerId = localStorage.getItem("jobseeker_id")
        if (!jobseekerId) {
          setError("No jobseeker ID found. Please login again.")
          setLoading(false)
          return
        }
        const res = await fetch(`/api/seeker/jobs/get_saved_jobs?jobseeker_id=${encodeURIComponent(jobseekerId)}`)
        const json = await res.json().catch(() => null)
        if (!mounted) return
        if (!res.ok || !json) {
          setError("Failed to load saved jobs")
          setSavedJobs([])
        } else {
          const rows = (json?.data || json?.jobs || []) as any[]
          const mapped: SavedJob[] = rows.map((job: any, idx: number) => ({
            id: String(job.job_id ?? job.id ?? idx),
            title: job.title ?? job.job_title ?? "Untitled Position",
            company: job.company ?? job.company_name ?? "Unknown Company",
            location: job.location ?? [job.city, job.country].filter(Boolean).join(", ") ?? "",
            salary: job.salary ?? "Salary not specified",
            jobType: (job.job_type ?? "full-time") as SavedJob["jobType"],
            remote: job.remote === 1 || job.remote === true,
            postedDate: job.posted_date ?? job.created_at ?? job.created_date ?? new Date().toISOString(),
            savedDate: job.saved_at ?? new Date().toISOString(),
            description: job.description ?? "",
            requirements: Array.isArray(job.requirements) ? job.requirements : [],
            industry: job.industry ?? job.industry_name ?? "",
            experienceLevel: job.experience_level ?? "",
            applied: job.applied === 1 || job.is_applied === 1 || job.applied === true,
          }))
          setSavedJobs(mapped)
        }
      } catch (e) {
        if (!mounted) return
        setError("Failed to load saved jobs")
        setSavedJobs([])
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => { mounted = false }
  }, [])

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <Heart className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0" />
            <div className="min-w-0">
              <h1 className="text-lg sm:text-2xl md:text-3xl font-bold leading-tight truncate">Saved Jobs</h1>
              <p className="text-xs sm:text-sm text-emerald-100 truncate">Jobs you've bookmarked for later review</p>
            </div>
          </div>

          <div className="text-center sm:text-right flex-shrink-0">
            <div className="text-xl sm:text-2xl md:text-3xl font-bold">{savedJobs.length}</div>
            <div className="text-xs sm:text-sm text-emerald-100">Saved Jobs</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card className="border-emerald-200 shadow">
        <CardContent className="p-3 sm:p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
            <div className="flex-1">
              <label htmlFor="saved-search" className="sr-only">Search saved jobs</label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400 pointer-events-none" />
                <Input
                  id="saved-search"
                  placeholder="Search saved jobs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-3 py-2 text-sm md:text-base w-full border-emerald-300 focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Filters removed as requested; keeping only search bar */}
          </div>
        </CardContent>
      </Card>

      {/* Error */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="text-red-800 text-center">
              <p className="font-medium">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Saved Jobs List */}
      <div className="space-y-3 sm:space-y-4">
        {loading ? (
          <Card className="border-emerald-200 bg-emerald-50">
            <CardContent className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
              <p className="text-emerald-800 font-medium">Loading saved jobs...</p>
            </CardContent>
          </Card>
        ) : filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <Card key={job.id} className="border-gray-200 hover:border-emerald-300 transition-colors shadow-sm">
              <CardContent className="p-3 sm:p-4 md:p-6">
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <Building className="h-4 w-4 sm:h-5 sm:w-5 text-emerald-600 flex-shrink-0" />
                        <div className="min-w-0">
                          <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 truncate">{job.title}</h3>
                          <p className="text-xs sm:text-sm text-emerald-600 font-medium truncate">{job.company}</p>
                        </div>
                      </div>

                      <div className="ml-auto flex-shrink-0">
                        <Badge variant="outline" className="border-pink-200 text-pink-700 bg-pink-50 text-xs">
                          <Heart className="h-3 w-3 mr-1" />
                          Saved
                        </Badge>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-gray-600 mb-2">
                      <div className="flex items-center gap-1 min-w-0">
                        <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="truncate max-w-xs sm:max-w-sm">{job.location}</span>
                        {job.remote && (
                          <Badge variant="outline" className="ml-2 border-blue-200 text-blue-700 text-xs">Remote</Badge>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="truncate">{job.salary}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span className="truncate">Saved {formatDate(job.savedDate)}</span>
                      </div>
                    </div>

                    <p className="text-gray-700 text-sm line-clamp-2 mb-3">{job.description}</p>

                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <Badge variant="outline" className="border-gray-200 text-gray-700 text-xs capitalize">{job.jobType.replace('-', ' ')}</Badge>
                      <Badge variant="outline" className="border-gray-200 text-gray-700 text-xs">{job.industry}</Badge>
                      <Badge variant="outline" className="border-gray-200 text-gray-700 text-xs">{job.experienceLevel}</Badge>
                    </div>

                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {job.requirements.slice(0, 4).map((req, index) => (
                        <Badge key={index} variant="secondary" className="bg-emerald-100 text-emerald-700 text-xs">{req}</Badge>
                      ))}
                      {job.requirements.length > 4 && (
                        <Badge variant="secondary" className="bg-gray-100 text-gray-700 text-xs">+{job.requirements.length - 4} more</Badge>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-row sm:flex-row lg:flex-col gap-2 lg:gap-3 items-stretch lg:items-start lg:ml-4 mt-2 lg:mt-0 flex-shrink-0 w-full sm:w-auto">
                    <Button
                      onClick={() => handleApply(job.id)}
                      disabled={job.applied === true}
                      className={`w-full sm:w-auto text-sm py-2 ${job.applied ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white'}`}
                    >
                      {job.applied ? 'Applied' : 'Apply Now'}
                    </Button>

                    <div className="flex gap-2 w-full sm:w-auto">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedJob(job)}
                            className="flex-1 sm:flex-none border-emerald-200 text-emerald-600 hover:bg-emerald-50 text-sm py-2"
                          >
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="w-[95vw] max-w-3xl max-h-[90vh] overflow-hidden flex flex-col mx-2 sm:mx-4">
                          <DialogHeader className="flex-shrink-0">
                            <DialogTitle className="text-emerald-800 text-sm sm:text-base truncate">{selectedJob?.title}</DialogTitle>
                            <DialogDescription className="text-emerald-600 text-xs sm:text-sm truncate">{selectedJob?.company} • {selectedJob?.location}</DialogDescription>
                          </DialogHeader>
                          {selectedJob && (
                            <div className="flex-1 overflow-y-auto space-y-4 sm:space-y-6 pr-2">
                              <div className="flex flex-wrap items-center gap-2">
                                <Badge variant="outline" className="border-gray-200 text-gray-700 text-xs capitalize">{selectedJob.jobType.replace('-', ' ')}</Badge>
                                {selectedJob.remote && (
                                  <Badge variant="outline" className="border-blue-200 text-blue-700 text-xs">Remote</Badge>
                                )}
                                <Badge variant="outline" className="border-pink-200 text-pink-700 bg-pink-50 text-xs"><Heart className="h-3 w-3 mr-1" /> Saved {formatDate(selectedJob.savedDate)}</Badge>
                              </div>

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

                              <div>
                                <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">Requirements</h4>
                                <div className="flex flex-wrap gap-2">
                                  {selectedJob.requirements.map((req, index) => (
                                    <Badge key={index} variant="outline" className="border-emerald-200 text-emerald-700 text-xs">{req}</Badge>
                                  ))}
                                </div>
                              </div>

                              <div className="flex flex-col gap-3 pt-4 border-t flex-shrink-0">
                                <Button onClick={() => handleRemoveJob(selectedJob.id)} variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 text-sm w-full sm:w-auto">
                                  <Trash2 className="h-4 w-4 mr-2" /> Remove from Saved
                                </Button>

                                <div className="flex flex-col sm:flex-row gap-3">
                                  <Button variant="outline" className="border-emerald-200 text-emerald-600 hover:bg-emerald-50 bg-transparent text-sm flex-1">
                                    <ExternalLink className="h-4 w-4 mr-2" /> View Original
                                  </Button>
                                  <Button onClick={() => handleApply(selectedJob.id)} className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white text-sm flex-1">
                                    Apply Now
                                  </Button>
                                </div>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>

                      <Button onClick={() => handleRemoveJob(job.id)} variant="outline" size="sm" className="border-red-200 text-red-600 hover:bg-red-50 text-sm py-2 w-full sm:w-auto">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="border-2 border-dashed border-emerald-300 bg-emerald-50/50">
            <CardContent className="p-8 sm:p-12 text-center">
              <Heart className="h-16 w-16 text-emerald-400 mx-auto mb-4" />
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">{searchTerm ? "No saved jobs match your search" : "No saved jobs yet"}</h3>
              <p className="text-sm sm:text-base text-gray-600 mb-6">{searchTerm ? "Try adjusting your search" : "Start saving jobs you're interested in to keep track of them here"}</p>
              {!searchTerm && (
                <Button asChild className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white">
                  <Link href="/job-seekers/dashboard/matching-jobs">Browse Jobs</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <Card className="border-emerald-200">
          <CardContent className="p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-emerald-600 mb-1">{savedJobs.length}</div>
            <div className="text-xs sm:text-sm text-gray-600">Total Saved Jobs</div>
          </CardContent>
        </Card>

        <Card className="border-emerald-200">
          <CardContent className="p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-blue-600 mb-1">{savedJobs.filter((job) => job.remote).length}</div>
            <div className="text-xs sm:text-sm text-gray-600">Remote Opportunities</div>
          </CardContent>
        </Card>

        <Card className="border-emerald-200">
          <CardContent className="p-3 sm:p-4 text-center">
            <div className="text-xl sm:text-2xl font-bold text-purple-600 mb-1">{new Set(savedJobs.map((job) => job.industry)).size}</div>
            <div className="text-xs sm:text-sm text-gray-600">Different Industries</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
