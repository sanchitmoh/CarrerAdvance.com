"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  User,
  Mail,
  MapPin,
  Edit,
  Save,
  X,
  Camera,
  GraduationCap,
  Briefcase,
  DollarSign,
  Github,
  Linkedin,
  Globe,
  BarChart3,
  Award,
  TrendingUp,
} from "lucide-react"

export default function StudentProfilePage() {
  const [isEditingPersonal, setIsEditingPersonal] = useState(false)
  const [isEditingPreferences, setIsEditingPreferences] = useState(false)

  const [personalData, setPersonalData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@student.edu",
    school: "University of Technology",
    specialization: "Computer Science",
    currentEducation: "Bachelor's Degree",
    graduationYear: "2025",
    grade: "3.8 GPA",
    careerObjective:
      "Seeking a software engineering role where I can apply my technical skills and contribute to innovative projects while continuing to learn and grow professionally.",
    linkedin: "https://linkedin.com/in/johndoe",
    github: "https://github.com/johndoe",
    portfolio: "https://johndoe.dev",
    avatar: "/placeholder.svg?height=100&width=100",
  })

  const [jobPreferences, setJobPreferences] = useState({
    jobType: "FULL TIME",
    location: "New York, NY",
    expectedSalary: "$65,000 - $80,000",
  })

  const handlePersonalChange = (field: string, value: string) => {
    setPersonalData((prev) => ({ ...prev, [field]: value }))
  }

  const handlePreferencesChange = (field: string, value: string) => {
    setJobPreferences((prev) => ({ ...prev, [field]: value }))
  }

  const handleSavePersonal = () => {
    setIsEditingPersonal(false)
    // Save to backend
  }

  const handleSavePreferences = () => {
    setIsEditingPreferences(false)
    // Save to backend
  }

  const profileStats = {
    profileCompletion: 85,
    profileViews: 127,
    connections: 45,
    coursesCompleted: 8,
    certificatesEarned: 5,
    goalsAchieved: 12,
    applicationsSent: 23,
    responseRate: 34,
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto p-6 space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Profile</h1>
          <p className="text-gray-600">Complete your profile to get better opportunities</p>
        </div>

        {/* Profile Picture & Basic Info */}
        <Card className="border-green-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-green-600" />
                <div>
                  <CardTitle className="text-green-800">Profile Picture</CardTitle>
                  <CardDescription className="text-green-600">Your profile image and basic information</CardDescription>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <Avatar className="h-24 w-24 ring-4 ring-green-500/20">
                  <AvatarImage
                    src={personalData.avatar || "/placeholder.svg"}
                    alt={`${personalData.firstName} ${personalData.lastName}`}
                  />
                  <AvatarFallback className="bg-gradient-to-br from-green-500 to-emerald-500 text-white text-xl">
                    {personalData.firstName[0]}
                    {personalData.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="sm"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-green-600 hover:bg-green-700 p-0"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {personalData.firstName} {personalData.lastName}
                </h3>
                <p className="text-gray-600">{personalData.email}</p>
                <Badge variant="secondary" className="mt-2 bg-green-100 text-green-700">
                  Student
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information Form */}
        <Card className="border-green-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <GraduationCap className="h-5 w-5 text-green-600" />
                <div>
                  <CardTitle className="text-green-800">Personal Information</CardTitle>
                  <CardDescription className="text-green-600">Your basic personal details</CardDescription>
                </div>
              </div>
              <Button
                variant={isEditingPersonal ? "destructive" : "outline"}
                size="sm"
                onClick={isEditingPersonal ? () => setIsEditingPersonal(false) : () => setIsEditingPersonal(true)}
                className={
                  isEditingPersonal
                    ? "border-red-200 text-red-600 hover:bg-red-50"
                    : "border-green-200 text-green-600 hover:bg-green-50"
                }
              >
                {isEditingPersonal ? <X className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
                {isEditingPersonal ? "Cancel" : "Edit"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="text-gray-700 font-medium">
                  First Name
                </Label>
                <Input
                  id="firstName"
                  value={personalData.firstName}
                  onChange={(e) => handlePersonalChange("firstName", e.target.value)}
                  disabled={!isEditingPersonal}
                  className={isEditingPersonal ? "border-green-300 focus:border-green-500" : "bg-gray-50"}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName" className="text-gray-700 font-medium">
                  Last Name
                </Label>
                <Input
                  id="lastName"
                  value={personalData.lastName}
                  onChange={(e) => handlePersonalChange("lastName", e.target.value)}
                  disabled={!isEditingPersonal}
                  className={isEditingPersonal ? "border-green-300 focus:border-green-500" : "bg-gray-50"}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={personalData.email}
                    onChange={(e) => handlePersonalChange("email", e.target.value)}
                    disabled={!isEditingPersonal}
                    className={`pl-10 ${isEditingPersonal ? "border-green-300 focus:border-green-500" : "bg-gray-50"}`}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="school" className="text-gray-700 font-medium">
                  School/College/University
                </Label>
                <Input
                  id="school"
                  value={personalData.school}
                  onChange={(e) => handlePersonalChange("school", e.target.value)}
                  disabled={!isEditingPersonal}
                  className={isEditingPersonal ? "border-green-300 focus:border-green-500" : "bg-gray-50"}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialization" className="text-gray-700 font-medium">
                  Specialization
                </Label>
                <Input
                  id="specialization"
                  value={personalData.specialization}
                  onChange={(e) => handlePersonalChange("specialization", e.target.value)}
                  disabled={!isEditingPersonal}
                  className={isEditingPersonal ? "border-green-300 focus:border-green-500" : "bg-gray-50"}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="currentEducation" className="text-gray-700 font-medium">
                  Current Education
                </Label>
                <Select
                  value={personalData.currentEducation}
                  onValueChange={(value) => handlePersonalChange("currentEducation", value)}
                  disabled={!isEditingPersonal}
                >
                  <SelectTrigger
                    className={isEditingPersonal ? "border-green-300 focus:border-green-500" : "bg-gray-50"}
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="High School">High School</SelectItem>
                    <SelectItem value="Associate's Degree">Associate's Degree</SelectItem>
                    <SelectItem value="Bachelor's Degree">Bachelor's Degree</SelectItem>
                    <SelectItem value="Master's Degree">Master's Degree</SelectItem>
                    <SelectItem value="PhD">PhD</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="graduationYear" className="text-gray-700 font-medium">
                  Graduation Year
                </Label>
                <Input
                  id="graduationYear"
                  value={personalData.graduationYear}
                  onChange={(e) => handlePersonalChange("graduationYear", e.target.value)}
                  disabled={!isEditingPersonal}
                  className={isEditingPersonal ? "border-green-300 focus:border-green-500" : "bg-gray-50"}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="grade" className="text-gray-700 font-medium">
                  Grade
                </Label>
                <Input
                  id="grade"
                  value={personalData.grade}
                  onChange={(e) => handlePersonalChange("grade", e.target.value)}
                  disabled={!isEditingPersonal}
                  className={isEditingPersonal ? "border-green-300 focus:border-green-500" : "bg-gray-50"}
                  placeholder="e.g., 3.8 GPA, 85%, A-"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="linkedin" className="text-gray-700 font-medium">
                  LinkedIn
                </Label>
                <div className="relative">
                  <Linkedin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="linkedin"
                    value={personalData.linkedin}
                    onChange={(e) => handlePersonalChange("linkedin", e.target.value)}
                    disabled={!isEditingPersonal}
                    className={`pl-10 ${isEditingPersonal ? "border-green-300 focus:border-green-500" : "bg-gray-50"}`}
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="github" className="text-gray-700 font-medium">
                  GitHub
                </Label>
                <div className="relative">
                  <Github className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="github"
                    value={personalData.github}
                    onChange={(e) => handlePersonalChange("github", e.target.value)}
                    disabled={!isEditingPersonal}
                    className={`pl-10 ${isEditingPersonal ? "border-green-300 focus:border-green-500" : "bg-gray-50"}`}
                    placeholder="https://github.com/yourusername"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="portfolio" className="text-gray-700 font-medium">
                  Portfolio
                </Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="portfolio"
                    value={personalData.portfolio}
                    onChange={(e) => handlePersonalChange("portfolio", e.target.value)}
                    disabled={!isEditingPersonal}
                    className={`pl-10 ${isEditingPersonal ? "border-green-300 focus:border-green-500" : "bg-gray-50"}`}
                    placeholder="https://yourportfolio.com"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 space-y-2">
              <Label htmlFor="careerObjective" className="text-gray-700 font-medium">
                Career Objective
              </Label>
              <Textarea
                id="careerObjective"
                value={personalData.careerObjective}
                onChange={(e) => handlePersonalChange("careerObjective", e.target.value)}
                disabled={!isEditingPersonal}
                rows={4}
                className={isEditingPersonal ? "border-green-300 focus:border-green-500" : "bg-gray-50"}
                placeholder="Describe your career goals and objectives..."
              />
            </div>

            {isEditingPersonal && (
              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setIsEditingPersonal(false)}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSavePersonal}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Job Preferences Form */}
        <Card className="border-green-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Briefcase className="h-5 w-5 text-green-600" />
                <div>
                  <CardTitle className="text-green-800">Job Preferences</CardTitle>
                  <CardDescription className="text-green-600">Your preferences for job search</CardDescription>
                </div>
              </div>
              <Button
                variant={isEditingPreferences ? "destructive" : "outline"}
                size="sm"
                onClick={
                  isEditingPreferences ? () => setIsEditingPreferences(false) : () => setIsEditingPreferences(true)
                }
                className={
                  isEditingPreferences
                    ? "border-red-200 text-red-600 hover:bg-red-50"
                    : "border-green-200 text-green-600 hover:bg-green-50"
                }
              >
                {isEditingPreferences ? <X className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
                {isEditingPreferences ? "Cancel" : "Edit"}
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="jobType" className="text-gray-700 font-medium">
                  Preferred Job Type
                </Label>
                <Select
                  value={jobPreferences.jobType}
                  onValueChange={(value) => handlePreferencesChange("jobType", value)}
                  disabled={!isEditingPreferences}
                >
                  <SelectTrigger
                    className={isEditingPreferences ? "border-green-300 focus:border-green-500" : "bg-gray-50"}
                  >
                    <SelectValue placeholder="Select Job Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="FULL TIME">Full Time</SelectItem>
                    <SelectItem value="PART TIME">Part Time</SelectItem>
                    <SelectItem value="CONTRACT">Contract</SelectItem>
                    <SelectItem value="INTERNSHIP">Internship</SelectItem>
                    <SelectItem value="FREELANCE">Freelance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-gray-700 font-medium">
                  Preferred Location
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="location"
                    value={jobPreferences.location}
                    onChange={(e) => handlePreferencesChange("location", e.target.value)}
                    disabled={!isEditingPreferences}
                    className={`pl-10 ${isEditingPreferences ? "border-green-300 focus:border-green-500" : "bg-gray-50"}`}
                    placeholder="e.g., New York, NY or Remote"
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="expectedSalary" className="text-gray-700 font-medium">
                  Expected Salary
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="expectedSalary"
                    value={jobPreferences.expectedSalary}
                    onChange={(e) => handlePreferencesChange("expectedSalary", e.target.value)}
                    disabled={!isEditingPreferences}
                    className={`pl-10 ${isEditingPreferences ? "border-green-300 focus:border-green-500" : "bg-gray-50"}`}
                    placeholder="e.g., $50,000 - $70,000 or Negotiable"
                  />
                </div>
              </div>
            </div>

            {isEditingPreferences && (
              <div className="flex justify-end space-x-3 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setIsEditingPreferences(false)}
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSavePreferences}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Preferences
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Profile Statistics section */}
        <Card className="border-green-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
            <div className="flex items-center space-x-3">
              <BarChart3 className="h-5 w-5 text-green-600" />
              <div>
                <CardTitle className="text-green-800">Profile Statistics</CardTitle>
                <CardDescription className="text-green-600">Your profile performance and achievements</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Award className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Total XP</span>
                </div>
                <p className="text-2xl font-bold text-green-900">Level 1</p>
                <p className="text-xs text-green-600">N/A</p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                <div className="flex items-center space-x-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-800">Current Level</span>
                </div>
                <p className="text-2xl font-bold text-blue-900">0</p>
                <p className="text-xs text-blue-600">N/A</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Briefcase className="h-4 w-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-800">Applications Sent</span>
                </div>
                <p className="text-2xl font-bold text-purple-900">0</p>
                <p className="text-xs text-purple-600">N/A</p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
                <div className="flex items-center space-x-2 mb-2">
                  <Award className="h-4 w-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-800">Certificates Earned</span>
                </div>
                <p className="text-2xl font-bold text-orange-900">0</p>
                <p className="text-xs text-orange-600">N/A</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
