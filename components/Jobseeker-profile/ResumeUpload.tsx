'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Upload, FileText, Download, Eye, CheckCircle, AlertCircle } from 'lucide-react'
import { getAssetUrl } from '@/lib/api-config'

interface ResumeFile {
  id: string
  name: string
  size: string
  uploadDate: string
  status: 'active' | 'inactive'
  type: 'pdf' | 'doc' | 'docx'
  url?: string
}

export default function ResumeUpload() {
  const [resumes, setResumes] = useState<ResumeFile[]>([])
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    const loadResume = async () => {
      const userId = localStorage.getItem('jobseeker_id') || localStorage.getItem('user_id')
      if (!userId) return
      const res = await fetch(`/api/seeker/profile/get_resume?user_id=${encodeURIComponent(userId)}`)
      const payload = await res.json()
      if (payload?.success && payload?.data?.resume) {
        const resumePath: string = payload.data.resume
        const name = resumePath.split('/').pop() || 'resume.pdf'
        const url = getAssetUrl(resumePath)
        const ext = name.split('.').pop()?.toLowerCase() as 'pdf' | 'doc' | 'docx' | undefined
        setResumes([
          {
            id: 'active',
            name,
            size: '—',
            uploadDate: new Date().toISOString().split('T')[0],
            status: 'active',
            type: (ext === 'doc' || ext === 'docx' ? ext : 'pdf'),
            url,
          },
        ])
      }
    }
    loadResume()
  }, [])

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    const userId = localStorage.getItem('jobseeker_id') || localStorage.getItem('user_id')
    if (!file || !userId) return

    setIsUploading(true)
    setUploadProgress(0)

    const ticker = setInterval(() => {
      setUploadProgress(prev => (prev >= 90 ? prev : prev + 10))
    }, 200)

    try {
      const form = new FormData()
      form.append('user_id', userId)
      form.append('resume', file)
      const res = await fetch('/api/seeker/profile/update_resume', { method: 'POST', body: form })
      const payload = await res.json()
      if (payload?.success) {
        const name = file.name
        const ext = name.split('.').pop()?.toLowerCase() as 'pdf' | 'doc' | 'docx' | undefined
        const url = payload.data ? getAssetUrl(String(payload.data)) : undefined
        setResumes([
          {
            id: Date.now().toString(),
            name,
            size: `${Math.round(file.size / 1024)} KB`,
            uploadDate: new Date().toISOString().split('T')[0],
            status: 'active',
            type: (ext === 'doc' || ext === 'docx' ? ext : 'pdf'),
            url,
          },
        ])
        setUploadProgress(100)
      }
    } finally {
      clearInterval(ticker)
      setIsUploading(false)
    }
  }

  const handleDelete = (id: string) => {
    setResumes(resumes.filter(resume => resume.id !== id))
  }

  const handleSetActive = (id: string) => {
    setResumes(resumes.map(resume => ({
      ...resume,
      status: resume.id === id ? 'active' : 'inactive'
    })))
  }

  const getFileIcon = (type: string) => {
    return <FileText className="h-5 w-5 text-emerald-600" />
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <Card className="border-emerald-200 shadow-lg w-full max-w-4xl mx-auto">
      <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-t-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center space-x-3">
            <Upload className="h-5 w-5 text-emerald-600" />
            <div>
              <CardTitle className="text-emerald-800">Resume Management</CardTitle>
              <CardDescription className="text-emerald-600">
                Upload and manage your resume files
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-6">
          {/* Upload Box */}
          <div className="border-2 border-dashed border-emerald-300 rounded-lg p-6 sm:p-8 text-center bg-emerald-50/50">
            <Upload className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Your Resume</h3>
            <p className="text-gray-600 mb-2">Drag and drop your resume file here, or click to browse</p>
            <p className="text-sm text-gray-500 mb-4">Supported: PDF(Max size: 5MB)</p>

            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileUpload}
              className="hidden"
              id="resume-upload"
              disabled={isUploading}
            />
            <label htmlFor="resume-upload">
              <Button
                className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white"
                disabled={isUploading}
                asChild
              >
                <span>{isUploading ? 'Uploading…' : 'Choose File'}</span>
              </Button>
            </label>

            {isUploading && (
              <div className="mt-4 space-y-2">
                <Progress value={uploadProgress} className="h-2" />
                <p className="text-sm text-gray-600">{uploadProgress}% uploaded</p>
              </div>
            )}
          </div>

          {/* Resumes List */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Your Resumes</h3>

            {resumes.map(resume => (
              <Card
                key={resume.id}
                className={`border transition-colors ${
                  resume.status === 'active'
                    ? 'border-emerald-300 bg-emerald-50/50'
                    : 'border-gray-200 hover:border-emerald-200'
                }`}
              >
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    {/* File Info */}
                    <div className="flex items-start sm:items-center space-x-3">
                      {getFileIcon(resume.type)}
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-medium text-gray-900 break-all">{resume.name}</h4>
                          {resume.status === 'active' && (
                            <Badge className="bg-green-100 text-green-700 border-green-200">
                              <CheckCircle className="h-3 w-3 mr-1" /> Active
                            </Badge>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                          <span>{resume.size}</span>
                          <span>•</span>
                          <span>Uploaded {formatDate(resume.uploadDate)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      {resume.url && (
                        <>
                          <a href={resume.url} target="_blank" rel="noopener noreferrer">
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </a>
                          <a href={resume.url} download>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-emerald-200 text-emerald-600 hover:bg-emerald-50"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </a>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {resumes.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-lg font-medium mb-2">No resume uploaded yet</p>
                <p>Upload your resume to get started with job applications</p>
              </div>
            )}
          </div>

          {/* Tips Section */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-900 mb-2">Resume Tips</h4>
                  <ul className="text-sm text-blue-800 space-y-1 list-disc pl-4">
                    <li>Keep your resume updated with your latest experience</li>
                    <li>Use PDF format for better compatibility</li>
                    <li>Include relevant keywords for your target positions</li>
                    <li>Keep it concise - ideally 1-2 pages</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  )
}
