'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { CheckCircle, Upload, FileText, Download, AlertCircle, Target, TrendingUp, Lightbulb } from 'lucide-react'

interface ResumeAnalysis {
  score: number
  strengths: string[]
  improvements: string[]
  keywords: string[]
  industryMatch: number
  atsCompatibility: number
}

export default function ResumeCheckerPage() {
  const [selectedIndustry, setSelectedIndustry] = useState('')
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [resumeText, setResumeText] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null)
  const [activeTab, setActiveTab] = useState('upload')

  const industries = [
    'Technology',
    'Healthcare',
    'Finance',
    'Marketing',
    'Education',
    'Manufacturing',
    'Retail',
    'Consulting',
    'Real Estate',
    'Non-Profit'
  ]

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadedFile(file)
    }
  }

  const handleAnalyze = async () => {
    if (!selectedIndustry || (!uploadedFile && !resumeText.trim())) {
      return
    }

    setIsAnalyzing(true)

    // Simulate analysis
    setTimeout(() => {
      const mockAnalysis: ResumeAnalysis = {
        score: 78,
        strengths: [
          'Strong technical skills section',
          'Quantified achievements with metrics',
          'Relevant work experience for target industry',
          'Professional summary is well-written',
          'Education section is complete'
        ],
        improvements: [
          'Add more industry-specific keywords',
          'Include soft skills in experience descriptions',
          'Optimize formatting for ATS systems',
          'Add relevant certifications section',
          'Include volunteer work or projects'
        ],
        keywords: [
          'JavaScript', 'React', 'Node.js', 'Agile', 'Scrum', 'API Development',
          'Database Management', 'Cloud Computing', 'DevOps', 'Problem Solving'
        ],
        industryMatch: 85,
        atsCompatibility: 72
      }
      setAnalysis(mockAnalysis)
      setIsAnalyzing(false)
    }, 3000)
  }

  const handleDownloadReport = () => {
    // Simulate PDF download
    const element = document.createElement('a')
    element.href = 'data:text/plain;charset=utf-8,Resume Analysis Report'
    element.download = 'resume-analysis-report.pdf'
    element.click()
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'from-green-500 to-emerald-500'
    if (score >= 60) return 'from-yellow-500 to-orange-500'
    return 'from-red-500 to-pink-500'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 rounded-2xl p-6 text-white">
        <div className="flex items-center space-x-3">
          <CheckCircle className="h-8 w-8" />
          <div>
            <h1 className="text-2xl font-bold">Resume Checker</h1>
            <p className="text-emerald-100">Get instant feedback and improve your resume's ATS compatibility</p>
          </div>
        </div>
      </div>

      {!analysis ? (
        /* Input Section */
        <Card className="border-emerald-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-emerald-50 to-green-50 rounded-t-lg">
            <CardTitle className="text-emerald-800">Analyze Your Resume</CardTitle>
            <CardDescription className="text-emerald-600">
              Upload your resume or paste the content to get detailed feedback
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {/* Industry Selection */}
              <div className="space-y-2">
                <Label htmlFor="industry" className="text-gray-700 font-medium">Target Industry</Label>
                <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                  <SelectTrigger className="border-emerald-300 focus:border-emerald-500">
                    <SelectValue placeholder="Select your target industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Resume Input */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-gray-100">
                  <TabsTrigger value="upload" className="data-[state=active]:bg-white data-[state=active]:text-emerald-600">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload File
                  </TabsTrigger>
                  <TabsTrigger value="paste" className="data-[state=active]:bg-white data-[state=active]:text-emerald-600">
                    <FileText className="h-4 w-4 mr-2" />
                    Paste Content
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="upload" className="space-y-4">
                  <div className="border-2 border-dashed border-emerald-300 rounded-lg p-8 text-center bg-emerald-50/50">
                    <Upload className="h-12 w-12 text-emerald-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Your Resume</h3>
                    <p className="text-gray-600 mb-4">
                      Drag and drop your resume file here, or click to browse
                    </p>
                    <p className="text-sm text-gray-500 mb-4">
                      Supported formats: PDF, DOC, DOCX (Max size: 5MB)
                    </p>
                    
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="resume-upload"
                    />
                    <label htmlFor="resume-upload">
                      <Button
                        className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white"
                        asChild
                      >
                        <span>
                          <Upload className="h-4 w-4 mr-2" />
                          Choose File
                        </span>
                      </Button>
                    </label>

                    {uploadedFile && (
                      <div className="mt-4 p-3 bg-white rounded-lg border border-emerald-200">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-5 w-5 text-emerald-600" />
                          <span className="text-sm font-medium text-gray-900">{uploadedFile.name}</span>
                          <Badge variant="secondary" className="bg-green-100 text-green-700">
                            {Math.round(uploadedFile.size / 1024)} KB
                          </Badge>
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="paste" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="resumeText" className="text-gray-700 font-medium">Resume Content</Label>
                    <Textarea
                      id="resumeText"
                      value={resumeText}
                      onChange={(e) => setResumeText(e.target.value)}
                      placeholder="Paste your resume content here..."
                      rows={12}
                      className="border-emerald-300 focus:border-emerald-500"
                    />
                  </div>
                </TabsContent>
              </Tabs>

              {/* Analyze Button */}
              <Button
                onClick={handleAnalyze}
                disabled={!selectedIndustry || (!uploadedFile && !resumeText.trim()) || isAnalyzing}
                className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white py-3"
              >
                {isAnalyzing ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Analyzing Resume...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Analyze Resume
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Results Section */
        <div className="space-y-6">
          {/* Overall Score */}
          <Card className="border-emerald-200 shadow-lg">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className={`text-6xl font-bold ${getScoreColor(analysis.score)}`}>
                  {analysis.score}
                </div>
                <div className="text-xl text-gray-600">Overall Resume Score</div>
                <div className="max-w-md mx-auto">
                  <Progress 
                    value={analysis.score} 
                    className="h-3"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getScoreColor(analysis.industryMatch)}`}>
                      {analysis.industryMatch}%
                    </div>
                    <div className="text-sm text-gray-600">Industry Match</div>
                  </div>
                  <div className="text-center">
                    <div className={`text-2xl font-bold ${getScoreColor(analysis.atsCompatibility)}`}>
                      {analysis.atsCompatibility}%
                    </div>
                    <div className="text-sm text-gray-600">ATS Compatible</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Strengths */}
            <Card className="border-green-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-t-lg">
                <CardTitle className="text-green-800 flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>Key Strengths</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-3">
                  {analysis.strengths.map((strength, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{strength}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Areas for Improvement */}
            <Card className="border-orange-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-t-lg">
                <CardTitle className="text-orange-800 flex items-center space-x-2">
                  <Target className="h-5 w-5" />
                  <span>Areas for Improvement</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <ul className="space-y-3">
                  {analysis.improvements.map((improvement, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <AlertCircle className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{improvement}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Suggested Keywords */}
          <Card className="border-blue-200 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
              <CardTitle className="text-blue-800 flex items-center space-x-2">
                <Lightbulb className="h-5 w-5" />
                <span>Suggested Keywords for ATS Optimization</span>
              </CardTitle>
              <CardDescription className="text-blue-600">
                Include these keywords to improve your resume's visibility in applicant tracking systems
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-2">
                {analysis.keywords.map((keyword, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="border-blue-200 text-blue-700 hover:bg-blue-50 cursor-pointer"
                  >
                    {keyword}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              onClick={handleDownloadReport}
              className="flex-1 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              Download PDF Report
            </Button>
            <Button
              onClick={() => setAnalysis(null)}
              variant="outline"
              className="flex-1 border-emerald-200 text-emerald-600 hover:bg-emerald-50"
            >
              Analyze Another Resume
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
