"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { X, Plus, MapPin, DollarSign, Clock, FileText, Calendar, Mail } from "lucide-react"

export default function PostJobPage() {
  const [skills, setSkills] = useState<string[]>([])
  const [skillInput, setSkillInput] = useState("")
  const [allowCalls, setAllowCalls] = useState(false)

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()])
      setSkillInput("")
    }
  }

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter((skill) => skill !== skillToRemove))
  }

  const handleSkillKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addSkill()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 p-4 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Post New Job</h1>
          <p className="text-gray-600">Create a comprehensive job posting to attract the best candidates</p>
        </div>

        <form className="space-y-8">
          {/* Basic Job Information */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Basic Job Information
              </CardTitle>
              <CardDescription className="text-emerald-100">Essential details about the position</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="jobTitle" className="text-sm font-medium text-gray-700">
                    Job Title *
                  </Label>
                  <Input
                    id="jobTitle"
                    placeholder="e.g. Senior Software Engineer"
                    className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobLocation" className="text-sm font-medium text-gray-700">
                    Job Location *
                  </Label>
                  <Input
                    id="jobLocation"
                    placeholder="e.g. New York, NY"
                    className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="jobType" className="text-sm font-medium text-gray-700">
                    Job Type *
                  </Label>
                  <Select required>
                    <SelectTrigger className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500">
                      <SelectValue placeholder="Select job type" />
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
                <div className="space-y-2">
                  <Label htmlFor="positions" className="text-sm font-medium text-gray-700">
                    Positions Available *
                  </Label>
                  <Input
                    id="positions"
                    type="number"
                    min="1"
                    placeholder="1"
                    className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="experience" className="text-sm font-medium text-gray-700">
                    Working Experience *
                  </Label>
                  <Select required>
                    <SelectTrigger className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500">
                      <SelectValue placeholder="Select experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="entry">Entry Level (0-1 years)</SelectItem>
                      <SelectItem value="junior">Junior (1-3 years)</SelectItem>
                      <SelectItem value="mid">Mid Level (3-5 years)</SelectItem>
                      <SelectItem value="senior">Senior (5-8 years)</SelectItem>
                      <SelectItem value="lead">Lead (8-12 years)</SelectItem>
                      <SelectItem value="executive">Executive (12+ years)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Salary and Benefits */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Salary and Benefits
              </CardTitle>
              <CardDescription className="text-emerald-100">Compensation details for the position</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="minSalary" className="text-sm font-medium text-gray-700">
                    Minimum Salary *
                  </Label>
                  <Input
                    id="minSalary"
                    type="number"
                    placeholder="50000"
                    className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="maxSalary" className="text-sm font-medium text-gray-700">
                    Maximum Salary *
                  </Label>
                  <Input
                    id="maxSalary"
                    type="number"
                    placeholder="80000"
                    className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salaryPeriod" className="text-sm font-medium text-gray-700">
                    Salary Period *
                  </Label>
                  <Select required>
                    <SelectTrigger className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500">
                      <SelectValue placeholder="Select period" />
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
            </CardContent>
          </Card>

          {/* Job Details */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Job Details
              </CardTitle>
              <CardDescription className="text-emerald-100">Detailed information about the role</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="skills" className="text-sm font-medium text-gray-700">
                  Required Skills
                </Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="bg-emerald-100 text-emerald-800">
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="ml-1 hover:text-emerald-600"
                        title={`Remove skill ${skill}`}
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    id="skills"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyPress={handleSkillKeyPress}
                    placeholder="Type a skill and press Enter or comma"
                    className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                  <Button type="button" onClick={addSkill} variant="outline" size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500">Press Enter or comma to add skills</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="jobDescription" className="text-sm font-medium text-gray-700">
                  Job Description *
                </Label>
                <Textarea
                  id="jobDescription"
                  placeholder="Describe the role, responsibilities, and what makes this position exciting..."
                  className="min-h-[120px] border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="jobRequirements" className="text-sm font-medium text-gray-700">
                  Job Requirements
                </Label>
                <Textarea
                  id="jobRequirements"
                  placeholder="List the qualifications, experience, and requirements for this position..."
                  className="min-h-[100px] border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
            </CardContent>
          </Card>

          {/* Location Details */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Location Details
              </CardTitle>
              <CardDescription className="text-emerald-100">Specific location information</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="country" className="text-sm font-medium text-gray-700">
                    Country *
                  </Label>
                  <Select required>
                    <SelectTrigger className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500">
                      <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="us">United States</SelectItem>
                      <SelectItem value="ca">Canada</SelectItem>
                      <SelectItem value="uk">United Kingdom</SelectItem>
                      <SelectItem value="au">Australia</SelectItem>
                      <SelectItem value="de">Germany</SelectItem>
                      <SelectItem value="fr">France</SelectItem>
                      <SelectItem value="in">India</SelectItem>
                      <SelectItem value="sg">Singapore</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="province" className="text-sm font-medium text-gray-700">
                    Province/State *
                  </Label>
                  <Input
                    id="province"
                    placeholder="e.g. California"
                    className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                    City *
                  </Label>
                  <Input
                    id="city"
                    placeholder="e.g. San Francisco"
                    className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fullAddress" className="text-sm font-medium text-gray-700">
                  Full Address
                </Label>
                <Input
                  id="fullAddress"
                  placeholder="Complete address (optional - for map integration)"
                  className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                />
                <p className="text-xs text-gray-500">This will be used for map integration and precise location</p>
              </div>
            </CardContent>
          </Card>

          {/* Application Settings */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Application Settings
              </CardTitle>
              <CardDescription className="text-emerald-100">Configure how candidates can apply</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="expiryDate" className="text-sm font-medium text-gray-700">
                    Job Expiry Date *
                  </Label>
                  <Input
                    id="expiryDate"
                    type="date"
                    className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="applicationMethod" className="text-sm font-medium text-gray-700">
                    Application Method *
                  </Label>
                  <Select required>
                    <SelectTrigger className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500">
                      <SelectValue placeholder="How should candidates apply?" />
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
            </CardContent>
          </Card>

          {/* Work Schedule */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Work Schedule
              </CardTitle>
              <CardDescription className="text-emerald-100">Define working hours and schedule</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="hoursPerWeek" className="text-sm font-medium text-gray-700">
                    Hours per Week
                  </Label>
                  <Input
                    id="hoursPerWeek"
                    type="number"
                    min="1"
                    max="80"
                    placeholder="40"
                    className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobSchedule" className="text-sm font-medium text-gray-700">
                    Job Schedule
                  </Label>
                  <Select>
                    <SelectTrigger className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500">
                      <SelectValue placeholder="Select schedule type" />
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
                <div className="space-y-2">
                  <Label htmlFor="hiringUrgency" className="text-sm font-medium text-gray-700">
                    Hiring Urgency
                  </Label>
                  <Select>
                    <SelectTrigger className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500">
                      <SelectValue placeholder="How urgent is this hire?" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low (1-3 months)</SelectItem>
                      <SelectItem value="medium">Medium (2-6 weeks)</SelectItem>
                      <SelectItem value="high">High (1-2 weeks)</SelectItem>
                      <SelectItem value="urgent">Urgent (ASAP)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Timeline
              </CardTitle>
              <CardDescription className="text-emerald-100">Important dates for this position</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="startDate" className="text-sm font-medium text-gray-700">
                    Planned Start Date
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="applicationDeadline" className="text-sm font-medium text-gray-700">
                    Application Deadline
                  </Label>
                  <Input
                    id="applicationDeadline"
                    type="date"
                    className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-emerald-600 to-green-600 text-white rounded-t-lg">
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                Contact Information
              </CardTitle>
              <CardDescription className="text-emerald-100">How candidates can reach you</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="notificationEmail" className="text-sm font-medium text-gray-700">
                  Notification Email *
                </Label>
                <Input
                  id="notificationEmail"
                  type="email"
                  placeholder="hr@company.com"
                  className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                  required
                />
                <p className="text-xs text-gray-500">You'll receive application notifications at this email</p>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="allowCalls"
                  checked={allowCalls}
                  onCheckedChange={(checked) => setAllowCalls(checked as boolean)}
                />
                <Label htmlFor="allowCalls" className="text-sm font-medium text-gray-700">
                  Allow direct calls from candidates
                </Label>
              </div>

              {allowCalls && (
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">
                    Phone Number *
                  </Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    className="border-gray-300 focus:border-emerald-500 focus:ring-emerald-500"
                    required={allowCalls}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4 pt-6">
            <Button type="button" variant="outline" className="px-8 bg-transparent">
              Save as Draft
            </Button>
            <Button
              type="submit"
              className="px-8 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
            >
              Post Job
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
