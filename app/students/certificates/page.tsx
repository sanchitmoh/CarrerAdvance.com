"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Award, Download, Share2, CheckCircle, User, Calendar } from "lucide-react"

export default function CertificatesPage() {
  const [searchTerm, setSearchTerm] = useState("")

  const certificates = [
    {
      id: 1,
      title: "Web Development Fundamentals",
      provider: "CareerAdvance Academy",
      instructor: "John Smith",
      completedDate: "1/15/2024",
      credentialId: "CA-WDF-2024-001",
      skills: ["HTML", "CSS", "JavaScript"],
      verified: true,
    },
    {
      id: 2,
      title: "React.js Development",
      provider: "CareerAdvance Academy",
      instructor: "Sarah Johnson",
      completedDate: "1/10/2024",
      credentialId: "CA-RJS-2024-002",
      skills: ["React", "JSX", "State Management"],
      verified: true,
    },
    {
      id: 3,
      title: "Database Design Principles",
      provider: "CareerAdvance Academy",
      instructor: "Mike Chen",
      completedDate: "1/5/2024",
      credentialId: "CA-DDP-2024-003",
      skills: ["SQL", "Database Design", "Normalization"],
      verified: true,
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 ml-16 pt-20">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Certificates</h1>
              <p className="text-gray-600">Your earned certificates and professional credentials.</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-emerald-600">Total Certificates</p>
                  <p className="text-2xl font-bold text-emerald-900">3</p>
                </div>
                <Award className="w-8 h-8 text-emerald-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">Verified Certificates</p>
                  <p className="text-2xl font-bold text-green-900">3</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">Skills Certified</p>
                  <p className="text-2xl font-bold text-blue-900">9</p>
                </div>
                <Award className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {certificates.map((cert) => (
            <Card key={cert.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">{cert.title}</h3>
                    <p className="text-emerald-600 font-medium mb-2">{cert.provider}</p>
                  </div>
                  <div className="flex items-center space-x-1 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Verified Certificate</span>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <User className="w-4 h-4 mr-2" />
                    <span>Instructor: {cert.instructor}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Completed: {cert.completedDate}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Credential ID:</span> {cert.credentialId}
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Skills Covered:</p>
                  <div className="flex flex-wrap gap-2">
                    {cert.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </Button>
                  <Button size="sm" variant="outline">
                    <Share2 className="w-4 h-4 mr-1" />
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
