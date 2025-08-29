"use client"

import { useState, useRef, useEffect } from "react"
import { useParams, useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  FileText,
  User,
  Briefcase,
  GraduationCap,
  Award,
  Globe,
  Save,
  Download,
  Eye,
  Plus,
  Trash2,
  X,
} from "lucide-react"

interface PersonalInfo {
  firstName: string
  lastName: string
  email: string
  phone: string
  location: string
  linkedin: string
  github: string
  portfolio: string
}

interface Experience {
  id: string
  jobTitle: string
  company: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  description: string
}

interface Education {
  id: string
  degree: string
  institution: string
  location: string
  startDate: string
  endDate: string
  gpa?: string
  current: boolean
}

interface Skill {
  name: string
}

const SKILL_SUGGESTIONS = [
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
  // Web Development
  "React",
  "Angular",
  "Vue.js",
  "Node.js",
  "Express.js",
  "HTML",
  "CSS",
  "SASS",
  "Bootstrap",
  "Tailwind CSS",
  // Databases
  "MySQL",
  "PostgreSQL",
  "MongoDB",
  "Redis",
  "SQLite",
  "Oracle",
  "SQL Server",
  // Cloud & DevOps
  "AWS",
  "Azure",
  "Google Cloud",
  "Docker",
  "Kubernetes",
  "Jenkins",
  "Git",
  "GitHub",
  "GitLab",
  // Data Science & AI
  "Machine Learning",
  "Data Analysis",
  "TensorFlow",
  "PyTorch",
  "Pandas",
  "NumPy",
  "R",
  "Tableau",
  "Power BI",
  // Design
  "Adobe Photoshop",
  "Adobe Illustrator",
  "Figma",
  "Sketch",
  "UI/UX Design",
  "Graphic Design",
  // Project Management
  "Agile",
  "Scrum",
  "Kanban",
  "Jira",
  "Trello",
  "Project Management",
  // Soft Skills
  "Leadership",
  "Communication",
  "Problem Solving",
  "Team Collaboration",
  "Time Management",
  "Critical Thinking",
]

