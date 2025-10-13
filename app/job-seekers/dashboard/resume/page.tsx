"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Plus, Edit, Trash2, Star, Download, Eye, Upload, Palette, X, FileUp } from "lucide-react"
import Link from "next/link"
import { toast } from "@/hooks/use-toast"
import { getApiUrl } from "@/lib/api-config"

interface ResumeItem {
  id: number
  user_id: number
  template_id?: number
  resume_name?: string
  pdf_file?: string
  created_at?: string
  updated_at?: string
  isPrimary?: boolean
}

export default function ResumeBuilderPage() {
  const [resumes, setResumes] = useState<ResumeItem[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>("")

  const [showUploadPopup, setShowUploadPopup] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const getCurrentUserId = () => (typeof window !== 'undefined') ? (localStorage.getItem('jobseeker_id') || localStorage.getItem('user_id')) : null

  const fetchResumes = async () => {
    const userId = getCurrentUserId()
    if (!userId) {
      setLoading(false)
      setResumes([])
      return
    }
    try {
      setLoading(true)
      const url = getApiUrl(`resume/list/${parseInt(userId as string, 10)}`)
      const res = await fetch(url, { credentials: 'include' })
      const data = await res.json()
      if (data && data.success) {
        const list: ResumeItem[] = Array.isArray(data.data) ? data.data : []
        const primaryKey = `primary_resume_${userId}`
        const primaryId = (typeof window !== 'undefined') ? parseInt(localStorage.getItem(primaryKey) || '0', 10) : 0
        const withPrimary = list.map(r => ({ ...r, isPrimary: primaryId > 0 && r.id === primaryId }))
        setResumes(withPrimary)
      } else {
        setError(data?.message || 'Failed to fetch resumes')
      }
    } catch (e: any) {
      setError(e?.message || 'Network error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchResumes()
  }, [])

  const handleSetPrimary = (id: number) => {
    const userId = getCurrentUserId()
    if (!userId) {
      toast({ title: 'Not logged in', description: 'Please login again.', variant: 'destructive' })
      return
    }
    const primaryKey = `primary_resume_${userId}`
    if (typeof window !== 'undefined') {
      localStorage.setItem(primaryKey, String(id))
    }
    setResumes(prev => prev.map(r => ({ ...r, isPrimary: r.id === id })))
    toast({ title: 'Updated', description: 'Primary resume set.' })
  }

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm('Delete this resume? This action cannot be undone.')
    if (!confirmed) return
    try {
      // Call backend delete route (session-based). We include credentials for auth.
      // Call JSON API endpoint (no redirects, no PHP session dependency)
      // Note: getApiUrl already prefixes with /api
      const url = getApiUrl(`resume/delete/${id}`)
      await fetch(url, { method: 'GET', credentials: 'include' })
      // Refresh list
      await fetchResumes()
      toast({ title: 'Deleted', description: 'Resume deleted successfully.' })
    } catch (e: any) {
      toast({ title: 'Delete failed', description: e?.message || 'Unable to delete resume', variant: 'destructive' })
    }
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

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-'
    const d = new Date(dateString)
    if (isNaN(d.getTime())) return dateString
    return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-100"
    if (score >= 60) return "text-yellow-600 bg-yellow-100"
    return "text-red-600 bg-red-100"
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <div className="container mx-auto max-w-6xl px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        <div className="space-y-4 sm:space-y-6">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 rounded-lg sm:rounded-2xl p-4 sm:p-6 text-white w-full overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
                <FileText className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <h1 className="text-lg sm:text-xl lg:text-2xl font-bold break-words">Resume Builder</h1>
                  <p className="text-xs sm:text-sm text-emerald-100 break-words">
                    Create, edit, and manage your professional resumes
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 w-full sm:w-auto">
                <Button 
                  className="w-full sm:w-auto bg-white/10 text-white border border-white/20 hover:bg-white/20 text-xs sm:text-sm px-3 py-2"
                  onClick={() => setShowUploadPopup(true)}
                >
                  <Upload className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5" />
                  Import Resume
                </Button>
                <Link href="/job-seekers/dashboard/resume-builder" className="w-full sm:w-auto">
                  <Button className="w-full sm:w-auto bg-white text-emerald-600 hover:bg-emerald-50 text-xs sm:text-sm px-3 py-2">
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5" />
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
          <div className="space-y-3 sm:space-y-4 w-full">
            {loading ? (
              <Card className="border-emerald-200">
                <CardContent className="p-6 text-center text-sm text-gray-600">Loading resumes…</CardContent>
              </Card>
            ) : error ? (
              <Card className="border-red-200">
                <CardContent className="p-6 text-center text-sm text-red-700">{error}</CardContent>
              </Card>
            ) : resumes.length > 0 ? (
              resumes.map((resume) => (
                <Card
                  key={resume.id}
                  className={`border transition-colors w-full overflow-hidden ${
                    "border-gray-200 hover:border-emerald-200"
                  }`}
                >
                  <CardContent className="p-3 sm:p-4 lg:p-6 w-full">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 lg:gap-4 w-full">
                      <div className="flex items-start sm:items-center gap-3 sm:gap-4 min-w-0 flex-1">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-2">
                            <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 break-words">
                              {resume.resume_name || `Resume #${resume.id}`}
                            </h3>
                            <div className="flex items-center gap-2 flex-wrap">
                              {resume.isPrimary && (
                                <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 text-xs">
                                  <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
                                  Primary
                                </Badge>
                              )}
                              <Badge
                                variant={resume.status === "completed" ? "default" : "secondary"}
                                className={`text-xs ${
                                  resume.status === "completed"
                                    ? "bg-green-100 text-green-700 border-green-200"
                                    : "bg-gray-100 text-gray-700 border-gray-200"
                                }`}
                              >
                                {resume.status === "completed" ? "Completed" : "Draft"}
                              </Badge>
                            </div>
                          </div>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-gray-600">
                            <span className="break-words">Template: {resume.template_id ?? '-'}</span>
                            <span className="hidden sm:inline">•</span>
                            <span className="break-words">Modified: {formatDate(resume.updated_at)}</span>
                            <span className="hidden sm:inline">•</span>
                            <span className="break-words">Created: {formatDate(resume.created_at)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0 lg:overflow-visible">
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <Link href={`/job-seekers/dashboard/resume-builder/${resume.id}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-emerald-200 text-emerald-600 hover:bg-emerald-50 bg-transparent text-xs px-2 py-1.5 flex-shrink-0"
                            >
                              <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                              <span className="sr-only">View</span>
                            </Button>
                          </Link>

                          {/* Download button removed */}

                          <Link href={`/job-seekers/dashboard/resume-builder/${resume.id}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              className="border-emerald-200 text-emerald-600 hover:bg-emerald-50 bg-transparent text-xs px-2 py-1.5 flex-shrink-0"
                            >
                              <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                              <span className="sr-only">Edit</span>
                            </Button>
                          </Link>

                          {!resume.isPrimary && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleSetPrimary(resume.id)}
                              className="border-green-200 text-green-600 hover:bg-green-50 text-xs px-2 py-1.5 flex-shrink-0"
                            >
                              <Star className="h-3 w-3 sm:h-4 sm:w-4" />
                              <span className="sr-only">Set Primary</span>
                            </Button>
                          )}

                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(resume.id)}
                            className="border-red-200 text-red-600 hover:bg-red-50 text-xs px-2 py-1.5 flex-shrink-0"
                          >
                            <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link href="/job-seekers/dashboard/resume-checker">
              <Card className="border-emerald-200 hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6 text-center">
                  <Eye className="h-8 w-8 text-emerald-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">Resume Checker</h3>
                  <p className="text-sm text-gray-600">Analyze and improve your resume</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/job-seekers/dashboard/resume-builder">
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
      </div>
    </div>
  )
}
