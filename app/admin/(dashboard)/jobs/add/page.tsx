"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import BackButton from "@/components/back-button"
import { Briefcase, Save, X } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function AddJobPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    description: "",
    requirements: "",
    location: "",
    jobType: "",
    salaryMin: "",
    salaryMax: "",
    experienceLevel: "",
    externalUrl: "",
    deadline: "",
    active: true,
  })

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const existingJobs = JSON.parse(localStorage.getItem("adminJobs") || "[]")

    const newJob = {
      id: Date.now(), // Simple ID generation
      title: formData.title,
      company: formData.company,
      description: formData.description,
      requirements: formData.requirements,
      location: formData.location,
      type: formData.jobType.replace("_", " "), // Convert FULL_TIME to FULL TIME
      salary:
        formData.salaryMin && formData.salaryMax
          ? `$${formData.salaryMin} - $${formData.salaryMax}`
          : formData.salaryMin
            ? `$${formData.salaryMin}+`
            : formData.salaryMax
              ? `Up to $${formData.salaryMax}`
              : "Negotiable",
      status: formData.active ? "Active" : "Pending",
      applications: 0,
      datePosted: new Date().toLocaleDateString(),
      experienceLevel: formData.experienceLevel,
      externalUrl: formData.externalUrl,
      deadline: formData.deadline,
    }

    const updatedJobs = [...existingJobs, newJob]
    localStorage.setItem("adminJobs", JSON.stringify(updatedJobs))

    // Redirect to jobs page
    router.push("/admin/jobs")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-6 pt-4">
        <BackButton />
      </div>

      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Add New Job</h1>
              <p className="text-gray-600">Create a new job posting</p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-6">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Job Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Enter job title"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company">Company</Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => handleInputChange("company", e.target.value)}
                    placeholder="Enter company name"
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Enter job description"
                  rows={4}
                  required
                />
              </div>

              {/* Requirements */}
              <div className="space-y-2">
                <Label htmlFor="requirements">Requirements</Label>
                <Textarea
                  id="requirements"
                  value={formData.requirements}
                  onChange={(e) => handleInputChange("requirements", e.target.value)}
                  placeholder="Enter job requirements"
                  rows={4}
                  required
                />
              </div>

              {/* Location and Job Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    placeholder="Enter job location"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobType">Job Type</Label>
                  <Select value={formData.jobType} onValueChange={(value) => handleInputChange("jobType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select job type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="FULL_TIME">FULL TIME</SelectItem>
                      <SelectItem value="PART_TIME">PART TIME</SelectItem>
                      <SelectItem value="CONTRACT">CONTRACT</SelectItem>
                      <SelectItem value="INTERNSHIP">INTERNSHIP</SelectItem>
                      <SelectItem value="FREELANCE">FREELANCE</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Salary Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="salaryMin">Salary Min</Label>
                  <Input
                    id="salaryMin"
                    type="number"
                    value={formData.salaryMin}
                    onChange={(e) => handleInputChange("salaryMin", e.target.value)}
                    placeholder="Minimum salary"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="salaryMax">Salary Max</Label>
                  <Input
                    id="salaryMax"
                    type="number"
                    value={formData.salaryMax}
                    onChange={(e) => handleInputChange("salaryMax", e.target.value)}
                    placeholder="Maximum salary"
                  />
                </div>
              </div>

              {/* Experience Level and External URL */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="experienceLevel">Experience Level</Label>
                  <Input
                    id="experienceLevel"
                    value={formData.experienceLevel}
                    onChange={(e) => handleInputChange("experienceLevel", e.target.value)}
                    placeholder="e.g., Entry Level, Mid Level, Senior"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="externalUrl">External URL</Label>
                  <Input
                    id="externalUrl"
                    type="url"
                    value={formData.externalUrl}
                    onChange={(e) => handleInputChange("externalUrl", e.target.value)}
                    placeholder="https://company.com/job-posting"
                  />
                </div>
              </div>

              {/* Deadline and Active Status */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="deadline">Deadline</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => handleInputChange("deadline", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="active">Active</Label>
                  <div className="flex items-center space-x-2 pt-2">
                    <Switch
                      id="active"
                      checked={formData.active}
                      onCheckedChange={(checked) => handleInputChange("active", checked)}
                    />
                    <span className="text-sm text-gray-600">
                      {formData.active ? "Job is active" : "Job is inactive"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-6 border-t">
                <Link href="/admin/jobs">
                  <Button type="button" variant="outline" className="w-full sm:w-auto bg-transparent">
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto">
                  <Save className="h-4 w-4 mr-2" />
                  Add Job
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
