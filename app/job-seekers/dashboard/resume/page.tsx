"use client"

import { useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Plus, Edit, Trash2, Star, Download, Eye, Upload, Palette, X, FileUp } from "lucide-react"
import Link from "next/link"
import { toast } from "@/hooks/use-toast"

interface Resume {
  id: string
  title: string
  template: string
  lastModified: string
  isPrimary: boolean
  status: "draft" | "completed"
  score: number
}

export default function ResumeBuilderPage() {
  const [resumes, setResumes] = useState<Resume[]>([
    {
      id: "1",
      title: "Software Developer Resume",
      template: "Modern Professional",
      lastModified: "2024-01-15",
      isPrimary: true,
      status: "completed",
      score: 85,
    },
    {
      id: "2",
      title: "Full Stack Developer Resume",
      template: "Creative",
      lastModified: "2024-01-10",
      isPrimary: false,
      status: "draft",
      score: 72,
          },
    ])

  const [showUploadPopup, setShowUploadPopup] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Debug logging
  console.log('Component state:', { showUploadPopup, uploading, selectedFile: selectedFile?.name })

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

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log('File input changed:', event.target.files)
    const file = event.target.files?.[0]
    if (file) {
      console.log('File selected:', file.name, file.type, file.size)
      
      // Check file type
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'application/rtf']
      if (!allowedTypes.includes(file.type)) {
        console.log('Invalid file type:', file.type)
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF, DOC, DOCX, TXT, or RTF file.",
          variant: "destructive"
        })
        return
      }
      
      // Check file size (2MB limit)
      if (file.size > 2 * 1024 * 1024) {
        console.log('File too large:', file.size)
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 2MB.",
          variant: "destructive"
        })
        return
      }
      
      console.log('File is valid, setting selected file')
      setSelectedFile(file)
    } else {
      console.log('No file selected')
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      toast({
        title: "No file selected",
        description: "Please select a file to upload.",
        variant: "destructive"
      })
      return
    }

    setUploading(true)
    
    try {
      // Step 1: Upload the file
      const formData = new FormData()
      formData.append('resume', selectedFile)
      
      const uploadResponse = await fetch('/api/resume/upload', {
        method: 'POST',
        body: formData
      })
      
      if (!uploadResponse.ok) {
        throw new Error('Upload failed')
      }
      
      const uploadResult = await uploadResponse.json()
      
      if (!uploadResult.success) {
        throw new Error(uploadResult.message || 'Upload failed')
      }
      
      // Step 2: Parse the uploaded file
      const parseResponse = await fetch('/api/resume/parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          filename: uploadResult.filename
        })
      })
      
      if (!parseResponse.ok) {
        throw new Error('Parsing failed')
      }
      
      const parseResult = await parseResponse.json()
      
      if (!parseResult.success) {
        throw new Error(parseResult.message || 'Parsing failed')
      }
      
      // Success - redirect to resume builder with parsed data
      toast({
        title: "Resume uploaded successfully",
        description: "Your resume has been parsed and is ready for editing.",
      })
      
      // Store parsed data in sessionStorage and redirect to resume builder
      sessionStorage.setItem('parsedResumeData', JSON.stringify(parseResult.data))
      
             // Also send the parsed data to the backend to store in PHP session
       try {
         await fetch('/api/resume/store-parsed-data', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            parsedData: parseResult.data
          })
        })
      } catch (error) {
        console.error('Failed to store parsed data in backend session:', error)
      }
      
             // Redirect to template selection first, then to resume builder
       window.location.href = '/job-seekers/dashboard/resume-builder?import=true'
      
    } catch (error) {
      console.error('Upload error:', error)
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "An error occurred during upload.",
        variant: "destructive"
      })
    } finally {
      setUploading(false)
      setShowUploadPopup(false)
      setSelectedFile(null)
    }
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
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <FileText className="h-8 w-8" />
            <div>
              <h1 className="text-2xl font-bold">Resume Builder</h1>
              <p className="text-emerald-100">Create, edit, and manage your professional resumes</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button 
              className="bg-white/10 text-white border border-white/20 hover:bg-white/20"
              onClick={() => setShowUploadPopup(true)}
            >
              <Upload className="h-4 w-4 mr-2" />
              Import Resume
            </Button>
            <Link href="/job-seekers/dashboard/resume-builder">
              <Button className="bg-white text-emerald-600 hover:bg-emerald-50">
                <Plus className="h-4 w-4 mr-2" />
                Create Resume
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Upload Resume Popup */}
      {showUploadPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Import Resume</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowUploadPopup(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <FileUp className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  Upload your existing resume to import and edit
                </p>
                <p className="text-xs text-gray-500 mb-4">
                  Supported formats: PDF, DOC, DOCX, TXT, RTF (Max 2MB)
                </p>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx,.txt,.rtf"
                  onChange={(e) => {
                    console.log('File input onChange triggered:', e.target.files)
                    handleFileSelect(e)
                  }}
                  className="hidden"
                  id="resume-upload"
                  onClick={(e) => console.log('File input clicked')}
                  style={{ display: 'none' }}
                />
                <label htmlFor="resume-upload" className="cursor-pointer">
                  <Button 
                    variant="outline" 
                    className="cursor-pointer"
                    onClick={() => {
                      console.log('Button clicked, triggering file input')
                      fileInputRef.current?.click()
                    }}
                  >
                    Choose File
                  </Button>
                </label>
                
                
                
                {selectedFile && (
                  <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded">
                    <p className="text-sm text-green-700">
                      Selected: {selectedFile.name}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowUploadPopup(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpload}
                  disabled={!selectedFile || uploading}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700"
                >
                  {uploading ? "Uploading..." : "Import Resume"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

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
                    <Link href={`/job-seekers/dashboard/resume-builder/${resume.id}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-emerald-200 text-emerald-600 hover:bg-emerald-50 bg-transparent"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>

                    <Link href={`/job-seekers/dashboard/resume-builder/${resume.id}`}>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-emerald-200 text-emerald-600 hover:bg-emerald-50 bg-transparent"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </Link>

                    <Link href={`/job-seekers/dashboard/resume-builder/${resume.id}`}>
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
              <Link href="/job-seekers/dashboard/resume-builder">
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
        <Link href="/job-seekers/dashboard/resume-checker">
          <Card className="border-emerald-200 hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Eye className="h-8 w-8 text-emerald-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Resume Checker</h3>
              <p className="text-sm text-gray-600">Analyze and improve your resume</p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/job-seekers/dashboard/templates">
          <Card className="border-emerald-200 hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <Palette className="h-8 w-8 text-emerald-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900 mb-2">Templates</h3>
              <p className="text-sm text-gray-600">Browse all available templates</p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  )
}
