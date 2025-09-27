"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  Clock,
  DollarSign,
  FileText,
  TrendingUp,
  Calendar,
  BarChart3,
  Settings,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Activity,
  PieChart,
  LineChart,
  Target,
} from "lucide-react"
import Link from "next/link"
import { useCallback, useEffect, useMemo, useState } from "react"
import { getBaseUrl } from "@/lib/api-config"

export default function EmploymentManagementPage() {
  const [mounted, setMounted] = useState(false)
  const [loadingStats, setLoadingStats] = useState<boolean>(true)
  const [statsError, setStatsError] = useState<string | null>(null)
  const [stats, setStats] = useState<{
    totalEmployees: number
    presentToday: number
    pendingLeaves: number
    avgPerformance: number | null
    performanceScore?: number | null
    payrollExpensesMonth?: number | null
    documentCompliancePercent?: number | null
    monthlyAttendanceTrend?: { date: string; attendancePercent: number | null }[]
    recentActivities?: { type: string; title: string; meta: string; time: string }[]
    pendingActions?: { title: string; subtitle: string; action: string; type: string }[]
  }>({ totalEmployees: 0, presentToday: 0, pendingLeaves: 0, avgPerformance: null })

  const fetchStats = useCallback(async () => {
    let aborted = false
    try {
      setLoadingStats(true)
      setStatsError(null)
      const candidatePaths = ['/api/hrms/stats', '/hrms/stats', '/api/employers/hrms/stats']
      let success = false
      for (const path of candidatePaths) {
        const url = getBaseUrl(path)
        try {
          const res = await fetch(url, { credentials: 'include' })
          const contentType = res.headers.get('content-type') || ''
          if (!res.ok || !contentType.includes('application/json')) {
            // try next path
            continue
          }
          const json = await res.json()
          if (!json?.success) {
            continue
          }
          if (!aborted) {
            setStats({
              totalEmployees: Number(json.data?.totalEmployees || 0),
              presentToday: Number(json.data?.presentToday || 0),
              pendingLeaves: Number(json.data?.pendingLeaves || 0),
              avgPerformance: json.data?.avgPerformance !== undefined && json.data?.avgPerformance !== null ? Number(json.data?.avgPerformance) : null,
              performanceScore: json.data?.performanceScore !== undefined && json.data?.performanceScore !== null ? Number(json.data?.performanceScore) : (json.data?.avgPerformance ?? null),
              payrollExpensesMonth: json.data?.payrollExpensesMonth !== undefined && json.data?.payrollExpensesMonth !== null ? Number(json.data?.payrollExpensesMonth) : null,
              documentCompliancePercent: json.data?.documentCompliancePercent !== undefined && json.data?.documentCompliancePercent !== null ? Number(json.data?.documentCompliancePercent) : null,
              monthlyAttendanceTrend: Array.isArray(json.data?.monthlyAttendanceTrend) ? json.data.monthlyAttendanceTrend : [],
              recentActivities: Array.isArray(json.data?.recentActivities) ? json.data.recentActivities.slice(0,3) : [],
              pendingActions: Array.isArray(json.data?.pendingActions) ? json.data.pendingActions.slice(0,3) : [],
            })
          }
          success = true
          break
        } catch (e) {
          // continue to next candidate
          // eslint-disable-next-line no-console
          console.warn('Stats path failed:', path, e)
          continue
        }
      }
      if (!success) {
        throw new Error('Stats endpoint not found. Please confirm API route.')
      }
    } catch (err: any) {
      if (!aborted) {
        setStatsError(err?.message || 'Unable to load stats')
        // Fallback demo values to keep UI populated
        setStats({
          totalEmployees: 24,
          presentToday: 22,
          pendingLeaves: 3,
          avgPerformance: 4.2,
          performanceScore: 4.2,
          payrollExpensesMonth: 48250,
          documentCompliancePercent: 87,
          monthlyAttendanceTrend: [
            { date: '2025-01-01', attendancePercent: 93 },
            { date: '2025-02-01', attendancePercent: 95 },
          ],
          recentActivities: [
            { type: 'attendance', title: 'Employee clocked in', meta: 'Attendance', time: '2 min ago' },
            { type: 'payroll', title: 'Monthly payroll processed', meta: 'Payroll', time: '1 hr ago' },
            { type: 'performance', title: 'Review reminder sent', meta: 'Performance', time: '3 hr ago' },
          ],
          pendingActions: [
            { title: '5 Performance Reviews Due', subtitle: 'Due by end of week', action: 'Review', type: 'performance' },
            { title: '3 Leave Requests Pending', subtitle: 'Awaiting approval', action: 'Approve', type: 'leave' },
            { title: '2 Documents Expiring Soon', subtitle: 'Within 30 days', action: 'Update', type: 'documents' },
          ],
        })
      }
    } finally {
      if (!aborted) setLoadingStats(false)
    }
    return () => { aborted = true }
  }, [])

  useEffect(() => {
    setMounted(true)
    fetchStats()
  }, [fetchStats])

  const modules = [
    {
      title: "Employee Management",
      description: "Add, edit, and manage employee information and records",
      icon: Users,
      color: "bg-indigo-500",
      href: "/employers/dashboard/employee-managment/employees",
      features: ["Add new employees", "Edit employee details", "View employee records", "Emergency contacts"],
      status: "active",
    },
    {
      title: "Attendance Management",
      description: "Track employee attendance, manage leave requests, and monitor absenteeism patterns",
      icon: Users,
      color: "bg-blue-500",
      href: "/employers/dashboard/employee-managment/attendance",
      features: ["Manual/Auto attendance", "Leave management", "Attendance reports", "Late arrival tracking"],
      status: "active",
    },
    {
      title: "Time Tracker",
      description: "Monitor work hours, break times, and calculate overtime with GPS location tracking",
      icon: Clock,
      color: "bg-green-500",
      href: "/employers/dashboard/employee-managment/time-tracker",
      features: ["Clock in/out system", "Break time tracking", "GPS location capture", "Overtime detection"],
      status: "active",
    },
    {
      title: "Payroll Management",
      description: "Calculate salaries, generate payslips, and manage tax deductions automatically",
      icon: DollarSign,
      color: "bg-yellow-500",
      href: "/employers/dashboard/employee-managment/payroll",
      features: ["Salary calculation", "Payroll reports", "Tax handling", "Bank transfer integration"],
      status: "active",
    },
    {
      title: "Document Management",
      description: "Securely store and manage employee documents with expiry reminders",
      icon: FileText,
      color: "bg-purple-500",
      href: "/employers/dashboard/employee-managment/documents",
      features: ["Document upload/storage", "Secure access control", "Expiry reminders", "Document categories"],
      status: "active",
    },
    {
      title: "Performance Review",
      description: "Conduct performance evaluations, track KPIs, and manage 360-degree feedback",
      icon: TrendingUp,
      color: "bg-indigo-500",
      href: "/employers/dashboard/employee-managment/performance",
      features: ["KPI tracking", "360-degree feedback", "Performance reports", "Improvement tracking"],
      status: "active",
    },
    
  ]

  const quickStats = useMemo(() => [
    { label: "Total Employees", value: loadingStats && !statsError ? '…' : String(stats.totalEmployees), icon: Users, color: "text-blue-600", change: statsError ? "error" : "live" },
    { label: "Present Today", value: loadingStats && !statsError ? '…' : String(stats.presentToday), icon: CheckCircle, color: "text-green-600", change: statsError ? "error" : "live" },
    { label: "Pending Leave", value: loadingStats && !statsError ? '…' : String(stats.pendingLeaves), icon: Calendar, color: "text-yellow-600", change: statsError ? "error" : "live" },
    { label: "Avg Performance", value: loadingStats && !statsError ? '…' : (stats.avgPerformance !== null ? String(stats.avgPerformance) : "—"), icon: Target, color: "text-purple-600", change: statsError ? "error" : "+0.0" },
  ], [stats, loadingStats, statsError])

  const formatCurrency = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined || Number.isNaN(amount)) return '—'
    try {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount)
    } catch {
      return `$${Math.round(amount).toLocaleString()}`
    }
  }

  const formatPercent = (value: number | null | undefined) => {
    if (value === null || value === undefined || Number.isNaN(value)) return '—'
    return `${value}%`
  }

  const attendanceAvg = useMemo(() => {
    const arr = (stats.monthlyAttendanceTrend || []).map(x => x.attendancePercent).filter((v): v is number => v !== null && v !== undefined && !Number.isNaN(v))
    if (!arr.length) return null
    const sum = arr.reduce((a, b) => a + b, 0)
    return Math.round((sum / arr.length) * 10) / 10
  }, [stats.monthlyAttendanceTrend])

  const analyticsCards = useMemo(() => [
    { title: "Monthly Attendance Trend", value: loadingStats && !statsError ? '…' : formatPercent(attendanceAvg), change: '', trend: "up", icon: LineChart, color: "bg-blue-500" },
    { title: "Payroll Expenses", value: loadingStats && !statsError ? '…' : formatCurrency(stats.payrollExpensesMonth ?? null), change: '', trend: "up", icon: PieChart, color: "bg-green-500" },
    { title: "Performance Score", value: loadingStats && !statsError ? '…' : (stats.performanceScore !== null && stats.performanceScore !== undefined ? `${stats.performanceScore}` : '—'), change: '', trend: "up", icon: TrendingUp, color: "bg-purple-500" },
    { title: "Document Compliance", value: loadingStats && !statsError ? '…' : formatPercent(stats.documentCompliancePercent ?? null), change: '', trend: (stats.documentCompliancePercent ?? 0) >= 90 ? 'up' : 'down', icon: FileText, color: "bg-orange-500" },
  ], [attendanceAvg, loadingStats, statsError, stats.payrollExpensesMonth, stats.performanceScore, stats.documentCompliancePercent])

  if (!mounted) return null

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Employment Management Analytics</h1>
            <p className="text-blue-100">Comprehensive HR analytics and workforce management tools</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
              <BarChart3 className="h-4 w-4 mr-2" />
              Export Reports
            </Button>
            <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsError && (
          <Card className="md:col-span-2 lg:col-span-4 border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-red-700">{statsError}</p>
                <Button size="sm" variant="outline" className="bg-transparent" onClick={fetchStats} disabled={loadingStats}>Retry</Button>
              </div>
            </CardContent>
          </Card>
        )}
        {quickStats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-gray-100`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Analytics Overview Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {analyticsCards.map((card, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${card.color}`}>
                  <card.icon className="h-5 w-5 text-white" />
                </div>
                <Badge variant={card.trend === "up" ? "default" : "destructive"} className="text-xs">
                  {card.change}
                </Badge>
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">{card.value}</p>
                <p className="text-sm text-gray-600">{card.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module, index) => (
          <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-lg ${module.color}`}>
                  <module.icon className="h-6 w-6 text-white" />
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  {module.status}
                </Badge>
              </div>
              <CardTitle className="text-lg font-semibold mt-3">{module.title}</CardTitle>
              <p className="text-sm text-gray-600 leading-relaxed">{module.description}</p>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Key Features:</h4>
                  <ul className="space-y-1">
                    {module.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="text-xs text-gray-600 flex items-center">
                        <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link href={module.href}>
                  <Button className="w-full mt-4 bg-gray-900 hover:bg-gray-800">
                    Access Module
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Enhanced Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-blue-600" />
              <span>Recent Activities</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Sarah Johnson clocked in</p>
                  <p className="text-xs text-gray-500">2 minutes ago • Attendance</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Monthly payroll processed</p>
                  <p className="text-xs text-gray-500">1 hour ago • Payroll</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <div className="h-2 w-2 bg-yellow-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Performance review reminder sent</p>
                  <p className="text-xs text-gray-500">3 hours ago • Performance</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New document uploaded</p>
                  <p className="text-xs text-gray-500">5 hours ago • Documents</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <span>Pending Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                <div>
                  <p className="text-sm font-medium text-red-800">5 Performance Reviews Due</p>
                  <p className="text-xs text-red-600">Due by end of week</p>
                </div>
                <Button size="sm" variant="outline" className="text-red-600 border-red-300 bg-transparent">
                  Review
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <div>
                  <p className="text-sm font-medium text-yellow-800">3 Leave Requests Pending</p>
                  <p className="text-xs text-yellow-600">Awaiting approval</p>
                </div>
                <Button size="sm" variant="outline" className="text-yellow-600 border-yellow-300 bg-transparent">
                  Approve
                </Button>
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div>
                  <p className="text-sm font-medium text-blue-800">2 Documents Expiring Soon</p>
                  <p className="text-xs text-blue-600">Within 30 days</p>
                </div>
                <Button size="sm" variant="outline" className="text-blue-600 border-blue-300 bg-transparent">
                  Update
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
