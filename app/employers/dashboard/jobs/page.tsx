
"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { toast } from "@/components/ui/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Plus,
  Briefcase,
  MapPin,
  Calendar,
  Eye,
  Edit,
  Trash2,
  Users,
  ArrowLeft,
  Phone,
  MessageCircle,
  Upload,
  Download,
  Check,
  X,
  HelpCircle,
  Building,
  GraduationCap,
  Globe,
  Loader2,
  Sparkles,
  Award,
  FileText,
} from "lucide-react"
import { employerApiService, Job, AddJobRequest } from "@/lib/employer-api"
import { fetchDepartments, fetchDesignations, type Department, type Designation } from "@/lib/hrms-api"
import { getAssetUrl, getBaseUrl, getMeetUrl, getBackendUrl, GOOGLE_LOGIN_PATH } from "@/lib/api-config"
import { jobsApiService } from "@/lib/jobs-api"
import BackButton from "@/components/back-button"

interface Candidate {
  id: number
  name: string
  designation: string
  location: string
  industry: string
  email: string
  phone: string
  avatar: string
  status: "applied" | "reviewed" | "shortlisted" | "contacted" | "rejected" | "hired"
  appliedDate: string
  experience: string
  skills: string[]
  summary: string
  education: {
    degree: string
    institution: string
    year: string
  }[]
      languages: {
        name: string
        proficiency: string
      }[]
      resumeUrl: string
      ctc?: string
      documents?: string[]
  }
 
  export default function JobsPage() {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState("manage")
  const [selectedJob, setSelectedJob] = useState<any>(null)
  const [candidateView, setCandidateView] = useState("applied")
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
  const [showCandidateProfile, setShowCandidateProfile] = useState(false)
  const [editingJob, setEditingJob] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [aiGeneratingJD, setAiGeneratingJD] = useState(false)
  const [states, setStates] = useState<any[]>([])
  const [countries, setCountries] = useState<any[]>([])
  const [cities, setCities] = useState<any[]>([])
  const [loadingStates, setLoadingStates] = useState(false)
  const [loadingCities, setLoadingCities] = useState(false)
  const [aiSuggestingSkills, setAiSuggestingSkills] = useState(false)
  const [selectedJobFilter, setSelectedJobFilter] = useState<string | null>(null)

  // Fetch jobs from API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true)
        // Load employer's own jobs for dashboard
        const response = await employerApiService.getEmployerJobs()
        const mapped = (response.jobs || []).map((j: any) => ({
          id: j.id,
          title: j.title,
          location: j.location ?? j.job_location ?? j.location_search ?? '',
          type: j.type ?? j.job_type ?? '',
          // created_date is datetime; fallback if invalid
          datePosted: j.datePosted ?? j.created_date ?? j.updated_date ?? '',
          status: j.status ?? (j.is_status === 'active' ? 'Active' : 'Inactive'),
          description: j.description ?? '',
          requirements: j.requirements ?? '',
          salary: j.salary ?? (j.min_salary && j.max_salary ? `$${Number(j.min_salary).toLocaleString()} - $${Number(j.max_salary).toLocaleString()}` : ''),
          candidates: j.candidates ?? { applied: 0, reviewed: 0, shortlisted: 0, contacted: 0, rejected: 0, hired: 0 },
        }))
        setJobs(mapped)
        setError(null)
      } catch (err) {
        console.error("Error fetching jobs:", err)
        setError("Failed to load jobs. Please try again later.")
        // Keep sample data for development
        setJobs(sampleJobs)
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [])

  // Sample job data for fallback
  const sampleJobs = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      location: "San Francisco, CA",
      type: "Full-time",
      datePosted: "2024-01-15",
      status: "Active",
      description: "We are looking for a Senior Frontend Developer to join our team...",
      requirements: "5+ years of experience with React, TypeScript, and modern web technologies",
      salary: "$120,000 - $150,000",
      candidates: {
        applied: 24,
        reviewed: 8,
        shortlisted: 3,
        contacted: 2,
        rejected: 5,
        hired: 1,
      },
    },
   
    {
      id: 2,
      title: "Product Manager",
      location: "Remote",
      type: "Full-time",
      datePosted: "2024-01-10",
      status: "Active",
      description: "Seeking an experienced Product Manager to drive product strategy...",
      requirements: "3+ years of product management experience, strong analytical skills",
      salary: "$100,000 - $130,000",
      candidates: {
        applied: 18,
        reviewed: 6,
        shortlisted: 2,
        contacted: 1,
        rejected: 3,
        hired: 0,
      },
    },
  ]
 
  // Initialize jobs state
  const [jobs, setJobs] = useState<any[]>([])
  // Pagination state (5 per page)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 5

  // Reset to first page when jobs list changes
  useEffect(() => {
    setCurrentPage(1)
  }, [jobs])

  // Pagination helpers
  const totalPages = Math.max(1, Math.ceil(jobs.length / pageSize))
  const start = (currentPage - 1) * pageSize
  const end = start + pageSize
  const displayJobs = jobs.slice(start, end)
  const getPageNumbers = () => {
    const maxButtons = 5
    const total = Math.max(1, totalPages)
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2))
    let endPage = startPage + maxButtons - 1
    if (endPage > total) {
      endPage = total
      startPage = Math.max(1, endPage - maxButtons + 1)
    }
    const pages: number[] = []
    for (let p = startPage; p <= endPage; p++) pages.push(p)
    return pages
  }

  const fetchStates = async (countryId: string) => {
    try {
      setLoadingStates(true)
      const response = await fetch(getBaseUrl(`/common_api/state?country_id=${countryId}`), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      })
      const data = await response.json()
      if (data.status === 1 && data.data) {
        setStates(data.data)
      } else {
        setStates([])
      }
    } catch (error) {
      console.error('Error fetching states:', error)
      setStates([])
    } finally {
      setLoadingStates(false)
    }
  }

  const fetchCountries = async () => {
    try {
      const response = await fetch(getBaseUrl('/api/common_api/country'), {
        method: 'GET',
        credentials: 'include'
      })
      if (!response.ok) {
        setCountries([])
        return
      }
      const data = await response.json().catch(() => ({}))
      if (Array.isArray(data?.data)) {
        // Expecting rows with id and name
        setCountries(data.data)
      } else {
        setCountries([])
      }
    } catch (e) {
      setCountries([])
    }
  }

  useEffect(() => {
    fetchCountries()
  }, [])

  const fetchCities = async (stateId: string) => {
    try {
      setLoadingCities(true)
      const response = await fetch(getBaseUrl(`/common_api/cities?state_id=${stateId}`), {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      })
      const data = await response.json()
      if (data.status === 1 && data.data) {
        setCities(data.data)
      } else {
        setCities([])
      }
    } catch (error) {
      console.error('Error fetching cities:', error)
      setCities([])
    } finally {
      setLoadingCities(false)
    }
  }
 
  // Sample candidates data - ensure it's never undefined
  const [candidates, setCandidates] = useState<Record<string, Candidate[]>>({
    applied: [
      {
        id: 1,
        name: "Dwan Mohite",
        designation: "Senior Software Developer Engineer",
        location: "Beaupre, Canada",
        industry: "Technology",
        email: "dwanmohite@gmail.com",
        phone: "09987547745",
        avatar: "/placeholder.svg?height=40&width=40",
        status: "applied",
        appliedDate: "2024-01-20",
        experience: "5+ years",
        skills: ["React", "Node.js", "TypeScript", "Python", "AWS"],
        summary:
          "Highly motivated and detail-oriented software engineer with 5+ years of experience crafting innovative software solutions with a passion for coding and delivering high-quality results. Collaborative problem-solver with expertise in various programming languages. Passionate about coding and staying up-to-date with the latest technologies and trends.",
        education: [
          {
            degree: "Bachelor of Computer Science",
            institution: "University of Technology",
            year: "2019",
          },
        ],
        languages: [
          { name: "English", proficiency: "Native" },
          { name: "French", proficiency: "Intermediate" },
        ],
        resumeUrl: "/resume-dwan-mohite.pdf",
      },
      {
        id: 2,
        name: "Sarah Johnson",
        designation: "Frontend Developer",
        location: "San Francisco, CA",
        industry: "Technology",
        email: "sarah.johnson@email.com",
        phone: "+1-555-0123",
        avatar: "/placeholder.svg?height=40&width=40",
        status: "applied",
        appliedDate: "2024-01-18",
        experience: "3+ years",
        skills: ["React", "JavaScript", "CSS", "HTML", "Git"],
        summary: "Creative frontend developer with a passion for creating beautiful and functional user interfaces.",
        education: [
          {
            degree: "Bachelor of Design",
            institution: "Art Institute",
            year: "2021",
          },
        ],
        languages: [
          { name: "English", proficiency: "Native" },
          { name: "Spanish", proficiency: "Beginner" },
        ],
        resumeUrl: "/resume-sarah-johnson.pdf",
      },
    ],
    reviewed: [],
    shortlisted: [
      {
        id: 3,
        name: "Emily Davis",
        designation: "Senior Developer",
        location: "Austin, TX",
        industry: "Technology",
        email: "emily.davis@email.com",
        phone: "+1-555-0456",
        avatar: "/placeholder.svg?height=40&width=40",
        status: "shortlisted",
        appliedDate: "2024-01-16",
        experience: "6+ years",
        skills: ["React", "Node.js", "MongoDB", "Docker", "Kubernetes"],
        summary: "Experienced full-stack developer with expertise in modern web technologies and cloud platforms.",
        education: [
          {
            degree: "Master of Computer Science",
            institution: "Tech University",
            year: "2018",
          },
        ],
        languages: [{ name: "English", proficiency: "Native" }],
        resumeUrl: "/resume-emily-davis.pdf",
      },
    ],
    contacted: [],
    rejected: [],
    hired: [],
  })

  const [jobForm, setJobForm] = useState({
    title: "",
    location: "",
    type: "full-time",
    positions: "1",
    experience: "entry",
    salaryMin: "",
    salaryMax: "",
    salaryPeriod: "monthly",
    skills: "",
    description: "",
    requirements: "",
    country: "",
    province: "",
    city: "",
    fullAddress: "",
    expiryDate: "",
    applicationSettings: "email",
    hoursPerWeek: "40",
    schedule: "flexible",
    urgency: "medium",
    startDate: "",
    deadline: "",
    notificationEmail: "",
    allowCalls: false,
    phoneNumber: "",
  })

  // Employee Management modal state
  const [showEmployeeForm, setShowEmployeeForm] = useState(false)
  const [employeeSubmitting, setEmployeeSubmitting] = useState(false)
  const [departments, setDepartments] = useState<Department[]>([])
  const [designations, setDesignations] = useState<Designation[]>([])
  const [imageUploading, setImageUploading] = useState(false)
  // Mirror the Employees page add form
  const [employeeForm, setEmployeeForm] = useState({
    name: "",
    email: "",
    mobile: "",
    empType: "",
    workingHours: "",
    salary: "",
    income: "",
    joiningDate: "",
    empId: "",
    image: "",
    emergencyContactName: "",
    emergencyContactNumber: "",
    emergencyContact: "",
    department: "",
    position: "",
    seekerId: "",
  })

  // Load departments and designations for dropdowns
  useEffect(() => {
    const loadDeps = async () => {
      try {
        const [deps, dess] = await Promise.all([fetchDepartments(), fetchDesignations()])
        setDepartments(deps)
        setDesignations(dess)
      } catch (e) {
        setDepartments([])
        setDesignations([])
      }
    }
    loadDeps()
  }, [])

  const openEmployeeFormWithCandidate = (candidate: Candidate | null) => {
    if (!candidate) return
    setSelectedCandidate(candidate)
    setEmployeeForm((prev) => ({
      ...prev,
      name: candidate.name || "",
      email: candidate.email || "",
      mobile: candidate.phone || "",
      position: candidate.designation || "",
      empType: "fulltime",
      joiningDate: new Date().toISOString().split("T")[0],
      seekerId: (((candidate as any)?.seeker_id)
        || (candidate as any)?.jobseeker_id
        || (candidate as any)?.seeker_id
        || (candidate as any)?.seeker?.id
        || (candidate as any)?.jobseekerId
        || (candidate as any)?.seekerId
        || (candidate as any)?.id
        || "").toString()
    }))
    try {
      const sid = (candidate as any)?.seeker_id || (candidate as any)?.jobseeker_id || (candidate as any)?.seeker?.id
      console.log('[Jobs] openEmployeeFormWithCandidate -> candidate id:', candidate?.id, 'derived seeker_id:', sid)
    } catch {}
    setShowEmployeeForm(true)
  }

  const submitEmployeeForm = async (redirectAfter: boolean) => {
    try {
      setEmployeeSubmitting(true)

      // Resolve department/designation IDs by name (like Employees page)
      const dept = departments.find((d) => d.name === employeeForm.department)
      const desig = designations.find((x) => x.name === employeeForm.position && (!dept || x.department_id === dept.id))

      // Try to extract jobseeker id from the selected candidate object
      const seekerId = (selectedCandidate as any)?.seeker_id
        || (selectedCandidate as any)?.jobseeker_id
        || (selectedCandidate as any)?.seeker?.id
        || (selectedCandidate as any)?.id
        || null

      const payload: any = {
        emp_name: employeeForm.name,
        email: employeeForm.email,
        mobile: employeeForm.mobile,
        emp_type: employeeForm.empType,
        working_hours: employeeForm.workingHours,
        salary: employeeForm.salary,
        income: employeeForm.income,
        joining_date: employeeForm.joiningDate,
        emp_id: employeeForm.empId,
        image: employeeForm.image,
        emergency_contact_name: employeeForm.emergencyContactName,
        emergency_contact_phone: employeeForm.emergencyContactNumber,
        emergency_contact: employeeForm.emergencyContact,
        work_status: 'active',
        department_id: dept ? dept.id : null,
        designation_id: desig ? desig.id : null,
      }
      const seekerIdFromForm = (employeeForm.seekerId || '').toString().trim()
      const fallbackSelectedId = seekerId ? String(seekerId) : (selectedCandidate?.id ? String((selectedCandidate as any).id) : '')
      const seekerIdFinal = seekerIdFromForm || fallbackSelectedId
      if (seekerIdFinal) {
        const n = Number(seekerIdFinal)
        if (!Number.isNaN(n) && n > 0) payload.seeker_id = n
      }
      try {
        console.log('[Jobs] submitEmployeeForm -> seekerIdFromForm:', seekerIdFromForm, 'selectedCandidate.seeker_id:', (selectedCandidate as any)?.seeker_id, 'final payload.seeker_id:', (payload as any)?.seeker_id)
      } catch {}
      if (selectedCandidate?.id) {
        payload.candidate_id = selectedCandidate.id
      }

      const url = getBaseUrl('/company-employees')
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok || !json?.success) {
        throw new Error(json?.error || json?.message || 'Failed to add employee')
      }

      toast({ title: 'Employee created', description: 'Candidate added to employee management.' })
      setShowEmployeeForm(false)
      setEmployeeForm({
        name: "",
        email: "",
        mobile: "",
        empType: "",
        workingHours: "",
        salary: "",
        income: "",
        joiningDate: "",
        empId: "",
        image: "",
        emergencyContactName: "",
        emergencyContactNumber: "",
        emergencyContact: "",
        department: "",
        position: "",
        seekerId: "",
      })
      if (redirectAfter) {
        router.push('/employers/dashboard/employee-managment/employees')
      }
    } catch (e: any) {
      console.error(e)
      toast({ title: 'Error', description: e?.message || 'Failed to add employee.', variant: 'destructive' })
    } finally {
      setEmployeeSubmitting(false)
    }
  }

  const handleEmployeeImageUpload = async (file: File) => {
    try {
      if (!file) return
      setImageUploading(true)
      const res = await employerApiService.uploadProfilePicture(file)
      if (res?.success && res?.file_path) {
        setEmployeeForm((p) => ({ ...p, image: String(res.file_path || '') }))
        toast({ title: 'Uploaded', description: 'Profile picture uploaded.' })
      } else {
        toast({ title: 'Upload failed', description: res?.message || 'Could not upload image.', variant: 'destructive' })
      }
    } catch (e: any) {
      console.error(e)
      toast({ title: 'Error', description: e?.message || 'Failed to upload image.', variant: 'destructive' })
    } finally {
      setImageUploading(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setJobForm((prev) => ({ ...prev, [field]: value }))
   
    // Handle dynamic dropdowns
    if (field === 'country' && typeof value === 'string' && value) {
      fetchStates(value)
      // Reset province and city when country changes
      setJobForm((prev) => ({
        ...prev,
        country: value,
        province: '',
        city: ''
      }))
    } else if (field === 'province' && typeof value === 'string' && value) {
      fetchCities(value)
      // Reset city when province changes
      setJobForm((prev) => ({
        ...prev,
        province: value,
        city: ''
      }))
    }
  }

  const handleSubmitJob = async () => {
    try {
      // Prepare job data
      const jobData: AddJobRequest = {
        title: jobForm.title,
        location: jobForm.location,
        type: jobForm.type,
        description: jobForm.description,
        requirements: jobForm.requirements,
        salary_min: parseInt(jobForm.salaryMin) || 0,
        salary_max: parseInt(jobForm.salaryMax) || 0,
        salary_period: jobForm.salaryPeriod,
        skills: jobForm.skills.split(',').map(skill => skill.trim()),
        country: jobForm.country,
        province: jobForm.province,
        city: jobForm.city,
        full_address: jobForm.fullAddress,
        expiry_date: jobForm.expiryDate,
        application_method: jobForm.applicationSettings,
        hours_per_week: parseInt(jobForm.hoursPerWeek) || 40,
        schedule: jobForm.schedule,
        urgency: jobForm.urgency,
        start_date: jobForm.startDate,
        deadline: jobForm.deadline,
        notification_email: jobForm.notificationEmail,
        allow_calls: jobForm.allowCalls,
        phone_number: jobForm.phoneNumber,
        positions: parseInt(jobForm.positions) || 1,
        experience_level: jobForm.experience
      }
     
      if (editingJob) {
        // Update existing job
        setLoading(true)
        await employerApiService.updateJob(editingJob.id, jobData)
        toast({
          title: "Success",
          description: "Job updated successfully",
        })
       
        // Refresh jobs list
        const updatedJobsResponse = await jobsApiService.getJobs()
        setJobs(updatedJobsResponse.data.jobs || [])
        setEditingJob(null)
      } else {
        // Add new job
        setLoading(true)
        const res = await employerApiService.addJob(jobData).catch((e: any) => ({ success: false, message: e?.message }))
        if (res && typeof res === 'object' && 'success' in res && res.success === false) {
          toast({ title: 'Error', description: res?.message || 'Failed to post job.', variant: 'destructive' })
          return
        }
        toast({ title: 'Success', description: 'Job posted successfully.' })
        
        // Refresh jobs list
        const updatedJobs = await jobsApiService.getJobs()
        setJobs(updatedJobs.data.jobs || [])
      }
    } catch (err) {
      console.error("Error submitting job:", err)
      toast({
        title: "Error",
        description: "Failed to submit job. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }

    // Reset form
    setJobForm({
      title: "",
      location: "",
      type: "full-time",
      positions: "1",
      experience: "entry",
      salaryMin: "",
      salaryMax: "",
      salaryPeriod: "monthly",
      skills: "",
      description: "",
      requirements: "",
      country: "",
      province: "",
      city: "",
      fullAddress: "",
      expiryDate: "",
      applicationSettings: "email",
      hoursPerWeek: "40",
      schedule: "flexible",
      urgency: "medium",
      startDate: "",
      deadline: "",
      notificationEmail: "",
      allowCalls: false,
      phoneNumber: "",
    })
  }

  const handleGenerateJobDescription = async () => {
    try {
      const title = (jobForm.title || '').trim()
      const skills = (jobForm.skills || '').trim()
      if (!title || !skills) {
        toast({
          title: "Missing details",
          description: "Enter Job Title and Required Skills first.",
          variant: "destructive",
        })
        return
      }
      setAiGeneratingJD(true)
      const res = await fetch(getBaseUrl('/api/ai/generate_jd'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ job_title: title, skills })
      })
      const data = await res.json()
      const jd = data?.jd || data?.description || ''
      if (jd) {
        setJobForm((prev) => ({ ...prev, description: jd }))
        toast({ title: 'Generated', description: 'Job description generated with AI.' })
      } else {
        toast({ title: 'No content', description: 'AI did not return a description.', variant: 'destructive' })
      }
    } catch (e: any) {
      console.error('AI JD error:', e)
      toast({ title: 'Error', description: e?.message || 'Failed to generate description.', variant: 'destructive' })
    } finally {
      setAiGeneratingJD(false)
    }
  }

  const handleEditJob = async (job: any) => {
    try {
      setLoading(true)
      // Get detailed job information from API
      const jobDetail: any = await employerApiService.getJobById(job.id)
      setEditingJob(jobDetail)
     
      // Parse salary range if available
      let salaryMin = ""
      let salaryMax = ""
      if (jobDetail.salary) {
        const salaryMatch = jobDetail.salary.match(/\$?(\d+[,\d]*)\s*-\s*\$?(\d+[,\d]*)/)
        if (salaryMatch) {
          salaryMin = salaryMatch[1].replace(/,/g, '')
          salaryMax = salaryMatch[2].replace(/,/g, '')
        }
      }
     
      // Convert skills array to comma-separated string if needed
      const skillsString = Array.isArray(jobDetail.skills)
        ? jobDetail.skills.join(', ')
        : jobDetail.skills || ''
     
      setJobForm({
        title: jobDetail.title || "",
        location: jobDetail.location || "",
        type: jobDetail.type?.toLowerCase() || "full-time",
        positions: (jobDetail.total_positions != null ? String(jobDetail.total_positions) : (jobDetail.positions?.toString() || "1")),
        experience: jobDetail.experience || jobDetail.experience_level || "entry",
        salaryMin: jobDetail.salary_min?.toString() || salaryMin,
        salaryMax: jobDetail.salary_max?.toString() || salaryMax,
        salaryPeriod: jobDetail.salary_period || "monthly",
        skills: skillsString,
        description: jobDetail.description || "",
        requirements: jobDetail.requirements || "",
        country: jobDetail.country || "",
        province: (jobDetail.province || jobDetail.state || "").toString(),
        city: (jobDetail.city || "").toString(),
        fullAddress: jobDetail.full_address || "",
        expiryDate: jobDetail.expiry_date || "",
        applicationSettings: jobDetail.application_method || "email",
        hoursPerWeek: jobDetail.hours_per_week?.toString() || "40",
        schedule: jobDetail.schedule || "flexible",
        urgency: (jobDetail.quickly_need_hire || jobDetail.urgency || "medium").toString(),
        startDate: (jobDetail.planned_start_job_date || jobDetail.start_date || "").toString(),
        deadline: (jobDetail.setting_deadline_date || jobDetail.deadline || "").toString(),
        notificationEmail: (jobDetail.setting_dailyupdate || jobDetail.notification_email || "").toString(),
        allowCalls: Boolean(jobDetail.allow_calls || jobDetail.allow_direct_calls || false),
        phoneNumber: (jobDetail.shared_phone_number || jobDetail.phone_number || "").toString(),
      })
      // Ensure dependent dropdowns are populated when editing existing job
      if (jobDetail.country) {
        fetchStates(String(jobDetail.country))
      }
      if (jobDetail.province || jobDetail.state) {
        fetchCities(String(jobDetail.province || jobDetail.state))
      }
      setActiveTab("post")
    } catch (err) {
      console.error("Error fetching job details:", err)
      toast({
        title: "Error",
        description: "Failed to load job details. Please try again.",
        variant: "destructive",
      })
     
      // Fallback to basic job info
      setEditingJob(job)
      setJobForm({
        title: job.title || "",
        location: job.location || "",
        type: job.type?.toLowerCase() || "full-time",
        positions: "1",
        experience: "entry",
        salaryMin: "",
        salaryMax: "",
        salaryPeriod: "monthly",
        skills: "",
        description: job.description || "",
        requirements: job.requirements || "",
        country: "",
        province: "",
        city: "",
        fullAddress: "",
        expiryDate: "",
        applicationSettings: "email",
        hoursPerWeek: "40",
        schedule: "flexible",
        urgency: "medium",
        startDate: "",
        deadline: "",
        notificationEmail: "",
        allowCalls: false,
        phoneNumber: "",
      })
      setActiveTab("post")
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteJob = async (jobId: number) => {
    try {
      setLoading(true)
      await employerApiService.deleteJob(jobId)
      toast({
        title: "Success",
        description: "Job deleted successfully",
      })
     
      // Refresh jobs list using the employer API to get updated list
      const updatedJobsResponse = await employerApiService.getEmployerJobs()
      setJobs(updatedJobsResponse.jobs || [])
    } catch (err) {
      console.error("Error deleting job:", err)
      toast({
        title: "Error",
        description: "Failed to delete job. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleViewCandidates = async (job: any) => {
    try {
      setLoading(true)
      setSelectedJob(job)
     
      // Fetch candidates from API
      const candidatesData: any = await employerApiService.getJobCandidates(job.id)
     
      // Initialize organized candidates structure
      const organizedCandidates: Record<string, Candidate[]> = {
        applied: [],
        reviewed: [],
        shortlisted: [],
        contacted: [],
        rejected: [],
        hired: []
      }
     
      // Check if we have valid data from the API
      if (candidatesData && typeof candidatesData === 'object') {
        // Process the API response - structure may vary based on your API
        if (Array.isArray(candidatesData)) {
          candidatesData.forEach((candidate: any) => {
            const status = candidate.status?.toLowerCase() || 'applied'
            const normalized = {
              ...candidate,
              seeker_id:
                candidate?.seeker_id ||
                candidate?.jobseeker_id ||
                candidate?.seeker?.id ||
                candidate?.js_id ||
                candidate?.user_id ||
                candidate?.seekerId ||
                candidate?.jobseekerId ||
                candidate?.id ||
                null,
            }
            if (organizedCandidates[status]) {
              organizedCandidates[status].push(normalized as any)
            } else {
              organizedCandidates.applied.push(normalized as any)
            }
          })
        } else if (candidatesData.data && Array.isArray(candidatesData.data)) {
          // If the API returns already categorized candidates
          candidatesData.data.forEach((candidate: any) => {
            const status = candidate.status?.toLowerCase() || 'applied'
            const normalized = {
              ...candidate,
              seeker_id:
                candidate?.seeker_id ||
                candidate?.jobseeker_id ||
                candidate?.seeker?.id ||
                candidate?.js_id ||
                candidate?.user_id ||
                candidate?.seekerId ||
                candidate?.jobseekerId ||
                candidate?.id ||
                null,
            }
            if (organizedCandidates[status]) {
              organizedCandidates[status].push(normalized as any)
            } else {
              organizedCandidates.applied.push(normalized as any)
            }
          })
        }
      }
     
      // Always set candidates to ensure the state is properly initialized
      setCandidates(organizedCandidates)
      setActiveTab('manage')
    } catch (err) {
      console.error("Error fetching candidates:", err)
      toast({
        title: "Error",
        description: "Failed to load candidates. Please try again.",
        variant: "destructive",
      })
     
      // Set empty candidates structure on error to prevent undefined access
      setCandidates({
        applied: [],
        reviewed: [],
        shortlisted: [],
        contacted: [],
        rejected: [],
        hired: []
      })
    } finally {
      setLoading(false)
    }
  }

  const moveCandidateToStatus = async (candidateId: number, newStatus: string) => {
    try {
      setLoading(true)
      if (!selectedJob) {
        toast({
          title: "Error",
          description: "No job selected",
          variant: "destructive",
        })
        return
      }

      // optimistic update
      const prevCandidates = JSON.parse(JSON.stringify(candidates)) as Record<string, Candidate[]>
      let movedCandidate: Candidate | null = null
      const groups = Object.keys(prevCandidates)
      for (const group of groups) {
        const idx = (prevCandidates[group] || []).findIndex((c) => c.id === candidateId)
        if (idx !== -1) {
          movedCandidate = { ...prevCandidates[group][idx], status: newStatus as any }
          prevCandidates[group].splice(idx, 1)
          break
        }
      }
      if (!movedCandidate) {
        // If not found in current lists, try selectedCandidate as source
        if (selectedCandidate && selectedCandidate.id === candidateId) {
          movedCandidate = { ...selectedCandidate, status: newStatus as any }
        }
      }
      if (movedCandidate) {
        if (!prevCandidates[newStatus]) prevCandidates[newStatus] = [] as any
        prevCandidates[newStatus] = [movedCandidate as Candidate, ...(prevCandidates[newStatus] || [])]
        setCandidates(prevCandidates)
        if (selectedCandidate && selectedCandidate.id === candidateId) {
          setSelectedCandidate(movedCandidate)
        }
      }

      // send to API
      await employerApiService.updateCandidateStatus(
        selectedJob.id,
        candidateId,
        newStatus as "reviewed" | "shortlisted" | "rejected" | "hired" | "interviewed" | "contacted"
      )

      toast({
        title: "Success",
        description: `Candidate moved to ${newStatus} successfully`,
      })
    } catch (err) {
      console.error("Error updating candidate status:", err)
      toast({
        title: "Error",
        description: "Failed to update candidate status. Reverting.",
        variant: "destructive",
      })
      // reload from API to revert
      try {
        if (selectedJob) {
          const updated = await employerApiService.getJobCandidates(selectedJob.id)
          // Basic rebuild assuming flat array
          const rebuilt: Record<string, Candidate[]> = {
            applied: [], reviewed: [], shortlisted: [], contacted: [], rejected: [], hired: []
          }
          ;(Array.isArray(updated) ? updated : ((updated as any)?.data || [])).forEach((c: any) => {
            const s = (c.status || 'applied').toLowerCase()
            const key = rebuilt[s] ? s : 'applied'
            rebuilt[key].push(c)
          })
          setCandidates(rebuilt)
        }
      } catch (e) {
        console.error("Failed to reload candidates after error:", e)
      }
    } finally {
      setLoading(false)
    }
  }

  const CandidateCard = ({ candidate, extraFooter }: { candidate: Candidate; extraFooter?: React.ReactNode }) => (
    <Card
      className="hover:shadow-md transition-shadow cursor-pointer border border-gray-200 hover:border-emerald-300 rounded-xl"
      onClick={() => {
        setSelectedCandidate(candidate)
        setShowCandidateProfile(true)
        // Auto-move to reviewed when viewing an applied candidate
        if (candidate.status === 'applied' && selectedJob) {
          employerApiService
            .updateCandidateStatus(selectedJob.id, candidate.id, 'reviewed')
            .then(() => {
              setCandidates((prev) => {
                const updated = { ...prev }
                updated.applied = (prev.applied || []).filter((c) => c.id !== candidate.id)
                const updatedCandidate = { ...candidate, status: 'reviewed' as const }
                updated.reviewed = [updatedCandidate, ...(prev.reviewed || [])]
                return updated
              })
              setSelectedCandidate((prevSel) => (prevSel && prevSel.id === candidate.id ? { ...prevSel, status: 'reviewed' } : prevSel))
            })
            .catch((e) => console.error('Failed to auto-mark reviewed:', e))
        }
      }}
    >
      <CardContent className="p-4 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-4 space-y-3 sm:space-y-0">
          <Avatar className="w-12 h-12">
            <AvatarImage src={getAssetUrl(candidate.avatar || "/placeholder.svg")} alt={candidate.name} />
            <AvatarFallback className="bg-emerald-100 text-emerald-700">
              {candidate.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div>
              <div className="min-w-0 flex-1 pr-2">
                <h4 className="font-semibold text-gray-900 truncate">{candidate.name}</h4>
                <p className="text-xs sm:text-sm text-gray-600">{candidate.designation}</p>
              </div>
              <div className="mt-2 flex flex-row flex-wrap items-center gap-1 sm:gap-2 justify-start sm:justify-end">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-emerald-600 border-emerald-600 hover:bg-emerald-50 bg-transparent px-3 h-7 rounded-full"
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedCandidate(candidate)
                    setShowCandidateProfile(true)
                    if (candidate.status === 'applied' && selectedJob) {
                      employerApiService
                        .updateCandidateStatus(selectedJob.id, candidate.id, 'reviewed')
                        .then(() => {
                          setCandidates((prev) => {
                            const updated = { ...prev }
                            updated.applied = (prev.applied || []).filter((c) => c.id !== candidate.id)
                            const updatedCandidate = { ...candidate, status: 'reviewed' as const }
                            updated.reviewed = [updatedCandidate, ...(prev.reviewed || [])]
                            return updated
                          })
                          setSelectedCandidate((prevSel) => (prevSel && prevSel.id === candidate.id ? { ...prevSel, status: 'reviewed' } : prevSel))
                        })
                        .catch((err) => console.error('Failed to auto-mark reviewed from View button:', err))
                    }
                  }}
                >
                  <Eye className="h-3 w-3 mr-1" />
                  <span className="hidden xs:inline">View</span>
                </Button>
               
                {/* For Hired candidates: Show only View and + buttons */}
                {candidate.status === "hired" ? (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-blue-600 border-blue-600 hover:bg-blue-50 px-2 py-1 h-7 bg-transparent"
                    onClick={(e) => {
                      e.stopPropagation()
                      openEmployeeFormWithCandidate(candidate)
                    }}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                ) : (
                  /* For non-Hired candidates: Show the regular action buttons */
                  <>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-green-600 border-green-600 hover:bg-green-50 px-2 py-1 h-7 bg-transparent"
                      onClick={(e) => {
                        e.stopPropagation()
                        const nextStatus = (candidate.status === 'shortlisted' || candidate.status === 'contacted') ? 'hired' : 'shortlisted'
                        moveCandidateToStatus(candidate.id, nextStatus)
                      }}
                    >
                      <Check className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 border-red-600 hover:bg-red-50 px-2 py-1 h-7 bg-transparent"
                      onClick={(e) => {
                        e.stopPropagation()
                        moveCandidateToStatus(candidate.id, "rejected")
                      }}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-yellow-600 border-yellow-600 hover:bg-yellow-50 px-2 py-1 h-7 bg-transparent"
                      onClick={(e) => {
                        e.stopPropagation()
                        moveCandidateToStatus(candidate.id, "reviewed")
                      }}
                    >
                      <HelpCircle className="h-3 w-3" />
                    </Button>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
              <span className="flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                {candidate.location}
              </span>
              <span>{candidate.industry}</span>
            </div>
            <p className="text-xs text-gray-500 mt-1 break-all">{candidate.email}</p>
            <div className="flex flex-wrap gap-1 mt-2">
              {candidate.skills.slice(0, 3).map((skill, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {candidate.skills.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{candidate.skills.length - 3}
                </Badge>
              )}
            </div>
          </div>
         
        </div>
        {extraFooter && (
          <div className="mt-3">
            {extraFooter}
          </div>
        )}
      </CardContent>
    </Card>
  )

  const CandidateProfileModal = () => {
    if (!selectedCandidate) return null

    return (
      <Dialog open={showCandidateProfile} onOpenChange={setShowCandidateProfile}>
        <DialogContent className="max-w-[95vw] sm:max-w-2xl lg:max-w-6xl max-h-[90vh] overflow-hidden p-0">
          <DialogTitle className="sr-only">Candidate Profile</DialogTitle>
          <div className="flex h-[80vh]">
            {/* Sidebar with candidate list */}
            <div className="hidden md:block w-80 border-r bg-gray-50 overflow-y-auto">
              <div className="p-4">
                <Button
                  variant="ghost"
                  className="mb-4 text-blue-600 hover:text-blue-700"
                  onClick={() => setShowCandidateProfile(false)}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to list
                </Button>
                <h3 className="font-semibold mb-4">Candidates</h3>
                <div className="space-y-2">
                  {candidates && candidates[candidateView] && candidates[candidateView].length > 0 ? (
                    candidates[candidateView].map((candidate) => (
                      <Card
                        key={candidate.id}
                        className={`cursor-pointer transition-colors ${
                          selectedCandidate?.id === candidate.id ? "border-blue-500 bg-blue-50" : "hover:bg-gray-100"
                        }`}
                        onClick={() => setSelectedCandidate(candidate)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-8 h-8">
                              <AvatarImage src={getAssetUrl(candidate.avatar || "/placeholder.svg")} alt={candidate.name} />
                              <AvatarFallback className="bg-emerald-100 text-emerald-700 text-xs">
                                {candidate.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{candidate.name}</p>
                              <p className="text-xs text-gray-500 truncate">{candidate.designation}</p>
                              <p className="text-xs text-gray-400 truncate">{candidate.location}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-500 text-sm">
                      No candidates in this category
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Main profile content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 sm:p-6">
                {/* Header */}
                <div className="text-center mb-6">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 break-words">{selectedCandidate.name}</h1>
                  <p className="text-gray-600 mb-4">
                    {selectedCandidate.designation} at EY Technology • {selectedCandidate.location}
                  </p>

                  {/* Action buttons */}
                  <div className="flex flex-col sm:flex-row justify-center gap-2 sm:space-x-4 mb-6">
                    <Button className="bg-blue-600 hover:bg-blue-700" onClick={async () => {
                      try {
                        if (!selectedJob || !selectedCandidate) return
                        const interviewerEmail = (await employerApiService.getProfile()).data?.employer?.email || ''
                        const formUrl = `${window.location.origin}/employers/interview-form?job_id=${encodeURIComponent(selectedJob.id)}&job_title=${encodeURIComponent(selectedJob.title || '')}&candidate_email=${encodeURIComponent(selectedCandidate.email || '')}&candidate_name=${encodeURIComponent(selectedCandidate.name || '')}&employer_email=${encodeURIComponent(interviewerEmail)}`
                        const redir = encodeURIComponent(formUrl)
                        const loginUrl = getBackendUrl(`${GOOGLE_LOGIN_PATH}?job_id=${encodeURIComponent(selectedJob.id)}&candidate_email=${encodeURIComponent(selectedCandidate.email || '')}&candidate_name=${encodeURIComponent(selectedCandidate.name || '')}&employer_email=${encodeURIComponent(interviewerEmail)}&redirect=${redir}&return_url=${redir}&next=${redir}`)
                        window.open(loginUrl, '_blank')
                        // move to interviewed and switch to Contacted tab
                        await moveCandidateToStatus(selectedCandidate.id, 'interviewed')
                        setCandidateView('contacted')
                      } catch (e: any) {
                        console.error(e)
                        toast({ title: 'Error', description: e.message || 'Failed to open interview scheduler', variant: 'destructive' })
                      }
                    }}>
                      <Calendar className="h-4 w-4 mr-2" />
                      Set up interview
                    </Button>
                    <Button
                      variant="outline"
                      onClick={async () => {
                        try {
                          const phoneRaw = selectedCandidate?.phone || ''
                          if (!phoneRaw) {
                            toast({ title: 'No phone number', description: 'This candidate has no phone number on file.', variant: 'destructive' })
                            return
                          }
                          const phone = phoneRaw.replace(/[^\d+]/g, '')
                          const jobTitle = selectedJob?.title ? ` for \"${selectedJob.title}\"` : ''
                          const message = `Hi ${selectedCandidate?.name || ''}, you have been shortlisted for an interview${jobTitle}. You will receive an email with details shortly. Please reply to confirm.`
                          const waUrl = `https://wa.me/${encodeURIComponent(phone)}?text=${encodeURIComponent(message)}`
                          window.open(waUrl, '_blank')
                          // mark contacted and jump to Contacted tab
                          await moveCandidateToStatus(selectedCandidate.id, 'contacted')
                          setCandidateView('contacted')
                        } catch (e: any) {
                          console.error(e)
                          toast({ title: 'Error', description: e?.message || 'Failed to open WhatsApp', variant: 'destructive' })
                        }
                      }}
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                    <Button variant="outline" onClick={async () => {
                      // open tel: and switch to Contacted tab
                      try {
                        const phoneRaw = selectedCandidate?.phone || ''
                        if (phoneRaw) {
                          const tel = `tel:${phoneRaw.replace(/[^\d+]/g, '')}`
                          window.open(tel, '_self')
                        }
                        await moveCandidateToStatus(selectedCandidate.id, 'contacted')
                        setCandidateView('contacted')
                      } catch (e) {
                        // ignore
                        setCandidateView('contacted')
                      }
                    }}>
                      <Phone className="h-4 w-4 mr-2" />
                      Call
                    </Button>
                  </div>

                  {/* Status action buttons */}
                  <div className="flex justify-center space-x-2 mb-6">
                    <Button
                      className="bg-green-500 hover:bg-green-600 text-white px-6"
                      onClick={() => moveCandidateToStatus(selectedCandidate.id, "shortlisted")}
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-6"
                      onClick={() => moveCandidateToStatus(selectedCandidate.id, "reviewed")}
                    >
                      <HelpCircle className="h-4 w-4" />
                    </Button>
                    <Button
                      className="bg-red-500 hover:bg-red-600 text-white px-6"
                      onClick={() => moveCandidateToStatus(selectedCandidate.id, "rejected")}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <Separator className="mb-6" />

                {/* Personal Information */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Email:</span> {selectedCandidate.email}
                    </div>
                    <div>
                      <span className="font-medium">Phone:</span> {selectedCandidate.phone}
                    </div>
                    <div>
                      <span className="font-medium">Location:</span> {selectedCandidate.location}
                    </div>
                    <div>
                      <span className="font-medium">Experience:</span> {selectedCandidate.experience}
                    </div>
                  </div>
                </div>

                {/* Professional Summary */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">Professional summary</h2>
                  <p className="text-gray-700 leading-relaxed">{selectedCandidate.summary}</p>
                </div>

                {/* Experience */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">Experience</h2>
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Building className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{selectedCandidate.designation}</h3>
                      <p className="text-gray-600">EY Technology</p>
                      <p className="text-sm text-gray-500">Aug 2022 – Present</p>
                      <p className="text-sm text-gray-500">{selectedCandidate.location}</p>
                    </div>
                  </div>
                </div>

                {/* Education */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">Education</h2>
                  {selectedCandidate.education.map((edu, index) => (
                    <div key={index} className="flex items-start space-x-4 mb-4">
                      <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <GraduationCap className="h-6 w-6 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{edu.degree}</h3>
                        <p className="text-gray-600">{edu.institution}</p>
                        <p className="text-sm text-gray-500">Graduated {edu.year}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Skills */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {selectedCandidate.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="bg-emerald-100 text-emerald-700">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Languages */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">Languages</h2>
                  <div className="space-y-2">
                    {selectedCandidate.languages.map((lang, index) => (
                      <div key={index} className="flex items-center space-x-4">
                        <Globe className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">{lang.name}</span>
                        <Badge variant="outline">{lang.proficiency}</Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Resume */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">Resume</h2>
                  <div className="flex items-center space-x-4">
                    <Button variant="outline" onClick={() => {
                      const url = selectedCandidate.resumeUrl ? getAssetUrl(selectedCandidate.resumeUrl) : ''
                      if (url) window.open(url, '_blank')
                    }}>
                      <Eye className="h-4 w-4 mr-2" />
                      Preview Resume
                    </Button>
                    <Button variant="outline" onClick={async () => {
                      const url = selectedCandidate.resumeUrl ? getAssetUrl(selectedCandidate.resumeUrl) : ''
                      if (!url) return
                      const a = document.createElement('a')
                      a.href = url
                      a.download = ''
                      document.body.appendChild(a)
                      a.click()
                      document.body.removeChild(a)
                    }}>
                      <Download className="h-4 w-4 mr-2" />
                      Download Resume
                    </Button>
                  </div>
                </div>

                {/* Hiring Section (only for hired candidates) */}
                {selectedCandidate.status === "hired" && (
                  <div className="mb-8">
                    <h2 className="text-xl font-semibold mb-4">Hiring Details</h2>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="ctc">CTC Package</Label>
                        <Input id="ctc" placeholder="Enter CTC amount" value={selectedCandidate.ctc || ""} />
                      </div>
                      <div>
                        <Label htmlFor="documents">Upload Documents</Label>
                        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                          <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button
                          className="bg-emerald-600 hover:bg-emerald-700"
                          onClick={() => openEmployeeFormWithCandidate(selectedCandidate)}
                        >
                          Add to Employee Management
                        </Button>
                        <Button
                          variant="outline"
                          className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 bg-transparent"
                          onClick={() => openEmployeeFormWithCandidate(selectedCandidate)}
                        >
                          Open Employee Form
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 px-4 sm:px-6 lg:px-8">
      {/* Header */}
     <BackButton/>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 rounded-2xl p-6 text-white">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">Jobs Management</h1>
          <p className="text-sm sm:text-base text-white">Post new jobs and manage applications</p>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative mb-6">
          {error}
        </div>
      )}
     
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 h-auto">
          <TabsTrigger value="post" className="flex items-center justify-center space-x-2 p-3">
            <Plus className="h-5 w-5 text-emerald-600" />
            <span>{editingJob ? "Edit Job" : "Post New Job"}</span>
          </TabsTrigger>
          <TabsTrigger value="manage" className="flex items-center justify-center space-x-2 p-3">
            <Briefcase className="h-4 w-4" />
            <span className="text-xs sm:text-sm">Manage Jobs</span>
          </TabsTrigger>
        </TabsList>

        {/* Post New Job Tab */}
        <TabsContent value="post" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Plus className="h-5 w-5 text-emerald-600" />
                <span>{editingJob ? "Edit Job" : "Post New Job"}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 lg:space-y-8">
              {/* Basic Job Information */}
              <div className="space-y-4">
                <h3 className="text-base lg:text-lg font-semibold text-gray-900 border-b pb-2">
                  Basic Job Information
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title" className="text-sm font-medium">
                      Job Title *
                    </Label>
                    <Input
                      id="title"
                      value={jobForm.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      placeholder="e.g. Senior Frontend Developer"
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="location" className="text-sm font-medium">
                      Job Location *
                    </Label>
                    <Input
                      id="location"
                      value={jobForm.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      placeholder="e.g. San Francisco, CA or Remote"
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="type" className="text-sm font-medium">
                      Job Type *
                    </Label>
                    <Select value={jobForm.type} onValueChange={(value) => handleInputChange("type", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="internship">Internship</SelectItem>
                        <SelectItem value="part-time">Part-time</SelectItem>
                        <SelectItem value="full-time">Full-time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="freelance">Freelance</SelectItem>
                        <SelectItem value="temporary">Temporary</SelectItem>
                        <SelectItem value="remote">Remote</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="positions" className="text-sm font-medium">
                      Position Available *
                    </Label>
                    <Input
                      id="positions"
                      type="number"
                      value={jobForm.positions}
                      onChange={(e) => handleInputChange("positions", e.target.value)}
                      min="1"
                      placeholder="Number of positions"
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="experience">Working Experience *</Label>
                    <Select
                      value={jobForm.experience}
                      onValueChange={(value) => handleInputChange("experience", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="entry">Entry Level (0-1 years)</SelectItem>
                        <SelectItem value="junior">Junior (1-3 years)</SelectItem>
                        <SelectItem value="mid">Mid Level (3-5 years)</SelectItem>
                        <SelectItem value="senior">Senior (5-8 years)</SelectItem>
                        <SelectItem value="lead">Lead (8+ years)</SelectItem>
                        <SelectItem value="executive">Executive Level</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Salary and Benefits */}
              <div className="space-y-4">
                <h3 className="text-base lg:text-lg font-semibold text-gray-900 border-b pb-2">Salary and Benefits</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="salaryMin" className="text-sm font-medium">
                      Minimum Salary *
                    </Label>
                    <Input
                      id="salaryMin"
                      type="number"
                      value={jobForm.salaryMin}
                      onChange={(e) => handleInputChange("salaryMin", e.target.value)}
                      placeholder="50000"
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="salaryMax" className="text-sm font-medium">
                      Maximum Salary *
                    </Label>
                    <Input
                      id="salaryMax"
                      type="number"
                      value={jobForm.salaryMax}
                      onChange={(e) => handleInputChange("salaryMax", e.target.value)}
                      placeholder="80000"
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="salaryPeriod" className="text-sm font-medium">
                      Salary Period *
                    </Label>
                    <Select
                      value={jobForm.salaryPeriod}
                      onValueChange={(value) => handleInputChange("salaryPeriod", value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hourly">Hourly</SelectItem>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Skills and Description */}
              <div className="space-y-4">
                <h3 className="text-base lg:text-lg font-semibold text-gray-900 border-b pb-2">Job Details</h3>
                <div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="skills" className="text-sm font-medium">Required Skills *</Label>
                    <Button
                      type="button"
                      variant="outline"
                      className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 bg-transparent h-8 px-3"
                      onClick={async () => {
                        try {
                          const title = (jobForm.title || '').trim()
                          if (!title) {
                            toast({ title: 'Missing title', description: 'Enter Job Title first.', variant: 'destructive' })
                            return
                          }
                          setAiSuggestingSkills(true)
                          const res = await fetch(getBaseUrl('/api/ai/skills'), {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                            credentials: 'include',
                            body: new URLSearchParams({ job_title: title }).toString(),
                          })
                          let suggested = ''
                          try {
                            const data = await res.json()
                            suggested = (data?.skills || '').toString().replace(/\n/g, ' ').trim()
                          } catch {
                            const text = await res.text()
                            suggested = text.replace(/\n/g, ' ').trim()
                          }
                          if (suggested) {
                            setJobForm((prev) => ({ ...prev, skills: suggested }))
                            toast({ title: 'Suggested', description: 'Skills filled from AI suggestion.' })
                          } else {
                            toast({ title: 'No suggestion', description: 'AI did not return skills.', variant: 'destructive' })
                          }
                        } catch (e: any) {
                          console.error('AI skills error:', e)
                          toast({ title: 'Error', description: e?.message || 'Failed to fetch skills.', variant: 'destructive' })
                        } finally {
                          setAiSuggestingSkills(false)
                        }
                      }}
                      disabled={aiSuggestingSkills}
                      title="Suggest skills based on Job Title"
                    >
                      {aiSuggestingSkills ? (
                        <>
                          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                          Suggesting...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-3 w-3 mr-1" />
                          Suggest skills
                        </>
                      )}
                    </Button>
                  </div>
                  <Input
                    id="skills"
                    value={jobForm.skills}
                    onChange={(e) => handleInputChange("skills", e.target.value)}
                    placeholder="React, TypeScript, Node.js (comma separated)"
                    required
                    className="mt-1"
                  />
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">Separate skills with commas</p>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="description" className="text-sm font-medium">Job Description *</Label>
                    <Button
                      type="button"
                      variant="outline"
                      className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 bg-transparent h-8 px-3"
                      onClick={handleGenerateJobDescription}
                      disabled={aiGeneratingJD}
                      title="Generate job description with AI"
                    >
                      {aiGeneratingJD ? (
                        <>
                          <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-3 w-3 mr-1" />
                          Generate with AI
                        </>
                      )}
                    </Button>
                  </div>
                  <Textarea
                    id="description"
                    rows={6}
                    value={jobForm.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    placeholder="Describe the role, responsibilities, company culture, and what makes this position exciting..."
                    required
                    className="mt-1"
                  />
                </div>

                {/* Removed Job Requirements field (not stored in DB). Use description instead. */}
              </div>

              {/* Location Details */}
              <div className="space-y-4">
                <h3 className="text-base lg:text-lg font-semibold text-gray-900 border-b pb-2">Location Details</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="country" className="text-sm font-medium">
                      Country *
                    </Label>
                    <Select value={jobForm.country} onValueChange={(value) => handleInputChange("country", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select country" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((c) => (
                          <SelectItem key={c.id} value={c.id.toString()}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="province" className="text-sm font-medium">
                      Province/State *
                    </Label>
                    <Select
                      value={jobForm.province}
                      onValueChange={(value) => handleInputChange("province", value)}
                      disabled={!jobForm.country || loadingStates}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder={loadingStates ? "Loading..." : "Select province/state"} />
                      </SelectTrigger>
                      <SelectContent>
                        {states.map((state) => (
                          <SelectItem key={state.id} value={state.id.toString()}>
                            {state.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="city" className="text-sm font-medium">
                      City *
                    </Label>
                    <Select
                      value={jobForm.city}
                      onValueChange={(value) => handleInputChange("city", value)}
                      disabled={!jobForm.province || loadingCities}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder={loadingCities ? "Loading..." : "Select city"} />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city.id} value={city.id.toString()}>
                            {city.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="fullAddress" className="text-sm font-medium">
                    Full Address
                  </Label>
                  <Input
                    id="fullAddress"
                    value={jobForm.fullAddress}
                    onChange={(e) => handleInputChange("fullAddress", e.target.value)}
                    placeholder="Complete street address (optional for remote positions)"
                    className="mt-1"
                  />
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">This will be used to show location on map</p>
                </div>
              </div>

              {/* Application Settings */}
              <div className="space-y-4">
                <h3 className="text-base lg:text-lg font-semibold text-gray-900 border-b pb-2">Application Settings</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiryDate" className="text-sm font-medium">
                      Job Expiry Date *
                    </Label>
                    <Input
                      id="expiryDate"
                      type="date"
                      value={jobForm.expiryDate}
                      onChange={(e) => handleInputChange("expiryDate", e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="applicationSettings" className="text-sm font-medium">
                      How should candidates apply? *
                    </Label>
                    <Select
                      value={jobForm.applicationSettings}
                      onValueChange={(value) => handleInputChange("applicationSettings", value)}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email Application</SelectItem>
                        <SelectItem value="platform">Through Platform</SelectItem>
                        <SelectItem value="external">External Website</SelectItem>
                        <SelectItem value="phone">Phone Application</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Work Schedule */}
              <div className="space-y-4">
                <h3 className="text-base lg:text-lg font-semibold text-gray-900 border-b pb-2">Work Schedule</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="hoursPerWeek" className="text-sm font-medium">
                      Hours per Week *
                    </Label>
                    <Input
                      id="hoursPerWeek"
                      type="number"
                      value={jobForm.hoursPerWeek}
                      onChange={(e) => handleInputChange("hoursPerWeek", e.target.value)}
                      min="1"
                      max="80"
                      placeholder="40"
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="schedule" className="text-sm font-medium">
                      Job Schedule *
                    </Label>
                    <Select value={jobForm.schedule} onValueChange={(value) => handleInputChange("schedule", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="flexible">Flexible Hours</SelectItem>
                        <SelectItem value="fixed">Fixed Schedule</SelectItem>
                        <SelectItem value="shift">Shift Work</SelectItem>
                        <SelectItem value="weekend">Weekend Work</SelectItem>
                        <SelectItem value="night">Night Shift</SelectItem>
                        <SelectItem value="rotating">Rotating Schedule</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="urgency" className="text-sm font-medium">
                      Hiring Urgency *
                    </Label>
                    <Select value={jobForm.urgency} onValueChange={(value) => handleInputChange("urgency", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low - Within 3 months</SelectItem>
                        <SelectItem value="medium">Medium - Within 1 month</SelectItem>
                        <SelectItem value="high">High - Within 2 weeks</SelectItem>
                        <SelectItem value="urgent">Urgent - ASAP</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Timeline */}
              <div className="space-y-4">
                <h3 className="text-base lg:text-lg font-semibold text-gray-900 border-b pb-2">Timeline</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startDate" className="text-sm font-medium">
                      Planned Start Date
                    </Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={jobForm.startDate}
                      onChange={(e) => handleInputChange("startDate", e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="deadline" className="text-sm font-medium">
                      Application Deadline
                    </Label>
                    <Input
                      id="deadline"
                      type="date"
                      value={jobForm.deadline}
                      onChange={(e) => handleInputChange("deadline", e.target.value)}
                      min={new Date().toISOString().split("T")[0]}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-base lg:text-lg font-semibold text-gray-900 border-b pb-2">Contact Information</h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="notificationEmail" className="text-sm font-medium">
                      Notification Email *
                    </Label>
                    <Input
                      id="notificationEmail"
                      type="email"
                      value={jobForm.notificationEmail}
                      onChange={(e) => handleInputChange("notificationEmail", e.target.value)}
                      placeholder="hr@company.com"
                      required
                      className="mt-1"
                    />
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">Where should application notifications be sent?</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="allowCalls"
                        checked={jobForm.allowCalls}
                        onChange={(e) => handleInputChange("allowCalls", e.target.checked)}
                          className="mt-1 rounded border-gray-300"
                        title="Allow direct calls from candidates"
                        placeholder="Allow direct calls"
                      />
                      <Label htmlFor="allowCalls" className="text-sm font-medium">Allow direct calls from candidates</Label>
                    </div>
                    {jobForm.allowCalls && (
                      <div>
                        <Label htmlFor="phoneNumber" className="text-sm font-medium">Phone Number *</Label>
                        <Input
                          id="phoneNumber"
                          type="tel"
                          value={jobForm.phoneNumber}
                          onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                          placeholder="+1 (555) 123-4567"
                          required={jobForm.allowCalls}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 pt-6 border-t">
                {editingJob && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEditingJob(null)
                      setJobForm({
                        title: "",
                        location: "",
                        type: "full-time",
                        positions: "1",
                        experience: "entry",
                        salaryMin: "",
                        salaryMax: "",
                        salaryPeriod: "monthly",
                        skills: "",
                        description: "",
                        requirements: "",
                        country: "",
                        province: "",
                        city: "",
                        fullAddress: "",
                        expiryDate: "",
                        applicationSettings: "email",
                        hoursPerWeek: "40",
                        schedule: "flexible",
                        urgency: "medium",
                        startDate: "",
                        deadline: "",
                        notificationEmail: "",
                        allowCalls: false,
                        phoneNumber: "",
                      })
                    }}
                  >
                    Cancel
                  </Button>
                )}
               
                <Button
                  onClick={handleSubmitJob}
                  className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {editingJob ? "Updating..." : "Posting..."}
                    </>
                  ) : (
                    <>{editingJob ? "Update Job" : "Post Job"}</>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Manage Jobs Tab */}
        <TabsContent value="manage" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Briefcase className="h-5 w-5 text-emerald-600" />
                <span>Manage Jobs</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                  <span className="ml-2 text-emerald-600">Loading jobs...</span>
                </div>
              ) : jobs.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <Briefcase className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                  <p>No jobs found. Click "Post New Job" to create your first job listing.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {displayJobs.map((job) => (
                    <Card key={job.id} className="hover:shadow-md transition-shadow cursor-pointer border border-gray-200">
                      <CardContent className="p-3 sm:p-4">
                        <div className="flex flex-col sm:flex-row sm:items-start space-y-3 sm:space-y-0 sm:space-x-4">
                          <div className="flex-1 min-w-0 space-y-2">
                            <h4 className="font-semibold text-gray-900 text-sm sm:text-base break-words">{job.title}</h4>
                            <p className="text-xs sm:text-sm text-gray-600 break-words">{job.location}</p>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs text-gray-500">
                              <span className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
                                <span className="truncate">{job.datePosted ? new Date(job.datePosted).toLocaleDateString() : ''}</span>
                              </span>
                              <Badge variant="outline" className="w-fit">
                                {job.type}
                              </Badge>
                              <Badge
                                variant={job.status === "Active" ? "default" : "secondary"}
                                className={job.status === "Active" ? "bg-emerald-600" : ""}
                              >
                                {job.status}
                              </Badge>
                            </div>

                            <div className="flex flex-wrap gap-1 sm:gap-2 mt-3">
                              <Badge
                                variant="outline"
                                className="cursor-pointer hover:bg-blue-50 text-blue-700 border-blue-200 text-xs"
                                onClick={() => {
                                  setSelectedJob(job)
                                  setCandidateView("applied")
                                  handleViewCandidates(job)
                                }}
                              >
                                Applied: {job?.candidates?.applied ?? 0}
                              </Badge>
                              <Badge
                                variant="outline"
                                className="cursor-pointer hover:bg-yellow-50 text-yellow-700 border-yellow-200 text-xs"
                                onClick={() => {
                                  setSelectedJob(job)
                                  setCandidateView("reviewed")
                                  handleViewCandidates(job)
                                }}
                              >
                                Reviewed: {job?.candidates?.reviewed ?? 0}
                              </Badge>
                              <Badge
                                variant="outline"
                                className="cursor-pointer hover:bg-green-50 text-green-700 border-green-200 text-xs"
                                onClick={() => {
                                  setSelectedJob(job)
                                  setCandidateView("shortlisted")
                                  handleViewCandidates(job)
                                }}
                              >
                                Shortlisted: {job?.candidates?.shortlisted ?? 0}
                              </Badge>
                              <Badge
                                variant="outline"
                                className="cursor-pointer hover:bg-purple-50 text-purple-700 border-purple-200 text-xs"
                                onClick={() => {
                                  setSelectedJob(job)
                                  setCandidateView("contacted")
                                  handleViewCandidates(job)
                                }}
                              >
                                Contacted: {job?.candidates?.contacted ?? 0}
                              </Badge>
                              <Badge
                                variant="outline"
                                className="cursor-pointer hover:bg-red-50 text-red-700 border-red-200 text-xs"
                                onClick={() => {
                                  setSelectedJob(job)
                                  setCandidateView("rejected")
                                  handleViewCandidates(job)
                                }}
                              >
                                Rejected: {job?.candidates?.rejected ?? 0}
                              </Badge>
                              <Badge
                                variant="outline"
                                className="cursor-pointer hover:bg-emerald-50 text-emerald-700 border-emerald-200 text-xs"
                                onClick={() => {
                                  setSelectedJob(job)
                                  setCandidateView("hired")
                                  handleViewCandidates(job)
                                }}
                              >
                                Hired: {job?.candidates?.hired ?? 0}
                              </Badge>
                            </div>

                            <p className="text-xs sm:text-sm text-gray-700 line-clamp-2 break-words">{job.description}</p>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedJob(job)
                                setCandidateView("applied")
                                handleViewCandidates(job)
                              }}
                              className="text-emerald-600 border-emerald-600 hover:bg-emerald-50 bg-transparent text-xs sm:text-sm"
                            >
                              <Eye className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                              View Applications
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditJob(job)}
                              className="text-blue-600 border-blue-600 hover:bg-blue-50 bg-transparent text-xs sm:text-sm"
                            >
                              <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteJob(job.id)}
                              className="text-red-600 border-red-600 hover:bg-red-50 bg-transparent text-xs sm:text-sm"
                            >
                              <Trash2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Pagination Controls */}
          {jobs.length > pageSize && (
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-sm text-gray-600">
                    Showing {displayJobs.length} of {jobs.length} jobs (Page {currentPage} of {totalPages})
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setCurrentPage((prev) => Math.max(1, prev - 1))
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                      }}
                      disabled={currentPage === 1}
                      className="border-emerald-300 text-emerald-600 hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </Button>

                    <div className="flex items-center gap-1">
                      {getPageNumbers().map((pageNum) => (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            setCurrentPage(pageNum)
                            window.scrollTo({ top: 0, behavior: 'smooth' })
                          }}
                          className={
                            currentPage === pageNum
                              ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                              : "border-emerald-300 text-emerald-600 hover:bg-emerald-50"
                          }
                        >
                          {pageNum}
                        </Button>
                      ))}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                      }}
                      disabled={currentPage === totalPages}
                      className="border-emerald-300 text-emerald-600 hover:bg-emerald-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Candidate Management */}
          {selectedJob && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-emerald-600" />
                  <span>Candidates for "{selectedJob.title}"</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                    <span className="ml-2 text-emerald-600">Loading candidates...</span>
                  </div>
                ) : (
                  <Tabs value={candidateView} onValueChange={setCandidateView}>
                    <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-1 h-auto p-1">
                      <TabsTrigger
                        value="applied"
                        className="text-xs md:text-sm px-1 md:px-2 py-2 flex flex-col md:flex-row items-center space-y-1 md:space-y-0 md:space-x-1"
                      >
                        <span>Applied</span>
                        <Badge variant="secondary" className="text-xs px-1 py-0">
                          {candidates?.applied?.length || 0}
                        </Badge>
                      </TabsTrigger>
                      <TabsTrigger
                        value="reviewed"
                        className="text-xs md:text-sm px-1 md:px-2 py-2 flex flex-col md:flex-row items-center space-y-1 md:space-y-0 md:space-x-1"
                      >
                        <span>Reviewed</span>
                        <Badge variant="secondary" className="text-xs px-1 py-0">
                          {candidates?.reviewed?.length || 0}
                        </Badge>
                      </TabsTrigger>
                      <TabsTrigger
                        value="shortlisted"
                        className="text-xs md:text-sm px-1 md:px-2 py-2 flex flex-col md:flex-row items-center space-y-1 md:space-y-0 md:space-x-1"
                      >
                        <span>Shortlisted</span>
                        <Badge variant="secondary" className="text-xs px-1 py-0">
                          {candidates?.shortlisted?.length || 0}
                        </Badge>
                      </TabsTrigger>
                      <TabsTrigger
                        value="contacted"
                        className="text-xs md:text-sm px-1 md:px-2 py-2 flex flex-col md:flex-row items-center space-y-1 md:space-y-0 md:space-x-1"
                      >
                        <span>Contacted</span>
                        <Badge variant="secondary" className="text-xs px-1 py-0">
                          {candidates?.contacted?.length || 0}
                        </Badge>
                      </TabsTrigger>
                      <TabsTrigger
                        value="rejected"
                        className="text-xs md:text-sm px-1 md:px-2 py-2 flex flex-col md:flex-row items-center space-y-1 md:space-y-0 md:space-x-1"
                      >
                        <span>Rejected</span>
                        <Badge variant="secondary" className="text-xs px-1 py-0">
                          {candidates?.rejected?.length || 0}
                        </Badge>
                      </TabsTrigger>
                      <TabsTrigger
                        value="hired"
                        className="text-xs md:text-sm px-1 md:px-2 py-2 flex flex-col md:flex-row items-center space-y-1 md:space-y-0 md:space-x-1"
                      >
                        <span>Hired</span>
                        <Badge variant="secondary" className="text-xs px-1 py-0">
                          {candidates?.hired?.length || 0}
                        </Badge>
                      </TabsTrigger>
                    </TabsList>

                  <TabsContent value="applied" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {candidates?.applied?.map((candidate) => (
                        <CandidateCard key={candidate.id} candidate={candidate} />
                      ))}
                    </div>
                    {(!candidates?.applied || candidates.applied.length === 0) && (
                      <div className="text-center py-8 text-gray-500">No candidates applied yet</div>
                    )}
                  </TabsContent>

                  <TabsContent value="shortlisted" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {candidates?.shortlisted?.map((candidate) => (
                        <CandidateCard key={candidate.id} candidate={candidate} />
                      ))}
                    </div>
                    {(!candidates?.shortlisted || candidates.shortlisted.length === 0) && (
                      <div className="text-center py-8 text-gray-500">No candidates shortlisted yet</div>
                    )}
                  </TabsContent>

                  <TabsContent value="reviewed" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {candidates?.reviewed?.map((candidate) => (
                        <CandidateCard key={candidate.id} candidate={candidate} />
                      ))}
                    </div>
                    {(!candidates?.reviewed || candidates.reviewed.length === 0) && (
                      <div className="text-center py-8 text-gray-500">No candidates in review yet</div>
                    )}
                  </TabsContent>

                  <TabsContent value="contacted" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {candidates?.contacted?.map((candidate) => (
                        <CandidateCard key={candidate.id} candidate={candidate} />
                      ))}
                    </div>
                    {(!candidates?.contacted || candidates.contacted.length === 0) && (
                      <div className="text-center py-8 text-gray-500">No candidates contacted yet</div>
                    )}
                  </TabsContent>

                  <TabsContent value="rejected" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {candidates?.rejected?.map((candidate) => (
                        <CandidateCard
                          key={candidate.id}
                          candidate={candidate}
                          extraFooter={
                            <div className="flex justify-end">
                              <Button
                                size="sm"
                                variant="outline"
                                className="w-full sm:w-auto text-green-600 border-green-600 hover:bg-green-50 bg-transparent"
                                onClick={() => moveCandidateToStatus(candidate.id, "shortlisted")}
                              >
                                Move to Shortlisted
                              </Button>
                            </div>
                          }
                        />
                      ))}
                    </div>
                    {(!candidates?.rejected || candidates.rejected.length === 0) && (
                      <div className="text-center py-8 text-gray-500">No rejected candidates</div>
                    )}
                  </TabsContent>

                  <TabsContent value="hired" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {candidates?.hired?.map((candidate) => (
                        <CandidateCard key={candidate.id} candidate={candidate} />
                      ))}
                    </div>
                    {(!candidates?.hired || candidates.hired.length === 0) && (
                      <div className="text-center py-8 text-gray-500">No hired candidates yet</div>
                    )}
                  </TabsContent>
                </Tabs>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>

      {/* Candidate Profile Modal */}
      <CandidateProfileModal />

      {/* Employee Management Form Modal (mirrors Employees page form) */}
      <Dialog open={showEmployeeForm} onOpenChange={setShowEmployeeForm}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogTitle>Add Employee</DialogTitle>
          <div className="space-y-6">
            {/* Row 1 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="emp_name">Full Name *</Label>
                <Input id="emp_name" value={employeeForm.name} onChange={(e) => setEmployeeForm((p) => ({ ...p, name: e.target.value }))} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="emp_email">Email Address *</Label>
                <Input id="emp_email" type="email" value={employeeForm.email} onChange={(e) => setEmployeeForm((p) => ({ ...p, email: e.target.value }))} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="emp_mobile">Mobile Number</Label>
                <Input id="emp_mobile" type="tel" value={employeeForm.mobile} onChange={(e) => setEmployeeForm((p) => ({ ...p, mobile: e.target.value }))} className="mt-1" />
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="emp_code">Employee ID *</Label>
                <Input id="emp_code" value={employeeForm.empId} onChange={(e) => setEmployeeForm((p) => ({ ...p, empId: e.target.value }))} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="emp_type">Employment Type *</Label>
                <Select value={employeeForm.empType} onValueChange={(v) => setEmployeeForm((p) => ({ ...p, empType: v }))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select employment type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fulltime">Full Time</SelectItem>
                    <SelectItem value="parttime">Part Time</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Seeker ID handled silently via state/payload */}

            {/* Row 3 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="emp_department">Department *</Label>
                <Select
                  value={employeeForm.department}
                  onValueChange={(value) => {
                    setEmployeeForm((p) => ({ ...p, department: value, position: "" }))
                  }}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {departments.map((d) => (
                      <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="emp_position">Position *</Label>
                <Select
                  value={employeeForm.position}
                  onValueChange={(value) => setEmployeeForm((p) => ({ ...p, position: value }))}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select designation" />
                  </SelectTrigger>
                  <SelectContent>
                    {(() => {
                      const selectedDept = departments.find((d) => d.name === employeeForm.department)
                      const filtered = selectedDept ? designations.filter((des) => des.department_id === selectedDept.id) : []
                      return filtered.map((des) => (
                        <SelectItem key={des.id} value={des.name}>{des.name}</SelectItem>
                      ))
                    })()}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Row 4 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="emp_salary">Salary *</Label>
                <Input id="emp_salary" type="number" value={employeeForm.salary} onChange={(e) => setEmployeeForm((p) => ({ ...p, salary: e.target.value }))} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="emp_income">Annual Income *</Label>
                <Input id="emp_income" type="number" value={employeeForm.income} onChange={(e) => setEmployeeForm((p) => ({ ...p, income: e.target.value }))} className="mt-1" />
              </div>
            </div>

            {/* Row 5 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="emp_working_hours">Working Hours</Label>
                <Input id="emp_working_hours" value={employeeForm.workingHours} onChange={(e) => setEmployeeForm((p) => ({ ...p, workingHours: e.target.value }))} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="emp_joining">Joining Date *</Label>
                <Input id="emp_joining" type="date" value={employeeForm.joiningDate} onChange={(e) => setEmployeeForm((p) => ({ ...p, joiningDate: e.target.value }))} className="mt-1" />
              </div>
            </div>

            {/* Row 6 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="emp_ec_name">Emergency Contact Name *</Label>
                <Input id="emp_ec_name" value={employeeForm.emergencyContactName} onChange={(e) => setEmployeeForm((p) => ({ ...p, emergencyContactName: e.target.value }))} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="emp_ec_number">Emergency Contact Number *</Label>
                <Input id="emp_ec_number" value={employeeForm.emergencyContactNumber} onChange={(e) => setEmployeeForm((p) => ({ ...p, emergencyContactNumber: e.target.value }))} className="mt-1" />
              </div>
              <div>
                <Label htmlFor="emp_ec_email">Emergency Contact Email</Label>
                <Input id="emp_ec_email" type="email" value={employeeForm.emergencyContact} onChange={(e) => setEmployeeForm((p) => ({ ...p, emergencyContact: e.target.value }))} className="mt-1" />
              </div>
            </div>

            {/* Row 7: Profile picture upload */}
            <div className="space-y-2">
              <Label htmlFor="emp_image">Profile Picture</Label>
              <div className="flex items-center gap-3">
                <Input
                  id="emp_image_file"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    if (f) handleEmployeeImageUpload(f)
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  disabled={imageUploading}
                  onClick={() => {
                    const el = document.getElementById('emp_image_file') as HTMLInputElement | null
                    el?.click()
                  }}
                >
                  {imageUploading ? 'Uploading...' : 'Upload'}
                </Button>
              </div>
              {employeeForm.image && (
                <p className="text-xs text-gray-600 break-all">Uploaded: {employeeForm.image}</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={() => setShowEmployeeForm(false)}>Cancel</Button>
              <Button
                variant="outline"
                className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 bg-transparent"
                disabled={employeeSubmitting}
                onClick={() => submitEmployeeForm(false)}
              >
                {employeeSubmitting ? 'Saving...' : 'Add Employee'}
              </Button>
              <Button
                className="bg-emerald-600 hover:bg-emerald-700"
                disabled={employeeSubmitting}
                onClick={() => submitEmployeeForm(true)}
              >
                {employeeSubmitting ? 'Saving...' : 'Add & Go to Employees'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      </div>
    )
  }



