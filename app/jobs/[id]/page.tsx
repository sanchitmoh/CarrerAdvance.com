"use client"

import { useState, useEffect, use } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, MapPin, Clock, DollarSign, Briefcase, Share2, Bookmark, Code } from "lucide-react"
import { jobsApiService, Job } from "@/lib/jobs-api"

interface JobDetails extends Job {
  fullDescription?: string
  company_description?: string
  logo?: string
  featured?: boolean
  skills?: string
}

export default function JobDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const resolvedParams = use(params)
  const jobId = resolvedParams.id
  const [currentJob, setCurrentJob] = useState<JobDetails | null>(null)
  const [otherJobs, setOtherJobs] = useState<Job[]>([])
  const [savedJobs, setSavedJobs] = useState<number[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch job details and other jobs
  useEffect(() => {
    const fetchJobDetails = async () => {
      setLoading(true)
      setError(null)
      try {
        // Fetch current job details
        const jobResponse = await jobsApiService.getJobDetails(jobId)
        if (jobResponse.success && jobResponse.data) {
          const job = jobResponse.data as any
          
          // Normalize salary values - convert strings to numbers
          const minSalary = job.min_salary 
            ? typeof job.min_salary === 'string' ? parseFloat(job.min_salary) : job.min_salary
            : undefined
          const maxSalary = job.max_salary
            ? typeof job.max_salary === 'string' ? parseFloat(job.max_salary) : job.max_salary
            : undefined
          
          // Normalize job data
          const normalizedJob: JobDetails = {
            ...job,
            company_name: job.company_name || '',
            title: job.title || '',
            location: job.location || '',
            description: job.description || '',
            requirements: job.requirements || '',
            benefits: job.benefits || '',
            fullDescription: job.description || '',
            company_description: '', // Will be fetched separately if needed
            posted_date: job.posted_date || job.created_date || '',
            salary_min: minSalary,
            salary_max: maxSalary,
            skills: job.skills || '',
          }
          
          setCurrentJob(normalizedJob)

          // Fetch other jobs for sidebar (excluding current job)
          const jobsResponse = await jobsApiService.getJobs({ 
            page: 1, 
            limit: 10 
          })
          
          if (jobsResponse.success && jobsResponse.data.jobs) {
            // Filter out current job and limit to 5-6 jobs
            const filtered = jobsResponse.data.jobs
              .filter(j => String(j.id) !== String(jobId))
              .slice(0, 6)
              .map(j => ({
                ...j,
                company_name: j.company_name || '',
                location: j.location || '',
                title: j.title || '',
              }))
            setOtherJobs(filtered)
          }
        } else {
          setError('Job not found')
        }
      } catch (err) {
        console.error('Error fetching job details:', err)
        setError('Failed to load job details')
      } finally {
        setLoading(false)
      }
    }

    if (jobId) {
      fetchJobDetails()
    }
  }, [jobId])

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "Recently"
    try {
      const date = new Date(dateString)
      const now = new Date()
      const diffTime = Math.abs(now.getTime() - date.getTime())
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

      if (diffDays === 1) return "1 day ago"
      if (diffDays < 7) return `${diffDays} days ago`
      if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
      return `${Math.ceil(diffDays / 30)} months ago`
    } catch {
      return "Recently"
    }
  }

  const formatSalary = (min?: number, max?: number, period?: string) => {
    // Convert to numbers if they're strings
    const minNum = min !== undefined && min !== null ? (typeof min === 'string' ? parseFloat(min) : min) : undefined
    const maxNum = max !== undefined && max !== null ? (typeof max === 'string' ? parseFloat(max) : max) : undefined
    
    if ((!minNum || isNaN(minNum)) && (!maxNum || isNaN(maxNum))) return "Not specified"
    
    const periodText = period ? `/${period}` : ""
    if (minNum && !isNaN(minNum) && maxNum && !isNaN(maxNum)) {
      return `$${minNum.toLocaleString()} - $${maxNum.toLocaleString()}${periodText}`
    }
    if (minNum && !isNaN(minNum)) return `$${minNum.toLocaleString()}+${periodText}`
    if (maxNum && !isNaN(maxNum)) return `Up to $${maxNum.toLocaleString()}${periodText}`
    return "Not specified"
  }

  const parseSkills = (skills: string | undefined): string[] => {
    if (!skills) return []
    // Split by comma (most common delimiter for skills)
    // Handle cases where skills might be separated by comma, semicolon, or newline
    return skills
      .split(/[,;\n]/)
      .map(skill => skill.trim())
      .filter(skill => skill.length > 0)
  }

  const parseRequirements = (requirements: string | undefined): string[] => {
    if (!requirements) return []
    // Try to parse as JSON array first
    try {
      const parsed = JSON.parse(requirements)
      if (Array.isArray(parsed)) return parsed
    } catch {
      // If not JSON, split by common delimiters
      return requirements
        .split(/[,\n•]/)
        .map(r => r.trim())
        .filter(r => r.length > 0)
    }
    return []
  }

  const parseBenefits = (benefits: string | undefined): string[] => {
    if (!benefits) return []
    // Try to parse as JSON array first
    try {
      const parsed = JSON.parse(benefits)
      if (Array.isArray(parsed)) return parsed
    } catch {
      // If not JSON, split by common delimiters
      return benefits
        .split(/[,\n•]/)
        .map(b => b.trim())
        .filter(b => b.length > 0)
    }
    return []
  }

  // Check authentication status
  const checkAuthStatus = () => {
    if (typeof window === 'undefined') return false
    const jobSeekerToken = localStorage.getItem('job-seeker-token')
    const authToken = localStorage.getItem('auth-token')
    const userRole = localStorage.getItem('user-role')
    return !!(jobSeekerToken || (authToken && userRole === 'job-seeker'))
  }

  const handleApply = () => {
    const isLoggedIn = checkAuthStatus()
    
    if (jobId) {
      localStorage.setItem('pending_job_id', String(jobId))
      localStorage.setItem('pending_job_source', 'job_details_page')
      localStorage.setItem('redirect_after_login', '/job-seekers/dashboard/matching-jobs')
    }
    
    if (isLoggedIn) {
      window.location.href = '/job-seekers/dashboard/matching-jobs'
    } else {
      router.push('/job-seekers/login')
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading job details...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !currentJob) {
    return (
      <div className="min-h-screen bg-gray-50 pt-16 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">{error || "Job not found"}</h1>
          <Link href="/jobs">
            <Button className="bg-emerald-600 hover:bg-emerald-700">Back to Jobs</Button>
          </Link>
        </div>
      </div>
    )
  }

  const requirementsList = parseRequirements(currentJob.requirements)
  const benefitsList = parseBenefits(currentJob.benefits)
  const skillsList = parseSkills(currentJob.skills)

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      {/* Back button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link href="/jobs">
          <Button
            variant="outline"
            className="flex items-center gap-2 text-emerald-600 border-emerald-600 hover:bg-emerald-50 bg-transparent"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Jobs
          </Button>
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Other Jobs Navigation */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle className="text-lg">Other Jobs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 max-h-[600px] overflow-y-auto">
                {otherJobs.length > 0 ? (
                  otherJobs.map((job) => (
                    <Link key={job.id} href={`/jobs/${job.id}`}>
                      <div
                        className={`p-3 rounded-lg cursor-pointer transition-all ${
                          String(job.id) === String(jobId)
                            ? "bg-emerald-100 border-2 border-emerald-500"
                            : "border border-gray-200 hover:border-emerald-300 hover:bg-emerald-50"
                        }`}
                      >
                        <p
                          className={`font-semibold text-sm line-clamp-2 ${
                            String(job.id) === String(jobId) ? "text-emerald-700" : "text-gray-900"
                          }`}
                        >
                          {job.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">{job.company_name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{formatDate(job.posted_date)}</p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-sm text-gray-500 text-center py-4">No other jobs available</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 order-1 lg:order-2 space-y-6">
            {/* Job Header */}
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                  <div className="flex items-start gap-4">
                    <img
                      src={currentJob.logo || "/placeholder.svg?height=60&width=60"}
                      alt={currentJob.company_name}
                      className="w-16 h-16 rounded-xl border border-gray-200"
                      onError={(e) => {
                        e.currentTarget.src = "/placeholder.svg?height=60&width=60"
                      }}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {currentJob.featured && (
                          <Badge className="bg-yellow-100 text-yellow-700 border-yellow-200">Featured</Badge>
                        )}
                      </div>
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">{currentJob.title}</h1>
                      <p className="text-xl text-emerald-600 font-semibold mb-3">{currentJob.company_name}</p>
                      {currentJob.company_description && (
                        <p className="text-gray-600 mb-4">{currentJob.company_description}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        const numId = Number.parseInt(jobId)
                        setSavedJobs((prev) =>
                          prev.includes(numId) ? prev.filter((id) => id !== numId) : [...prev, numId],
                        )
                      }}
                      className={
                        savedJobs.includes(Number.parseInt(jobId))
                          ? "text-emerald-600 border-emerald-600 bg-emerald-50"
                          : ""
                      }
                    >
                      <Bookmark
                        className={`w-4 h-4 ${savedJobs.includes(Number.parseInt(jobId)) ? "fill-current" : ""}`}
                      />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: currentJob.title,
                            text: `Check out this job: ${currentJob.title} at ${currentJob.company_name}`,
                            url: window.location.href,
                          })
                        } else {
                          navigator.clipboard.writeText(window.location.href)
                          alert("Link copied to clipboard!")
                        }
                      }}
                    >
                      <Share2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Job ID */}
                <div className="mb-6 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Job ID:</span> #{String(currentJob.id).padStart(6, "0")}
                  </p>
                </div>

                {/* Key Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="flex items-center gap-3">
                    <div className="bg-emerald-100 p-2 rounded-lg">
                      <MapPin className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Location</p>
                      <p className="font-semibold text-gray-900">{currentJob.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-emerald-100 p-2 rounded-lg">
                      <Clock className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Type</p>
                      <p className="font-semibold text-gray-900">{currentJob.job_type || "Not specified"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-emerald-100 p-2 rounded-lg">
                      <DollarSign className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Salary</p>
                      <p className="font-semibold text-gray-900">
                        {formatSalary(currentJob.salary_min, currentJob.salary_max, (currentJob as any).salary_period)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-emerald-100 p-2 rounded-lg">
                      <Briefcase className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Posted</p>
                      <p className="font-semibold text-gray-900">{formatDate(currentJob.posted_date)}</p>
                    </div>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleApply}
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold py-3 h-auto"
                  >
                    Apply Now
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const numId = Number.parseInt(jobId)
                      setSavedJobs((prev) =>
                        prev.includes(numId) ? prev.filter((id) => id !== numId) : [...prev, numId],
                      )
                    }}
                    className={`flex-1 border-emerald-600 font-semibold py-3 h-auto bg-transparent ${
                      savedJobs.includes(Number.parseInt(jobId))
                        ? "bg-emerald-50 text-emerald-700"
                        : "text-emerald-600 hover:bg-emerald-50"
                    }`}
                  >
                    {savedJobs.includes(Number.parseInt(jobId)) ? "Saved" : "Save Job"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Job Description */}
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <CardTitle>About This Job</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {currentJob.fullDescription || currentJob.description || "No description available."}
                  </p>
                </div>

                {requirementsList.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h3>
                    <ul className="space-y-2">
                      {requirementsList.map((req, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-gray-700">
                          <span className="inline-block w-2 h-2 bg-emerald-600 rounded-full mt-2 flex-shrink-0"></span>
                          {req}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {currentJob.requirements && requirementsList.length === 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Requirements</h3>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">{currentJob.requirements}</p>
                  </div>
                )}

                {benefitsList.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Benefits</h3>
                    <div className="flex flex-wrap gap-2">
                      {benefitsList.map((benefit, idx) => (
                        <Badge
                          key={idx}
                          variant="outline"
                          className="border-emerald-200 text-emerald-700 bg-emerald-50"
                        >
                          {benefit}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {currentJob.benefits && benefitsList.length === 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Benefits</h3>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">{currentJob.benefits}</p>
                  </div>
                )}

                {skillsList.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Code className="w-5 h-5 text-emerald-600" />
                      Required Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {skillsList.map((skill, idx) => (
                        <Badge
                          key={idx}
                          variant="outline"
                          className="border-blue-200 text-blue-700 bg-blue-50 text-sm px-3 py-1"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {currentJob.skills && skillsList.length === 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Code className="w-5 h-5 text-emerald-600" />
                      Required Skills
                    </h3>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-line">{currentJob.skills}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* About Company */}
            {currentJob.company_description && (
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>About {currentJob.company_name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 leading-relaxed">{currentJob.company_description}</p>
                </CardContent>
              </Card>
            )}

            {/* Apply Section */}
            <Card className="border-0 shadow-lg bg-emerald-50">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Ready to Apply?</h3>
                <p className="text-gray-600 mb-6">
                  Submit your application now and let's start a great journey together!
                </p>
                <Button
                  onClick={handleApply}
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold px-8 py-3 h-auto"
                >
                  Apply Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
