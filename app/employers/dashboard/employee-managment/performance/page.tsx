"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Slider } from "@/components/ui/slider"
import {
  TrendingUp,
  Star,
  Users,
  Target,
  Award,
  FileText,
  Download,
  Plus,
  Eye,
  Edit,
  BarChart3,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  TrendingDown,
  Save,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"

export default function PerformanceReviewPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("2024-Q1")
  const [selectedEmployee, setSelectedEmployee] = useState("")
  const [showNewReviewDialog, setShowNewReviewDialog] = useState(false)
  const [showViewReviewDialog, setShowViewReviewDialog] = useState(false)
  const [showEditReviewDialog, setShowEditReviewDialog] = useState(false)
  const [selectedReview, setSelectedReview] = useState<any>(null)
  const [newReviewForm, setNewReviewForm] = useState({
    employeeId: "",
    reviewPeriod: "",
    reviewType: "quarterly",
    kpis: {
      productivity: 3,
      quality: 3,
      teamwork: 3,
      communication: 3,
      attendance: 3,
    },
    feedback: "",
    goals: "",
    improvements: "",
    overallRating: 3,
  })

  // Sample KPI categories
  const kpiCategories = [
    { id: "productivity", name: "Productivity", weight: 30, color: "bg-blue-500" },
    { id: "quality", name: "Quality of Work", weight: 25, color: "bg-green-500" },
    { id: "teamwork", name: "Teamwork", weight: 20, color: "bg-purple-500" },
    { id: "communication", name: "Communication", weight: 15, color: "bg-orange-500" },
    { id: "attendance", name: "Attendance", weight: 10, color: "bg-indigo-500" },
  ]

  // Sample employee performance data
  const [employees, setEmployees] = useState([
    {
      id: 1,
      name: "Sarah Johnson",
      position: "Senior Developer",
      department: "Engineering",
      manager: "John Smith",
      avatar: "/placeholder.svg?height=40&width=40",
      overallScore: 4.2,
      lastReview: "2024-01-15",
      nextReview: "2024-04-15",
      status: "completed",
      kpis: {
        productivity: 4.5,
        quality: 4.0,
        teamwork: 4.2,
        communication: 4.1,
        attendance: 4.8,
      },
      feedback:
        "Excellent technical skills and leadership qualities. Shows great initiative in mentoring junior developers.",
      goals: ["Lead the new API project", "Mentor 2 junior developers", "Complete advanced React certification"],
      improvements: ["Time management", "Documentation practices"],
    },
    {
      id: 2,
      name: "Michael Chen",
      position: "Marketing Manager",
      department: "Marketing",
      manager: "Jane Doe",
      avatar: "/placeholder.svg?height=40&width=40",
      overallScore: 3.8,
      lastReview: "2024-01-10",
      nextReview: "2024-04-10",
      status: "in-progress",
      kpis: {
        productivity: 3.9,
        quality: 3.7,
        teamwork: 4.0,
        communication: 4.2,
        attendance: 3.5,
      },
      feedback: "Strong marketing strategies and campaign execution. Needs improvement in meeting deadlines.",
      goals: ["Increase lead generation by 25%", "Launch new product campaign", "Improve team collaboration"],
      improvements: ["Project timeline management", "Data analysis skills"],
    },
    {
      id: 3,
      name: "Emily Davis",
      position: "UX Designer",
      department: "Design",
      manager: "Bob Wilson",
      avatar: "/placeholder.svg?height=40&width=40",
      overallScore: 4.5,
      lastReview: "2024-01-20",
      nextReview: "2024-04-20",
      status: "completed",
      kpis: {
        productivity: 4.3,
        quality: 4.8,
        teamwork: 4.5,
        communication: 4.4,
        attendance: 4.2,
      },
      feedback: "Outstanding design work and user research skills. Excellent collaboration with development team.",
      goals: ["Design system implementation", "User research certification", "Cross-functional project leadership"],
      improvements: ["Presentation skills", "Stakeholder management"],
    },
  ])

  // Sample 360 feedback data
  const [feedbackData] = useState([
    {
      id: 1,
      employeeId: 1,
      reviewerName: "John Smith",
      reviewerRole: "Manager",
      relationship: "manager",
      overallRating: 4.2,
      feedback: "Sarah consistently delivers high-quality work and shows excellent leadership potential.",
      strengths: ["Technical expertise", "Problem-solving", "Mentoring"],
      improvements: ["Time management", "Documentation"],
      submittedDate: "2024-01-15",
    },
    {
      id: 2,
      employeeId: 1,
      reviewerName: "Mike Johnson",
      reviewerRole: "Senior Developer",
      relationship: "peer",
      overallRating: 4.0,
      feedback: "Great team player and always willing to help. Code reviews are thorough and constructive.",
      strengths: ["Collaboration", "Code quality", "Knowledge sharing"],
      improvements: ["Meeting participation", "Process documentation"],
      submittedDate: "2024-01-12",
    },
    {
      id: 3,
      employeeId: 1,
      reviewerName: "Lisa Chen",
      reviewerRole: "Junior Developer",
      relationship: "direct-report",
      overallRating: 4.5,
      feedback: "Excellent mentor who provides clear guidance and constructive feedback. Very approachable.",
      strengths: ["Mentoring", "Patience", "Clear communication"],
      improvements: ["More structured learning plans"],
      submittedDate: "2024-01-10",
    },
  ])

  const getScoreColor = (score: number) => {
    if (score >= 4.5) return "text-green-600"
    if (score >= 4.0) return "text-blue-600"
    if (score >= 3.5) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreIcon = (score: number) => {
    if (score >= 4.5) return <TrendingUp className="h-4 w-4 text-green-600" />
    if (score >= 4.0) return <CheckCircle className="h-4 w-4 text-blue-600" />
    if (score >= 3.5) return <AlertCircle className="h-4 w-4 text-yellow-600" />
    return <TrendingDown className="h-4 w-4 text-red-600" />
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-yellow-100 text-yellow-800"
      case "pending":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const handleCreateReview = () => {
    const selectedEmp = employees.find((emp) => emp.id === Number.parseInt(newReviewForm.employeeId))
    if (!selectedEmp) return

    const overallScore =
      Object.values(newReviewForm.kpis).reduce((sum, score) => sum + score, 0) / Object.keys(newReviewForm.kpis).length

    const updatedEmployee = {
      ...selectedEmp,
      overallScore,
      kpis: newReviewForm.kpis,
      feedback: newReviewForm.feedback,
      goals: newReviewForm.goals.split(",").map((g) => g.trim()),
      improvements: newReviewForm.improvements.split(",").map((i) => i.trim()),
      lastReview: new Date().toISOString().split("T")[0],
      status: "completed",
    }

    setEmployees(employees.map((emp) => (emp.id === selectedEmp.id ? updatedEmployee : emp)))
    setShowNewReviewDialog(false)
    setNewReviewForm({
      employeeId: "",
      reviewPeriod: "",
      reviewType: "quarterly",
      kpis: {
        productivity: 3,
        quality: 3,
        teamwork: 3,
        communication: 3,
        attendance: 3,
      },
      feedback: "",
      goals: "",
      improvements: "",
      overallRating: 3,
    })
  }

  const handleUpdateReview = () => {
    if (!selectedReview) return

    const overallScore =
      Object.values(selectedReview.kpis).reduce((sum: number, score: any) => sum + score, 0) /
      Object.keys(selectedReview.kpis).length

    const updatedEmployee = {
      ...selectedReview,
      overallScore,
    }

    setEmployees(employees.map((emp) => (emp.id === selectedReview.id ? updatedEmployee : emp)))
    setShowEditReviewDialog(false)
  }

  const averageScore = employees.reduce((sum, emp) => sum + emp.overallScore, 0) / employees.length
  const completedReviews = employees.filter((emp) => emp.status === "completed").length
  const pendingReviews = employees.filter((emp) => emp.status === "in-progress" || emp.status === "pending").length

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/employers/dashboard/employee-managment">
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Employment
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold mb-2">Performance Review</h1>
              <p className="text-purple-100">Conduct evaluations, track KPIs, and manage 360-degree feedback</p>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <Dialog open={showNewReviewDialog} onOpenChange={setShowNewReviewDialog}>
              <DialogTrigger asChild>
                <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
                  <Plus className="h-4 w-4 mr-2" />
                  New Review
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Performance Review</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="review-employee">Employee</Label>
                      <Select
                        value={newReviewForm.employeeId}
                        onValueChange={(value) => setNewReviewForm({ ...newReviewForm, employeeId: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select employee" />
                        </SelectTrigger>
                        <SelectContent>
                          {employees.map((employee) => (
                            <SelectItem key={employee.id} value={employee.id.toString()}>
                              {employee.name} - {employee.position}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="review-period">Review Period</Label>
                      <Input
                        id="review-period"
                        type="date"
                        value={newReviewForm.reviewPeriod}
                        onChange={(e) => setNewReviewForm({ ...newReviewForm, reviewPeriod: e.target.value })}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="review-type">Review Type</Label>
                    <Select
                      value={newReviewForm.reviewType}
                      onValueChange={(value) => setNewReviewForm({ ...newReviewForm, reviewType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="quarterly">Quarterly Review</SelectItem>
                        <SelectItem value="annual">Annual Review</SelectItem>
                        <SelectItem value="probation">Probation Review</SelectItem>
                        <SelectItem value="promotion">Promotion Review</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">KPI Ratings</h3>
                    {kpiCategories.map((kpi) => (
                      <div key={kpi.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor={`kpi-${kpi.id}`}>{kpi.name}</Label>
                          <span className="text-sm font-medium">
                            {newReviewForm.kpis[kpi.id as keyof typeof newReviewForm.kpis]}/5
                          </span>
                        </div>
                        <Slider
                          id={`kpi-${kpi.id}`}
                          min={1}
                          max={5}
                          step={0.1}
                          value={[newReviewForm.kpis[kpi.id as keyof typeof newReviewForm.kpis]]}
                          onValueChange={(value) =>
                            setNewReviewForm({
                              ...newReviewForm,
                              kpis: { ...newReviewForm.kpis, [kpi.id]: value[0] },
                            })
                          }
                          className="w-full"
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <Label htmlFor="review-feedback">Overall Feedback</Label>
                    <Textarea
                      id="review-feedback"
                      value={newReviewForm.feedback}
                      onChange={(e) => setNewReviewForm({ ...newReviewForm, feedback: e.target.value })}
                      placeholder="Provide detailed feedback on performance, achievements, and areas for improvement..."
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="review-goals">Goals for Next Period</Label>
                    <Textarea
                      id="review-goals"
                      value={newReviewForm.goals}
                      onChange={(e) => setNewReviewForm({ ...newReviewForm, goals: e.target.value })}
                      placeholder="Enter goals separated by commas..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="review-improvements">Areas for Improvement</Label>
                    <Textarea
                      id="review-improvements"
                      value={newReviewForm.improvements}
                      onChange={(e) => setNewReviewForm({ ...newReviewForm, improvements: e.target.value })}
                      placeholder="Enter improvement areas separated by commas..."
                      rows={2}
                    />
                  </div>

                  <div className="flex space-x-3 pt-4 border-t">
                    <Button onClick={handleCreateReview} className="flex-1">
                      <Save className="h-4 w-4 mr-2" />
                      Create Review
                    </Button>
                    <Button variant="outline" onClick={() => setShowNewReviewDialog(false)} className="bg-transparent">
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-purple-100">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{employees.length}</p>
                <p className="text-sm text-gray-600">Total Employees</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-green-100">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{completedReviews}</p>
                <p className="text-sm text-gray-600">Completed Reviews</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-yellow-100">
                <AlertCircle className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{pendingReviews}</p>
                <p className="text-sm text-gray-600">Pending Reviews</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <Star className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{averageScore.toFixed(1)}</p>
                <p className="text-sm text-gray-600">Average Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="360-feedback">360° Feedback</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Employee Performance Overview */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-purple-600" />
                <span>Employee Performance Overview</span>
              </CardTitle>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024-Q1">Q1 2024</SelectItem>
                  <SelectItem value="2023-Q4">Q4 2023</SelectItem>
                  <SelectItem value="2023-Q3">Q3 2023</SelectItem>
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {employees.map((employee) => (
                  <div key={employee.id} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={employee.avatar || "/placeholder.svg"} alt={employee.name} />
                          <AvatarFallback className="bg-purple-100 text-purple-600">
                            {employee.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900">{employee.name}</p>
                          <p className="text-sm text-gray-600">
                            {employee.position} • {employee.department}
                          </p>
                          <p className="text-xs text-gray-500">Manager: {employee.manager}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2">
                          {getScoreIcon(employee.overallScore)}
                          <span className={`text-2xl font-bold ${getScoreColor(employee.overallScore)}`}>
                            {employee.overallScore.toFixed(1)}
                          </span>
                        </div>
                        <Badge variant="outline" className={getStatusColor(employee.status)}>
                          {employee.status}
                        </Badge>
                      </div>
                    </div>

                    {/* KPI Breakdown */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      {kpiCategories.map((kpi) => (
                        <div key={kpi.id} className="text-center">
                          <p className="text-xs font-medium text-gray-600 mb-2">{kpi.name}</p>
                          <div className="relative">
                            <Progress
                              value={(employee.kpis[kpi.id as keyof typeof employee.kpis] / 5) * 100}
                              className="h-2 mb-1"
                            />
                            <p className="text-sm font-medium">
                              {employee.kpis[kpi.id as keyof typeof employee.kpis].toFixed(1)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-700 mb-2">
                        <strong>Recent Feedback:</strong> {employee.feedback}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Last Review: {new Date(employee.lastReview).toLocaleDateString()}</span>
                        <span>Next Review: {new Date(employee.nextReview).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-6">
          {/* Performance Reviews */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-purple-600" />
                <span>Performance Reviews</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Overall Score</TableHead>
                      <TableHead>Last Review</TableHead>
                      <TableHead>Next Review</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employees.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={employee.avatar || "/placeholder.svg"} alt={employee.name} />
                              <AvatarFallback className="bg-purple-100 text-purple-600">
                                {employee.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">{employee.name}</p>
                              <p className="text-sm text-gray-600">{employee.department}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{employee.position}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            {getScoreIcon(employee.overallScore)}
                            <span className={`font-medium ${getScoreColor(employee.overallScore)}`}>
                              {employee.overallScore.toFixed(1)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>{new Date(employee.lastReview).toLocaleDateString()}</TableCell>
                        <TableCell>{new Date(employee.nextReview).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getStatusColor(employee.status)}>
                            {employee.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0 bg-transparent"
                              onClick={() => {
                                setSelectedReview(employee)
                                setShowViewReviewDialog(true)
                              }}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 w-8 p-0 bg-transparent"
                              onClick={() => {
                                setSelectedReview({ ...employee })
                                setShowEditReviewDialog(true)
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="h-8 w-8 p-0 bg-transparent">
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="360-feedback" className="space-y-6">
          {/* 360-Degree Feedback */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="h-5 w-5 text-purple-600" />
                  <span>Request 360° Feedback</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="feedback-employee">Select Employee</Label>
                  <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((employee) => (
                        <SelectItem key={employee.id} value={employee.id.toString()}>
                          {employee.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="reviewers">Select Reviewers</Label>
                  <Textarea
                    id="reviewers"
                    placeholder="Enter email addresses of reviewers (managers, peers, direct reports)..."
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="feedback-deadline">Review Deadline</Label>
                  <Input id="feedback-deadline" type="date" />
                </div>
                <Button className="w-full">Send 360° Feedback Requests</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  <span>Recent 360° Feedback</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {feedbackData.map((feedback) => (
                    <div key={feedback.id} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium text-sm">{feedback.reviewerName}</p>
                          <p className="text-xs text-gray-600">
                            {feedback.reviewerRole} • {feedback.relationship}
                          </p>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{feedback.overallRating.toFixed(1)}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{feedback.feedback}</p>
                      <div className="flex flex-wrap gap-1">
                        {feedback.strengths.slice(0, 2).map((strength, index) => (
                          <Badge key={index} variant="outline" className="bg-green-50 text-green-700 text-xs">
                            {strength}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Performance Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-5 w-5 text-purple-600" />
                  <span>KPI Performance Trends</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {kpiCategories.map((kpi) => {
                    const avgScore =
                      employees.reduce((sum, emp) => sum + emp.kpis[kpi.id as keyof typeof emp.kpis], 0) /
                      employees.length
                    return (
                      <div key={kpi.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${kpi.color}`}></div>
                          <span className="text-sm font-medium">{kpi.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Progress value={(avgScore / 5) * 100} className="w-20 h-2" />
                          <span className="text-sm font-medium w-8">{avgScore.toFixed(1)}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5 text-purple-600" />
                  <span>Top Performers</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {employees
                    .sort((a, b) => b.overallScore - a.overallScore)
                    .slice(0, 3)
                    .map((employee, index) => (
                      <div key={employee.id} className="flex items-center space-x-3">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                            index === 0 ? "bg-yellow-500" : index === 1 ? "bg-gray-400" : "bg-orange-500"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={employee.avatar || "/placeholder.svg"} alt={employee.name} />
                          <AvatarFallback className="bg-purple-100 text-purple-600">
                            {employee.name
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{employee.name}</p>
                          <p className="text-xs text-gray-600">{employee.position}</p>
                        </div>
                        <span className={`font-bold ${getScoreColor(employee.overallScore)}`}>
                          {employee.overallScore.toFixed(1)}
                        </span>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* View Review Dialog */}
      <Dialog open={showViewReviewDialog} onOpenChange={setShowViewReviewDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-purple-600" />
              <span>Performance Review Details</span>
            </DialogTitle>
          </DialogHeader>
          {selectedReview && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={selectedReview.avatar || "/placeholder.svg"} alt={selectedReview.name} />
                  <AvatarFallback className="bg-purple-100 text-purple-600">
                    {selectedReview.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{selectedReview.name}</h3>
                  <p className="text-gray-600">
                    {selectedReview.position} • {selectedReview.department}
                  </p>
                  <p className="text-sm text-gray-500">Manager: {selectedReview.manager}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2">
                    {getScoreIcon(selectedReview.overallScore)}
                    <span className={`text-2xl font-bold ${getScoreColor(selectedReview.overallScore)}`}>
                      {selectedReview.overallScore.toFixed(1)}
                    </span>
                  </div>
                  <Badge variant="outline" className={getStatusColor(selectedReview.status)}>
                    {selectedReview.status}
                  </Badge>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-3">KPI Breakdown</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {kpiCategories.map((kpi) => (
                    <div key={kpi.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">{kpi.name}</span>
                      <div className="flex items-center space-x-2">
                        <Progress
                          value={(selectedReview.kpis[kpi.id as keyof typeof selectedReview.kpis] / 5) * 100}
                          className="w-16 h-2"
                        />
                        <span className="font-bold w-8">
                          {selectedReview.kpis[kpi.id as keyof typeof selectedReview.kpis].toFixed(1)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Feedback</h4>
                <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{selectedReview.feedback}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Goals</h4>
                  <ul className="space-y-1">
                    {selectedReview.goals.map((goal: string, index: number) => (
                      <li key={index} className="text-sm text-gray-700 flex items-center">
                        <Target className="h-3 w-3 text-blue-600 mr-2" />
                        {goal}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Areas for Improvement</h4>
                  <ul className="space-y-1">
                    {selectedReview.improvements.map((improvement: string, index: number) => (
                      <li key={index} className="text-sm text-gray-700 flex items-center">
                        <TrendingUp className="h-3 w-3 text-orange-600 mr-2" />
                        {improvement}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t">
                <span>Last Review: {new Date(selectedReview.lastReview).toLocaleDateString()}</span>
                <span>Next Review: {new Date(selectedReview.nextReview).toLocaleDateString()}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Review Dialog */}
      <Dialog open={showEditReviewDialog} onOpenChange={setShowEditReviewDialog}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Edit className="h-5 w-5 text-purple-600" />
              <span>Edit Performance Review</span>
            </DialogTitle>
          </DialogHeader>
          {selectedReview && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={selectedReview.avatar || "/placeholder.svg"} alt={selectedReview.name} />
                  <AvatarFallback className="bg-purple-100 text-purple-600">
                    {selectedReview.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">{selectedReview.name}</h3>
                  <p className="text-gray-600">
                    {selectedReview.position} • {selectedReview.department}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">KPI Ratings</h4>
                {kpiCategories.map((kpi) => (
                  <div key={kpi.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor={`edit-kpi-${kpi.id}`}>{kpi.name}</Label>
                      <span className="text-sm font-medium">
                        {selectedReview.kpis[kpi.id as keyof typeof selectedReview.kpis]}/5
                      </span>
                    </div>
                    <Slider
                      id={`edit-kpi-${kpi.id}`}
                      min={1}
                      max={5}
                      step={0.1}
                      value={[selectedReview.kpis[kpi.id as keyof typeof selectedReview.kpis]]}
                      onValueChange={(value) =>
                        setSelectedReview({
                          ...selectedReview,
                          kpis: { ...selectedReview.kpis, [kpi.id]: value[0] },
                        })
                      }
                      className="w-full"
                    />
                  </div>
                ))}
              </div>

              <div>
                <Label htmlFor="edit-feedback">Overall Feedback</Label>
                <Textarea
                  id="edit-feedback"
                  value={selectedReview.feedback}
                  onChange={(e) => setSelectedReview({ ...selectedReview, feedback: e.target.value })}
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="edit-goals">Goals for Next Period</Label>
                <Textarea
                  id="edit-goals"
                  value={selectedReview.goals.join(", ")}
                  onChange={(e) =>
                    setSelectedReview({
                      ...selectedReview,
                      goals: e.target.value.split(",").map((g) => g.trim()),
                    })
                  }
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="edit-improvements">Areas for Improvement</Label>
                <Textarea
                  id="edit-improvements"
                  value={selectedReview.improvements.join(", ")}
                  onChange={(e) =>
                    setSelectedReview({
                      ...selectedReview,
                      improvements: e.target.value.split(",").map((i) => i.trim()),
                    })
                  }
                  rows={2}
                />
              </div>

              <div className="flex space-x-3 pt-4 border-t">
                <Button onClick={handleUpdateReview} className="flex-1">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => setShowEditReviewDialog(false)} className="bg-transparent">
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