export default function ResumeBuilderEditor() {
  const params = useParams()
  const searchParams = useSearchParams()
  const resumeId = params.id as string
  const template = searchParams.get("template") || "modern"

  const [personalInfo, setPersonalInfo] = useState<PersonalInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    github: "",
    portfolio: "",
  })

  const [summary, setSummary] = useState("")
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [education, setEducation] = useState<Education[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [languages, setLanguages] = useState<string[]>([])
  const [certificates, setCertificates] = useState<string[]>([])
  const [languagesInput, setLanguagesInput] = useState("")
  const [certificatesInput, setCertificatesInput] = useState("")

  const [activeTab, setActiveTab] = useState("personal")
  const [skillInput, setSkillInput] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [filteredSuggestions, setFilteredSuggestions] = useState<string[]>([])
  const skillInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (skillInput.length > 0) {
      const filtered = SKILL_SUGGESTIONS.filter(
        (skill) =>
          skill.toLowerCase().includes(skillInput.toLowerCase()) &&
          !skills.some((existingSkill) => existingSkill.name.toLowerCase() === skill.toLowerCase()),
      ).slice(0, 8)
      setFilteredSuggestions(filtered)
      setShowSuggestions(filtered.length > 0)
    } else {
      setShowSuggestions(false)
    }
  }, [skillInput, skills])

  const handleSave = () => {
    // Save resume data
    console.log("Saving resume...", {
      personalInfo,
      summary,
      experiences,
      education,
      skills,
      languages,
      certificates,
    })
  }

  const handleDownload = () => {
    // Download resume as PDF
    console.log("Downloading resume...")
  }

  const addExperience = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      jobTitle: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
      description: "",
    }
    setExperiences([...experiences, newExp])
  }

  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      degree: "",
      institution: "",
      location: "",
      startDate: "",
      endDate: "",
      current: false,
    }
    setEducation([...education, newEdu])
  }

  const addSkillFromInput = () => {
    if (skillInput.trim() && !skills.some((skill) => skill.name.toLowerCase() === skillInput.toLowerCase())) {
      setSkills([...skills, { name: skillInput.trim() }])
      setSkillInput("")
      setShowSuggestions(false)
    }
  }

  const addSkillFromSuggestion = (skillName: string) => {
    setSkills([...skills, { name: skillName }])
    setSkillInput("")
    setShowSuggestions(false)
  }

  return (
    <div className="ml-16 pt-20 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 rounded-2xl p-6 text-white mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="h-8 w-8" />
              <div>
                <h1 className="text-2xl font-bold">Resume Builder</h1>
                <p className="text-emerald-100">Template: {template}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button onClick={handleSave} className="bg-white/10 text-white border border-white/20 hover:bg-white/20">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button onClick={handleDownload} className="bg-white text-emerald-600 hover:bg-emerald-50">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Editor Panel */}
          <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="personal" className="text-xs">
                  <User className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="summary" className="text-xs">
                  <FileText className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="experience" className="text-xs">
                  <Briefcase className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="education" className="text-xs">
                  <GraduationCap className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="skills" className="text-xs">
                  <Award className="h-4 w-4" />
                </TabsTrigger>
                <TabsTrigger value="additional" className="text-xs">
                  <Globe className="h-4 w-4" />
                </TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <User className="h-5 w-5 text-emerald-600" />
                      <span>Personal Information</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={personalInfo.firstName}
                          onChange={(e) => setPersonalInfo({ ...personalInfo, firstName: e.target.value })}
                          className="border-emerald-300 focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={personalInfo.lastName}
                          onChange={(e) => setPersonalInfo({ ...personalInfo, lastName: e.target.value })}
                          className="border-emerald-300 focus:border-emerald-500"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={personalInfo.email}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                        className="border-emerald-300 focus:border-emerald-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={personalInfo.phone}
                          onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                          className="border-emerald-300 focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={personalInfo.location}
                          onChange={(e) => setPersonalInfo({ ...personalInfo, location: e.target.value })}
                          className="border-emerald-300 focus:border-emerald-500"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="linkedin">LinkedIn</Label>
                      <Input
                        id="linkedin"
                        value={personalInfo.linkedin}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, linkedin: e.target.value })}
                        className="border-emerald-300 focus:border-emerald-500"
                        placeholder="https://linkedin.com/in/yourprofile"
                      />
                    </div>
                    <div>
                      <Label htmlFor="github">GitHub</Label>
                      <Input
                        id="github"
                        value={personalInfo.github}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, github: e.target.value })}
                        className="border-emerald-300 focus:border-emerald-500"
                        placeholder="https://github.com/yourusername"
                      />
                    </div>
                    <div>
                      <Label htmlFor="portfolio">Portfolio</Label>
                      <Input
                        id="portfolio"
                        value={personalInfo.portfolio}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, portfolio: e.target.value })}
                        className="border-emerald-300 focus:border-emerald-500"
                        placeholder="https://yourportfolio.com"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="summary" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <FileText className="h-5 w-5 text-emerald-600" />
                      <span>Professional Summary</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Textarea
                      value={summary}
                      onChange={(e) => setSummary(e.target.value)}
                      rows={6}
                      className="border-emerald-300 focus:border-emerald-500"
                      placeholder="Write a compelling summary of your background, skills, and career objectives..."
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="experience" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center space-x-2">
                        <Briefcase className="h-5 w-5 text-emerald-600" />
                        <span>Work Experience</span>
                      </CardTitle>
                      <Button onClick={addExperience} size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Experience
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {experiences.map((exp, index) => (
                      <Card key={exp.id} className="border-gray-200">
                        <CardContent className="p-4 space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <Input
                              placeholder="Job Title"
                              value={exp.jobTitle}
                              onChange={(e) => {
                                const updated = [...experiences]
                                updated[index].jobTitle = e.target.value
                                setExperiences(updated)
                              }}
                              className="border-emerald-300 focus:border-emerald-500"
                            />
                            <Input
                              placeholder="Company"
                              value={exp.company}
                              onChange={(e) => {
                                const updated = [...experiences]
                                updated[index].company = e.target.value
                                setExperiences(updated)
                              }}
                              className="border-emerald-300 focus:border-emerald-500"
                            />
                          </div>
                          <Textarea
                            placeholder="Describe your responsibilities and achievements..."
                            value={exp.description}
                            onChange={(e) => {
                              const updated = [...experiences]
                              updated[index].description = e.target.value
                              setExperiences(updated)
                            }}
                            rows={3}
                            className="border-emerald-300 focus:border-emerald-500"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setExperiences(experiences.filter((e) => e.id !== exp.id))}
                            className="border-red-200 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                    {experiences.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <Briefcase className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>No work experience added yet</p>
                        <p className="text-sm">Click "Add Experience" to get started</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="education" className="space-y-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center space-x-2">
                        <GraduationCap className="h-5 w-5 text-emerald-600" />
                        <span>Education</span>
                      </CardTitle>
                      <Button onClick={addEducation} size="sm" className="bg-emerald-600 hover:bg-emerald-700">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Education
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {education.map((edu, index) => (
                      <Card key={edu.id} className="border-gray-200">
                        <CardContent className="p-4 space-y-3">
                          <div className="grid grid-cols-2 gap-3">
                            <Input
                              placeholder="Degree"
                              value={edu.degree}
                              onChange={(e) => {
                                const updated = [...education]
                                updated[index].degree = e.target.value
                                setEducation(updated)
                              }}
                              className="border-emerald-300 focus:border-emerald-500"
                            />
                            <Input
                              placeholder="Institution"
                              value={edu.institution}
                              onChange={(e) => {
                                const updated = [...education]
                                updated[index].institution = e.target.value
                                setEducation(updated)
                              }}
                              className="border-emerald-300 focus:border-emerald-500"
                            />
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEducation(education.filter((e) => e.id !== edu.id))}
                            className="border-red-200 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                    {education.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <GraduationCap className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p>No education added yet</p>
                        <p className="text-sm">Click "Add Education" to get started</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="skills" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Award className="h-5 w-5 text-emerald-600" />
                      <span>Skills & Expertise</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="relative">
                      <div className="flex space-x-2">
                        <div className="flex-1 relative">
                          <Input
                            ref={skillInputRef}
                            placeholder="Type a skill (e.g., JavaScript, Python, Project Management...)"
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault()
                                addSkillFromInput()
                              }
                              if (e.key === "Escape") {
                                setShowSuggestions(false)
                              }
                            }}
                            className="border-emerald-300 focus:border-emerald-500"
                          />
                          {showSuggestions && (
                            <div className="absolute top-full left-0 right-0 z-10 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                              {filteredSuggestions.map((suggestion, index) => (
                                <button
                                  key={index}
                                  onClick={() => addSkillFromSuggestion(suggestion)}
                                  className="w-full text-left px-3 py-2 hover:bg-emerald-50 text-sm border-b border-gray-100 last:border-b-0"
                                >
                                  {suggestion}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                        <Button
                          onClick={addSkillFromInput}
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700"
                          disabled={!skillInput.trim()}
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {skills.map((skill, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border">
                          <div className="flex items-center space-x-3 flex-1">
                            <span className="font-medium text-gray-900">{skill.name}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSkills(skills.filter((_, i) => i !== index))}
                            className="text-red-600 hover:bg-red-50 h-8 w-8 p-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    {skills.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        <Award className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                        <p className="font-medium">No skills added yet</p>
                        <p className="text-sm">Start typing to add your first skill</p>
                      </div>
                    )}

                    <div className="border-t pt-4">
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">Quick Add Popular Skills:</Label>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "JavaScript",
                          "Python",
                          "React",
                          "Node.js",
                          "SQL",
                          "Git",
                          "Project Management",
                          "Communication",
                        ].map((skill) => (
                          <Button
                            key={skill}
                            variant="outline"
                            size="sm"
                            onClick={() => addSkillFromSuggestion(skill)}
                            disabled={skills.some((s) => s.name.toLowerCase() === skill.toLowerCase())}
                            className="text-xs h-7 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                          >
                            {skill}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="additional" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Globe className="h-5 w-5 text-emerald-600" />
                      <span>Additional Information</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Languages</Label>
                      <Input
                        placeholder="e.g., English (Native), Spanish (Intermediate)"
                        className="border-emerald-300 focus:border-emerald-500"
                        value={languagesInput}
                        onChange={(e) => setLanguagesInput(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Certificates</Label>
                      <Input
                        placeholder="e.g., AWS Certified Developer, Google Analytics"
                        className="border-emerald-300 focus:border-emerald-500"
                        value={certificatesInput}
                        onChange={(e) => setCertificatesInput(e.target.value)}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Preview Panel */}
          <div className="lg:sticky lg:top-24">
            <Card className="h-[800px]">
              <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50">
                <CardTitle className="flex items-center space-x-2">
                  <Eye className="h-5 w-5 text-emerald-600" />
                  <span>Resume Preview</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6 h-full overflow-y-auto">
                <div className="bg-white border rounded-lg p-8 min-h-full shadow-sm">
                  <div className="space-y-8">
                    {/* Header */}
                    <div className="text-center border-b-2 border-emerald-600 pb-6">
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {personalInfo.firstName || "Your Name"} {personalInfo.lastName}
                      </h1>
                      <div className="text-gray-600 space-y-1 text-sm">
                        {personalInfo.email && <p>{personalInfo.email}</p>}
                        <div className="flex justify-center items-center space-x-4">
                          {personalInfo.phone && <span>{personalInfo.phone}</span>}
                          {personalInfo.location && <span>{personalInfo.location}</span>}
                        </div>
                        <div className="flex justify-center items-center space-x-4 text-emerald-600">
                          {personalInfo.linkedin && <span>LinkedIn</span>}
                          {personalInfo.github && <span>GitHub</span>}
                          {personalInfo.portfolio && <span>Portfolio</span>}
                        </div>
                      </div>
                    </div>

                    {/* Summary */}
                    {summary && (
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-3 border-b border-gray-300 pb-1">
                          PROFESSIONAL SUMMARY
                        </h2>
                        <p className="text-gray-700 leading-relaxed">{summary}</p>
                      </div>
                    )}

                    {/* Experience */}
                    {experiences.length > 0 && (
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-300 pb-1">
                          WORK EXPERIENCE
                        </h2>
                        <div className="space-y-5">
                          {experiences.map((exp) => (
                            <div key={exp.id} className="border-l-4 border-emerald-600 pl-4">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <h3 className="text-lg font-semibold text-gray-900">{exp.jobTitle || "Job Title"}</h3>
                                  <p className="text-emerald-600 font-medium text-base">
                                    {exp.company || "Company Name"}
                                  </p>
                                </div>
                                <div className="text-right text-sm text-gray-600">
                                  <p>{exp.location}</p>
                                  <p>
                                    {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                                  </p>
                                </div>
                              </div>
                              {exp.description && (
                                <div className="text-gray-700 leading-relaxed">
                                  {exp.description.split("\n").map((line, i) => (
                                    <p key={i} className="mb-1">
                                      • {line}
                                    </p>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Education */}
                    {education.length > 0 && (
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-300 pb-1">
                          EDUCATION
                        </h2>
                        <div className="space-y-3">
                          {education.map((edu) => (
                            <div key={edu.id} className="border-l-4 border-emerald-600 pl-4">
                              <h3 className="text-lg font-semibold text-gray-900">{edu.degree || "Degree"}</h3>
                              <p className="text-emerald-600 font-medium">{edu.institution || "Institution"}</p>
                              <div className="text-sm text-gray-600">
                                <p>{edu.location}</p>
                                <p>
                                  {edu.startDate} - {edu.current ? "Present" : edu.endDate}
                                </p>
                                {edu.gpa && <p>GPA: {edu.gpa}</p>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Skills */}
                    {skills.length > 0 && (
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-300 pb-1">
                          SKILLS & EXPERTISE
                        </h2>
                        <div className="flex flex-wrap gap-2">
                          {skills.map((skill, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-sm border-emerald-500 text-emerald-700 bg-emerald-50"
                            >
                              {skill.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Additional Information */}
                    {(languagesInput || certificatesInput) && (
                      <div>
                        <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-300 pb-1">
                          ADDITIONAL INFORMATION
                        </h2>
                        <div className="space-y-3">
                          {languagesInput && (
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">Languages</h3>
                              <p className="text-gray-700">{languagesInput}</p>
                            </div>
                          )}
                          {certificatesInput && (
                            <div>
                              <h3 className="text-lg font-semibold text-gray-900 mb-2">Certificates</h3>
                              <p className="text-gray-700">{certificatesInput}</p>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
