"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Plus, Edit, Trash2, Star, Download, Eye, Upload, Palette } from "lucide-react"
import Link from "next/link"

interface Resume {
  id: string
  title: string
  template: string
  lastModified: string
  isPrimary: boolean
  status: "draft" | "completed"
  score: number
}

export default function StudentResumeManagementPage() {
  const [resumes, setResumes] = useState<Resume[]>([
    {
      id: "1",
      title: "Computer Science Student Resume",
      template: "Student",
      lastModified: "2024-01-15",
      isPrimary: true,
      status: "completed",
      score: 85,
    },
    {
      id: "2",
      title: "Internship Application Resume",
      template: "Modern Professional",
      lastModified: "2024-01-10",
      isPrimary: false,
      status: "draft",
      score: 72,
    },
  ])

  const handleSetPrimary = (id: string) => {
    setResumes(
      resumes.map((resume) => ({
        ...resume,
        isPrimary: resume.id === id,
      })),
    )
  }

  const handleDelete = (id: string) => {
    setResumes(resumes.filter((resume) => resume.id !== id))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-100"
    if (score >= 60) return "text-yellow-600 bg-yellow-100"
    return "text-red-600 bg-red-100"
  }

  return (
    <div className="ml-16 pt-20 p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">My Resumes</h1>
              <p className="text-emerald-100">Create, edit, and manage your professional resumes</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button className="bg-white/10 text-white border border-white/20 hover:bg-white/20">
              <Upload className="h-4 w-4 mr-2" />
              Import Resume
            </Button>
            <Link href="/students/resume-builder">
              <Button className="bg-white text-emerald-600 hover:bg-emerald-50">
                <Plus className="h-4 w-4 mr-2" />
                Create Resume
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Resume List */}
      <div className="space-y-4">
        {resumes.length > 0 ? (
          resumes.map((resume) => (
            <Card
              key={resume.id}
              className={`border transition-colors ${
                resume.isPrimary ? "border-emerald-300 bg-emerald-50/50" : "border-gray-200 hover:border-emerald-200"
              }`}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg flex items-center justify-center">
                      <FileText className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center space-x-3">
                        <h3 className="text-lg font-semibold text-gray-900">{resume.title}</h3>
                        {resume.isPrimary && (
                          <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                            <Star className="h-3 w-3 mr-1" />
                            Primary
                          </Badge>
                        )}
                        <Badge
                          variant={resume.status === "completed" ? "default" : "secondary"}
                          className={
                            resume.status === "completed"
                              ? "bg-green-100 text-green-700 border-green-200"
                              : "bg-gray-100 text-gray-700 border-gray-200"
                          }
                        >
                          {resume.status === "completed" ? "Completed" : "Draft"}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <span>Template: {resume.template}</span>
                        <span>•</span>
                        <span>Modified: {formatDate(resume.lastModified)}</span>
                        <span>•</span>
                        <div className="flex items-center space-x-1">
                          <span>Score:</span>
                          <Badge variant="outline" className={getScoreColor(resume.score)}>
                            {resume.score}%
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Link href={`/students/resume-builder/${resume.id}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-emerald-200 text-emerald-600 hover:bg-emerald-50 bg-transparent"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>

                    <Button
                      variant="outline"
                      size="sm"
                      className="border-emerald-200 text-emerald-600 hover:bg-emerald-50 bg-transparent"
                    >
                      <Download className="h-4 w-4" />
                    </Button>

                    <Link href={`/students/resume-builder/${resume.id}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-emerald-200 text-emerald-600 hover:bg-emerald-50 bg-transparent"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>

                    {!resume.isPrimary && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSetPrimary(resume.id)}
                        className="border-green-200 text-green-600 hover:bg-green-50"
                      >
                        <Star className="h-4 w-4" />
                      </Button>
                    )}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDelete(resume.id)}
                      className="border-red-200 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="border-2 border-dashed border-emerald-300 bg-emerald-50/50">
            <CardContent className="p-12 text-center">
              <FileText className="h-16 w-16 text-emerald-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No resumes yet</h3>
              <p className="text-gray-600 mb-6">
                Create your first professional resume to get started with job applications
              </p>
              <Link href="/students/resume-builder">
                <Button className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Resume
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-emerald-200 hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <Eye className="h-8 w-8 text-emerald-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Resume Checker</h3>
            <p className="text-sm text-gray-600">Analyze and improve your resume</p>
          </CardContent>
        </Card>

        <Card className="border-emerald-200 hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <Palette className="h-8 w-8 text-emerald-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Templates</h3>
            <p className="text-sm text-gray-600">Browse all available templates</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
