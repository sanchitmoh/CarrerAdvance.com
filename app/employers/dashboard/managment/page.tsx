"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import {
  Users,
  Search,
  Filter,
  Eye,
  Check,
  X,
  HelpCircle,
  MapPin,
  Mail,
  Building,
  Calendar,
  FileText,
  Download,
  Upload,
  DollarSign,
  UserCheck,
  ArrowLeft,
  MessageSquare,
  Video,
  GraduationCap,
  Briefcase,
  Globe,
  Award,
  Star,
} from "lucide-react"

interface Candidate {
  id: string
  name: string
  email: string
  phone: string
  designation: string
  location: string
  industry: string
  experience: string
  avatar: string
  skills: string[]
  status: "applied" | "shortlisted" | "reviewed" | "rejected" | "hired"
  appliedDate: string
  resumeUrl: string
  summary: string
  education: {
    degree: string
    institution: string
    year: string
  }
  languages: { name: string; level: string }[]
  ctc?: string
  documents?: string[]
}

export default function ManagementPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
  const [showCandidateList, setShowCandidateList] = useState(true)
  const [ctcAmount, setCTCAmount] = useState("")
  const [uploadedDocs, setUploadedDocs] = useState<string[]>([])

  const [candidates, setCandidates] = useState<Candidate[]>([
    {
      id: "1",
      name: "Dwan Mohite",
      email: "dwanmohite@gmail.com",
      phone: "09987547745",
      designation: "Senior Software Developer Engineer",
      location: "Beaupre, Canada",
      industry: "Technology",
      experience: "5+ years",
      avatar: "/placeholder.svg?height=40&width=40",
      skills: ["JavaScript", "React", "Node.js", "Python", "AWS", "Docker"],
      status: "applied",
      appliedDate: "2024-01-15",
      resumeUrl: "/resume.pdf",
      summary:
        "Highly motivated and detail-oriented software engineer with 5+ years of experience crafting innovative software solutions with a passion for coding and delivering high-quality results. Collaborative problem-solver with expertise in various programming languages. Passionate about coding and staying up-to-date with the latest technologies and trends.",
      education: {
        degree: "Bachelor of Computer Science",
        institution: "University of Technology",
        year: "2019",
      },
      languages: [
        { name: "English", level: "Native" },
        { name: "French", level: "Intermediate" },
      ],
    },
    {
      id: "2",
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      phone: "+1-555-0123",
      designation: "Frontend Developer",
      location: "New York, NY",
      industry: "Technology",
      experience: "3+ years",
      avatar: "/placeholder.svg?height=40&width=40",
      skills: ["React", "TypeScript", "CSS", "HTML", "Figma"],
      status: "shortlisted",
      appliedDate: "2024-01-12",
      resumeUrl: "/resume.pdf",
      summary: "Creative frontend developer with expertise in modern web technologies and user experience design.",
      education: {
        degree: "Bachelor of Design",
        institution: "Design Institute",
        year: "2021",
      },
      languages: [
        { name: "English", level: "Native" },
        { name: "Spanish", level: "Beginner" },
      ],
    },
    {
      id: "3",
      name: "Michael Chen",
      email: "michael.chen@email.com",
      phone: "+1-555-0456",
      designation: "Full Stack Developer",
      location: "San Francisco, CA",
      industry: "Technology",
      experience: "4+ years",
      avatar: "/placeholder.svg?height=40&width=40",
      skills: ["Java", "Spring Boot", "React", "PostgreSQL", "Kubernetes"],
      status: "reviewed",
      appliedDate: "2024-01-10",
      resumeUrl: "/resume.pdf",
      summary: "Experienced full-stack developer with strong backend and frontend skills.",
      education: {
        degree: "Master of Computer Science",
        institution: "Tech University",
        year: "2020",
      },
      languages: [
        { name: "English", level: "Fluent" },
        { name: "Mandarin", level: "Native" },
      ],
    },
    {
      id: "4",
      name: "Emily Rodriguez",
      email: "emily.rodriguez@email.com",
      phone: "+1-555-0789",
      designation: "DevOps Engineer",
      location: "Austin, TX",
      industry: "Technology",
      experience: "6+ years",
      avatar: "/placeholder.svg?height=40&width=40",
      skills: ["AWS", "Docker", "Kubernetes", "Terraform", "Jenkins"],
      status: "rejected",
      appliedDate: "2024-01-08",
      resumeUrl: "/resume.pdf",
      summary: "DevOps engineer with extensive cloud infrastructure experience.",
      education: {
        degree: "Bachelor of Engineering",
        institution: "Engineering College",
        year: "2018",
      },
      languages: [
        { name: "English", level: "Native" },
        { name: "Spanish", level: "Native" },
      ],
    },
    {
      id: "5",
      name: "David Kim",
      email: "david.kim@email.com",
      phone: "+1-555-0321",
      designation: "Senior Backend Developer",
      location: "Seattle, WA",
      industry: "Technology",
      experience: "7+ years",
      avatar: "/placeholder.svg?height=40&width=40",
      skills: ["Python", "Django", "PostgreSQL", "Redis", "Celery"],
      status: "hired",
      appliedDate: "2024-01-05",
      resumeUrl: "/resume.pdf",
      summary: "Senior backend developer with expertise in scalable system architecture.",
      education: {
        degree: "Master of Software Engineering",
        institution: "Software University",
        year: "2017",
      },
      languages: [
        { name: "English", level: "Fluent" },
        { name: "Korean", level: "Native" },
      ],
      ctc: "$120,000",
      documents: ["Offer Letter.pdf", "Contract.pdf"],
    },
  ])

  const updateCandidateStatus = (candidateId: string, newStatus: Candidate["status"]) => {
    setCandidates((prev) =>
      prev.map((candidate) => (candidate.id === candidateId ? { ...candidate, status: newStatus } : candidate)),
    )
  }

  const filteredCandidates = (status: Candidate["status"]) => {
    const statusCandidates = candidates.filter((candidate) => candidate.status === status)
    if (!searchTerm) return statusCandidates

    return statusCandidates.filter((candidate) => {
      const name = candidate.name || ""
      const email = candidate.email || ""
      const designation = candidate.designation || ""
      const location = candidate.location || ""
      const industry = candidate.industry || ""

      return (
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        industry.toLowerCase().includes(searchTerm.toLowerCase())
      )
    })
  }

  const CandidateCard = ({ candidate }: { candidate: Candidate }) => (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer border-gray-200">
      <CardContent className="p-4">
        <div className="flex items-start space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={candidate.avatar || "/placeholder.svg"} alt={candidate.name} />
            <AvatarFallback className="bg-emerald-100 text-emerald-700">
              {candidate.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-gray-900 truncate">{candidate.name}</h3>
                <p className="text-emerald-600 text-sm font-medium">{candidate.designation}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-3 w-3" />
                    <span>{candidate.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Building className="h-3 w-3" />
                    <span>{candidate.industry}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1 text-sm text-gray-600 mt-1">
                  <Mail className="h-3 w-3" />
                  <span className="truncate">{candidate.email}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-1 mt-3">
              {candidate.skills.slice(0, 3).map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-xs bg-emerald-100 text-emerald-700">
                  {skill}
                </Badge>
              ))}
              {candidate.skills.length > 3 && (
                <Badge variant="secondary" className="text-xs bg-gray-100 text-gray-600">
                  +{candidate.skills.length - 3}
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setSelectedCandidate(candidate)
                    setShowCandidateList(false)
                  }}
                  className="border-blue-200 text-blue-600 hover:bg-blue-50"
                >
                  <Eye className="h-3 w-3 mr-1" />
                  View
                </Button>

                {candidate.status !== "shortlisted" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateCandidateStatus(candidate.id, "shortlisted")}
                    className="border-green-200 text-green-600 hover:bg-green-50"
                  >
                    <Check className="h-3 w-3" />
                  </Button>
                )}

                {candidate.status !== "rejected" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateCandidateStatus(candidate.id, "rejected")}
                    className="border-red-200 text-red-600 hover:bg-red-50"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                )}

                {candidate.status !== "reviewed" && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateCandidateStatus(candidate.id, "reviewed")}
                    className="border-yellow-200 text-yellow-600 hover:bg-yellow-50"
                  >
                    <HelpCircle className="h-3 w-3" />
                  </Button>
                )}
              </div>

              <span className="text-xs text-gray-500">
                Applied {new Date(candidate.appliedDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  const CandidateProfile = ({ candidate }: { candidate: Candidate }) => (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar with candidate list */}
      <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-4 border-b border-gray-200">
          <Button
            variant="ghost"
            onClick={() => setShowCandidateList(true)}
            className="mb-4 text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to list
          </Button>
          <h2 className="font-semibold text-gray-900">Candidates</h2>
        </div>

        <div className="p-4 space-y-3">
          {candidates
            .filter((c) => c.status === candidate.status)
            .map((c) => (
              <div
                key={c.id}
                onClick={() => setSelectedCandidate(c)}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  c.id === candidate.id
                    ? "bg-blue-50 border-2 border-blue-200"
                    : "bg-gray-50 hover:bg-gray-100 border-2 border-transparent"
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={c.avatar || "/placeholder.svg"} alt={c.name} />
                    <AvatarFallback className="bg-emerald-100 text-emerald-700 text-xs">
                      {c.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-gray-900 truncate">{c.name}</p>
                    <p className="text-xs text-gray-600 truncate">{c.designation}</p>
                    <p className="text-xs text-gray-500 truncate">{c.location}</p>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Main profile content */}
      <div className="flex-1 overflow-y-auto">
        <div className="bg-white border-b border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div className="text-center flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{candidate.name}</h1>
              <p className="text-gray-600">
                {candidate.designation} at EY Technology • {candidate.location}
              </p>
            </div>

            <div className="flex space-x-2">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <Check className="h-4 w-4" />
              </Button>
              <Button className="bg-yellow-500 hover:bg-yellow-600 text-white">
                <HelpCircle className="h-4 w-4" />
              </Button>
              <Button className="bg-red-600 hover:bg-red-700 text-white">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex justify-center space-x-4 mt-4">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Calendar className="h-4 w-4 mr-2" />
              Set up interview
            </Button>
            <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent">
              <MessageSquare className="h-4 w-4 mr-2" />
              Message
            </Button>
            <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent">
              <Video className="h-4 w-4 mr-2" />
              Call
            </Button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-emerald-600" />
                <span>Personal Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-600">Email</Label>
                  <p className="text-gray-900">{candidate.email}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Phone</Label>
                  <p className="text-gray-900">{candidate.phone}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Location</Label>
                  <p className="text-gray-900">{candidate.location}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-600">Experience</Label>
                  <p className="text-gray-900">{candidate.experience}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Professional Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-emerald-600" />
                <span>Professional Summary</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 leading-relaxed">{candidate.summary}</p>
            </CardContent>
          </Card>

          {/* Experience */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Briefcase className="h-5 w-5 text-emerald-600" />
                <span>Experience</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start space-x-4">
                <div className="bg-blue-100 p-2 rounded">
                  <Building className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{candidate.designation}</h3>
                  <p className="text-emerald-600 font-medium">EY Technology</p>
                  <p className="text-sm text-gray-600">Aug 2022 – Present</p>
                  <p className="text-sm text-gray-600">{candidate.location}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Education */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <GraduationCap className="h-5 w-5 text-emerald-600" />
                <span>Education</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <h3 className="font-semibold text-gray-900">{candidate.education.degree}</h3>
                <p className="text-emerald-600 font-medium">{candidate.education.institution}</p>
                <p className="text-sm text-gray-600">Graduated {candidate.education.year}</p>
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Award className="h-5 w-5 text-emerald-600" />
                <span>Skills</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {candidate.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="bg-emerald-100 text-emerald-700">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Languages */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5 text-emerald-600" />
                <span>Languages</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {candidate.languages.map((lang, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span className="text-gray-900">{lang.name}</span>
                    <Badge variant="outline" className="border-emerald-200 text-emerald-700">
                      {lang.level}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Resume Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-emerald-600" />
                <span>Resume</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="h-8 w-8 text-red-600" />
                  <div>
                    <p className="font-medium text-gray-900">Resume.pdf</p>
                    <p className="text-sm text-gray-600">245 KB</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Hiring Section - Only for hired candidates */}
          {candidate.status === "hired" && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-green-800">
                  <UserCheck className="h-5 w-5" />
                  <span>Hiring Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="ctc">CTC Package</Label>
                    <div className="flex items-center space-x-2">
                      <DollarSign className="h-4 w-4 text-gray-400" />
                      <Input
                        id="ctc"
                        value={candidate.ctc || ctcAmount}
                        onChange={(e) => setCTCAmount(e.target.value)}
                        placeholder="Enter CTC amount"
                        className="border-green-300 focus:border-green-500"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label>Documents</Label>
                  <div className="border-2 border-dashed border-green-300 rounded-lg p-4 text-center">
                    <Upload className="h-8 w-8 text-green-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-600 mb-2">Upload hiring documents</p>
                    <Button variant="outline" size="sm" className="border-green-300 text-green-600 bg-transparent">
                      Choose Files
                    </Button>
                  </div>

                  {candidate.documents && candidate.documents.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {candidate.documents.map((doc, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-white rounded border">
                          <div className="flex items-center space-x-2">
                            <FileText className="h-4 w-4 text-green-600" />
                            <span className="text-sm">{doc}</span>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Download className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                  <UserCheck className="h-4 w-4 mr-2" />
                  Finalize Hiring
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )

  if (selectedCandidate && !showCandidateList) {
    return <CandidateProfile candidate={selectedCandidate} />
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Candidate Management</h1>
          <p className="text-gray-600">Manage and track your job applicants</p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search candidates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{filteredCandidates("applied").length}</div>
            <div className="text-sm text-gray-600">Applied</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{filteredCandidates("shortlisted").length}</div>
            <div className="text-sm text-gray-600">Shortlisted</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">{filteredCandidates("reviewed").length}</div>
            <div className="text-sm text-gray-600">Reviewed</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{filteredCandidates("rejected").length}</div>
            <div className="text-sm text-gray-600">Rejected</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-emerald-600">{filteredCandidates("hired").length}</div>
            <div className="text-sm text-gray-600">Hired</div>
          </CardContent>
        </Card>
      </div>

      {/* Candidate Tabs */}
      <Tabs defaultValue="applied" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="applied" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700">
            Applied ({filteredCandidates("applied").length})
          </TabsTrigger>
          <TabsTrigger
            value="shortlisted"
            className="data-[state=active]:bg-green-100 data-[state=active]:text-green-700"
          >
            Shortlisted ({filteredCandidates("shortlisted").length})
          </TabsTrigger>
          <TabsTrigger
            value="reviewed"
            className="data-[state=active]:bg-yellow-100 data-[state=active]:text-yellow-700"
          >
            Reviewed ({filteredCandidates("reviewed").length})
          </TabsTrigger>
          <TabsTrigger value="rejected" className="data-[state=active]:bg-red-100 data-[state=active]:text-red-700">
            Rejected ({filteredCandidates("rejected").length})
          </TabsTrigger>
          <TabsTrigger
            value="hired"
            className="data-[state=active]:bg-emerald-100 data-[state=active]:text-emerald-700"
          >
            Hired ({filteredCandidates("hired").length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="applied" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredCandidates("applied").map((candidate) => (
              <CandidateCard key={candidate.id} candidate={candidate} />
            ))}
          </div>
          {filteredCandidates("applied").length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">No applied candidates</p>
              <p>New applications will appear here</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="shortlisted" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredCandidates("shortlisted").map((candidate) => (
              <CandidateCard key={candidate.id} candidate={candidate} />
            ))}
          </div>
          {filteredCandidates("shortlisted").length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Star className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">No shortlisted candidates</p>
              <p>Shortlisted candidates will appear here</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="reviewed" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredCandidates("reviewed").map((candidate) => (
              <CandidateCard key={candidate.id} candidate={candidate} />
            ))}
          </div>
          {filteredCandidates("reviewed").length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <HelpCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">No candidates under review</p>
              <p>Candidates marked for review will appear here</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredCandidates("rejected").map((candidate) => (
              <div key={candidate.id} className="relative">
                <CandidateCard candidate={candidate} />
                <div className="absolute top-2 right-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => updateCandidateStatus(candidate.id, "shortlisted")}
                    className="border-green-200 text-green-600 hover:bg-green-50"
                  >
                    Move to Shortlisted
                  </Button>
                </div>
              </div>
            ))}
          </div>
          {filteredCandidates("rejected").length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <X className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">No rejected candidates</p>
              <p>Rejected candidates will appear here</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="hired" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredCandidates("hired").map((candidate) => (
              <div key={candidate.id} className="relative">
                <CandidateCard candidate={candidate} />
                <div className="absolute top-2 right-2">
                  <Badge className="bg-emerald-100 text-emerald-700">Hired • {candidate.ctc}</Badge>
                </div>
              </div>
            ))}
          </div>
          {filteredCandidates("hired").length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <UserCheck className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium mb-2">No hired candidates</p>
              <p>Successfully hired candidates will appear here</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
