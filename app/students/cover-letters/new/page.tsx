"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Sparkles, Save, X, FileText } from "lucide-react"
import Link from "next/link"

export default function NewCoverLetterPage() {
  const [formData, setFormData] = useState({
    jobTitle: "",
    company: "",
    jobDescription: "",
    content: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const generateWithAI = () => {
    // AI generation logic would go here
    const aiGeneratedContent = `Dear Hiring Manager,

I am writing to express my strong interest in the ${formData.jobTitle} position at ${formData.company}. As a dedicated student with a passion for professional growth, I am excited about the opportunity to contribute to your team.

Based on the job description, I believe my skills and enthusiasm align well with your requirements. I am eager to bring my fresh perspective and commitment to learning to this role.

I would welcome the opportunity to discuss how my background and passion can contribute to ${formData.company}'s continued success. Thank you for considering my application.

Sincerely,
[Your Name]`

    setFormData((prev) => ({
      ...prev,
      content: aiGeneratedContent,
    }))
  }

  const handleSave = () => {
    // Save logic would go here
    console.log("Saving cover letter:", formData)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 ml-16">
      <div className="pt-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center space-x-4">
              <Link href="/students/cover-letters">
                <Button variant="outline" size="sm" className="bg-white/70 backdrop-blur-sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Cover Letters</h1>
                <p className="text-gray-600">Manage your job application cover letters</p>
              </div>
            </div>
            <Button className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200">
              New
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <Card className="bg-white/70 backdrop-blur-sm border border-gray-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-t-lg">
                <CardTitle className="text-xl font-semibold">Create Cover Letter</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="jobTitle" className="text-sm font-medium text-gray-700">
                    Job Title
                  </Label>
                  <Input
                    id="jobTitle"
                    value={formData.jobTitle}
                    onChange={(e) => handleInputChange("jobTitle", e.target.value)}
                    placeholder="e.g. Software Engineer Intern"
                    className="bg-white/50 border-gray-300 focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company" className="text-sm font-medium text-gray-700">
                    Company
                  </Label>
                  <Input
                    id="company"
                    value={formData.company}
                    onChange={(e) => handleInputChange("company", e.target.value)}
                    placeholder="e.g. Google"
                    className="bg-white/50 border-gray-300 focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="jobDescription" className="text-sm font-medium text-gray-700">
                      Job Description
                    </Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={generateWithAI}
                      className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-none"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Generate with AI
                    </Button>
                  </div>
                  <Textarea
                    id="jobDescription"
                    value={formData.jobDescription}
                    onChange={(e) => handleInputChange("jobDescription", e.target.value)}
                    placeholder="Paste the job description here..."
                    rows={4}
                    className="bg-white/50 border-gray-300 focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content" className="text-sm font-medium text-gray-700">
                    Content
                  </Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => handleInputChange("content", e.target.value)}
                    placeholder="Write your cover letter content here..."
                    rows={12}
                    className="bg-white/50 border-gray-300 focus:border-green-500 focus:ring-green-500"
                  />
                </div>

                <div className="flex space-x-4 pt-4">
                  <Button
                    onClick={handleSave}
                    className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Save
                  </Button>
                  <Link href="/students/cover-letters" className="flex-1">
                    <Button
                      variant="outline"
                      className="w-full bg-white/70 backdrop-blur-sm border-gray-300 hover:bg-gray-50"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Preview Section */}
            <Card className="bg-white/70 backdrop-blur-sm border border-gray-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-t-lg">
                <CardTitle className="text-xl font-semibold flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                {!formData.content && !formData.jobTitle && !formData.company ? (
                  <div className="text-center py-12 text-gray-500">
                    <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p className="text-lg font-medium mb-2">Start typing to see the preview...</p>
                    <p className="text-sm">Your cover letter will appear here as you write</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {formData.jobTitle && (
                      <div className="border-b border-gray-200 pb-2">
                        <h3 className="text-lg font-semibold text-gray-900">Application for: {formData.jobTitle}</h3>
                        {formData.company && <p className="text-gray-600">at {formData.company}</p>}
                      </div>
                    )}

                    {formData.content && (
                      <div className="prose prose-sm max-w-none">
                        <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">{formData.content}</div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
