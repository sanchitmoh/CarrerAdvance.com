"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Save,
  Download,
  Target,
  Plus,
  X,
  FileText,
  User,
  Briefcase,
  GraduationCap,
  Award,
  Lightbulb,
  Heart,
  CheckCircle,
} from "lucide-react"
import { useParams, useSearchParams } from "next/navigation"
import { getApiUrl } from "@/lib/api-config"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface ResumeData {
  personalInfo: {
    fullName: string
    email: string
    phone: string
    location: string
    linkedin: string
    website: string
  }
  summary: string
  experience: Array<{
    id: string
    title: string
    company: string
    location: string
    startDate: string
    endDate: string
    current: boolean
    description: string
  }>
  education: Array<{
    id: string
    degree: string
    school: string
    location: string
    graduationDate: string
    gpa?: string
    fieldOfStudy?: string
    description?: string
  }>
  certifications: Array<{
    id: string
    name: string
    organization: string
    issueDate: string
    expiryDate: string
    credentialUrl: string
  }>
  skills: string[]
  projects: Array<{
    id: string
    name: string
    description: string
    technologies: string[]
    date?: string
    link?: string
  }>
  activities: Array<{
    id: string
    title: string
    organization: string
    description: string
    date: string
  }>
  extracurriculars?: Array<{
    id: string
    title: string
    organization: string
    description: string
    date: string
  }>
}

