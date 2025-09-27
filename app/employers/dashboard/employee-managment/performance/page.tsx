"use client"

import { useState, useEffect, useMemo } from "react"
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
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"
import { fetchReviewPeriods, createReviewPeriod, updateReviewPeriod, deleteReviewPeriod, fetchKpiCategories, type KpiCategoryRow, fetchCompanyEmployees, type CompanyEmployee, createPerformanceReview, fetchPerformanceReviews, type PerformanceReviewRow } from "@/lib/hrms-api"

export default function PerformanceReviewPage() {
  const [selectedPeriodId, setSelectedPeriodId] = useState("")
  const [selectedEmployee, setSelectedEmployee] = useState("")
  const [showNewReviewDialog, setShowNewReviewDialog] = useState(false)
  const [showViewReviewDialog, setShowViewReviewDialog] = useState(false)
  const [showEditReviewDialog, setShowEditReviewDialog] = useState(false)
  const [showCycleDialog, setShowCycleDialog] = useState(false)
  const [selectedReview, setSelectedReview] = useState<any>(null)
  const [newReviewForm, setNewReviewForm] = useState({
    employeeId: "",
    reviewPeriodId: "",
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

  // Pagination state for performance cycles
  const [currentCyclePage, setCurrentCyclePage] = useState(1)
  const [itemsPerPage] = useState(10)

  // Sample KPI categories
  const kpiCategories = [
    { id: "productivity", name: "Productivity", weight: 30, color: "bg-blue-500" },
    { id: "quality", name: "Quality of Work", weight: 25, color: "bg-green-500" },
    { id: "teamwork", name: "Teamwork", weight: 20, color: "bg-purple-500" },
    { id: "communication", name: "Communication", weight: 15, color: "bg-orange-500" },
    { id: "attendance", name: "Attendance", weight: 10, color: "bg-indigo-500" },
  ]

  // Employee performance data (loaded from backend)
  const [employees, setEmployees] = useState<any[]>([])

  // Removed 360 feedback mock data

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

  const getInitials = (name?: string) => {
    if (!name) return ""
    return name
      .split(" ")
      .filter((n) => n.length > 0)
      .map((n) => n[0])
      .join("")
  }

  const [cycleForm, setCycleForm] = useState({
    name: "",
    startDate: "",
    endDate: "",
    reviewType: "quarterly" as "quarterly" | "annual" | "probation" | "promotion",
    status: "active" as "active" | "completed" | "cancelled",
  })
  const [reviewPeriods, setReviewPeriods] = useState<any[]>([])
  const [kpiCategoriesBackend, setKpiCategoriesBackend] = useState<KpiCategoryRow[]>([])
  const [savingCycle, setSavingCycle] = useState(false)
  const [companyEmployees, setCompanyEmployees] = useState<CompanyEmployee[]>([])

  // Pagination logic for performance cycles
  const currentCycles = useMemo(() => {
    const startIndex = (currentCyclePage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return reviewPeriods.slice(startIndex, endIndex)
  }, [currentCyclePage, itemsPerPage, reviewPeriods])

  const totalCyclePages = useMemo(() => {
    return Math.ceil(reviewPeriods.length / itemsPerPage)
  }, [reviewPeriods.length, itemsPerPage])

  const handleCyclePageChange = (page: number) => {
    setCurrentCyclePage(page)
  }

  // Pagination Component for Cycles
  const CyclePagination = () => {
    const pageNumbers = []
    const maxPageNumbers = 5
    
    let startPage = Math.max(1, currentCyclePage - Math.floor(maxPageNumbers / 2))
    let endPage = Math.min(totalCyclePages, startPage + maxPageNumbers - 1)
    
    if (endPage - startPage + 1 < maxPageNumbers) {
      startPage = Math.max(1, endPage - maxPageNumbers + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i)
    }

    return (
      <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 px-2 py-4">
        <div className="text-sm text-gray-600">
          Showing {((currentCyclePage - 1) * itemsPerPage) + 1} to {Math.min(currentCyclePage * itemsPerPage, reviewPeriods.length)} of {reviewPeriods.length} cycles
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleCyclePageChange(currentCyclePage - 1)}
            disabled={currentCyclePage === 1}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          {startPage > 1 && (
            <>
              <Button
                variant={currentCyclePage === 1 ? "default" : "outline"}
                size="sm"
                onClick={() => handleCyclePageChange(1)}
                className="h-8 w-8 p-0 hidden sm:inline-flex"
              >
                1
              </Button>
              {startPage > 2 && <span className="px-2 hidden sm:inline">...</span>}
            </>
          )}
          
          {pageNumbers.map(page => (
            <Button
              key={page}
              variant={currentCyclePage === page ? "default" : "outline"}
              size="sm"
              onClick={() => handleCyclePageChange(page)}
              className="h-8 w-8 p-0 hidden sm:inline-flex"
            >
              {page}
            </Button>
          ))}
          
          {/* Mobile page indicator */}
          <div className="sm:hidden text-sm font-medium">
            Page {currentCyclePage} of {totalCyclePages}
          </div>
          
          {endPage < totalCyclePages && (
            <>
              {endPage < totalCyclePages - 1 && <span className="px-2 hidden sm:inline">...</span>}
              <Button
                variant={currentCyclePage === totalCyclePages ? "default" : "outline"}
                size="sm"
                onClick={() => handleCyclePageChange(totalCyclePages)}
                className="h-8 w-8 p-0 hidden sm:inline-flex"
              >
                {totalCyclePages}
              </Button>
            </>
          )}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleCyclePageChange(currentCyclePage + 1)}
            disabled={currentCyclePage === totalCyclePages}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  const calculateDurationDays = (start: string, end: string) => {
    if (!start || !end) return null
    const startDt = new Date(start)
    const endDt = new Date(end)
    const diff = endDt.getTime() - startDt.getTime()
    if (Number.isNaN(diff) || diff < 0) return null
    return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1
  }

  const formatFixed1 = (value: any) => {
    const num = typeof value === 'number' ? value : Number(value)
    return Number.isFinite(num) ? num.toFixed(1) : '—'
  }

  const defaultKpis = { productivity: 0, quality: 0, teamwork: 0, communication: 0, attendance: 0 }
  const getKpis = (obj: any) => (obj && obj.kpis ? obj.kpis : defaultKpis)
  const getKpiVal = (obj: any, id: keyof typeof defaultKpis) => {
    const k = getKpis(obj)
    const v = (k as any)[id]
    return typeof v === 'number' ? v : Number(v) || 0
  }
  const clampScore = (s: any) => {
    const n = Number(s)
    if (!Number.isFinite(n)) return 3
    if (n < 1) return 1
    if (n > 5) return 5
    return n
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '—'
    const dt = new Date(dateStr)
    if (Number.isNaN(dt.getTime())) return '—'
    return dt.toISOString().slice(0, 10)
  }

  const splitIntoPoints = (text?: string) => {
    if (!text) return [] as string[]
    return text
      .split('.')
      .map((s) => s.trim())
      .filter(Boolean)
  }
  const splitArrayIntoPoints = (arr?: string[]) => {
    const source = Array.isArray(arr) ? arr : []
    const out: string[] = []
    source.forEach((item) => {
      splitIntoPoints(item).forEach((pt) => out.push(pt))
    })
    return out
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
      goals: (newReviewForm.goals || '').split(',').map((g) => g.trim()).filter(Boolean),
      improvements: (newReviewForm.improvements || '').split(',').map((i) => i.trim()).filter(Boolean),
      lastReview: new Date().toISOString().split("T")[0],
      status: "completed",
    }
 
    setEmployees(employees.map((emp) => (emp.id === selectedEmp.id ? updatedEmployee : emp)))
    setShowNewReviewDialog(false)
    setNewReviewForm({
      employeeId: "",
      reviewPeriodId: "",
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

  const averageScore = employees.length ? employees.reduce((sum, emp) => sum + (Number(emp.overallScore) || 0), 0) / employees.length : 0
  const completedReviews = employees.filter((emp) => emp.status === "completed").length
  const pendingReviews = employees.filter((emp) => emp.status === "in-progress" || emp.status === "pending").length

  useEffect(() => {
    ;(async () => {
      const list = await fetchReviewPeriods().catch(() => [])
      setReviewPeriods(list)
      const kpis = await fetchKpiCategories().catch(() => [])
      setKpiCategoriesBackend(kpis)
      const emps = await fetchCompanyEmployees().catch(() => [])
      setCompanyEmployees(emps)
    })()
  }, [])

  return (
    <div className="max-w-7xl mx-auto space-y-6 px-3 sm:px-4 lg:px-6">
      {/* Header - Responsive */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-4 sm:p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            <Link href="/employers/dashboard/employee-managment">
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 w-full sm:w-auto mb-2 sm:mb-0"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Back to Employment</span>
                <span className="sm:hidden">Back</span>
              </Button>
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">Performance Review</h1>
              <p className="text-purple-100 text-sm sm:text-base">Conduct evaluations, track KPIs, and manage 360-degree feedback</p>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <Dialog open={showNewReviewDialog} onOpenChange={setShowNewReviewDialog}>
              <DialogTrigger asChild>
                <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30 text-sm">
                  <Plus className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">New Review</span>
                  <span className="sm:hidden">Review</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-lg sm:text-xl">Create New Performance Review</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="review-employee" className="text-sm">Employee</Label>
                      <Select
                        value={newReviewForm.employeeId}
                        onValueChange={(value) => setNewReviewForm({ ...newReviewForm, employeeId: value })}
                      >
                        <SelectTrigger className="text-sm">
                          <SelectValue placeholder="Select employee" />
                        </SelectTrigger>
                        <SelectContent>
                          {companyEmployees.map((emp) => (
                            <SelectItem key={emp.id} value={emp.id.toString()}>
                              {emp.name} - {emp.emp_code}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="review-period" className="text-sm">Review Period</Label>
                      <Select
                        value={newReviewForm.reviewPeriodId}
                        onValueChange={(value) => {
                          setNewReviewForm({ ...newReviewForm, reviewPeriodId: value })
                          const rp = reviewPeriods.find((r: any) => String(r.id) === value)
                          if (rp?.review_type) {
                            setNewReviewForm((prev) => ({ ...prev, reviewType: rp.review_type }))
                          }
                        }}
                      >
                        <SelectTrigger className="text-sm">
                          <SelectValue placeholder="Select review period" />
                        </SelectTrigger>
                        <SelectContent>
                          {reviewPeriods.map((rp: any) => (
                            <SelectItem key={rp.id} value={rp.id.toString()}>
                              {rp.name} ({formatDate(rp.start_date)} - {formatDate(rp.end_date)})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="review-type" className="text-sm">Review Type</Label>
                      <Input id="review-type" value={newReviewForm.reviewType} readOnly className="text-sm" />
                    </div>
                    <div>
                      <Label htmlFor="reviewed-by" className="text-sm">Reviewed By</Label>
                      <Select
                        value={(newReviewForm as any).reviewedBy || ''}
                        onValueChange={(value) => setNewReviewForm({ ...newReviewForm, reviewedBy: value } as any)}
                      >
                        <SelectTrigger className="text-sm">
                          <SelectValue placeholder="Select reviewer" />
                        </SelectTrigger>
                        <SelectContent>
                          {companyEmployees
                            .filter((emp) => emp.id.toString() !== newReviewForm.employeeId)
                            .map((emp) => (
                              <SelectItem key={emp.id} value={emp.id.toString()}>
                                {emp.name} - {emp.emp_code}
                              </SelectItem>
                            ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base">KPI Ratings</h3>
                    {(kpiCategoriesBackend.length ? kpiCategoriesBackend.map((k) => ({ id: String(k.id), name: k.name })) : kpiCategories).map((kpi) => (
                      <div key={kpi.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor={`kpi-${kpi.id}`} className="text-sm">{kpi.name}</Label>
                          <span className="text-sm font-medium">
                            {newReviewForm.kpis[kpi.id as keyof typeof newReviewForm.kpis] ?? 3}/5
                          </span>
                        </div>
                        <Slider
                          id={`kpi-${kpi.id}`}
                          min={1}
                          max={5}
                          step={0.1}
                          value={[newReviewForm.kpis[kpi.id as keyof typeof newReviewForm.kpis] ?? 3]}
                          onValueChange={(value) =>
                            setNewReviewForm({
                              ...newReviewForm,
                              kpis: { ...newReviewForm.kpis, [kpi.id]: value[0] as number },
                            })
                          }
                          className="w-full"
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <Label htmlFor="review-feedback" className="text-sm">Overall Feedback</Label>
                    <Textarea
                      id="review-feedback"
                      value={newReviewForm.feedback}
                      onChange={(e) => setNewReviewForm({ ...newReviewForm, feedback: e.target.value })}
                      placeholder="Provide detailed feedback on performance, achievements, and areas for improvement..."
                      rows={4}
                      className="text-sm"
                    />
                  </div>

                  <div>
                    <Label htmlFor="review-goals" className="text-sm">Goals for Next Period</Label>
                    <Textarea
                      id="review-goals"
                      value={newReviewForm.goals}
                      onChange={(e) => setNewReviewForm({ ...newReviewForm, goals: e.target.value })}
                      placeholder="Enter goals separated by commas..."
                      rows={3}
                      className="text-sm"
                    />
                  </div>

                  <div>
                    <Label htmlFor="review-improvements" className="text-sm">Areas for Improvement</Label>
                    <Textarea
                      id="review-improvements"
                      value={newReviewForm.improvements}
                      onChange={(e) => setNewReviewForm({ ...newReviewForm, improvements: e.target.value })}
                      placeholder="Enter improvement areas separated by commas..."
                      rows={2}
                      className="text-sm"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-4 border-t">
                    <Button
                      onClick={async () => {
                        if ((newReviewForm as any).reviewedBy && (newReviewForm as any).reviewedBy === newReviewForm.employeeId) {
                          alert('Employee and Reviewed By cannot be the same')
                          return
                        }
                        // Build payload for backend create
                        const kpiList = (kpiCategoriesBackend.length ? kpiCategoriesBackend.map((k) => ({ id: String(k.id), name: k.name })) : kpiCategories).map((k) => ({
                          kpi_category_id: Number.parseInt(String((k as any).id)),
                          score: clampScore(newReviewForm.kpis[k.id as keyof typeof newReviewForm.kpis] ?? 3),
                        }))
                        const payload = {
                          employee_id: Number.parseInt(newReviewForm.employeeId),
                          reviewer_id: Number.parseInt((newReviewForm as any).reviewedBy || '0'),
                          review_period_id: newReviewForm.reviewPeriodId ? Number.parseInt(newReviewForm.reviewPeriodId) : null,
                          overall_score:
                            Object.values(newReviewForm.kpis).reduce((sum, score) => sum + (Number(score) || 0), 0) /
                            Object.keys(newReviewForm.kpis).length,
                          feedback: newReviewForm.feedback || '',
                          goals: newReviewForm.goals || '',
                          improvements: newReviewForm.improvements || '',
                          status: 'completed',
                          review_date: formatDate(new Date().toISOString()),
                          next_review_date: null,
                          kpi_scores: kpiList,
                        }
                        const res = await createPerformanceReview(payload as any)
                        if (res?.success) {
                          handleCreateReview()
                        } else {
                          alert(res?.message || 'Failed to create review')
                        }
                      }}
                      className="flex-1 text-sm"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Create Review
                    </Button>
                    <Button variant="outline" onClick={() => setShowNewReviewDialog(false)} className="flex-1 bg-transparent text-sm">
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog open={showCycleDialog} onOpenChange={setShowCycleDialog}>
              <DialogTrigger asChild>
                <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30 text-sm">
                  <Plus className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Add Performance Cycle</span>
                  <span className="sm:hidden">Cycle</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[95vw] sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-lg sm:text-xl">Create Performance Cycle</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cycle-name" className="text-sm">Name</Label>
                    <Input
                      id="cycle-name"
                      placeholder="e.g., 2024 Q4 Cycle"
                      value={cycleForm.name}
                      onChange={(e) => setCycleForm((p) => ({ ...p, name: e.target.value }))}
                      className="text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cycle-start" className="text-sm">Start date</Label>
                      <Input
                        id="cycle-start"
                        type="date"
                        value={cycleForm.startDate}
                        onChange={(e) => setCycleForm((p) => ({ ...p, startDate: e.target.value }))}
                        className="text-sm"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cycle-end" className="text-sm">End date</Label>
                      <Input
                        id="cycle-end"
                        type="date"
                        value={cycleForm.endDate}
                        onChange={(e) => setCycleForm((p) => ({ ...p, endDate: e.target.value }))}
                        className="text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="cycle-type" className="text-sm">Review type</Label>
                      <Select
                        value={cycleForm.reviewType}
                        onValueChange={(v) => setCycleForm((p) => ({ ...p, reviewType: v as any }))}
                      >
                        <SelectTrigger className="text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="quarterly">Quarterly</SelectItem>
                          <SelectItem value="annual">Annual</SelectItem>
                          <SelectItem value="probation">Probation</SelectItem>
                          <SelectItem value="promotion">Promotion</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="cycle-status" className="text-sm">Status</Label>
                      <Select
                        value={cycleForm.status}
                        onValueChange={(v) => setCycleForm((p) => ({ ...p, status: v as any }))}
                      >
                        <SelectTrigger className="text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="p-3 sm:p-4 rounded-lg bg-gray-50 border">
                    <h4 className="font-semibold text-gray-900 text-sm sm:text-base mb-2">Preview</h4>
                    <div className="text-xs sm:text-sm text-gray-700 space-y-1">
                      <p>
                        <span className="font-medium">Name:</span> {cycleForm.name || "—"}
                      </p>
                      <p>
                        <span className="font-medium">Type:</span> {cycleForm.reviewType}
                      </p>
                      <p>
                        <span className="font-medium">Status:</span> {cycleForm.status}
                      </p>
                      <p>
                        <span className="font-medium">Start:</span>{" "}
                        {formatDate(cycleForm.startDate)}
                      </p>
                      <p>
                        <span className="font-medium">End:</span>{" "}
                        {formatDate(cycleForm.endDate)}
                      </p>
                      <p>
                        <span className="font-medium">Duration:</span>{" "}
                        {(() => {
                          const days = calculateDurationDays(cycleForm.startDate, cycleForm.endDate)
                          return days ? `${days} day${days === 1 ? "" : "s"}` : "—"
                        })()}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-2">
                    <Button
                      disabled={savingCycle}
                      onClick={async () => {
                        setSavingCycle(true)
                        try {
                          const payload = {
                            name: cycleForm.name,
                            start_date: cycleForm.startDate,
                            end_date: cycleForm.endDate,
                            review_type: cycleForm.reviewType,
                            status: cycleForm.status,
                          }
                          const res = await createReviewPeriod(payload)
                          if (res?.success) {
                            const list = await fetchReviewPeriods()
                            setReviewPeriods(list)
                            setShowCycleDialog(false)
                            setCycleForm({ name: "", startDate: "", endDate: "", reviewType: "quarterly", status: "active" })
                          }
                        } finally {
                          setSavingCycle(false)
                        }
                      }}
                      className="flex-1 text-sm"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {savingCycle ? 'Saving…' : 'Save Cycle'}
                    </Button>
                    <Button variant="outline" onClick={() => setShowCycleDialog(false)} className="flex-1 bg-transparent text-sm">
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Quick Stats - Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-purple-100">
                <Users className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{employees.length}</p>
                <p className="text-xs sm:text-sm text-gray-600">Total Employees</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-green-100">
                <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{completedReviews}</p>
                <p className="text-xs sm:text-sm text-gray-600">Completed Reviews</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-yellow-100">
                <AlertCircle className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{pendingReviews}</p>
                <p className="text-xs sm:text-sm text-gray-600">Pending Reviews</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <Star className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{formatFixed1(averageScore)}</p>
                <p className="text-xs sm:text-sm text-gray-600">Average Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Cycles Section with Pagination */}
      {reviewPeriods.length > 0 && (
        <Card className="border-purple-100">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
              <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
              <span>Performance Cycles</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 sm:p-6">
            <div className="rounded-md border overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[150px]">Name</TableHead>
                      <TableHead className="hidden sm:table-cell">Type</TableHead>
                      <TableHead className="hidden md:table-cell">Status</TableHead>
                      <TableHead className="hidden lg:table-cell">Start</TableHead>
                      <TableHead className="hidden lg:table-cell">End</TableHead>
                      <TableHead className="hidden xl:table-cell">Duration</TableHead>
                      <TableHead className="min-w-[100px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentCycles.map((rp: any) => {
                      const duration = calculateDurationDays(rp.start_date, rp.end_date)
                      return (
                        <TableRow key={rp.id}>
                          <TableCell className="font-medium text-sm">{rp.name}</TableCell>
                          <TableCell className="hidden sm:table-cell capitalize text-sm">{rp.review_type}</TableCell>
                          <TableCell className="hidden md:table-cell">
                            <Badge variant="outline" className={getStatusColor(rp.status)}>{rp.status}</Badge>
                          </TableCell>
                          <TableCell className="hidden lg:table-cell text-sm">{formatDate(rp.start_date)}</TableCell>
                          <TableCell className="hidden lg:table-cell text-sm">{formatDate(rp.end_date)}</TableCell>
                          <TableCell className="hidden xl:table-cell text-sm">{duration ? `${duration} days` : '—'}</TableCell>
                          <TableCell>
                            <div className="flex space-x-1">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 w-8 p-0 bg-transparent"
                                onClick={async () => {
                                  // quick edit: prefill and open dialog
                                  setCycleForm({
                                    name: rp.name,
                                    startDate: rp.start_date,
                                    endDate: rp.end_date,
                                    reviewType: rp.review_type,
                                    status: rp.status,
                                  })
                                  setShowCycleDialog(true)
                                  ;(setSelectedReview as any)({ id: rp.id })
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-8 w-8 p-0 bg-transparent"
                                onClick={async () => {
                                  const ok = confirm('Delete this cycle?')
                                  if (!ok) return
                                  const res = await deleteReviewPeriod(rp.id)
                                  if (res?.success) {
                                    const list = await fetchReviewPeriods()
                                    setReviewPeriods(list)
                                  }
                                }}
                              >
                                <Download className="h-4 w-4 rotate-180" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
              <CyclePagination />
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="overview" className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
          <TabsTrigger value="reviews" className="text-xs sm:text-sm">Reviews</TabsTrigger>
          <TabsTrigger value="analytics" className="text-xs sm:text-sm">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 sm:space-y-6">
          {/* Employee Performance Overview */}
          <Card>
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-3 sm:space-y-0 p-4 sm:p-6">
              <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                <Target className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                <span>Employee Performance Overview</span>
              </CardTitle>
              <Select value={selectedPeriodId} onValueChange={async (val) => {
                setSelectedPeriodId(val)
                const rows = await fetchPerformanceReviews(val ? Number.parseInt(val) : undefined)
                // Map backend rows to the local employees structure used in the overview
                const mapped = rows.map((r: PerformanceReviewRow) => ({
                  id: r.employee_id,
                  name: r.employee_name || `Employee ${r.employee_id}`,
                  position: r.designation_name || '',
                  department: r.department_name || '',
                  manager: '',
                  avatar: '/placeholder.svg?height=40&width=40',
                  overallScore: Number(r.overall_score || 0),
                  lastReview: r.review_date,
                  nextReview: r.next_review_date || r.review_date,
                  status: r.status || 'completed',
                  kpis: (r.kpi_scores || []).reduce((acc: any, s) => {
                    acc[String(s.kpi_category_id)] = Number(s.score || 0)
                    return acc
                  }, {} as any),
                  feedback: r.feedback || '',
                  goals: (r.goals || '').split(',').map((g) => g.trim()).filter(Boolean),
                  improvements: (r.improvements || '').split(',').map((g) => g.trim()).filter(Boolean),
                }))
                setEmployees(mapped as any)
              }}>
                <SelectTrigger className="w-full sm:w-56 text-sm">
                  <SelectValue placeholder="Filter by review period" />
                </SelectTrigger>
                <SelectContent>
                  {reviewPeriods.map((rp: any) => (
                    <SelectItem key={rp.id} value={rp.id.toString()}>
                      {rp.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardHeader>
            <CardContent className="p-4 sm:p-6">
              <div className="space-y-4 sm:space-y-6">
                {employees.map((employee) => (
                  <div key={employee.id} className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 sm:mb-4 space-y-3 sm:space-y-0">
                      <div className="flex items-center space-x-3 sm:space-x-4">
                        <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                          <AvatarImage src={employee.avatar || "/placeholder.svg"} alt={employee.name} />
                          <AvatarFallback className="bg-purple-100 text-purple-600 text-sm">
                            {getInitials(employee.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900 text-sm sm:text-base">{employee.name}</p>
                          <p className="text-xs sm:text-sm text-gray-600">
                            {employee.position} • {employee.department}
                          </p>
                          <p className="text-xs text-gray-500 sm:hidden">Manager: {employee.manager}</p>
                        </div>
                      </div>
                      <div className="text-left sm:text-right">
                        <div className="flex items-center space-x-2">
                          {getScoreIcon(employee.overallScore)}
                          <span className={`text-xl sm:text-2xl font-bold ${getScoreColor(employee.overallScore)}`}>
                            {formatFixed1(employee.overallScore)}
                          </span>
                        </div>
                        <Badge variant="outline" className={getStatusColor(employee.status)}>
                          {employee.status}
                        </Badge>
                      </div>
                    </div>

                    {/* KPI Breakdown */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 sm:gap-4">
                      {(kpiCategoriesBackend.length ? kpiCategoriesBackend.map((k) => ({ id: String(k.id), name: k.name })) : kpiCategories).map((kpi) => (
                        <div key={kpi.id} className="text-center">
                          <p className="text-xs font-medium text-gray-600 mb-1 sm:mb-2">{kpi.name}</p>
                          <div className="relative">
                            <Progress
                              value={(getKpiVal(employee, kpi.id as any) / 5) * 100}
                              className="h-1 sm:h-2 mb-1"
                            />
                            <p className="text-xs sm:text-sm font-medium">
                              {formatFixed1(getKpiVal(employee, kpi.id as any))}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200">
                      <div className="text-xs sm:text-sm text-gray-700 mb-2">
                        <strong>Recent Feedback:</strong>
                        <ul className="list-disc ml-3 sm:ml-5 mt-1">
                          {splitIntoPoints(employee.feedback).map((pt, idx) => (
                            <li key={idx} className="text-xs sm:text-sm">{pt}.</li>
                          ))}
                        </ul>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-gray-500 space-y-1 sm:space-y-0">
                        <span>Last Review: {formatDate(employee.lastReview)}</span>
                        <span>Next Review: {formatDate(employee.nextReview)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reviews" className="space-y-4 sm:space-y-6">
          {/* Performance Reviews */}
          <Card>
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                <span>Performance Reviews</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 sm:p-6">
              <div className="rounded-md border overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[150px]">Employee</TableHead>
                        <TableHead className="hidden sm:table-cell">Position</TableHead>
                        <TableHead>Overall Score</TableHead>
                        <TableHead className="hidden md:table-cell">Last Review</TableHead>
                        <TableHead className="hidden lg:table-cell">Next Review</TableHead>
                        <TableHead className="hidden md:table-cell">Status</TableHead>
                        <TableHead className="min-w-[120px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {employees.map((employee) => (
                        <TableRow key={employee.id}>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={employee.avatar || "/placeholder.svg"} alt={employee.name} />
                                <AvatarFallback className="bg-purple-100 text-purple-600 text-xs">
                                  {getInitials(employee.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0">
                                <p className="font-medium text-sm truncate">{employee.name}</p>
                                <p className="text-xs text-gray-600 truncate sm:hidden">{employee.position}</p>
                                <p className="text-xs text-gray-600 hidden sm:block">{employee.department}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell text-sm">{employee.position}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-2">
                              {getScoreIcon(employee.overallScore)}
                              <span className={`font-medium text-sm ${getScoreColor(employee.overallScore)}`}>
                                {formatFixed1(employee.overallScore)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="hidden md:table-cell text-sm">{formatDate(employee.lastReview)}</TableCell>
                          <TableCell className="hidden lg:table-cell text-sm">{formatDate(employee.nextReview)}</TableCell>
                          <TableCell className="hidden md:table-cell">
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
                                className="h-8 w-8 p-0 bg-transparent hidden sm:inline-flex"
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
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4 sm:space-y-6">
          {/* Performance Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                  <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                  <span>KPI Performance Trends</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-3 sm:space-y-4">
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
                          <Progress value={(avgScore / 5) * 100} className="w-16 sm:w-20 h-2" />
                          <span className="text-sm font-medium w-8">{formatFixed1(avgScore)}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
                  <Award className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                  <span>Top Performers</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-3">
                  {[...employees]
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
                          <AvatarFallback className="bg-purple-100 text-purple-600 text-xs">
                            {employee.name
                              .split(" ")
                              .map((n: string) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{employee.name}</p>
                          <p className="text-xs text-gray-600 truncate">{employee.position}</p>
                        </div>
                        <span className={`font-bold text-sm ${getScoreColor(employee.overallScore)}`}>
                          {formatFixed1(employee.overallScore)}
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
        <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-lg sm:text-xl">
              <Eye className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
              <span>Performance Review Details</span>
            </DialogTitle>
          </DialogHeader>
          {selectedReview && (
            <div className="space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center space-x-0 sm:space-x-4 p-3 sm:p-4 bg-gray-50 rounded-lg space-y-3 sm:space-y-0">
                <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                  <AvatarImage src={selectedReview.avatar || "/placeholder.svg"} alt={selectedReview.name} />
                  <AvatarFallback className="bg-purple-100 text-purple-600 text-sm">
                    {getInitials(selectedReview.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-base sm:text-lg">{selectedReview.name}</h3>
                  <p className="text-gray-600 text-sm">
                    {selectedReview.position} • {selectedReview.department}
                  </p>
                  <p className="text-xs text-gray-500 sm:hidden">Manager: {selectedReview.manager}</p>
                </div>
                <div className="text-left sm:text-right">
                  <div className="flex items-center space-x-2">
                    {getScoreIcon(selectedReview.overallScore)}
                    <span className={`text-xl sm:text-2xl font-bold ${getScoreColor(selectedReview.overallScore)}`}>
                      {formatFixed1(selectedReview.overallScore)}
                    </span>
                  </div>
                  <Badge variant="outline" className={getStatusColor(selectedReview.status)}>
                    {selectedReview.status}
                  </Badge>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 text-sm sm:text-base mb-3">KPI Breakdown</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(kpiCategoriesBackend.length ? kpiCategoriesBackend.map((k) => ({ id: String(k.id), name: k.name })) : kpiCategories).map((kpi) => (
                    <div key={kpi.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-sm">{kpi.name}</span>
                      <div className="flex items-center space-x-2">
                        <Progress
                          value={(getKpiVal(selectedReview, kpi.id as any) / 5) * 100}
                          className="w-12 sm:w-16 h-2"
                        />
                        <span className="font-bold text-sm w-6 sm:w-8">
                          {formatFixed1(getKpiVal(selectedReview, kpi.id as any))}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 text-sm sm:text-base mb-2">Feedback</h4>
                <ul className="text-gray-700 bg-gray-50 p-3 rounded-lg list-disc ml-3 sm:ml-5 text-sm">
                  {splitIntoPoints(selectedReview.feedback).map((pt, idx) => (
                    <li key={idx}>{pt}.</li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base mb-2">Goals</h4>
                  <ul className="space-y-1 list-disc ml-3 sm:ml-5">
                    {splitArrayIntoPoints(selectedReview.goals).map((goal: string, index: number) => (
                      <li key={index} className="text-xs sm:text-sm text-gray-700">{goal}.</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 text-sm sm:text-base mb-2">Areas for Improvement</h4>
                  <ul className="space-y-1 list-disc ml-3 sm:ml-5">
                    {splitArrayIntoPoints(selectedReview.improvements).map((improvement: string, index: number) => (
                      <li key={index} className="text-xs sm:text-sm text-gray-700">{improvement}.</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-gray-500 pt-3 sm:pt-4 border-t space-y-1 sm:space-y-0">
                <span>Last Review: {formatDate(selectedReview.lastReview)}</span>
                <span>Next Review: {formatDate(selectedReview.nextReview)}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Review Dialog */}
      <Dialog open={showEditReviewDialog} onOpenChange={setShowEditReviewDialog}>
        <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-lg sm:text-xl">
              <Edit className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
              <span>Edit Performance Review</span>
            </DialogTitle>
          </DialogHeader>
          {selectedReview && (
            <div className="space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center space-x-0 sm:space-x-4 p-3 sm:p-4 bg-gray-50 rounded-lg space-y-3 sm:space-y-0">
                <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                  <AvatarImage src={selectedReview.avatar || "/placeholder.svg"} alt={selectedReview.name} />
                  <AvatarFallback className="bg-purple-100 text-purple-600 text-sm">
                    {getInitials(selectedReview.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <h3 className="font-semibold text-base sm:text-lg">{selectedReview.name}</h3>
                  <p className="text-gray-600 text-sm">
                    {selectedReview.position} • {selectedReview.department}
                  </p>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <h4 className="font-semibold text-gray-900 text-sm sm:text-base">KPI Ratings</h4>
                {(kpiCategoriesBackend.length ? kpiCategoriesBackend.map((k) => ({ id: String(k.id), name: k.name })) : kpiCategories).map((kpi) => (
                  <div key={kpi.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor={`edit-kpi-${kpi.id}`} className="text-sm">{kpi.name}</Label>
                      <span className="text-sm font-medium">{formatFixed1(getKpiVal(selectedReview, kpi.id as any))}/5</span>
                    </div>
                    <Slider
                      id={`edit-kpi-${kpi.id}`}
                      min={1}
                      max={5}
                      step={0.1}
                      value={[getKpiVal(selectedReview, kpi.id as any)]}
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
                <Label htmlFor="edit-feedback" className="text-sm">Overall Feedback</Label>
                <Textarea
                  id="edit-feedback"
                  value={selectedReview.feedback}
                  onChange={(e) => setSelectedReview({ ...selectedReview, feedback: e.target.value })}
                  rows={4}
                  className="text-sm"
                />
              </div>

              <div>
                <Label htmlFor="edit-goals" className="text-sm">Goals for Next Period</Label>
                <Textarea
                  id="edit-goals"
                  value={(selectedReview.goals || []).join(", ")}
                  onChange={(e) =>
                    setSelectedReview({
                      ...selectedReview,
                      goals: e.target.value.split(",").map((g) => g.trim()).filter(Boolean),
                    })
                  }
                  rows={3}
                  className="text-sm"
                />
              </div>

              <div>
                <Label htmlFor="edit-improvements" className="text-sm">Areas for Improvement</Label>
                <Textarea
                  id="edit-improvements"
                  value={(selectedReview.improvements || []).join(", ")}
                  onChange={(e) =>
                    setSelectedReview({
                      ...selectedReview,
                      improvements: e.target.value.split(",").map((i) => i.trim()).filter(Boolean),
                    })
                  }
                  rows={2}
                  className="text-sm"
                />
              </div>

              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 pt-3 sm:pt-4 border-t">
                <Button onClick={handleUpdateReview} className="flex-1 text-sm">
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
                <Button variant="outline" onClick={() => setShowEditReviewDialog(false)} className="flex-1 bg-transparent text-sm">
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