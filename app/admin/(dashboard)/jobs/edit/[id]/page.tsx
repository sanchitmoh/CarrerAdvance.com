"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import BackButton from "@/components/back-button"
import {
  Save,
  ArrowLeft,
  Building,
  MapPin,
  Clock,
  DollarSign,
  Users,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react"
import { toast } from "sonner"

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
  description: string
  requirements: string[]
  benefits: string[]
  contactEmail: string
}

export default function EditJobPage() {
  const params = useParams()
  const router = useRouter()
  const jobId = Number(params.id)

  const [job, setJob] = useState<Job | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const jobTypes = ["Full-time", "Part-time", "Contract", "Internship", "Freelance", "Temporary"]
  const jobStatuses = ["Active", "Pending", "Expired"]

  useEffect(() => {
    loadJob()
  }, [jobId])

  const loadJob = () => {
    setIsLoading(true)
    try {
      const savedJobs = JSON.parse(localStorage.getItem("adminJobs") || "[]")
      const foundJob = savedJobs.find((j: Job) => j.id === jobId)
      
      if (foundJob) {
        // Ensure arrays are properly set
        const normalizedJob = {
          ...foundJob,
          requirements: Array.isArray(foundJob.requirements) ? foundJob.requirements : [],
          benefits: Array.isArray(foundJob.benefits) ? foundJob.benefits : [],
          description: foundJob.description || "",
          contactEmail: foundJob.contactEmail || ""
        }
        setJob(normalizedJob)
      } else {
        toast.error("Job not found")
        router.push("/admin/jobs")
      }
    } catch (error) {
      console.error("Error loading job:", error)
      toast.error("Error loading job data")
    } finally {
      setIsLoading(false)
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!job?.title?.trim()) {
      newErrors.title = "Job title is required"
    }

    if (!job?.company?.trim()) {
      newErrors.company = "Company name is required"
    }

    if (!job?.location?.trim()) {
      newErrors.location = "Location is required"
    }

    if (!job?.salary?.trim()) {
      newErrors.salary = "Salary range is required"
    }

    if (!job?.description?.trim()) {
      newErrors.description = "Job description is required"
    }

    if (!job?.contactEmail?.trim()) {
      newErrors.contactEmail = "Contact email is required"
    } else if (!/\S+@\S+\.\S+/.test(job.contactEmail)) {
      newErrors.contactEmail = "Please enter a valid email address"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!job || !validateForm()) {
      toast.error("Please fix the errors before saving")
      return
    }

    setIsSaving(true)
    try {
      const savedJobs = JSON.parse(localStorage.getItem("adminJobs") || "[]")
      const updatedJobs = savedJobs.map((j: Job) => j.id === jobId ? job : j)
      
      localStorage.setItem("adminJobs", JSON.stringify(updatedJobs))
      
      toast.success("Job updated successfully!")
      router.push("/admin/jobs")
    } catch (error) {
      console.error("Error saving job:", error)
      toast.error("Error saving job data")
    } finally {
      setIsSaving(false)
    }
  }

  const handleInputChange = (field: keyof Job, value: any) => {
    if (!job) return
    
    setJob(prev => prev ? { ...prev, [field]: value } : null)
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleArrayChange = (field: 'requirements' | 'benefits', index: number, value: string) => {
    if (!job) return
    
    const newArray = [...job[field]]
    newArray[index] = value
    setJob(prev => prev ? { ...prev, [field]: newArray } : null)
  }

  const addArrayItem = (field: 'requirements' | 'benefits') => {
    if (!job) return
    
    setJob(prev => prev ? { ...prev, [field]: [...prev[field], ""] } : null)
  }

  const removeArrayItem = (field: 'requirements' | 'benefits', index: number) => {
    if (!job) return
    
    const newArray = job[field].filter((_, i) => i !== index)
    setJob(prev => prev ? { ...prev, [field]: newArray } : null)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
        <BackButton />
        <div className="max-w-4xl mx-auto mt-6">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading job data...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
        <BackButton />
        <div className="max-w-4xl mx-auto mt-6">
          <Card>
            <CardContent className="p-8 text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">Job Not Found</h2>
              <p className="text-gray-600 mb-4">The job you're trying to edit doesn't exist.</p>
              <Button onClick={() => router.push("/admin/jobs")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Jobs
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <BackButton />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Edit Job</h1>
            <p className="text-gray-600">Update job posting details</p>
          </div>
        </div>

        <form onSubmit={handleSave}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Basic Information
                  </CardTitle>
                  <CardDescription>
                    Essential details about the job position
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Job Title *</Label>
                      <Input
                        id="title"
                        value={job.title}
                        onChange={(e) => handleInputChange('title', e.target.value)}
                        placeholder="e.g., Senior Frontend Developer"
                        className={errors.title ? "border-red-500" : ""}
                      />
                      {errors.title && (
                        <p className="text-red-500 text-sm flex items-center gap-1">
                          <AlertCircle className="h-4 w-4" />
                          {errors.title}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="company">Company *</Label>
                      <Input
                        id="company"
                        value={job.company}
                        onChange={(e) => handleInputChange('company', e.target.value)}
                        placeholder="Company name"
                        className={errors.company ? "border-red-500" : ""}
                      />
                      {errors.company && (
                        <p className="text-red-500 text-sm flex items-center gap-1">
                          <AlertCircle className="h-4 w-4" />
                          {errors.company}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="location">Location *</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          id="location"
                          value={job.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                          placeholder="e.g., Remote, San Francisco, CA"
                          className={`pl-10 ${errors.location ? "border-red-500" : ""}`}
                        />
                      </div>
                      {errors.location && (
                        <p className="text-red-500 text-sm flex items-center gap-1">
                          <AlertCircle className="h-4 w-4" />
                          {errors.location}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="type">Job Type</Label>
                      <Select value={job.type} onValueChange={(value) => handleInputChange('type', value)}>
                        <SelectTrigger>
                          <Clock className="h-4 w-4 mr-2" />
                          <SelectValue placeholder="Select job type" />
                        </SelectTrigger>
                        <SelectContent>
                          {jobTypes.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="salary">Salary Range *</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="salary"
                        value={job.salary}
                        onChange={(e) => handleInputChange('salary', e.target.value)}
                        placeholder="e.g., $90,000 - $120,000"
                        className={`pl-10 ${errors.salary ? "border-red-500" : ""}`}
                      />
                    </div>
                    {errors.salary && (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.salary}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Job Description *</Label>
                    <Textarea
                      id="description"
                      value={job.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Describe the job responsibilities, expectations, and what you're looking for in a candidate..."
                      rows={6}
                      className={errors.description ? "border-red-500" : ""}
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.description}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Contact Email *</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      value={job.contactEmail}
                      onChange={(e) => handleInputChange('contactEmail', e.target.value)}
                      placeholder="contact@company.com"
                      className={errors.contactEmail ? "border-red-500" : ""}
                    />
                    {errors.contactEmail && (
                      <p className="text-red-500 text-sm flex items-center gap-1">
                        <AlertCircle className="h-4 w-4" />
                        {errors.contactEmail}
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Requirements */}
              <Card>
                <CardHeader>
                  <CardTitle>Requirements</CardTitle>
                  <CardDescription>
                    Skills, experience, and qualifications needed for this position
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {job.requirements.map((requirement, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={requirement}
                        onChange={(e) => handleArrayChange('requirements', index, e.target.value)}
                        placeholder={`Requirement ${index + 1} (e.g., 5+ years of experience)`}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeArrayItem('requirements', index)}
                        className="flex-shrink-0"
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addArrayItem('requirements')}
                    className="w-full"
                  >
                    + Add Requirement
                  </Button>
                </CardContent>
              </Card>

              {/* Benefits */}
              <Card>
                <CardHeader>
                  <CardTitle>Benefits & Perks</CardTitle>
                  <CardDescription>
                    What you offer to candidates (health insurance, remote work, etc.)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {job.benefits.map((benefit, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={benefit}
                        onChange={(e) => handleArrayChange('benefits', index, e.target.value)}
                        placeholder={`Benefit ${index + 1} (e.g., Health insurance)`}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeArrayItem('benefits', index)}
                        className="flex-shrink-0"
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addArrayItem('benefits')}
                    className="w-full"
                  >
                    + Add Benefit
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Status & Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Status & Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="status">Job Status</Label>
                    <Select value={job.status} onValueChange={(value: "Active" | "Pending" | "Expired") => handleInputChange('status', value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {jobStatuses.map(status => (
                          <SelectItem key={status} value={status}>
                            <div className="flex items-center gap-2">
                              {status === "Active" && <CheckCircle className="h-4 w-4 text-green-600" />}
                              {status === "Pending" && <Clock className="h-4 w-4 text-yellow-600" />}
                              {status === "Expired" && <XCircle className="h-4 w-4 text-red-600" />}
                              {status}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="applications">Applications Received</Label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        id="applications"
                        type="number"
                        value={job.applications}
                        onChange={(e) => handleInputChange('applications', Number(e.target.value))}
                        className="pl-10"
                        min="0"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="datePosted">Date Posted</Label>
                    <Input
                      id="datePosted"
                      type="date"
                      value={job.datePosted}
                      onChange={(e) => handleInputChange('datePosted', e.target.value)}
                    />
                  </div>

                  <div className="pt-4 space-y-3">
                    <Button 
                      type="submit" 
                      className="w-full bg-emerald-600 hover:bg-emerald-700"
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                    
                    <Button 
                      type="button" 
                      variant="outline" 
                      className="w-full"
                      onClick={() => router.push("/admin/jobs")}
                    >
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Preview */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Preview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900 line-clamp-2">{job.title}</h3>
                      <p className="text-sm text-gray-600">{job.company}</p>
                    </div>
                    <Badge className={`
                      ${job.status === "Active" ? "bg-green-100 text-green-800" : ""}
                      ${job.status === "Pending" ? "bg-yellow-100 text-yellow-800" : ""}
                      ${job.status === "Expired" ? "bg-red-100 text-red-800" : ""}
                    `}>
                      {job.status}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="h-3 w-3" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="h-3 w-3" />
                      <span>{job.type}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <DollarSign className="h-3 w-3" />
                      <span>{job.salary}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="h-3 w-3" />
                      <span>{job.applications} applications</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}