export default function ResumeBuilderPage() {
  const [mounted, setMounted] = useState(false)
  const params = useParams()
  const resumeIdParam = params?.id as string | undefined
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      fullName: "John Doe",
      email: "john.doe@example.com",
      phone: "+1 (555) 123-4567",
      location: "New York, NY",
      linkedin: "linkedin.com/in/johndoe",
      website: "johndoe.dev",
    },
    summary: "Experienced software developer with 5+ years of expertise in full-stack development.",
    experience: [
      {
        id: "1",
        title: "Senior Software Developer",
        company: "Tech Solutions Inc.",
        location: "New York, NY",
        startDate: "2021-03",
        endDate: "",
        current: true,
        description: "Lead development of web applications using React and Node.js.",
      },
    ],
    education: [
      {
        id: "1",
        degree: "Bachelor of Computer Science",
        school: "University of Technology",
        location: "New York, NY",
        graduationDate: "2019-05",
        gpa: "3.8",
      },
    ],
    certifications: [],
    skills: ["JavaScript", "React", "Node.js", "Python", "SQL"],
    projects: [
      {
        id: "1",
        name: "E-commerce Platform",
        description: "Built a full-stack e-commerce platform with React and Node.js",
        technologies: ["React", "Node.js", "MongoDB"],
        link: "github.com/johndoe/ecommerce",
      },
    ],
    activities: [
      {
        id: "1",
        title: "Volunteer Developer",
        organization: "Local Non-Profit",
        description: "Developed website for local charity organization",
        date: "2023",
      },
    ],
    extracurriculars: [],
  })

  const [atsScore, setAtsScore] = useState(78)
  const [showTailorCard, setShowTailorCard] = useState(false)
  const [showManualEntry, setShowManualEntry] = useState(false)
  const [jobPostingUrl, setJobPostingUrl] = useState("")
  const [manualEntryData, setManualEntryData] = useState({
    companyName: "",
    jobTitle: "",
    jobDescription: "",
  })
  const [isTailoring, setIsTailoring] = useState(false)
  const [tailorError, setTailorError] = useState<string | null>(null)
  const [jobData, setJobData] = useState<any>(null)
  const [analysis, setAnalysis] = useState<any>(null)
  const [suggestions, setSuggestions] = useState<any>(null)
  const [activeSection, setActiveSection] = useState("personal")

  const [skillInput, setSkillInput] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)

  const [showEducationForm, setShowEducationForm] = useState(false)
  const [dataImported, setDataImported] = useState(false)
  
  const searchParams = useSearchParams()

  const [showResultsModal, setShowResultsModal] = useState(false)

  // Backend base URL for CodeIgniter (set NEXT_PUBLIC_BACKEND_BASE_URL in env for prod)
  const apiBase = (typeof window !== 'undefined'
    ? (process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_BACKEND_BASE_URL || '')
    : (process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_BACKEND_BASE_URL || ''))

  const [lastStatus, setLastStatus] = useState<string>("")
  const [savedResumeId, setSavedResumeId] = useState<number | null>(null)
  const [isDirty, setIsDirty] = useState<boolean>(false)
  const [showLeaveConfirm, setShowLeaveConfirm] = useState<boolean>(false)
  const [pendingNav, setPendingNav] = useState<'back' | null>(null)
  const ignoreNextPopRef = useRef<boolean>(false)

  useEffect(() => {
    if (analysis || suggestions) {
      setShowResultsModal(true)
    }
  }, [analysis, suggestions])

  // Avoid SSR hydration mismatches by rendering only on client
  useEffect(() => { setMounted(true) }, [])

  // Load existing resume data when opened via /resume-builder/[id]
  useEffect(() => {
    const loadExisting = async () => {
      if (!resumeIdParam) return
      // Skip loading if it's a new resume (starts with 'new-')
      if (resumeIdParam.startsWith('new-')) return
      const idNum = parseInt(resumeIdParam, 10)
      if (!idNum || Number.isNaN(idNum)) return
      try {
        const url = getApiUrl(`resume/get/${idNum}`)
        const res = await fetch(url, { credentials: 'include' })
        const data = await res.json()
        if (data && data.success && data.data) {
          const payload = data.data
          const rd = payload.resume_data
          if (rd && typeof rd === 'object') {
            setResumeData((prev) => ({
              ...prev,
              ...rd,
            }))
          } else if (typeof rd === 'string') {
            try {
              const parsed = JSON.parse(rd)
              if (parsed && typeof parsed === 'object') {
                setResumeData((prev) => ({ ...prev, ...parsed }))
              }
            } catch (_) {}
          }
          try { setSavedResumeId(idNum) } catch (_) {}
          setIsDirty(false)
          setLastStatus(`saved:${idNum}`)
        }
      } catch (_) {
        // ignore
      }
    }
    loadExisting()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resumeIdParam])

  // Mark form as dirty on resumeData changes
  useEffect(() => {
    setIsDirty(true)
  }, [resumeData])

  // Prompt before unload if there are unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isDirty])

  // In-app back navigation guard: intercept browser back and show custom confirm
  useEffect(() => {
    // Push a dummy state so that back stays within the page once
    const pushMarker = () => {
      try { history.pushState({ rb: true }, '') } catch (_) {}
    }
    pushMarker()

    const onPopState = (e: PopStateEvent) => {
      if (ignoreNextPopRef.current) { ignoreNextPopRef.current = false; return }
      if (isDirty) {
        // Re-push to cancel the back and show confirm
        try { history.pushState({ rb: true }, '') } catch (_) {}
        setPendingNav('back')
        setShowLeaveConfirm(true)
      }
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [isDirty])

  const confirmLeaveAndNavigate = async (action: 'save' | 'discard' | 'cancel') => {
    if (action === 'save') {
      await handleSave()
      setShowLeaveConfirm(false)
      setPendingNav(null)
      // Allow back to proceed
      ignoreNextPopRef.current = true
      window.history.back()
      return
    }
    if (action === 'discard') {
      setShowLeaveConfirm(false)
      setPendingNav(null)
      ignoreNextPopRef.current = true
      window.history.back()
      return
    }
    // cancel
    setShowLeaveConfirm(false)
    setPendingNav(null)
  }

  // Handle imported resume data
  useEffect(() => {
    const isImported = searchParams.get('imported')
    if (isImported === 'true') {
      const storedData = sessionStorage.getItem('resumeBuilderData')
      if (storedData) {
        try {
          const importedData = JSON.parse(storedData)
          console.log('Loading imported resume data:', importedData)
          
          // Map imported data to resume form structure
          const mappedData: ResumeData = {
            personalInfo: {
              fullName: importedData.name || "John Doe",
              email: importedData.email || "john.doe@example.com",
              phone: importedData.phone || "+1 (555) 123-4567",
              location: importedData.location || "New York, NY",
              linkedin: importedData.linkedin || "linkedin.com/in/johndoe",
              website: importedData.website || "johndoe.dev",
            },
            summary: importedData.summary || "Experienced professional with expertise in various domains.",
            experience: importedData.experience ? [
              {
                id: "1",
                title: "Extracted Experience",
                company: "Various Companies",
                location: "Multiple Locations",
                startDate: "2020-01",
                endDate: "",
                current: true,
                description: importedData.experience.substring(0, 500) + (importedData.experience.length > 500 ? "..." : ""),
              }
            ] : resumeData.experience,
            education: importedData.education ? [
              {
                id: "1",
                degree: "Extracted Education",
                school: "Various Institutions",
                location: "Multiple Locations",
                graduationDate: "2020-05",
                gpa: "N/A",
                description: importedData.education.substring(0, 300) + (importedData.education.length > 300 ? "..." : ""),
              }
            ] : resumeData.education,
            certifications: resumeData.certifications,
            skills: importedData.skills ? importedData.skills.split(',').map((skill: string) => skill.trim()).filter(Boolean) : resumeData.skills,
            projects: resumeData.projects,
            activities: resumeData.activities,
          }
          
          setResumeData(mappedData)
          setDataImported(true)
          console.log('Resume data auto-populated with imported data')
          
          // Clear the stored data
          sessionStorage.removeItem('resumeBuilderData')
        } catch (error) {
          console.error('Error loading imported resume data:', error)
        }
      }
    }
  }, [searchParams])

  // Handle imported resume data
  useEffect(() => {
    const isImported = searchParams.get('imported')
    if (isImported === 'true') {
      const storedData = sessionStorage.getItem('resumeBuilderData')
      if (storedData) {
        try {
          const importedData = JSON.parse(storedData)
          console.log('Loading imported resume data:', importedData)
          
          // Map imported data to resume form structure
          const mappedData: ResumeData = {
            personalInfo: {
              fullName: importedData.name || "John Doe",
              email: importedData.email || "john.doe@example.com",
              phone: importedData.phone || "+1 (555) 123-4567",
              location: importedData.location || "New York, NY",
              linkedin: importedData.linkedin || "linkedin.com/in/johndoe",
              website: importedData.website || "johndoe.dev",
            },
            summary: importedData.summary || "Experienced professional with expertise in various domains.",
            experience: importedData.experience ? [
              {
                id: "1",
                title: "Extracted Experience",
                company: "Various Companies",
                location: "Multiple Locations",
                startDate: "2020-01",
                endDate: "",
                current: true,
                description: importedData.experience.substring(0, 500) + (importedData.experience.length > 500 ? "..." : ""),
              }
            ] : resumeData.experience,
            education: importedData.education ? [
              {
                id: "1",
                degree: "Extracted Education",
                school: "Various Institutions",
                location: "Multiple Locations",
                graduationDate: "2020-05",
                gpa: "N/A",
                description: importedData.education.substring(0, 300) + (importedData.education.length > 300 ? "..." : ""),
              }
            ] : resumeData.education,
            certifications: resumeData.certifications,
            skills: importedData.skills ? importedData.skills.split(',').map((skill: string) => skill.trim()).filter(Boolean) : resumeData.skills,
            projects: resumeData.projects,
            activities: resumeData.activities,
          }
          
          setResumeData(mappedData)
          setDataImported(true)
          console.log('Resume data auto-populated with imported data')
          
          // Clear the stored data
          sessionStorage.removeItem('resumeBuilderData')
        } catch (error) {
          console.error('Error loading imported resume data:', error)
        }
      }
    }
  }, [searchParams])
  const [educationFormData, setEducationFormData] = useState({
    institution: "",
    degree: "",
    fieldOfStudy: "",
    startDate: "",
    endDate: "",
    gpa: "",
    description: "",
  })

  const [showProjectForm, setShowProjectForm] = useState(false)
  const [projectForm, setProjectForm] = useState({
    name: "",
    date: "",
    description: "",
    technologies: "",
  })

  const [certificationForm, setCertificationForm] = useState({
    name: "",
    organization: "",
    issueDate: "",
    expiryDate: "",
    credentialUrl: "",
  })

  // Activities form state and handlers
  const [showActivityForm, setShowActivityForm] = useState(false)
  const [activityForm, setActivityForm] = useState({
    title: "",
    organization: "",
    description: "",
    date: "",
  })

  const saveActivity = () => {
    if (activityForm.title && activityForm.organization) {
      const newActivity = {
        id: Date.now().toString(),
        title: activityForm.title,
        organization: activityForm.organization,
        description: activityForm.description,
        date: activityForm.date,
      }
      setResumeData((prev) => ({
        ...prev,
        activities: [...prev.activities, newActivity],
      }))
      setActivityForm({ title: "", organization: "", description: "", date: "" })
      setShowActivityForm(false)
    }
  }

  const removeActivity = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      activities: prev.activities.filter((a) => a.id !== id),
    }))
  }

  // Extra-curricular form state and handlers
  const [showExtracurricularForm, setShowExtracurricularForm] = useState(false)
  const [extracurricularForm, setExtracurricularForm] = useState({
    title: "",
    organization: "",
    description: "",
    date: "",
  })

  const saveExtracurricular = () => {
    if (extracurricularForm.title && extracurricularForm.organization) {
      const newExtra = {
        id: Date.now().toString(),
        title: extracurricularForm.title,
        organization: extracurricularForm.organization,
        description: extracurricularForm.description,
        date: extracurricularForm.date,
      }
      setResumeData((prev) => ({
        ...prev,
        extracurriculars: [...(prev.extracurriculars || []), newExtra],
      }))
      setExtracurricularForm({ title: "", organization: "", description: "", date: "" })
      setShowExtracurricularForm(false)
    }
  }

  const removeExtracurricular = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      extracurriculars: (prev.extracurriculars || []).filter((a) => a.id !== id),
    }))
  }

  const skillSuggestions = [
    // Programming Languages
    "JavaScript",
    "Python",
    "Java",
    "C++",
    "C#",
    "TypeScript",
    "PHP",
    "Ruby",
    "Go",
    "Rust",
    "Swift",
    "Kotlin",
    "Scala",
    "R",
    "MATLAB",
    "SQL",
    "HTML",
    "CSS",
    "Dart",
    "Perl",

    // Frontend Technologies
    "React",
    "Vue.js",
    "Angular",
    "Next.js",
    "Nuxt.js",
    "Svelte",
    "jQuery",
    "Bootstrap",
    "Tailwind CSS",
    "Material-UI",
    "Ant Design",
    "Chakra UI",
    "Styled Components",
    "SASS",
    "LESS",

    // Backend Technologies
    "Node.js",
    "Express.js",
    "Django",
    "Flask",
    "FastAPI",
    "Spring Boot",
    "Laravel",
    "Ruby on Rails",
    "ASP.NET",
    "Gin",
    "Echo",
    "Fiber",

    // Databases
    "MySQL",
    "PostgreSQL",
    "MongoDB",
    "Redis",
    "SQLite",
    "Oracle",
    "Microsoft SQL Server",
    "Cassandra",
    "DynamoDB",
    "Firebase",
    "Supabase",
    "Neo4j",

    // Cloud & DevOps
    "AWS",
    "Azure",
    "Google Cloud",
    "Docker",
    "Kubernetes",
    "Jenkins",
    "GitLab CI",
    "GitHub Actions",
    "Terraform",
    "Ansible",
    "Chef",
    "Puppet",
    "Nginx",
    "Apache",

    // Mobile Development
    "React Native",
    "Flutter",
    "iOS Development",
    "Android Development",
    "Xamarin",
    "Ionic",
    "Cordova",

    // Data Science & AI
    "Machine Learning",
    "Deep Learning",
    "TensorFlow",
    "PyTorch",
    "Scikit-learn",
    "Pandas",
    "NumPy",
    "Matplotlib",
    "Seaborn",
    "Jupyter",
    "Apache Spark",
    "Hadoop",
    "Tableau",
    "Power BI",

    // Testing
    "Jest",
    "Cypress",
    "Selenium",
    "Playwright",
    "Mocha",
    "Chai",
    "JUnit",
    "PyTest",
    "Unit Testing",
    "Integration Testing",
    "E2E Testing",

    // Version Control & Tools
    "Git",
    "GitHub",
    "GitLab",
    "Bitbucket",
    "SVN",
    "Jira",
    "Confluence",
    "Slack",
    "Trello",
    "Asana",
    "Notion",

    // Design & UI/UX
    "Figma",
    "Adobe XD",
    "Sketch",
    "Photoshop",
    "Illustrator",
    "InVision",
    "Zeplin",
    "UI Design",
    "UX Design",
    "Wireframing",
    "Prototyping",

    // Soft Skills
    "Leadership",
    "Team Management",
    "Project Management",
    "Communication",
    "Problem Solving",
    "Critical Thinking",
    "Time Management",
    "Agile",
    "Scrum",
    "Kanban",

    // Other Technologies
    "GraphQL",
    "REST API",
    "Microservices",
    "Serverless",
    "WebSockets",
    "OAuth",
    "JWT",
    "Blockchain",
    "Cryptocurrency",
    "IoT",
    "AR/VR",
  ]

  const filteredSuggestions = skillSuggestions
    .filter((skill) => skill.toLowerCase().includes(skillInput.toLowerCase()) && !resumeData.skills.includes(skill))
    .slice(0, 10) // Limit to 10 suggestions

  const sections = [
    { id: "personal", label: "Personal Info", icon: User },
    { id: "summary", label: "Summary", icon: FileText },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "education", label: "Education", icon: GraduationCap },
    { id: "certifications", label: "Certifications", icon: Award },
    { id: "skills", label: "Skills", icon: Award },
    { id: "projects", label: "Projects", icon: Lightbulb },
    { id: "activities", label: "Activities", icon: Heart },
    { id: "extracurriculars", label: "Extra-Curricular", icon: CheckCircle },
  ]

  const handleSave = async () => {
    try {
      const userId = (typeof window !== 'undefined') ? (localStorage.getItem('jobseeker_id') || localStorage.getItem('user_id')) : null
      if (!userId) {
        alert('Please log in to save your resume')
        return
      }
      const defaultName = (resumeData?.personalInfo?.fullName ? `${resumeData.personalInfo.fullName} Resume` : 'My Resume')
      const resumeName = window.prompt('Enter a name for your resume:', defaultName)
      if (!resumeName || !resumeName.trim()) {
        return
      }
      const payload: any = {
        user_id: parseInt(userId as string, 10) || 0,
        template_id: 1,
        resume_data: resumeData,
        resume_name: resumeName.trim(),
      }
      // If editing existing resume, include its id to update that record
      // Only treat as valid ID if it's a numeric database ID (not a timestamp or 'new-' prefix)
      if (typeof resumeIdParam === 'string') {
        // Skip if it's a new resume (starts with 'new-')
        if (!resumeIdParam.startsWith('new-')) {
          const idNum = parseInt(resumeIdParam, 10)
          // Only use as ID if it's a reasonable database ID (less than 100000)
          // Timestamps are much larger numbers (13+ digits)
          // Database IDs are typically small integers
          if (!Number.isNaN(idNum) && idNum > 0 && idNum < 100000) {
            payload.id = idNum
          }
        }
      }
      if (savedResumeId && !payload.id) {
        payload.id = savedResumeId
      }
      const url = getApiUrl('resume/save')
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      })
      let data: any = null
      try { data = await res.clone().json() } catch (_) {
        const text = await res.text()
        data = { success: res.ok, message: text }
      }
      if (data && data.success) {
        setLastStatus(`saved:${data.id || ''}`)
        if (data.id) { try { setSavedResumeId(parseInt(String(data.id), 10)) } catch(_) {} }
        setIsDirty(false)
        alert('Resume saved successfully')
      } else {
        alert(data?.message || 'Failed to save resume')
      }
    } catch (e: any) {
      alert(e?.message || 'Unexpected error while saving')
    }
  }

  const handleDownload = async (format: 'pdf' | 'doc') => {
    let id = savedResumeId
    if (!id) {
      // Try to parse from lastStatus saved:id
      if (lastStatus.startsWith('saved:')) {
        const parts = lastStatus.split(':')
        if (parts[1]) { try { id = parseInt(parts[1], 10) } catch(_) {} }
      }
    }
    if (!id) {
      alert('Please save your resume first to download.')
      return
    }
    const url = getApiUrl(`resume/${format}/${id}`)
    window.open(url, '_blank')
  }


  const buildResumeContent = () => {
    const lines: string[] = []
    lines.push(`${resumeData.personalInfo.fullName}`)
    lines.push(`${resumeData.personalInfo.email} | ${resumeData.personalInfo.phone} | ${resumeData.personalInfo.location}`)
    if (resumeData.summary) lines.push(`Summary: ${resumeData.summary}`)
    if (resumeData.skills?.length) lines.push(`Skills: ${resumeData.skills.join(', ')}`)
    if (resumeData.experience?.length) {
      lines.push('Experience:')
      resumeData.experience.forEach((e) => {
        lines.push(`- ${e.title} at ${e.company} (${e.startDate} - ${e.current ? 'Present' : e.endDate}) - ${e.location}`)
        if (e.description) lines.push(e.description)
      })
    }
    if (resumeData.education?.length) {
      lines.push('Education:')
      resumeData.education.forEach((ed) => {
        lines.push(`- ${ed.degree} - ${ed.school} (${ed.graduationDate})`)
        if (ed.description) lines.push(ed.description)
      })
    }
    if (resumeData.projects?.length) {
      lines.push('Projects:')
      resumeData.projects.forEach((p) => {
        lines.push(`- ${p.name}${p.date ? ` (${p.date})` : ''}`)
        if (p.description) lines.push(p.description)
        if (p.technologies?.length) lines.push(`Tech: ${p.technologies.join(', ')}`)
      })
    }
    if (resumeData.activities?.length) {
      lines.push('Activities:')
      resumeData.activities.forEach((a) => {
        lines.push(`- ${a.title} at ${a.organization}${a.date ? ` (${a.date})` : ''}`)
        if (a.description) lines.push(a.description)
      })
    }
    if (resumeData.extracurriculars?.length) {
      lines.push('Extra-Curricular:')
      resumeData.extracurriculars.forEach((a) => {
        lines.push(`- ${a.title} at ${a.organization}${a.date ? ` (${a.date})` : ''}`)
        if (a.description) lines.push(a.description)
      })
    }
    return lines.join('\n')
  }

  const fetchJson = async (url: string, payload: any) => {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    })
    const contentType = res.headers.get('content-type') || ''
    if (!contentType.includes('application/json')) {
      const text = await res.text()
      throw new Error(text?.slice(0, 300) || 'Non-JSON response from server')
    }
    const json = await res.json()
    return json
  }

  const callCompleteAnalysis = async (payload: any) => {
    const res = await fetch('/api/resume/complete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const contentType = res.headers.get('content-type') || ''
    if (!contentType.includes('application/json')) {
      const text = await res.text()
      throw new Error(text?.slice(0, 300) || 'Non-JSON response from proxy')
    }
    return res.json()
  }

  const handleTailorResume = async () => {
    setTailorError(null)
    setIsTailoring(true)
    try {
      const resume_content = buildResumeContent()
      setLastStatus('complete_job_analysis')
      const complete = await callCompleteAnalysis({ job_url: jobPostingUrl, resume_content })
      if (!complete.success) throw new Error(complete.message || 'Analysis failed')
      setJobData(complete.job_data)
      setAnalysis(complete.analysis)
      setSuggestions(complete.suggestions || null)

      const score = complete.analysis?.overall_match_score ?? complete.analysis?.skills_match?.skills_match_percentage ?? 80
      setAtsScore(Math.max(0, Math.min(100, Number(score))))
      setShowTailorCard(false)
      setShowResultsModal(true)
    } catch (e: any) {
      setTailorError(e?.message || 'Something went wrong')
    } finally {
      setIsTailoring(false)
    }
  }

  const handleManualEntry = () => {
    setShowManualEntry(true)
  }

  const handleBackToLink = () => {
    setShowManualEntry(false)
  }

  const handleAnalyzeAndTailor = async () => {
    setTailorError(null)
    setIsTailoring(true)
    try {
      const resume_content = buildResumeContent()
      const manual_data = {
        job_title: manualEntryData.jobTitle,
        company_name: manualEntryData.companyName,
        job_description: manualEntryData.jobDescription,
      }
      setLastStatus('complete_job_analysis')
      const complete = await callCompleteAnalysis({ resume_content, manual_data })
      if (!complete.success) throw new Error(complete.message || 'Analysis failed')
      setJobData(complete.job_data)
      setAnalysis(complete.analysis)
      setSuggestions(complete.suggestions || null)

      const score = complete.analysis?.overall_match_score ?? complete.analysis?.skills_match?.skills_match_percentage ?? 80
      setAtsScore(Math.max(0, Math.min(100, Number(score))))
      setShowTailorCard(false)
      setShowManualEntry(false)
      setShowResultsModal(true)
    } catch (e: any) {
      setTailorError(e?.message || 'Something went wrong')
    } finally {
      setIsTailoring(false)
    }
  }

  const addExperience = () => {
    const newExp = {
      id: Date.now().toString(),
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    }
    setResumeData((prev) => ({
      ...prev,
      experience: [...prev.experience, newExp],
    }))
  }

  const removeExperience = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.filter((exp) => exp.id !== id),
    }))
  }

  const updateExperience = (id: string, field: string, value: any) => {
    setResumeData((prev) => ({
      ...prev,
      experience: prev.experience.map((exp) => (exp.id === id ? { ...exp, [field]: value } : exp)),
    }))
  }

  const addSkill = (skill: string) => {
    if (skill.trim() && !resumeData.skills.includes(skill.trim())) {
      setResumeData((prev) => ({
        ...prev,
        skills: [...prev.skills, skill.trim()],
      }))
      setSkillInput("")
      setShowSuggestions(false)
    }
  }

  const handleSkillInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSkillInput(value)
    setShowSuggestions(value.length > 0)
  }

  const handleSkillInputKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addSkill(skillInput)
    } else if (e.key === "Escape") {
      setShowSuggestions(false)
    }
  }

  const handleSaveEducation = () => {
    if (educationFormData.institution && educationFormData.degree) {
      const newEducation = {
        id: Date.now().toString(),
        degree: educationFormData.degree,
        school: educationFormData.institution,
        location: "", // You can add location field if needed
        graduationDate: educationFormData.endDate,
        gpa: educationFormData.gpa,
        fieldOfStudy: educationFormData.fieldOfStudy,
        description: educationFormData.description,
      }

      setResumeData((prev) => ({
        ...prev,
        education: [...prev.education, newEducation],
      }))

      // Reset form
      setEducationFormData({
        institution: "",
        degree: "",
        fieldOfStudy: "",
        startDate: "",
        endDate: "",
        gpa: "",
        description: "",
      })
      setShowEducationForm(false)
    }
  }

  const handleAIDescription = () => {
    // AI functionality for generating education description
    console.log("AI description generation for education")
  }

  const saveProject = () => {
    if (projectForm.name && projectForm.description) {
      const newProject = {
        id: Date.now().toString(),
        name: projectForm.name,
        description: projectForm.description,
        technologies: projectForm.technologies
          .split(",")
          .map((tech) => tech.trim())
          .filter((tech) => tech),
        date: projectForm.date,
      }

      setResumeData((prev) => ({
        ...prev,
        projects: [...prev.projects, newProject],
      }))

      setProjectForm({ name: "", date: "", description: "", technologies: "" })
      setShowProjectForm(false)
    }
  }

  const saveCertification = () => {
    if (certificationForm.name && certificationForm.organization) {
      const newCertification = {
        id: Date.now().toString(),
        ...certificationForm,
      }
      setResumeData((prev) => ({
        ...prev,
        certifications: [...(prev.certifications || []), newCertification],
      }))
      setCertificationForm({
        name: "",
        organization: "",
        issueDate: "",
        expiryDate: "",
        credentialUrl: "",
      })
    }
  }

  const removeCertification = (id: string) => {
    setResumeData((prev) => ({
      ...prev,
      certifications: prev.certifications?.filter((cert) => cert.id !== id) || [],
    }))
  }

  if (!mounted) {
    return null
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex flex-col lg:flex-row">
        {/* Editor Panel */}
        <div className="w-full lg:w-1/2 p-3 sm:p-4 lg:p-6 bg-white border-b lg:border-b-0 lg:border-r border-gray-200 overflow-y-auto max-h-screen">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">Resume Builder</h1>
              <div className="flex items-center space-x-2">
                <Badge
                  variant="outline"
                  className={`${
                    atsScore >= 80
                      ? "border-green-200 text-green-700 bg-green-50"
                      : atsScore >= 60
                        ? "border-yellow-200 text-yellow-700 bg-yellow-50"
                        : "border-red-200 text-red-700 bg-red-50"
                  }`}
                >
                  ATS Score: {atsScore}%
                </Badge>
              </div>
            </div>
            <Progress value={atsScore} className="h-2 mb-4" />

            {/* Import Notification */}
            {dataImported && (
              <div className="mb-4 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-emerald-600" />
                  <span className="text-emerald-800 font-medium">Resume data imported successfully!</span>
                </div>
                <p className="text-emerald-700 text-sm mt-1">
                  Your resume has been parsed and the form has been auto-populated. You can now edit and customize the information.
                </p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 lg:gap-3">
              <Button
                onClick={handleSave}
                className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white"
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="border-emerald-200 text-emerald-600 hover:bg-emerald-50"
              >
                <Download className="h-4 w-4 mr-2" />
                    Download
              </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem onClick={() => handleDownload('pdf')}>Download as PDF</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleDownload('doc')}>Download as DOC</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                onClick={() => setShowTailorCard(!showTailorCard)}
                variant="outline"
                className="border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
              >
                <Target className="h-4 w-4 mr-2" />
                {isTailoring ? 'Analyzing…' : 'Tailor Resume'}
              </Button>
            </div>

            {/* Tailor Resume Card */}
            {(showTailorCard || tailorError) && (
              <Card className="mt-4 border-blue-200 bg-blue-50/50">
                <CardContent className="p-4">
                  {tailorError && (
                    <div className="mb-3 p-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded">
                      {tailorError}
                    </div>
                  )}
                  {!showManualEntry ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="jobPostingUrl">Job Posting URL</Label>
                        <Input
                          id="jobPostingUrl"
                          value={jobPostingUrl}
                          onChange={(e) => setJobPostingUrl(e.target.value)}
                          placeholder="Paste the job posting URL for automatic analysis"
                          className="w-full"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          onClick={handleTailorResume}
                          className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                          disabled={isTailoring || !jobPostingUrl}
                        >
                          {isTailoring ? 'Analyzing…' : 'Analyze'}
                        </Button>
                        <Button
                          onClick={handleManualEntry}
                          variant="outline"
                          size="sm"
                          className="border-gray-200 text-gray-600 hover:bg-gray-50 bg-transparent"
                        >
                          Manual Entry
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="companyName">Company Name*</Label>
                        <Input
                          id="companyName"
                          value={manualEntryData.companyName}
                          onChange={(e) => setManualEntryData((prev) => ({ ...prev, companyName: e.target.value }))}
                          placeholder="Enter company name"
                          className="w-full"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="jobTitle">Job Title*</Label>
                        <Input
                          id="jobTitle"
                          value={manualEntryData.jobTitle}
                          onChange={(e) => setManualEntryData((prev) => ({ ...prev, jobTitle: e.target.value }))}
                          placeholder="Enter job title"
                          className="w-full"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="jobDescription">Job Description*</Label>
                        <Textarea
                          id="jobDescription"
                          value={manualEntryData.jobDescription}
                          onChange={(e) => setManualEntryData((prev) => ({ ...prev, jobDescription: e.target.value }))}
                          placeholder="Enter job description"
                          className="w-full"
                          rows={4}
                          required
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          onClick={handleAnalyzeAndTailor}
                          className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                          disabled={isTailoring || !manualEntryData.companyName || !manualEntryData.jobTitle || !manualEntryData.jobDescription}
                        >
                          {isTailoring ? 'Analyzing…' : 'Analyze and Tailor'}
                        </Button>
                        <Button
                          onClick={handleBackToLink}
                          variant="outline"
                          size="sm"
                          className="border-gray-200 text-gray-600 hover:bg-gray-50 bg-transparent"
                        >
                          Back to Link
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Results Tab - Shows when analysis is complete */}
            {analysis && (
              <Card className="mt-4 border-emerald-200 bg-emerald-50/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-emerald-800 flex items-center space-x-2">
                    <Target className="h-5 w-5" />
                    <span>Tailoring Results</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Job Information */}
                  {jobData && (
                    <div className="p-3 bg-white rounded border border-emerald-100">
                      <div className="text-sm font-semibold text-emerald-800 mb-2">Job Details</div>
                      <div className="text-gray-700">
                        <div className="font-medium">{jobData.job_title || 'N/A'}</div>
                        {jobData.company_name && <div className="text-sm text-gray-600">{jobData.company_name}</div>}
                      </div>
                    </div>
                  )}

                  {/* Match Score */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-emerald-100 rounded text-center">
                      <div className="text-2xl font-bold text-emerald-800">{analysis.overall_match_score ?? '—'}</div>
                      <div className="text-xs text-emerald-700">Overall Match</div>
                    </div>
                    <div className="p-3 bg-blue-100 rounded text-center">
                      <div className="text-lg font-bold text-blue-800">{analysis.match_grade ?? '—'}</div>
                      <div className="text-xs text-blue-700">Grade</div>
                    </div>
                    <div className="p-3 bg-amber-100 rounded text-center">
                      <div className="text-lg font-bold text-amber-800">{analysis.skills_match?.skills_match_percentage ?? '—'}%</div>
                      <div className="text-xs text-amber-700">Skills Match</div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      {analysis.recommendations?.length > 0 && (
                        <span>{analysis.recommendations.length} recommendations available</span>
                      )}
                    </div>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-emerald-200 text-emerald-700 hover:bg-emerald-100" 
                      onClick={() => setShowResultsModal(true)}
                    >
                      View Full Analysis
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Section Navigation */}
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {sections.map((section) => {
                const Icon = section.icon
                return (
                  <Button
                    key={section.id}
                    variant={activeSection === section.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveSection(section.id)}
                    className={
                      activeSection === section.id
                        ? "bg-gradient-to-r from-emerald-600 to-green-600 text-white"
                        : "border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                    }
                  >
                    <Icon className="h-4 w-4 mr-2" />
                    {section.label}
                  </Button>
                )
              })}
            </div>
          </div>

          {/* Form Sections */}
          <div className="space-y-6">
            {activeSection === "personal" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5 text-emerald-600" />
                    <span>Personal Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={resumeData.personalInfo.fullName}
                        onChange={(e) =>
                          setResumeData((prev) => ({
                            ...prev,
                            personalInfo: { ...prev.personalInfo, fullName: e.target.value },
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={resumeData.personalInfo.email}
                        onChange={(e) =>
                          setResumeData((prev) => ({
                            ...prev,
                            personalInfo: { ...prev.personalInfo, email: e.target.value },
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={resumeData.personalInfo.phone}
                        onChange={(e) =>
                          setResumeData((prev) => ({
                            ...prev,
                            personalInfo: { ...prev.personalInfo, phone: e.target.value },
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={resumeData.personalInfo.location}
                        onChange={(e) =>
                          setResumeData((prev) => ({
                            ...prev,
                            personalInfo: { ...prev.personalInfo, location: e.target.value },
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="linkedin">LinkedIn</Label>
                      <Input
                        id="linkedin"
                        value={resumeData.personalInfo.linkedin}
                        onChange={(e) =>
                          setResumeData((prev) => ({
                            ...prev,
                            personalInfo: { ...prev.personalInfo, linkedin: e.target.value },
                          }))
                        }
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        value={resumeData.personalInfo.website}
                        onChange={(e) =>
                          setResumeData((prev) => ({
                            ...prev,
                            personalInfo: { ...prev.personalInfo, website: e.target.value },
                          }))
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeSection === "summary" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <FileText className="h-5 w-5 text-emerald-600" />
                    <span>Professional Summary</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Label htmlFor="summary">Summary</Label>
                    <Textarea
                      id="summary"
                      value={resumeData.summary}
                      onChange={(e) => setResumeData((prev) => ({ ...prev, summary: e.target.value }))}
                      rows={4}
                      placeholder="Write a compelling professional summary..."
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {activeSection === "experience" && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <Briefcase className="h-5 w-5 text-emerald-600" />
                      <span>Work Experience</span>
                    </CardTitle>
                    <Button
                      onClick={addExperience}
                      size="sm"
                      className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Experience
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-6">
                  {resumeData.experience.map((exp, index) => (
                    <div key={exp.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-medium text-gray-900">Experience {index + 1}</h4>
                        <Button
                          onClick={() => removeExperience(exp.id)}
                          variant="outline"
                          size="sm"
                          className="border-red-200 text-red-600 hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="space-y-2">
                          <Label>Job Title</Label>
                          <Input
                            value={exp.title}
                            onChange={(e) => updateExperience(exp.id, "title", e.target.value)}
                            placeholder="e.g., Software Developer"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Company</Label>
                          <Input
                            value={exp.company}
                            onChange={(e) => updateExperience(exp.id, "company", e.target.value)}
                            placeholder="e.g., Tech Corp"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Location</Label>
                          <Input
                            value={exp.location}
                            onChange={(e) => updateExperience(exp.id, "location", e.target.value)}
                            placeholder="e.g., New York, NY"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Start Date</Label>
                          <Input
                            type="month"
                            value={exp.startDate}
                            onChange={(e) => updateExperience(exp.id, "startDate", e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="space-y-2 mb-4">
                        <Label>Description</Label>
                        <Textarea
                          value={exp.description}
                          onChange={(e) => updateExperience(exp.id, "description", e.target.value)}
                          rows={3}
                          placeholder="Describe your responsibilities and achievements..."
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {activeSection === "education" && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <GraduationCap className="h-5 w-5 text-emerald-600" />
                      <span>Education</span>
                    </CardTitle>
                    <Button
                      onClick={() => setShowEducationForm(!showEducationForm)}
                      size="sm"
                      className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Education
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {showEducationForm && (
                    <Card className="mb-6 border-emerald-200 bg-emerald-50/50">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="institution">Institution*</Label>
                              <Input
                                id="institution"
                                value={educationFormData.institution}
                                onChange={(e) =>
                                  setEducationFormData((prev) => ({ ...prev, institution: e.target.value }))
                                }
                                placeholder="e.g., Harvard University"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="degree">Degree*</Label>
                              <Input
                                id="degree"
                                value={educationFormData.degree}
                                onChange={(e) => setEducationFormData((prev) => ({ ...prev, degree: e.target.value }))}
                                placeholder="e.g., Bachelor of Science"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="fieldOfStudy">Field of Study*</Label>
                              <Input
                                id="fieldOfStudy"
                                value={educationFormData.fieldOfStudy}
                                onChange={(e) =>
                                  setEducationFormData((prev) => ({ ...prev, fieldOfStudy: e.target.value }))
                                }
                                placeholder="e.g., Computer Science"
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="gpa">GPA</Label>
                              <Input
                                id="gpa"
                                value={educationFormData.gpa}
                                onChange={(e) => setEducationFormData((prev) => ({ ...prev, gpa: e.target.value }))}
                                placeholder="e.g., 3.8"
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="startDate">Start Date*</Label>
                              <Input
                                id="startDate"
                                type="month"
                                value={educationFormData.startDate}
                                onChange={(e) =>
                                  setEducationFormData((prev) => ({ ...prev, startDate: e.target.value }))
                                }
                                required
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="endDate">End Date*</Label>
                              <Input
                                id="endDate"
                                type="month"
                                value={educationFormData.endDate}
                                onChange={(e) => setEducationFormData((prev) => ({ ...prev, endDate: e.target.value }))}
                                required
                              />
                            </div>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <div className="flex space-x-2">
                              <Textarea
                                id="description"
                                value={educationFormData.description}
                                onChange={(e) =>
                                  setEducationFormData((prev) => ({ ...prev, description: e.target.value }))
                                }
                                placeholder="Describe relevant coursework, achievements, or activities..."
                                rows={3}
                                className="flex-1"
                              />
                              <Button
                                onClick={handleAIDescription}
                                size="sm"
                                variant="outline"
                                className="border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent px-3"
                              >
                                AI
                              </Button>
                            </div>
                          </div>
                          <div className="flex justify-end">
                            <Button
                              onClick={handleSaveEducation}
                              className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white"
                            >
                              <Save className="h-4 w-4 mr-2" />
                              Save Education
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Display existing education entries */}
                  <div className="space-y-4">
                    {resumeData.education.map((edu, index) => (
                      <div key={edu.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{edu.degree}</h4>
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-emerald-600 font-medium">{edu.school}</p>
                        <p className="text-sm text-gray-600">{edu.graduationDate}</p>
                        {edu.gpa && <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeSection === "activities" && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <Heart className="h-5 w-5 text-emerald-600" />
                      <span>Activities</span>
                    </CardTitle>
                    <Button
                      onClick={() => setShowActivityForm(!showActivityForm)}
                      size="sm"
                      className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {showActivityForm ? "Cancel" : "Add Activity"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {showActivityForm && (
                    <div className="space-y-4 mb-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="activityTitle">Title*</Label>
                          <Input
                            id="activityTitle"
                            value={activityForm.title}
                            onChange={(e) => setActivityForm((p) => ({ ...p, title: e.target.value }))}
                            placeholder="e.g., Volunteer Developer"
                          />
                        </div>
                        <div>
                          <Label htmlFor="activityOrg">Organization*</Label>
                          <Input
                            id="activityOrg"
                            value={activityForm.organization}
                            onChange={(e) => setActivityForm((p) => ({ ...p, organization: e.target.value }))}
                            placeholder="e.g., Local Non-Profit"
                          />
                        </div>
                        <div>
                          <Label htmlFor="activityDate">Date</Label>
                          <Input
                            id="activityDate"
                            value={activityForm.date}
                            onChange={(e) => setActivityForm((p) => ({ ...p, date: e.target.value }))}
                            placeholder="e.g., 2023"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="activityDesc">Description</Label>
                        <Textarea
                          id="activityDesc"
                          value={activityForm.description}
                          onChange={(e) => setActivityForm((p) => ({ ...p, description: e.target.value }))}
                          rows={3}
                          placeholder="Describe your role and impact..."
                        />
                      </div>
                      <div className="flex justify-end">
                        <Button onClick={saveActivity} className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white">
                          <Save className="h-4 w-4 mr-2" />
                          Save Activity
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Display existing activities */}
                  <div className="space-y-4">
                    {resumeData.activities.map((act) => (
                      <div key={act.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{act.title}</h4>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeActivity(act.id)}
                            className="border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-emerald-600 font-medium">{act.organization}</p>
                        <p className="text-sm text-gray-600">{act.date}</p>
                        {act.description && <p className="text-gray-700 mt-2 text-sm">{act.description}</p>}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeSection === "extracurriculars" && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-emerald-600" />
                      <span>Extra-Curricular Activities</span>
                    </CardTitle>
                    <Button
                      onClick={() => setShowExtracurricularForm(!showExtracurricularForm)}
                      size="sm"
                      className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {showExtracurricularForm ? "Cancel" : "Add Extra-Curricular"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {showExtracurricularForm && (
                    <div className="space-y-4 mb-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="extraTitle">Title*</Label>
                          <Input
                            id="extraTitle"
                            value={extracurricularForm.title}
                            onChange={(e) => setExtracurricularForm((p) => ({ ...p, title: e.target.value }))}
                            placeholder="e.g., Debate Club Captain"
                          />
                        </div>
                        <div>
                          <Label htmlFor="extraOrg">Organization*</Label>
                          <Input
                            id="extraOrg"
                            value={extracurricularForm.organization}
                            onChange={(e) => setExtracurricularForm((p) => ({ ...p, organization: e.target.value }))}
                            placeholder="e.g., University Debate Society"
                          />
                        </div>
                        <div>
                          <Label htmlFor="extraDate">Date</Label>
                          <Input
                            id="extraDate"
                            value={extracurricularForm.date}
                            onChange={(e) => setExtracurricularForm((p) => ({ ...p, date: e.target.value }))}
                            placeholder="e.g., 2022 - 2023"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="extraDesc">Description</Label>
                        <Textarea
                          id="extraDesc"
                          value={extracurricularForm.description}
                          onChange={(e) => setExtracurricularForm((p) => ({ ...p, description: e.target.value }))}
                          rows={3}
                          placeholder="Describe activities, achievements, and impact..."
                        />
                      </div>
                      <div className="flex justify-end">
                        <Button onClick={saveExtracurricular} className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white">
                          <Save className="h-4 w-4 mr-2" />
                          Save Extra-Curricular
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Display existing extra-curricular activities */}
                  <div className="space-y-4">
                    {(resumeData.extracurriculars || []).map((act) => (
                      <div key={act.id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">{act.title}</h4>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeExtracurricular(act.id)}
                            className="border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-emerald-600 font-medium">{act.organization}</p>
                        <p className="text-sm text-gray-600">{act.date}</p>
                        {act.description && <p className="text-gray-700 mt-2 text-sm">{act.description}</p>}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {activeSection === "certifications" && (
              <div className="space-y-6">
                <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200">
                  <CardHeader>
                    <CardTitle className="text-emerald-800">Add Certification</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="certName">Certification Name *</Label>
                        <Input
                          id="certName"
                          value={certificationForm.name}
                          onChange={(e) => setCertificationForm((prev) => ({ ...prev, name: e.target.value }))}
                          placeholder="e.g., AWS Certified Solutions Architect"
                        />
                      </div>
                      <div>
                        <Label htmlFor="organization">Issuing Organization *</Label>
                        <Input
                          id="organization"
                          value={certificationForm.organization}
                          onChange={(e) => setCertificationForm((prev) => ({ ...prev, organization: e.target.value }))}
                          placeholder="e.g., Amazon Web Services"
                        />
                      </div>
                      <div>
                        <Label htmlFor="issueDate">Issue Date</Label>
                        <Input
                          id="issueDate"
                          type="date"
                          value={certificationForm.issueDate}
                          onChange={(e) => setCertificationForm((prev) => ({ ...prev, issueDate: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input
                          id="expiryDate"
                          type="date"
                          value={certificationForm.expiryDate}
                          onChange={(e) => setCertificationForm((prev) => ({ ...prev, expiryDate: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="credentialUrl">Credential URL</Label>
                      <Input
                        id="credentialUrl"
                        value={certificationForm.credentialUrl}
                        onChange={(e) => setCertificationForm((prev) => ({ ...prev, credentialUrl: e.target.value }))}
                        placeholder="https://www.credly.com/badges/..."
                      />
                    </div>
                    <Button onClick={saveCertification} className="bg-emerald-600 hover:bg-emerald-700">
                      Add Certification
                    </Button>
                  </CardContent>
                </Card>

                {/* Display existing certifications */}
                {resumeData.certifications && resumeData.certifications.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-800">Your Certifications</h3>
                    {resumeData.certifications.map((cert) => (
                      <Card key={cert.id} className="border-l-4 border-l-emerald-500">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">{cert.name}</h4>
                              <p className="text-gray-600">{cert.organization}</p>
                              <div className="text-sm text-gray-500 mt-1">
                                {cert.issueDate && <span>Issued: {new Date(cert.issueDate).toLocaleDateString()}</span>}
                                {cert.expiryDate && (
                                  <span className="ml-4">
                                    Expires: {new Date(cert.expiryDate).toLocaleDateString()}
                                  </span>
                                )}
                              </div>
                              {cert.credentialUrl && (
                                <a
                                  href={cert.credentialUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-emerald-600 hover:text-emerald-800 text-sm underline mt-1 inline-block"
                                >
                                  View Credential
                                </a>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeCertification(cert.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeSection === "skills" && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Award className="h-5 w-5 text-emerald-600" />
                    <span>Skills</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      {resumeData.skills.map((skill, index) => (
                        <Badge key={index} variant="outline" className="border-emerald-200 text-emerald-700">
                          {skill}
                          <button
                            title="Remove skill"
                            onClick={() => {
                              setResumeData((prev) => ({
                                ...prev,
                                skills: prev.skills.filter((_, i) => i !== index),
                              }))
                            }}
                            className="ml-2 hover:bg-red-100 rounded-full p-0.5"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>

                    <div className="relative">
                      <div className="flex space-x-2">
                        <div className="flex-1 relative">
                          <Input
                            value={skillInput}
                            onChange={handleSkillInputChange}
                            onKeyPress={handleSkillInputKeyPress}
                            onFocus={() => skillInput.length > 0 && setShowSuggestions(true)}
                            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                            placeholder="Add a skill..."
                            className="w-full"
                          />

                          {showSuggestions && filteredSuggestions.length > 0 && (
                            <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                              {filteredSuggestions.map((suggestion, index) => (
                                <button
                                  key={index}
                                  onClick={() => addSkill(suggestion)}
                                  className="w-full text-left px-4 py-2 hover:bg-emerald-50 hover:text-emerald-700 transition-colors duration-150 text-sm"
                                >
                                  {suggestion}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        <Button
                          onClick={() => addSkill(skillInput)}
                          className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      {skillInput === "" && (
                        <div className="mt-3">
                          <p className="text-sm text-gray-600 mb-2">Popular skills:</p>
                          <div className="flex flex-wrap gap-2">
                            {skillSuggestions
                              .slice(0, 8)
                              .filter((skill) => !resumeData.skills.includes(skill))
                              .map((skill, index) => (
                                <button
                                  key={index}
                                  onClick={() => addSkill(skill)}
                                  className="px-3 py-1 text-xs bg-gray-100 hover:bg-emerald-100 hover:text-emerald-700 text-gray-600 rounded-full transition-colors duration-150"
                                >
                                  + {skill}
                                </button>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activeSection === "projects" && (
              <div className="space-y-6">
                <Card className="border-2 border-emerald-200 bg-emerald-50">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-emerald-800">Add Project</CardTitle>
                      <Button
                        onClick={() => setShowProjectForm(!showProjectForm)}
                        className="bg-emerald-600 hover:bg-emerald-700"
                      >
                        {showProjectForm ? "Cancel" : "Add Project"}
                      </Button>
                    </div>
                  </CardHeader>

                  {showProjectForm && (
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="projectName">Project Name *</Label>
                          <Input
                            id="projectName"
                            value={projectForm.name}
                            onChange={(e) => setProjectForm((prev) => ({ ...prev, name: e.target.value }))}
                            placeholder="Enter project name"
                            className="border-emerald-300 focus:border-emerald-500"
                          />
                        </div>
                        <div>
                          <Label htmlFor="projectDate">Date</Label>
                          <Input
                            id="projectDate"
                            value={projectForm.date}
                            onChange={(e) => setProjectForm((prev) => ({ ...prev, date: e.target.value }))}
                            placeholder="e.g., 2023 or Jan 2023 - Mar 2023"
                            className="border-emerald-300 focus:border-emerald-500"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="projectDescription">Description *</Label>
                        <div className="flex gap-2">
                          <Textarea
                            id="projectDescription"
                            value={projectForm.description}
                            onChange={(e) => setProjectForm((prev) => ({ ...prev, description: e.target.value }))}
                            placeholder="Describe your project, its features, and your role"
                            className="border-emerald-300 focus:border-emerald-500 min-h-[100px]"
                          />
                          <Button
                            size="sm"
                            variant="outline"
                            className="px-3 py-2 text-xs border-emerald-300 text-emerald-700 hover:bg-emerald-50 bg-transparent"
                          >
                            AI
                          </Button>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="projectTechnologies">Technologies (comma separated)</Label>
                        <Input
                          id="projectTechnologies"
                          value={projectForm.technologies}
                          onChange={(e) => setProjectForm((prev) => ({ ...prev, technologies: e.target.value }))}
                          placeholder="React, Node.js, MongoDB, AWS"
                          className="border-emerald-300 focus:border-emerald-500"
                        />
                      </div>

                      <Button onClick={saveProject} className="w-full bg-emerald-600 hover:bg-emerald-700">
                        Save Project
                      </Button>
                    </CardContent>
                  )}
                </Card>

                {/* Display existing projects */}
                {resumeData.projects.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800">Your Projects</h3>
                    {resumeData.projects.map((project) => (
                      <Card key={project.id} className="border-gray-200">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-gray-800">{project.name}</h4>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setResumeData((prev) => ({
                                  ...prev,
                                  projects: prev.projects.filter((p) => p.id !== project.id),
                                }))
                              }}
                              className="text-red-600 hover:text-red-700"
                            >
                              Remove
                            </Button>
                          </div>
                          {project.date && <p className="text-sm text-gray-600 mb-2">{project.date}</p>}
                          <p className="text-gray-700 mb-3">{project.description}</p>
                          {project.technologies.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {project.technologies.map((tech, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full"
                                >
                                  {tech}
                                </span>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Live Preview Panel */}
        <div className="w-full lg:w-1/2 p-3 sm:p-4 lg:p-6 bg-gray-100 overflow-y-auto max-h-screen">
          <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 max-w-full lg:max-w-2xl mx-auto">
            <div className="space-y-4 lg:space-y-6">
              {/* Header */}
              <div className="text-center border-b border-gray-200 pb-4 lg:pb-6">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 break-words">{resumeData.personalInfo.fullName}</h1>
                <div className="flex flex-wrap justify-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                  <span>{resumeData.personalInfo.email}</span>
                  <span className="hidden sm:inline">•</span>
                  <span>{resumeData.personalInfo.phone}</span>
                  <span className="hidden sm:inline">•</span>
                  <span>{resumeData.personalInfo.location}</span>
                </div>
                <div className="flex flex-wrap justify-center gap-2 sm:gap-4 text-xs sm:text-sm text-emerald-600 mt-2">
                  <span>{resumeData.personalInfo.linkedin}</span>
                  <span className="hidden sm:inline">•</span>
                  <span>{resumeData.personalInfo.website}</span>
                </div>
              </div>

              {/* Summary */}
              {resumeData.summary && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-200 pb-1">
                    Professional Summary
                  </h2>
                  <p className="text-gray-700 leading-relaxed">{resumeData.summary}</p>
                </div>
              )}

              {/* Experience */}
              {resumeData.experience.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-200 pb-1">
                    Work Experience
                  </h2>
                  <div className="space-y-4">
                    {resumeData.experience.map((exp) => (
                      <div key={exp.id}>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-semibold text-gray-900">{exp.title}</h3>
                            <p className="text-emerald-600 font-medium">{exp.company}</p>
                          </div>
                          <div className="text-right text-sm text-gray-600">
                            <p>{exp.location}</p>
                            <p>
                              {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                            </p>
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm leading-relaxed">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills */}
              {resumeData.skills.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-200 pb-1">Skills</h2>
                  <div className="flex flex-wrap gap-2">
                    {resumeData.skills.map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Education */}
              {resumeData.education.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-200 pb-1">Education</h2>
                  <div className="space-y-3">
                    {resumeData.education.map((edu) => (
                      <div key={edu.id} className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                          <p className="text-emerald-600">{edu.school}</p>
                        </div>
                        <div className="text-right text-sm text-gray-600">
                          <p>{edu.location}</p>
                          <p>{edu.graduationDate}</p>
                          {edu.gpa && <p>GPA: {edu.gpa}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {resumeData.certifications && resumeData.certifications.length > 0 && (
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-3 border-b-2 border-blue-600 pb-1">
                    CERTIFICATIONS
                  </h2>
                  <div className="space-y-3">
                    {resumeData.certifications.map((cert) => (
                      <div key={cert.id}>
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold text-gray-900">{cert.name}</h3>
                            <p className="text-gray-700">{cert.organization}</p>
                          </div>
                          <div className="text-right text-sm text-gray-600">
                            {cert.issueDate && <div>Issued: {new Date(cert.issueDate).toLocaleDateString()}</div>}
                            {cert.expiryDate && <div>Expires: {new Date(cert.expiryDate).toLocaleDateString()}</div>}
                          </div>
                        </div>
                        {cert.credentialUrl && (
                          <a
                            href={cert.credentialUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm underline"
                          >
                            View Credential
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              {resumeData.projects.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-200 pb-1">Projects</h2>
                  <div className="space-y-4">
                    {resumeData.projects.map((project) => (
                      <div key={project.id} className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-900">{project.name}</h3>
                          <p className="text-gray-700 text-sm leading-relaxed">{project.description}</p>
                        </div>
                        <div className="text-right text-sm text-gray-600">
                          {project.date && <p>{project.date}</p>}
                          <div className="flex flex-wrap gap-2">
                            {project.technologies.map((tech, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Activities */}
              {resumeData.activities.length > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-200 pb-1">Activities</h2>
                  <div className="space-y-3">
                    {resumeData.activities.map((act) => (
                      <div key={act.id} className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-900">{act.title}</h3>
                          <p className="text-emerald-600">{act.organization}</p>
            </div>
                        <div className="text-right text-sm text-gray-600">
                          <p>{act.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Extra-Curricular Activities */}
              {resumeData.extracurriculars && (resumeData.extracurriculars?.length ?? 0) > 0 && (
                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-200 pb-1">Extra-Curricular Activities</h2>
                  <div className="space-y-3">
                    {(resumeData.extracurriculars || []).map((act) => (
                      <div key={act.id} className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-gray-900">{act.title}</h3>
                          <p className="text-emerald-600">{act.organization}</p>
                        </div>
                        <div className="text-right text-sm text-gray-600">
                          <p>{act.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Global Tailoring Results Modal */}
      {showResultsModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowResultsModal(false)} />
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl mx-4 p-6 max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-900">Tailored Resume Analysis</h3>
              <Button variant="outline" size="sm" onClick={() => setShowResultsModal(false)} className="border-gray-200">Close</Button>
            </div>
            
            <div className="space-y-6 max-h-[calc(90vh-120px)] overflow-y-auto pr-2">
              {/* Job Information */}
              {jobData && (
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Job Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Job Title:</span>
                      <p className="text-gray-900">{jobData.job_title || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Company:</span>
                      <p className="text-gray-900">{jobData.company_name || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Location:</span>
                      <p className="text-gray-900">{jobData.location || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Industry:</span>
                      <p className="text-gray-900">{jobData.industry || 'N/A'}</p>
                    </div>
                  </div>
                  {jobData.job_description && jobData.job_description !== 'Not specified' && (
                    <div className="mt-3">
                      <span className="text-sm font-medium text-gray-600">Description:</span>
                      <p className="text-gray-700 mt-1 text-sm">{jobData.job_description}</p>
                    </div>
                  )}

      {/* Leave Confirm Modal */}
      {showLeaveConfirm && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => confirmLeaveAndNavigate('cancel')} />
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Unsaved changes</h3>
            <p className="text-sm text-gray-600 mb-4">You have unsaved changes. Would you like to save before leaving?</p>
            <div className="flex items-center justify-end gap-2">
              <Button variant="outline" onClick={() => confirmLeaveAndNavigate('cancel')} className="border-gray-200">Stay</Button>
              <Button variant="outline" onClick={() => confirmLeaveAndNavigate('discard')} className="border-red-200 text-red-600">Discard</Button>
              <Button onClick={() => confirmLeaveAndNavigate('save')} className="bg-emerald-600 hover:bg-emerald-700 text-white">Save & Leave</Button>
            </div>
          </div>
                    </div>
                  )}
                </div>
              )}

              {/* Analysis Results */}
              {analysis && (
                <div className="space-y-6">
                  {/* Match Scores */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200 text-center">
                      <div className="text-3xl font-bold text-emerald-800">{analysis.overall_match_score ?? '—'}</div>
                      <div className="text-sm text-emerald-700">Overall Match</div>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 text-center">
                      <div className="text-2xl font-bold text-blue-800">{analysis.match_grade ?? '—'}</div>
                      <div className="text-sm text-blue-700">Grade</div>
                    </div>
                    <div className="p-4 bg-amber-50 rounded-lg border border-amber-200 text-center">
                      <div className="text-2xl font-bold text-amber-800">{analysis.skills_match?.skills_match_percentage ?? '—'}%</div>
                      <div className="text-sm text-amber-700">Skills Match</div>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200 text-center">
                      <div className="text-2xl font-bold text-purple-800">{analysis.experience_match?.experience_score ?? '—'}</div>
                      <div className="text-sm text-purple-700">Experience</div>
                    </div>
                  </div>

                  {/* Skills Analysis */}
                  {analysis.skills_match && (
                    <div className="space-y-4">
                      <h4 className="text-lg font-semibold text-gray-800">Skills Analysis</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {analysis.skills_match.preferred_skills_matched && analysis.skills_match.preferred_skills_matched.length > 0 && (
                          <div className="p-3 bg-emerald-50 rounded border border-emerald-200">
                            <h5 className="font-medium text-emerald-800 mb-2">Matched Skills</h5>
                            <div className="flex flex-wrap gap-2">
                              {analysis.skills_match.preferred_skills_matched.map((skill: string, i: number) => (
                                <span key={i} className="px-2 py-1 bg-emerald-100 text-emerald-800 text-xs rounded-full">{skill}</span>
                              ))}
                            </div>
                          </div>
                        )}
                        {analysis.skills_match.required_skills_missing && analysis.skills_match.required_skills_missing.length > 0 && (
                          <div className="p-3 bg-red-50 rounded border border-red-200">
                            <h5 className="font-medium text-red-800 mb-2">Missing Required Skills</h5>
                            <div className="flex flex-wrap gap-2">
                              {analysis.skills_match.required_skills_missing.map((skill: string, i: number) => (
                                <span key={i} className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">{skill}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Strengths & Weaknesses */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {analysis.strengths && analysis.strengths.length > 0 && (
                      <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                        <h4 className="text-lg font-semibold text-emerald-800 mb-3">Strengths</h4>
                        <ul className="space-y-2">
                          {analysis.strengths.map((strength: string, i: number) => (
                            <li key={i} className="flex items-start">
                              <span className="text-emerald-600 mr-2">✓</span>
                              <span className="text-gray-700 text-sm">{strength}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {analysis.weaknesses && analysis.weaknesses.length > 0 && (
                      <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                        <h4 className="text-lg font-semibold text-red-800 mb-3">Areas for Improvement</h4>
                        <ul className="space-y-2">
                          {analysis.weaknesses.map((weakness: string, i: number) => (
                            <li key={i} className="flex items-start">
                              <span className="text-red-600 mr-2">⚠</span>
                              <span className="text-gray-700 text-sm">{weakness}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Recommendations */}
                  {analysis.recommendations && analysis.recommendations.length > 0 && (
                    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="text-lg font-semibold text-blue-800 mb-3">Recommendations</h4>
                      <div className="space-y-3">
                        {analysis.recommendations.map((rec: any, i: number) => (
                          <div key={i} className="flex items-start p-3 bg-white rounded border border-blue-100">
                            <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></div>
                            <div>
                              <p className="text-gray-800 text-sm">{rec.message}</p>
                              <div className="flex items-center mt-2 space-x-3 text-xs text-gray-600">
                                <span className="capitalize">{rec.category}</span>
                                <span className="capitalize">{rec.priority} priority</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tailoring Suggestions */}
                  {analysis.tailoring_suggestions && analysis.tailoring_suggestions.length > 0 && (
                    <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                      <h4 className="text-lg font-semibold text-amber-800 mb-3">Tailoring Suggestions</h4>
                      <ul className="space-y-2">
                        {analysis.tailoring_suggestions.map((suggestion: string, i: number) => (
                          <li key={i} className="flex items-start">
                            <span className="text-amber-600 mr-2">💡</span>
                            <span className="text-gray-700 text-sm">{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Interview Chance */}
                  {analysis.estimated_interview_chance && (
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200 text-center">
                      <h4 className="text-lg font-semibold text-purple-800 mb-2">Interview Probability</h4>
                      <div className="text-2xl font-bold text-purple-800 capitalize">{analysis.estimated_interview_chance}</div>
                      <p className="text-purple-700 text-sm mt-1">Based on resume-job match analysis</p>
                    </div>
                  )}
                </div>
              )}

              {/* Suggestions */}
              {suggestions && (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-800">Additional Suggestions</h4>
                  
                  {suggestions.summary_suggestions && suggestions.summary_suggestions.length > 0 && (
                    <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                      <h5 className="font-medium text-indigo-800 mb-2">Summary Suggestions</h5>
                      <ul className="space-y-2">
                        {suggestions.summary_suggestions.map((s: string, i: number) => (
                          <li key={i} className="flex items-start">
                            <span className="text-indigo-600 mr-2">📝</span>
                            <span className="text-gray-700 text-sm">{s}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {suggestions.skills_to_add && suggestions.skills_to_add.length > 0 && (
                    <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                      <h5 className="font-medium text-green-800 mb-2">Skills to Add</h5>
                      <div className="flex flex-wrap gap-2">
                        {suggestions.skills_to_add.map((sk: string, i: number) => (
                          <span key={i} className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">+ {sk}</span>
                        ))}
                       </div>
                     </div>
                   )}

                   {suggestions.priority_actions && suggestions.priority_actions.length > 0 && (
                     <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                       <h5 className="font-medium text-orange-800 mb-2">Priority Actions</h5>
                       <ul className="space-y-2">
                         {suggestions.priority_actions.map((a: any, i: number) => (
                           <li key={i} className="flex items-start">
                             <span className="text-orange-600 mr-2">🎯</span>
                             <span className="text-gray-700 text-sm">{a.action || a.description || ''}</span>
                           </li>
                         ))}
                       </ul>
                     </div>
                   )}
                 </div>
               )}
             </div>
           </div>
         </div>
       )}
     </div>
   )
 }
