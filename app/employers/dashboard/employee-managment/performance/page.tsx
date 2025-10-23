"use client"

import { useState, useEffect } from "react"
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
import { useToast } from "@/hooks/use-toast"
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
  MoreHorizontal,
} from "lucide-react"
import Link from "next/link"
import { fetchReviewPeriods, createReviewPeriod, updateReviewPeriod, deleteReviewPeriod, fetchKpiCategories, type KpiCategoryRow, fetchCompanyEmployees, type CompanyEmployee, createPerformanceReview, fetchPerformanceReviews, type PerformanceReviewRow } from "@/lib/hrms-api"

export default function PerformanceReviewPage() {
  const { toast } = useToast()
  const [selectedPeriodId, setSelectedPeriodId] = useState("")
  const [selectedEmployee, setSelectedEmployee] = useState("")
  const [showNewReviewDialog, setShowNewReviewDialog] = useState(false)
  const [showViewReviewDialog, setShowViewReviewDialog] = useState(false)
  const [showEditReviewDialog, setShowEditReviewDialog] = useState(false)
  const [showCycleDialog, setShowCycleDialog] = useState(false)
  const [editingCycleId, setEditingCycleId] = useState<number | null>(null)
  const [selectedReview, setSelectedReview] = useState<any>(null)
  const [mobileActionMenu, setMobileActionMenu] = useState<number | null>(null)
  const [creatingReview, setCreatingReview] = useState(false)
  const [updatingReview, setUpdatingReview] = useState(false)
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


  const handleUpdateReview = async () => {
    if (!selectedReview) return

    setUpdatingReview(true)
    try {
      const overallScore =
        Object.values(selectedReview.kpis).reduce((sum: number, score: any) => sum + score, 0) /
        Object.keys(selectedReview.kpis).length

      const updatedEmployee = {
        ...selectedReview,
        overallScore,
      }

      setEmployees(employees.map((emp) => (emp.id === selectedReview.id ? updatedEmployee : emp)))
      setShowEditReviewDialog(false)
      
      toast({
        title: "Review Updated Successfully",
        description: `Performance review for ${selectedReview.name} has been updated.`,
        variant: "default",
      })
    } catch (error) {
      toast({
        title: "Error Updating Review",
        description: "Failed to update performance review. Please try again.",
        variant: "destructive",
      })
    } finally {
      setUpdatingReview(false)
    }
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
    <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6 p-3 sm:p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <Link href="/employers/dashboard/employee-managment">
              <Button
                variant="secondary"
                size="sm"
                className="w-full sm:w-auto bg-white/20 hover:bg-white/30 text-white border-white/30 justify-center text-xs sm:text-sm"
              >
                <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                Back to Employment
              </Button>
            </Link>
            <div className="text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">Performance Review</h1>
              <p className="text-purple-100 text-sm sm:text-base">Conduct evaluations, track KPIs, and manage 360-degree feedback</p>
            </div>
          </div>
          
          {/* Desktop Action Buttons */}
          <div className="hidden lg:flex space-x-2 flex-shrink-0">
            <Dialog open={showNewReviewDialog} onOpenChange={setShowNewReviewDialog}>
              <DialogTrigger asChild>
                <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30 text-sm">
                  <Plus className="h-4 w-4 mr-2" />
                  New Review
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-lg sm:text-xl">Create New Performance Review</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <Label htmlFor="review-employee" className="text-sm sm:text-base">Employee</Label>
                      <Select
                        value={newReviewForm.employeeId}
                        onValueChange={(value) => setNewReviewForm({ ...newReviewForm, employeeId: value })}
                      >
                        <SelectTrigger className="text-sm sm:text-base">
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
                      <Label htmlFor="review-period" className="text-sm sm:text-base">Review Period</Label>
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
                        <SelectTrigger className="text-sm sm:text-base">
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

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <Label htmlFor="review-type" className="text-sm sm:text-base">Review Type</Label>
                      <Input id="review-type" value={newReviewForm.reviewType} readOnly className="text-sm sm:text-base" />
                    </div>
                    <div>
                      <Label htmlFor="reviewed-by" className="text-sm sm:text-base">Reviewed By</Label>
                      <Select
                        value={(newReviewForm as any).reviewedBy || ''}
                        onValueChange={(value) => setNewReviewForm({ ...newReviewForm, reviewedBy: value } as any)}
                      >
                        <SelectTrigger className="text-sm sm:text-base">
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

                  <div className="space-y-3 sm:space-y-4">
                    <h3 className="font-semibold text-gray-900 text-sm sm:text-base">KPI Ratings</h3>
                    {(kpiCategoriesBackend.length ? kpiCategoriesBackend.map((k) => ({ id: String(k.id), name: k.name })) : kpiCategories).map((kpi) => (
                      <div key={kpi.id} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor={`kpi-${kpi.id}`} className="text-sm sm:text-base">{kpi.name}</Label>
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
                    <Label htmlFor="review-feedback" className="text-sm sm:text-base">Overall Feedback</Label>
                    <Textarea
                      id="review-feedback"
                      value={newReviewForm.feedback}
                      onChange={(e) => setNewReviewForm({ ...newReviewForm, feedback: e.target.value })}
                      placeholder="Provide detailed feedback on performance, achievements, and areas for improvement..."
                      rows={4}
                      className="text-sm sm:text-base"
                    />
                  </div>

                  <div>
                    <Label htmlFor="review-goals" className="text-sm sm:text-base">Goals for Next Period</Label>
                    <Textarea
                      id="review-goals"
                      value={newReviewForm.goals}
                      onChange={(e) => setNewReviewForm({ ...newReviewForm, goals: e.target.value })}
                      placeholder="Enter goals separated by commas..."
                      rows={3}
                      className="text-sm sm:text-base"
                    />
                  </div>

                  <div>
                    <Label htmlFor="review-improvements" className="text-sm sm:text-base">Areas for Improvement</Label>
                    <Textarea
                      id="review-improvements"
                      value={newReviewForm.improvements}
                      onChange={(e) => setNewReviewForm({ ...newReviewForm, improvements: e.target.value })}
                      placeholder="Enter improvement areas separated by commas..."
                      rows={2}
                      className="text-sm sm:text-base"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
                    <Button
                      disabled={creatingReview}
                      onClick={async () => {
                        if ((newReviewForm as any).reviewedBy && (newReviewForm as any).reviewedBy === newReviewForm.employeeId) {
                          toast({
                            title: "Invalid Selection",
                            description: "Employee and Reviewed By cannot be the same.",
                            variant: "destructive",
                          })
                          return
                        }
                        if (!newReviewForm.employeeId) {
                          toast({
                            title: "Missing Information",
                            description: "Please select an employee.",
                            variant: "destructive",
                          })
                          return
                        }
                        
                        setCreatingReview(true)
                        try {
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
                          console.log('Create review payload:', payload)
                          const res = await createPerformanceReview(payload as any)
                          console.log('Create review API response:', res)
                          if (res?.success) {
                            // Get the selected employee name for the toast
                            const selectedEmp = companyEmployees.find((emp) => emp.id === Number.parseInt(newReviewForm.employeeId))
                            
                            // Show success toast
                            toast({
                              title: "Review Created Successfully",
                              description: `Performance review for ${selectedEmp?.name || 'employee'} has been created.`,
                              variant: "default",
                            })
                            
                            // Close dialog and reset form
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
                            
                            // Refresh the employees list
                            const rows = await fetchPerformanceReviews(selectedPeriodId ? Number.parseInt(selectedPeriodId) : undefined)
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
                          } else {
                            toast({
                              title: "Error Creating Review",
                              description: res?.message || 'Failed to create review',
                              variant: "destructive",
                            })
                          }
                        } catch (error) {
                          toast({
                            title: "Error Creating Review",
                            description: "Failed to create performance review. Please try again.",
                            variant: "destructive",
                          })
                        } finally {
                          setCreatingReview(false)
                        }
                      }}
                      className="flex-1 text-sm sm:text-base"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {creatingReview ? 'Creating...' : 'Create Review'}
                    </Button>
                    <Button variant="outline" onClick={() => setShowNewReviewDialog(false)} className="flex-1 text-sm sm:text-base">
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
            <Dialog open={showCycleDialog} onOpenChange={(open) => {
              setShowCycleDialog(open)
              if (!open) {
                setEditingCycleId(null)
                setCycleForm({ name: "", startDate: "", endDate: "", reviewType: "quarterly", status: "active" })
              }
            }}>
              <DialogTrigger asChild>
                <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30 text-sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Cycle
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[95vw] sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-lg sm:text-xl">Create Performance Cycle</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cycle-name" className="text-sm sm:text-base">Name</Label>
                    <Input
                      id="cycle-name"
                      placeholder="e.g., 2024 Q4 Cycle"
                      value={cycleForm.name}
                      onChange={(e) => setCycleForm((p) => ({ ...p, name: e.target.value }))}
                      className="text-sm sm:text-base"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <Label htmlFor="cycle-start" className="text-sm sm:text-base">Start date</Label>
                      <Input
                        id="cycle-start"
                        type="date"
                        value={cycleForm.startDate}
                        onChange={(e) => setCycleForm((p) => ({ ...p, startDate: e.target.value }))}
                        className="text-sm sm:text-base"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cycle-end" className="text-sm sm:text-base">End date</Label>
                      <Input
                        id="cycle-end"
                        type="date"
                        value={cycleForm.endDate}
                        onChange={(e) => setCycleForm((p) => ({ ...p, endDate: e.target.value }))}
                        className="text-sm sm:text-base"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <Label htmlFor="cycle-type" className="text-sm sm:text-base">Review type</Label>
                      <Select
                        value={cycleForm.reviewType}
                        onValueChange={(v) => setCycleForm((p) => ({ ...p, reviewType: v as any }))}
                      >
                        <SelectTrigger className="text-sm sm:text-base">
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
                      <Label htmlFor="cycle-status" className="text-sm sm:text-base">Status</Label>
                      <Select
                        value={cycleForm.status}
                        onValueChange={(v) => setCycleForm((p) => ({ ...p, status: v as any }))}
                      >
                        <SelectTrigger className="text-sm sm:text-base">
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
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Preview</h4>
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

                  <div className="flex flex-col sm:flex-row gap-2 pt-2">
                    <Button
                      disabled={savingCycle}
                      onClick={async () => {
                        if (!cycleForm.name || !cycleForm.startDate || !cycleForm.endDate) {
                          toast({
                            title: "Missing Information",
                            description: "Please fill in all required fields.",
                            variant: "destructive",
                          })
                          return
                        }
                        
                        setSavingCycle(true)
                        try {
                          const payload = {
                            name: cycleForm.name,
                            start_date: cycleForm.startDate,
                            end_date: cycleForm.endDate,
                            review_type: cycleForm.reviewType,
                            status: cycleForm.status,
                          }
                          let res: any = null
                          if (editingCycleId) {
                            res = await updateReviewPeriod(editingCycleId, payload as any)
                          } else {
                            res = await createReviewPeriod(payload)
                          }
                          if (res?.success) {
                            const list = await fetchReviewPeriods()
                            setReviewPeriods(list)
                            setShowCycleDialog(false)
                            setEditingCycleId(null)
                            setCycleForm({ name: "", startDate: "", endDate: "", reviewType: "quarterly", status: "active" })
                            
                            toast({
                              title: editingCycleId ? "Cycle Updated Successfully" : "Cycle Created Successfully",
                              description: `Performance cycle "${cycleForm.name}" has been ${editingCycleId ? 'updated' : 'created'}.`,
                              variant: "default",
                            })
                          } else {
                            toast({
                              title: "Error Saving Cycle",
                              description: res?.message || 'Failed to save cycle',
                              variant: "destructive",
                            })
                          }
                        } catch (error) {
                          toast({
                            title: "Error Saving Cycle",
                            description: "Failed to save performance cycle. Please try again.",
                            variant: "destructive",
                          })
                        } finally {
                          setSavingCycle(false)
                        }
                      }}
                      className="flex-1 text-sm sm:text-base"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      {savingCycle ? 'Saving…' : editingCycleId ? 'Update Cycle' : 'Save Cycle'}
                    </Button>
                    <Button variant="outline" onClick={() => setShowCycleDialog(false)} className="flex-1 text-sm sm:text-base">
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Mobile Action Buttons */}
          <div className="flex flex-col xs:flex-row gap-2 lg:hidden">
            <Button
              variant="secondary"
              className="w-full xs:w-auto bg-white/20 hover:bg-white/30 text-white border-white/30 justify-center text-xs py-2 h-auto"
              onClick={() => setShowNewReviewDialog(true)}
            >
              <Plus className="h-3 w-3 mr-1" />
              New Review
            </Button>
            <Button
              variant="secondary"
              className="w-full xs:w-auto bg-white/20 hover:bg-white/30 text-white border-white/30 justify-center text-xs py-2 h-auto"
              onClick={() => setShowCycleDialog(true)}
            >
              <Plus className="h-3 w-3 mr-1" />
              Add Cycle
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 xs:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-1 sm:p-2 rounded-lg bg-purple-100">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-base sm:text-lg font-bold text-gray-900">{employees.length}</p>
                <p className="text-xs text-gray-600">Total Employees</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-1 sm:p-2 rounded-lg bg-green-100">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
              </div>
              <div>
                <p className="text-base sm:text-lg font-bold text-gray-900">{completedReviews}</p>
                <p className="text-xs text-gray-600">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-1 sm:p-2 rounded-lg bg-yellow-100">
                <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-base sm:text-lg font-bold text-gray-900">{pendingReviews}</p>
                <p className="text-xs text-gray-600">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-1 sm:p-2 rounded-lg bg-blue-100">
                <Star className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-base sm:text-lg font-bold text-gray-900">{formatFixed1(averageScore)}</p>
                <p className="text-xs text-gray-600">Avg Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Cycles Table */}
      {reviewPeriods.length > 0 && (
        <Card className="border-purple-100">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
              <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
              <span>Performance Cycles</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-hidden">
              <div className="hidden sm:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[120px]">Name</TableHead>
                      <TableHead className="min-w-[80px]">Type</TableHead>
                      <TableHead className="min-w-[80px]">Status</TableHead>
                      <TableHead className="min-w-[90px]">Start</TableHead>
                      <TableHead className="min-w-[90px]">End</TableHead>
                      <TableHead className="min-w-[80px]">Duration</TableHead>
                      <TableHead className="min-w-[70px] text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reviewPeriods.map((rp: any) => {
                      const duration = calculateDurationDays(rp.start_date, rp.end_date)
                      return (
                        <TableRow key={rp.id}>
                          <TableCell className="font-medium">{rp.name}</TableCell>
                          <TableCell className="capitalize">{rp.review_type}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getStatusColor(rp.status)}>{rp.status}</Badge>
                          </TableCell>
                          <TableCell>{formatDate(rp.start_date)}</TableCell>
                          <TableCell>{formatDate(rp.end_date)}</TableCell>
                          <TableCell>{duration ? `${duration} days` : '—'}</TableCell>
                          <TableCell>
                            <div className="flex justify-end space-x-1">
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
                                  try {
                                    const res = await deleteReviewPeriod(rp.id)
                                    if (res?.success) {
                                      const list = await fetchReviewPeriods()
                                      setReviewPeriods(list)
                                      toast({
                                        title: "Cycle Deleted Successfully",
                                        description: `Performance cycle "${rp.name}" has been deleted.`,
                                        variant: "default",
                                      })
                                    } else {
                                      toast({
                                        title: "Error Deleting Cycle",
                                        description: res?.message || 'Failed to delete cycle',
                                        variant: "destructive",
                                      })
                                    }
                                  } catch (error) {
                                    toast({
                                      title: "Error Deleting Cycle",
                                      description: "Failed to delete performance cycle. Please try again.",
                                      variant: "destructive",
                                    })
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

              {/* Mobile View for Performance Cycles */}
              <div className="sm:hidden divide-y">
                {reviewPeriods.map((rp: any) => {
                  const duration = calculateDurationDays(rp.start_date, rp.end_date)
                  return (
                    <div key={rp.id} className="p-3">
                      <div className="flex justify-between items-start">
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-sm truncate">{rp.name}</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            <Badge variant="outline" className={getStatusColor(rp.status) + " text-xs"}>
                              {rp.status}
                            </Badge>
                            <span className="text-xs text-gray-500 capitalize">{rp.review_type}</span>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-gray-500">{formatDate(rp.start_date)}</span>
                            <span className="text-xs text-gray-500">to</span>
                            <span className="text-xs text-gray-500">{formatDate(rp.end_date)}</span>
                          </div>
                          <p className="text-xs text-gray-600 mt-1">
                            Duration: {duration ? `${duration} days` : '—'}
                          </p>
                        </div>
                        <div className="flex space-x-1 ml-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 w-8 p-0 bg-transparent"
                            onClick={async () => {
                              setCycleForm({
                                name: rp.name,
                                startDate: rp.start_date,
                                endDate: rp.end_date,
                                reviewType: rp.review_type,
                                status: rp.status,
                              })
                              setShowCycleDialog(true)
                              ;(setSelectedReview as any)({ id: rp.id })
                              setEditingCycleId(Number(rp.id))
                              setEditingCycleId(Number(rp.id))
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="overview" className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-3 h-auto p-1">
          <TabsTrigger value="overview" className="text-xs sm:text-sm px-2 py-2 data-[state=active]:bg-white flex items-center justify-center">
            <Target className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="truncate">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="reviews" className="text-xs sm:text-sm px-2 py-2 data-[state=active]:bg-white flex items-center justify-center">
            <FileText className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="truncate">Reviews</span>
          </TabsTrigger>
          <TabsTrigger value="analytics" className="text-xs sm:text-sm px-2 py-2 data-[state=active]:bg-white flex items-center justify-center">
            <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
            <span className="truncate">Analytics</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4 sm:space-y-6">
          {/* Employee Performance Overview */}
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
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
            <CardContent>
              <div className="space-y-4">
                {employees.map((employee) => (
                  <div key={employee.id} className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3 sm:mb-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                          <AvatarImage src={employee.avatar || "/placeholder.svg"} alt={employee.name} />
                          <AvatarFallback className="bg-purple-100 text-purple-600 text-sm">
                            {getInitials(employee.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-gray-900 text-sm sm:text-base truncate">{employee.name}</p>
                          <p className="text-xs sm:text-sm text-gray-600 truncate">
                            {employee.position} • {employee.department}
                          </p>
                          <p className="text-xs text-gray-500">Manager: {employee.manager}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-2 sm:gap-3">
                        <div className="flex items-center space-x-1 sm:space-x-2">
                          {getScoreIcon(employee.overallScore)}
                          <span className={`text-lg sm:text-xl font-bold ${getScoreColor(employee.overallScore)}`}>
                            {formatFixed1(employee.overallScore)}
                          </span>
                        </div>
                        <Badge variant="outline" className={getStatusColor(employee.status) + " text-xs"}>
                          {employee.status}
                        </Badge>
                      </div>
                    </div>

                    {/* KPI Breakdown */}
                    <div className="grid grid-cols-2 xs:grid-cols-3 md:grid-cols-5 gap-2 sm:gap-3">
                      {(kpiCategoriesBackend.length ? kpiCategoriesBackend.map((k) => ({ id: String(k.id), name: k.name })) : kpiCategories).map((kpi) => (
                        <div key={kpi.id} className="text-center">
                          <p className="text-xs text-gray-600 mb-1 truncate">{kpi.name}</p>
                          <div className="relative">
                            <Progress
                              value={(getKpiVal(employee, kpi.id as any) / 5) * 100}
                              className="h-1.5 sm:h-2 mb-1"
                            />
                            <p className="text-xs sm:text-sm font-medium">
                              {formatFixed1(getKpiVal(employee, kpi.id as any))}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-3 sm:mt-4 pt-3 border-t border-gray-200">
                      <div className="text-xs sm:text-sm text-gray-700 mb-2">
                        <strong>Recent Feedback:</strong>
                        <ul className="list-disc ml-4 sm:ml-5 mt-1 space-y-1">
                          {splitIntoPoints(employee.feedback).slice(0, 2).map((pt, idx) => (
                            <li key={idx} className="break-words">{pt}.</li>
                          ))}
                          {splitIntoPoints(employee.feedback).length > 2 && (
                            <li className="text-gray-500">+{splitIntoPoints(employee.feedback).length - 2} more</li>
                          )}
                        </ul>
                      </div>
                      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between text-xs text-gray-500 gap-1">
                        <span>Last: {formatDate(employee.lastReview)}</span>
                        <span>Next: {formatDate(employee.nextReview)}</span>
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
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                <span>Performance Reviews</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <div className="hidden sm:block">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[150px]">Employee</TableHead>
                        <TableHead className="min-w-[100px]">Position</TableHead>
                        <TableHead className="min-w-[100px]">Overall Score</TableHead>
                        <TableHead className="min-w-[90px]">Last Review</TableHead>
                        <TableHead className="min-w-[90px]">Next Review</TableHead>
                        <TableHead className="min-w-[80px]">Status</TableHead>
                        <TableHead className="min-w-[70px] text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {employees.map((employee) => (
                        <TableRow key={employee.id}>
                          <TableCell>
                            <div className="flex items-center space-x-2 sm:space-x-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={employee.avatar || "/placeholder.svg"} alt={employee.name} />
                                <AvatarFallback className="bg-purple-100 text-purple-600 text-xs">
                                  {getInitials(employee.name)}
                                </AvatarFallback>
                              </Avatar>
                              <div className="min-w-0">
                                <p className="font-medium text-sm truncate">{employee.name}</p>
                                <p className="text-xs text-gray-600 truncate">{employee.department}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm">{employee.position}</TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-1 sm:space-x-2">
                              {getScoreIcon(employee.overallScore)}
                              <span className={`font-medium text-sm ${getScoreColor(employee.overallScore)}`}>
                                {formatFixed1(employee.overallScore)}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-sm whitespace-nowrap">{formatDate(employee.lastReview)}</TableCell>
                          <TableCell className="text-sm whitespace-nowrap">{formatDate(employee.nextReview)}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={getStatusColor(employee.status) + " text-xs"}>
                              {employee.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex justify-end space-x-1">
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
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Mobile View for Reviews */}
                <div className="sm:hidden divide-y">
                  {employees.map((employee) => (
                    <div key={employee.id} className="p-3">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start space-x-2 min-w-0 flex-1">
                          <Avatar className="h-10 w-10 flex-shrink-0">
                            <AvatarImage src={employee.avatar || "/placeholder.svg"} alt={employee.name} />
                            <AvatarFallback className="bg-purple-100 text-purple-600 text-sm">
                              {getInitials(employee.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-sm truncate">{employee.name}</p>
                            <p className="text-xs text-gray-600 truncate">{employee.position} • {employee.department}</p>
                            <div className="flex items-center space-x-2 mt-1">
                              <div className="flex items-center space-x-1">
                                {getScoreIcon(employee.overallScore)}
                                <span className={`font-medium text-sm ${getScoreColor(employee.overallScore)}`}>
                                  {formatFixed1(employee.overallScore)}
                                </span>
                              </div>
                              <Badge variant="outline" className={getStatusColor(employee.status) + " text-xs"}>
                                {employee.status}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                              <span>Last: {formatDate(employee.lastReview)}</span>
                              <span>Next: {formatDate(employee.nextReview)}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="relative">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            onClick={() => setMobileActionMenu(mobileActionMenu === employee.id ? null : employee.id)}
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                          
                          {mobileActionMenu === employee.id && (
                            <div className="absolute right-0 top-8 bg-white border rounded-lg shadow-lg z-10 min-w-[120px]">
                              <Button
                                variant="ghost"
                                className="w-full justify-start text-xs h-8"
                                onClick={() => {
                                  setSelectedReview(employee)
                                  setShowViewReviewDialog(true)
                                  setMobileActionMenu(null)
                                }}
                              >
                                <Eye className="h-3 w-3 mr-2" />
                                View
                              </Button>
                              <Button
                                variant="ghost"
                                className="w-full justify-start text-xs h-8"
                                onClick={() => {
                                  setSelectedReview({ ...employee })
                                  setShowEditReviewDialog(true)
                                  setMobileActionMenu(null)
                                }}
                              >
                                <Edit className="h-3 w-3 mr-2" />
                                Edit
                              </Button>
                              <Button
                                variant="ghost"
                                className="w-full justify-start text-xs h-8"
                                onClick={() => {
                                  // Download functionality
                                  setMobileActionMenu(null)
                                }}
                              >
                                <Download className="h-3 w-3 mr-2" />
                                Download
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4 sm:space-y-6">
          {/* Performance Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                  <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                  <span>KPI Performance Trends</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4">
                  {kpiCategories.map((kpi) => {
                    const avgScore =
                      employees.reduce((sum, emp) => sum + getKpiVal(emp, kpi.id as any), 0) /
                      (employees.length || 1)
                    return (
                      <div key={kpi.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <div className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${kpi.color}`}></div>
                          <span className="text-xs sm:text-sm font-medium truncate">{kpi.name}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Progress value={(avgScore / 5) * 100} className="w-16 sm:w-20 h-1.5 sm:h-2" />
                          <span className="text-xs sm:text-sm font-medium w-6 sm:w-8 text-right">{formatFixed1(avgScore)}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-base sm:text-lg">
                  <Award className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                  <span>Top Performers</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 sm:space-y-3">
                  {[...employees]
                    .sort((a, b) => b.overallScore - a.overallScore)
                    .slice(0, 3)
                    .map((employee, index) => (
                      <div key={employee.id} className="flex items-center space-x-2 sm:space-x-3 p-2 bg-gray-50 rounded-lg">
                        <div
                          className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${
                            index === 0 ? "bg-yellow-500" : index === 1 ? "bg-gray-400" : "bg-orange-500"
                          }`}
                        >
                          {index + 1}
                        </div>
                        <Avatar className="h-7 w-7 sm:h-8 sm:w-8 flex-shrink-0">
                          <AvatarImage src={employee.avatar || "/placeholder.svg"} alt={employee.name} />
                          <AvatarFallback className="bg-purple-100 text-purple-600 text-xs">
                            {getInitials(employee.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-xs sm:text-sm truncate">{employee.name}</p>
                          <p className="text-xs text-gray-600 truncate">{employee.position}</p>
                        </div>
                        <span className={`font-bold text-sm sm:text-base ${getScoreColor(employee.overallScore)} flex-shrink-0`}>
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
              <Eye className="h-5 w-5 text-purple-600" />
              <span>Performance Review Details</span>
            </DialogTitle>
          </DialogHeader>
          {selectedReview && (
            <div className="space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center space-x-0 sm:space-x-4 p-3 sm:p-4 bg-gray-50 rounded-lg gap-3">
                <Avatar className="h-12 w-12 flex-shrink-0">
                  <AvatarImage src={selectedReview.avatar || "/placeholder.svg"} alt={selectedReview.name} />
                  <AvatarFallback className="bg-purple-100 text-purple-600">{getInitials(selectedReview.name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-lg break-words">{selectedReview.name}</h3>
                  <p className="text-gray-600 break-words">
                    {selectedReview.position} • {selectedReview.department}
                  </p>
                  <p className="text-sm text-gray-500">Manager: {selectedReview.manager}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-1 sm:space-x-2">
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
                <h4 className="font-semibold text-gray-900 mb-3 text-sm sm:text-base">KPI Breakdown</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4">
                  {(kpiCategoriesBackend.length ? kpiCategoriesBackend.map((k) => ({ id: String(k.id), name: k.name })) : kpiCategories).map((kpi) => (
                    <div key={kpi.id} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-sm sm:text-base">{kpi.name}</span>
                      <div className="flex items-center space-x-2">
                        <Progress
                          value={(getKpiVal(selectedReview, kpi.id as any) / 5) * 100}
                          className="w-12 sm:w-16 h-1.5 sm:h-2"
                        />
                        <span className="font-bold w-6 sm:w-8 text-sm sm:text-base text-right">
                          {formatFixed1(getKpiVal(selectedReview, kpi.id as any))}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Feedback</h4>
                <ul className="text-gray-700 bg-gray-50 p-2 sm:p-3 rounded-lg list-disc ml-4 sm:ml-5 space-y-1">
                  {splitIntoPoints(selectedReview.feedback).map((pt, idx) => (
                    <li key={idx} className="break-words">{pt}.</li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Goals</h4>
                  <ul className="space-y-1 list-disc ml-4 sm:ml-5">
                    {splitArrayIntoPoints(selectedReview.goals).map((goal: string, index: number) => (
                      <li key={index} className="text-xs sm:text-sm text-gray-700 break-words">{goal}.</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">Areas for Improvement</h4>
                  <ul className="space-y-1 list-disc ml-4 sm:ml-5">
                    {splitArrayIntoPoints(selectedReview.improvements).map((improvement: string, index: number) => (
                      <li key={index} className="text-xs sm:text-sm text-gray-700 break-words">{improvement}.</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between text-xs sm:text-sm text-gray-500 pt-3 sm:pt-4 border-t gap-1">
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
              <Edit className="h-5 w-5 text-purple-600" />
              <span>Edit Performance Review</span>
            </DialogTitle>
          </DialogHeader>
          {selectedReview && (
            <div className="space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center space-x-0 sm:space-x-4 p-3 sm:p-4 bg-gray-50 rounded-lg gap-3">
                <Avatar className="h-12 w-12 flex-shrink-0">
                  <AvatarImage src={selectedReview.avatar || "/placeholder.svg"} alt={selectedReview.name} />
                  <AvatarFallback className="bg-purple-100 text-purple-600">{getInitials(selectedReview.name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-lg break-words">{selectedReview.name}</h3>
                  <p className="text-gray-600 break-words">
                    {selectedReview.position} • {selectedReview.department}
                  </p>
                </div>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <h4 className="font-semibold text-gray-900 text-sm sm:text-base">KPI Ratings</h4>
                {(kpiCategoriesBackend.length ? kpiCategoriesBackend.map((k) => ({ id: String(k.id), name: k.name })) : kpiCategories).map((kpi) => (
                  <div key={kpi.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor={`edit-kpi-${kpi.id}`} className="text-sm sm:text-base">{kpi.name}</Label>
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
                <Label htmlFor="edit-feedback" className="text-sm sm:text-base">Overall Feedback</Label>
                <Textarea
                  id="edit-feedback"
                  value={selectedReview.feedback}
                  onChange={(e) => setSelectedReview({ ...selectedReview, feedback: e.target.value })}
                  rows={4}
                  className="text-sm sm:text-base"
                />
              </div>

              <div>
                <Label htmlFor="edit-goals" className="text-sm sm:text-base">Goals for Next Period</Label>
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
                  className="text-sm sm:text-base"
                />
              </div>

              <div>
                <Label htmlFor="edit-improvements" className="text-sm sm:text-base">Areas for Improvement</Label>
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
                  className="text-sm sm:text-base"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-3 sm:pt-4 border-t">
                <Button 
                  disabled={updatingReview}
                  onClick={handleUpdateReview} 
                  className="flex-1 text-sm sm:text-base"
                >
                  <Save className="h-4 w-4 mr-2" />
                  {updatingReview ? 'Saving...' : 'Save Changes'}
                </Button>
                <Button variant="outline" onClick={() => setShowEditReviewDialog(false)} className="flex-1 text-sm sm:text-base">
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