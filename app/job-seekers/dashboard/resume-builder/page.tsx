"use client"
import { useEffect, useState, Suspense } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Plus, Palette, Upload, ArrowLeft } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "@/hooks/use-toast"
import { getApiUrl, getAssetUrl } from "@/lib/api-config"
import BackButton from '@/components/back-button'   

export const dynamic = 'force-dynamic'

function ResumeBuilderContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [importedData, setImportedData] = useState<any>(null)

  useEffect(() => {
    const isImport = searchParams.get('import')
    if (isImport === 'true') {
      const storedData = sessionStorage.getItem('parsedResumeData')
      if (storedData) {
        try {
          const parsedData = JSON.parse(storedData)
          setImportedData(parsedData)
          toast({
            title: "Resume imported successfully",
            description: "Your resume has been parsed and is ready for editing.",
          })
          sessionStorage.removeItem('parsedResumeData')
        } catch (error) {
          console.error('Error parsing stored resume data:', error)
        }
      }
    }
  }, [searchParams])

  const [templates, setTemplates] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadTemplates = async () => {
      setLoading(true)
      setError(null)
      try {
        const url = getApiUrl('resume/templates')
        const res = await fetch(url, { credentials: 'include' })
        const contentType = res.headers.get('content-type') || ''
        if (!contentType.includes('application/json')) {
          const text = await res.text()
          throw new Error(text?.slice(0, 300) || 'Non-JSON response')
        }
        const json = await res.json()
        if (!json?.success) throw new Error(json?.message || 'Failed to load templates')
        const items = Array.isArray(json.templates) ? json.templates : []
        setTemplates(items)
      } catch (e: any) {
        setError(e?.message || 'Failed to load templates')
        // Fallback minimal examples to keep UI usable
        setTemplates([
          { id: 'modern', name: 'Modern Professional', image_url: '/resume6.jpeg', category_name: 'General', is_premium: false },
          { id: 'creative', name: 'Creative', image_url: '/resume1.jpeg', category_name: 'Creative', is_premium: false },
        ])
      } finally {
        setLoading(false)
      }
    }
    loadTemplates()
  }, [])

  const handleCreateResume = (templateId: string) => {
    // Generate a unique identifier for new resumes (not a database ID)
    const newResumeId = 'new-' + Date.now().toString()
    
    // If we have imported data, pass it to the builder
    if (importedData) {
      sessionStorage.setItem('resumeBuilderData', JSON.stringify(importedData))
    }
    
    router.push(`/job-seekers/dashboard/resume-builder/${newResumeId}?template=${templateId}${importedData ? '&imported=true' : ''}`)
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <div className="container mx-auto max-w-6xl px-3 sm:px-4 lg:px-6 py-4 sm:py-6">
        <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 rounded-2xl p-6 text-white">
        <div className="flex items-center space-x-3">
          <FileText className="h-8 w-8" />
          <div>
            <BackButton />
            <h1 className="text-2xl font-bold">Resume Builder</h1>
            <p className="text-emerald-100">Choose a template to start building your professional resume</p>
          </div>
        </div>
      </div>

      {/* Imported Resume Data Display */}
      {importedData && (
        <Card className="border-emerald-200 bg-emerald-50/50">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Upload className="h-6 w-6 text-emerald-600" />
              <h3 className="text-lg font-semibold text-emerald-800">Imported Resume Data</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              {importedData.name && (
                <div>
                  <span className="font-medium text-gray-700">Name:</span> {importedData.name}
                </div>
              )}
              {importedData.email && (
                <div>
                  <span className="font-medium text-gray-700">Email:</span> {importedData.email}
                </div>
              )}
              {importedData.phone && (
                <div>
                  <span className="font-medium text-gray-700">Phone:</span> {importedData.phone}
                </div>
              )}
              {importedData.experience && (
                <div>
                  <span className="font-medium text-gray-700">Experience:</span> {
                    Array.isArray(importedData.experience) 
                      ? importedData.experience.slice(0, 2).map(exp => exp.description || exp).join(', ')
                      : importedData.experience.substring(0, 100)
                  }...
                </div>
              )}
              {importedData.education && (
                <div>
                  <span className="font-medium text-gray-700">Education:</span> {
                    Array.isArray(importedData.education) 
                      ? importedData.education.slice(0, 2).map(edu => edu.description || edu).join(', ')
                      : importedData.education.substring(0, 100)
                  }...
                </div>
              )}
              {importedData.skills && (
                <div>
                  <span className="font-medium text-gray-700">Skills:</span> {
                    Array.isArray(importedData.skills) 
                      ? importedData.skills.slice(0, 5).join(', ')
                      : importedData.skills.substring(0, 100)
                  }...
                </div>
              )}
            </div>
            <p className="text-emerald-700 text-sm mt-3">
              Select a template below to start building your resume with this imported data.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Template Selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {loading && (
          <div className="col-span-full text-center text-gray-600">Loading templates…</div>
        )}
        {error && !loading && (
          <div className="col-span-full text-center text-red-600 text-sm">{error}</div>
        )}
        {templates.map((template) => (
          <Card
            key={template.id}
            className="cursor-pointer hover:shadow-lg transition-shadow border-emerald-200 hover:border-emerald-300"
          >
            <CardContent className="p-6">
              <div className="aspect-[3/4] bg-gray-100 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                <img src={getAssetUrl(template.image_url || "/placeholder.svg")} alt={template.name} className="w-full h-full object-cover rounded-lg" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{template.name}</h3>
              {template.category_name && (
                <p className="text-xs text-gray-600 mb-2">Category: {template.category_name}</p>
              )}
              {template.is_premium && (
                <p className="text-xs text-amber-600 mb-2">Premium</p>
              )}
              <Button
                onClick={() => handleCreateResume(template.id)}
                className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Use This Template
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card
          className="border-emerald-200 hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => router.push("/job-seekers/dashboard/resume")}
        >
          <CardContent className="p-6 text-center">
            <FileText className="h-8 w-8 text-emerald-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Manage Existing Resumes</h3>
            <p className="text-sm text-gray-600">View and edit your saved resumes</p>
          </CardContent>
        </Card>

        <Card className="border-emerald-200 hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <Palette className="h-8 w-8 text-emerald-600 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 mb-2">Browse All Templates</h3>
            <p className="text-sm text-gray-600">Explore more template options</p>
          </CardContent>
        </Card>
      </div>
        </div>
      </div>
    </div>
  )
}

export default function ResumeBuilderPage() {
  return (
    <Suspense fallback={null}>
      <ResumeBuilderContent />
    </Suspense>
  )
}