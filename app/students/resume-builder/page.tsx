"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Plus, Palette } from "lucide-react"
import { useRouter } from "next/navigation"

export default function StudentResumeBuilderPage() {
  const router = useRouter()

  const templates = [
    {
      id: "modern",
      name: "Modern Professional",
      description: "Clean and professional design perfect for internships and entry-level roles",
      preview: "/placeholder.svg?height=300&width=200&text=Modern",
    },
    {
      id: "creative",
      name: "Creative",
      description: "Eye-catching design for creative and design roles",
      preview: "/placeholder.svg?height=300&width=200&text=Creative",
    },
    {
      id: "minimal",
      name: "Minimal",
      description: "Simple and elegant design that focuses on content",
      preview: "/placeholder.svg?height=300&width=200&text=Minimal",
    },
    {
      id: "student",
      name: "Student",
      description: "Tailored layout for students and recent graduates",
      preview: "/placeholder.svg?height=300&width=200&text=Student",
    },
    {
      id: "technical",
      name: "Technical",
      description: "Structured layout ideal for technical and engineering roles",
      preview: "/placeholder.svg?height=300&width=200&text=Technical",
    },
    {
      id: "academic",
      name: "Academic",
      description: "Traditional format suitable for academic and research positions",
      preview: "/placeholder.svg?height=300&width=200&text=Academic",
    },
  ]

  const handleCreateResume = (templateId: string) => {
    // Generate a new resume ID and navigate to the builder
    const newResumeId = Date.now().toString()
    router.push(`/students/resume-builder/${newResumeId}?template=${templateId}`)
  }

  return (
    <div className="ml-16 pt-20 p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 rounded-2xl p-6 text-white">
        <div className="flex items-center space-x-3">
          <FileText className="h-8 w-8" />
          <div>
            <h1 className="text-2xl font-bold">Resume Builder</h1>
            <p className="text-emerald-100">Choose a template to start building your professional resume</p>
          </div>
        </div>
      </div>

      {/* Template Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template) => (
          <Card
            key={template.id}
            className="cursor-pointer hover:shadow-lg transition-shadow border-emerald-200 hover:border-emerald-300"
          >
            <CardContent className="p-6 flex flex-col h-full">
              <div className="aspect-[3/4] bg-gray-100 rounded-lg mb-4 flex items-center justify-center">
                <img
                  src={template.preview || "/placeholder.svg"}
                  alt={template.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{template.name}</h3>
              <p className="text-sm text-gray-600 mb-4 flex-grow">{template.description}</p>
              <Button
                onClick={() => handleCreateResume(template.id)}
                className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white mt-auto"
              >
                <Plus className="h-4 w-4 mr-2" />
                Use This Template
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card
          className="border-emerald-200 hover:shadow-lg transition-shadow cursor-pointer"
          onClick={() => router.push("/students/resume")}
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
  )
}
