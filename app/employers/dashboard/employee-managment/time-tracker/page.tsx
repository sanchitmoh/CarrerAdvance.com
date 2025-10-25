"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Clock,
  Play,
  Pause,
  Square,
  MapPin,
  Calendar,
  TrendingUp,
  Download,
  Filter,
  Timer,
  Coffee,
  AlertTriangle,
  CheckCircle,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react"
import Link from "next/link"
import {
  getActiveSessions,
  getTimeRecords,
  performClockAction,
  getTodaySummary,
  transformTimeRecordToSession,
  getCurrentTimeStatus,
  type TimeTrackingSession,
  type TimeRecord,
  type ClockAction,
  type TimeTrackingStatus
} from "@/lib/time-tracking-api"
import { fetchCompanyEmployees, type CompanyEmployee } from "@/lib/hrms-api"
import { useToast } from "@/hooks/use-toast"
import { Loader2 } from "lucide-react"

// Employee Details Modal Component - Made mobile responsive
function EmployeeDetailsModal({
  isOpen,
  onClose,
  employee,
  activeSession,
  timeRecords,
  onClockAction
}: {
  isOpen: boolean
  onClose: () => void
  employee: CompanyEmployee | null
  activeSession?: TimeTrackingSession
  timeRecords: TimeRecord[]
  onClockAction: (employeeId: number, action: string) => void
}) {
  if (!isOpen || !employee) return null

  const status = activeSession ? getCurrentTimeStatus({
    id: activeSession.id,
    employee_id: activeSession.employeeId,
    company_id: 0,
    date: activeSession.date,
    clock_in_time: activeSession.clockInTime,
    clock_out_time: activeSession.clockOutTime,
    break_start_time: activeSession.breakStartTime,
    break_end_time: activeSession.breakEndTime,
    total_work_hours: activeSession.totalWorkHours,
    total_break_hours: activeSession.totalBreakHours,
    overtime_hours: activeSession.overtimeHours,
    is_active: session.isActive ? 1 : 0,
    created_at: '',
    updated_at: ''
  }) : 'clocked-out'

  const getStatusColor = (status: string) => {
    switch (status) {
      case "clocked-in":
        return "bg-green-100 text-green-800 border-green-200"
      case "clocked-out":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "on-break":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header - Mobile responsive */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b bg-gradient-to-r from-green-600 to-emerald-600 text-white">
          <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
            <Avatar className="h-10 w-10 sm:h-12 sm:w-12 border-2 border-white/20">
              <AvatarImage
                src={employee.image || "/placeholder.svg"}
                alt={employee.name}
              />
              <AvatarFallback className="bg-white/20 text-white text-sm sm:text-base">
                {employee.name.split(" ").map((n) => n[0]).join("")}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg sm:text-xl font-bold truncate">{employee.name}</h2>
              <p className="text-green-100 text-sm truncate">{employee.emp_type}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/20 h-8 w-8 sm:h-10 sm:w-10 p-0 flex-shrink-0"
          >
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>

        {/* Content - Scrollable on mobile */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Current Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-600">Current Status</h3>
                  <Badge
                    variant="outline"
                    className={`${getStatusColor(status)} flex items-center space-x-2 text-sm px-3 py-1.5 w-fit`}
                  >
                    <span className="capitalize">{status.replace("-", " ")}</span>
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 sm:p-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-gray-600">Today's Hours</h3>
                  <p className="text-xl font-bold text-gray-900">
                    {activeSession?.totalWorkHours ? `${activeSession.totalWorkHours.toFixed(1)}h` : "0h"}
                  </p>
                  {activeSession?.overtimeHours && activeSession.overtimeHours > 0 && (
                    <p className="text-sm text-orange-600">
                      +{activeSession.overtimeHours.toFixed(1)}h overtime
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions - Stack on mobile */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <Button
                  className="bg-green-600 hover:bg-green-700 text-xs sm:text-sm h-9 sm:h-10"
                  onClick={() => onClockAction(employee.id, 'clock-in')}
                  disabled={status === 'clocked-in' || status === 'on-break'}
                >
                  <Play className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  Clock In
                </Button>
                <Button
                  variant="outline"
                  className="border-red-200 text-red-600 hover:bg-red-50 text-xs sm:text-sm h-9 sm:h-10"
                  onClick={() => onClockAction(employee.id, 'clock-out')}
                  disabled={status === 'clocked-out'}
                >
                  <Square className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  Clock Out
                </Button>
                <Button
                  variant="outline"
                  className="border-yellow-200 text-yellow-600 hover:bg-yellow-50 text-xs sm:text-sm h-9 sm:h-10"
                  onClick={() => onClockAction(employee.id, 'break-start')}
                  disabled={status !== 'clocked-in'}
                >
                  <Pause className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  Start Break
                </Button>
                <Button
                  variant="outline"
                  className="border-blue-200 text-blue-600 hover:bg-blue-50 text-xs sm:text-sm h-9 sm:h-10"
                  onClick={() => onClockAction(employee.id, 'break-end')}
                  disabled={status !== 'on-break'}
                >
                  <Play className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  End Break
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Session Details */}
          {activeSession && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base sm:text-lg">Current Session</CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0 space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Clock In</p>
                    <p className="font-medium">{activeSession.clockInTime}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Location</p>
                    <p className="font-medium flex items-center space-x-1">
                      <MapPin className="h-3 w-3" />
                      <span>{activeSession.location || "Office"}</span>
                    </p>
                  </div>
                  {activeSession.breakStartTime && (
                    <div>
                      <p className="text-gray-600">Break Start</p>
                      <p className="font-medium">{activeSession.breakStartTime}</p>
                    </div>
                  )}
                  {activeSession.totalBreakHours > 0 && (
                    <div>
                      <p className="text-gray-600">Break Time</p>
                      <p className="font-medium">{activeSession.totalBreakHours.toFixed(1)}h</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recent Records */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base sm:text-lg">Recent Time Records</CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-6 pt-0">
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {timeRecords
                  .filter(record => record.employee_id === employee.id)
                  .slice(0, 5)
                  .map((record) => (
                    <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{record.date}</p>
                        <p className="text-xs text-gray-600">
                          {record.clock_in_time} - {record.clock_out_time || 'Present'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{record.total_work_hours?.toFixed(1)}h</p>
                        {record.overtime_hours > 0 && (
                          <p className="text-xs text-orange-600">+{record.overtime_hours.toFixed(1)}h OT</p>
                        )}
                      </div>
                    </div>
                  ))}

                {timeRecords.filter(record => record.employee_id === employee.id).length === 0 && (
                  <p className="text-center text-gray-500 py-4 text-sm">No recent records found</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function TimeTrackerPage() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null)
  const [selectedEmployee, setSelectedEmployee] = useState("")
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const { toast } = useToast()

  // Helper function to format dates consistently
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  // Helper function to safely format numbers with decimal places
  const formatNumber = (value: any, decimals: number = 1): string => {
    if (value === null || value === undefined || value === '') {
      return '0'
    }
    const num = typeof value === 'string' ? parseFloat(value) : value
    if (isNaN(num)) {
      return '0'
    }
    return num.toFixed(decimals)
  }

  // Real data from APIs
  const [employees, setEmployees] = useState<CompanyEmployee[]>([])
  const [activeSessions, setActiveSessions] = useState<TimeTrackingSession[]>([])
  const [timeRecords, setTimeRecords] = useState<TimeRecord[]>([])
  const [todaySummary, setTodaySummary] = useState({
    clocked_in_count: 0,
    on_break_count: 0,
    clocked_out_count: 0,
    total_hours_today: 0,
    total_overtime_today: 0
  })

  // Employee details modal state
  const [selectedEmployeeForDetails, setSelectedEmployeeForDetails] = useState<CompanyEmployee | null>(null)
  const [isEmployeeDetailsOpen, setIsEmployeeDetailsOpen] = useState(false)

  // Pagination state for Employee Status
  const [employeeStatusPage, setEmployeeStatusPage] = useState(1)
  const [employeeStatusPerPage] = useState(5)

  // Pagination state for Time Records
  const [timeRecordsPage, setTimeRecordsPage] = useState(1)
  const [timeRecordsPerPage] = useState(10)

  // Update current time every second (client-side only to avoid hydration mismatch)
  useEffect(() => {
    // Set initial time only on client side
    setCurrentTime(new Date())

    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Fetch employees on component mount
  useEffect(() => {
    const loadEmployees = async () => {
      try {
        setLoading(true)
        const employeeList = await fetchCompanyEmployees()
        setEmployees(employeeList)
        toast({
          title: "Employees Loaded",
          description: "Employee data has been loaded successfully.",
          variant: "default",
        })
      } catch (error) {
        console.error("Failed to fetch employees:", error)
        toast({
          title: "Loading Failed",
          description: "Failed to load employee data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    loadEmployees()
  }, [toast])

  // Fetch active sessions and today's summary
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [sessions, summary] = await Promise.all([
          getActiveSessions(),
          getTodaySummary()
        ])
        setActiveSessions(sessions)
        setTodaySummary(summary)
        toast({
          title: "Time Data Loaded",
          description: "Time tracking data has been updated.",
          variant: "default",
        })
      } catch (error) {
        console.error("Failed to fetch time tracking data:", error)
        toast({
          title: "Loading Failed",
          description: "Failed to load time tracking data. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [toast])

  // Fetch time records when date changes
  useEffect(() => {
    const loadTimeRecords = async () => {
      try {
        setLoading(true)
        const records = await getTimeRecords(selectedDate, selectedDate)
        setTimeRecords(records)
        // Reset pagination when date changes
        setTimeRecordsPage(1)
        toast({
          title: "Records Updated",
          description: `Time records for ${formatDate(selectedDate)} have been loaded.`,
          variant: "default",
        })
      } catch (error) {
        console.error("Failed to fetch time records:", error)
        toast({
          title: "Loading Failed",
          description: "Failed to load time records. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }
    loadTimeRecords()
  }, [selectedDate, toast])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "clocked-in":
        return "bg-green-100 text-green-800"
      case "clocked-out":
        return "bg-gray-100 text-gray-800"
      case "on-break":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "clocked-in":
        return <Play className="h-4 w-4" />
      case "clocked-out":
        return <Square className="h-4 w-4" />
      case "on-break":
        return <Pause className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  // Clock action handler
  const handleClockAction = async (action: ClockAction) => {
    if (!selectedEmployee) {
      toast({
        title: "Action Failed",
        description: "Please select an employee first.",
        variant: "destructive",
      })
      return
    }

    try {
      setActionLoading(action)
      const result = await performClockAction({
        employee_id: parseInt(selectedEmployee),
        action,
        location: "Office",
        device_info: navigator.userAgent,
        ip_address: ""
      })

      if (result.success) {
        // Refresh data after successful action
        const [sessions, summary] = await Promise.all([
          getActiveSessions(),
          getTodaySummary()
        ])
        setActiveSessions(sessions)
        setTodaySummary(summary)

        // Also refresh time records if viewing today
        if (selectedDate === new Date().toISOString().split("T")[0]) {
          const records = await getTimeRecords(selectedDate, selectedDate)
          setTimeRecords(records)
        }

        const employeeName = employees.find(emp => emp.id === parseInt(selectedEmployee))?.name || "Employee"
        
        toast({
          title: "Action Successful",
          description: `${employeeName} has been ${getActionDescription(action)} successfully.`,
          variant: "default",
        })
      } else {
        throw new Error(result.message || "Action failed")
      }
    } catch (error) {
      console.error("Clock action failed:", error)
      toast({
        title: "Action Failed",
        description: (error as Error)?.message || "Failed to perform clock action. Please try again.",
        variant: "destructive",
      })
    } finally {
      setActionLoading(null)
    }
  }

  // Helper function to get action description
  const getActionDescription = (action: string) => {
    switch (action) {
      case 'clock-in':
        return 'clocked in'
      case 'clock-out':
        return 'clocked out'
      case 'break-start':
        return 'started break'
      case 'break-end':
        return 'ended break'
      default:
        return 'updated'
    }
  }

  // Handle opening employee details modal
  const handleOpenEmployeeDetails = (employee: CompanyEmployee) => {
    setSelectedEmployeeForDetails(employee)
    setIsEmployeeDetailsOpen(true)
  }

  // Get employee status from active sessions
  const getEmployeeStatus = (employeeId: number): TimeTrackingStatus => {
    const session = activeSessions.find(s => s.employeeId === employeeId)
    if (!session) return 'clocked-out'
    return getCurrentTimeStatus({
      id: session.id,
      employee_id: session.employeeId,
      company_id: 0,
      date: session.date,
      clock_in_time: session.clockInTime,
      clock_out_time: session.clockOutTime,
      break_start_time: session.breakStartTime,
      break_end_time: session.breakEndTime,
      total_work_hours: session.totalWorkHours,
      total_break_hours: session.totalBreakHours,
      overtime_hours: session.overtimeHours,
      is_active: session.isActive ? 1 : 0,
      created_at: '',
      updated_at: ''
    })
  }

  // Statistics from real data
  const totalEmployees = employees.length
  const clockedIn = todaySummary.clocked_in_count
  const onBreak = todaySummary.on_break_count
  const clockedOut = todaySummary.clocked_out_count

  const totalHoursToday = typeof todaySummary.total_hours_today === 'number'
    ? todaySummary.total_hours_today
    : parseFloat(todaySummary.total_hours_today) || 0
  const totalOvertimeToday = typeof todaySummary.total_overtime_today === 'number'
    ? todaySummary.total_overtime_today
    : parseFloat(todaySummary.total_overtime_today) || 0

  // Pagination calculations for Employee Status
  const totalEmployeeStatusPages = Math.ceil(employees.length / employeeStatusPerPage)
  const paginatedEmployees = employees.slice(
    (employeeStatusPage - 1) * employeeStatusPerPage,
    employeeStatusPage * employeeStatusPerPage
  )

  // Pagination calculations for Time Records
  const totalTimeRecordsPages = Math.ceil(timeRecords.length / timeRecordsPerPage)
  const paginatedTimeRecords = timeRecords.slice(
    (timeRecordsPage - 1) * timeRecordsPerPage,
    timeRecordsPage * timeRecordsPerPage
  )

  return (
    <div className="max-w-7xl mx-auto space-y-6 px-4 sm:px-6 lg:px-8 py-4">
      {/* Global Loader Overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 flex flex-col items-center space-y-4 shadow-2xl">
            <Loader2 className="h-8 w-8 animate-spin text-green-600" />
            <p className="text-lg font-medium text-gray-900">Loading Time Tracker Data...</p>
            <p className="text-sm text-gray-600">Please wait while we fetch the latest information</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-4 sm:p-6 text-white">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          {/* Left section - Back button and title */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1 w-full">
            <Link href="/employers/dashboard/employee-managment" className="w-full sm:w-auto">
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30 text-xs sm:text-sm w-full sm:w-auto justify-center sm:justify-start"
              >
                <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                Back to Employment
              </Button>
            </Link>
            <div className="text-center sm:text-left w-full sm:w-auto mt-2 sm:mt-0">
              <h1 className="text-xl sm:text-2xl font-bold mb-1">Time Tracker</h1>
              <p className="text-green-100 text-sm sm:text-base">
                Monitor work hours, breaks, and calculate overtime with location tracking
              </p>
            </div>
          </div>

          {/* Right section - Time and Export button */}
          <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-end gap-3 sm:gap-4 w-full sm:w-auto">
            <div className="flex items-center gap-3 bg-white/10 rounded-lg px-3 sm:px-4 py-2 sm:py-2.5 w-full sm:w-auto justify-center">
              <p className="text-sm text-green-100 whitespace-nowrap">Current Time</p>
              <p className="text-lg sm:text-xl font-mono font-bold bg-white/10 px-2 sm:px-3 py-1 rounded">
                {currentTime ? currentTime.toLocaleTimeString() : '--:--:--'}
              </p>
            </div>
            <Button 
              variant="secondary" 
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 text-xs sm:text-sm whitespace-nowrap w-full sm:w-auto justify-center"
              disabled={loading}
            >
              <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              Export Report
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-1.5 sm:p-2 rounded-lg bg-green-100">
                <Play className="h-4 w-4 sm:h-6 sm:w-6 text-green-600" />
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{clockedIn}</p>
                <p className="text-xs sm:text-sm text-gray-600">Clocked In</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-1.5 sm:p-2 rounded-lg bg-yellow-100">
                <Coffee className="h-4 w-4 sm:h-6 sm:w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{onBreak}</p>
                <p className="text-xs sm:text-sm text-gray-600">On Break</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-1.5 sm:p-2 rounded-lg bg-blue-100">
                <Timer className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{formatNumber(totalHoursToday)}</p>
                <p className="text-xs sm:text-sm text-gray-600">Total Hours Today</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-3 sm:p-4">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="p-1.5 sm:p-2 rounded-lg bg-orange-100">
                <TrendingUp className="h-4 w-4 sm:h-6 sm:w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{formatNumber(totalOvertimeToday)}</p>
                <p className="text-xs sm:text-sm text-gray-600">Overtime Hours</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Quick Clock Actions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
              <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
              <span>Quick Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 sm:space-y-4">
            <div>
              <Label htmlFor="employee-select" className="text-sm sm:text-base">Select Employee</Label>
              <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                <SelectTrigger className="text-sm sm:text-base">
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

            <div className="grid grid-cols-2 gap-2">
              <Button
                className="bg-green-600 hover:bg-green-700 text-xs sm:text-sm h-9 sm:h-10"
                onClick={() => handleClockAction('clock-in')}
                disabled={loading || actionLoading !== null || !selectedEmployee}
              >
                {actionLoading === 'clock-in' ? (
                  <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 animate-spin" />
                ) : (
                  <Play className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                )}
                {actionLoading === 'clock-in' ? 'Processing...' : 'Clock In'}
              </Button>
              <Button
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50 bg-transparent text-xs sm:text-sm h-9 sm:h-10"
                onClick={() => handleClockAction('clock-out')}
                disabled={loading || actionLoading !== null || !selectedEmployee}
              >
                {actionLoading === 'clock-out' ? (
                  <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 animate-spin" />
                ) : (
                  <Square className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                )}
                {actionLoading === 'clock-out' ? 'Processing...' : 'Clock Out'}
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                className="border-yellow-200 text-yellow-600 hover:bg-yellow-50 bg-transparent text-xs sm:text-sm h-9 sm:h-10"
                onClick={() => handleClockAction('break-start')}
                disabled={loading || actionLoading !== null || !selectedEmployee}
              >
                {actionLoading === 'break-start' ? (
                  <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 animate-spin" />
                ) : (
                  <Pause className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                )}
                {actionLoading === 'break-start' ? 'Processing...' : 'Start Break'}
              </Button>
              <Button
                variant="outline"
                className="border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent text-xs sm:text-sm h-9 sm:h-10"
                onClick={() => handleClockAction('break-end')}
                disabled={loading || actionLoading !== null || !selectedEmployee}
              >
                {actionLoading === 'break-end' ? (
                  <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 animate-spin" />
                ) : (
                  <Play className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                )}
                {actionLoading === 'break-end' ? 'Processing...' : 'End Break'}
              </Button>
            </div>

            <div className="pt-3 sm:pt-4 border-t">
              <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-600">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>Location tracking enabled</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Status */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
              <Timer className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
              <span>Employee Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-2 sm:p-6">
            <div className="space-y-3 sm:space-y-4">
              {loading ? (
                <div className="text-center py-6 sm:py-8 text-gray-500">
                  <Loader2 className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 text-gray-300 animate-spin" />
                  <p className="text-sm sm:text-base">Loading employee status...</p>
                </div>
              ) : employees.length === 0 ? (
                <div className="text-center py-6 sm:py-8 text-gray-500">
                  <Clock className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-3 sm:mb-4 text-gray-300" />
                  <p className="text-sm sm:text-base">No employees found</p>
                </div>
              ) : (
                <>
                  {paginatedEmployees.map((employee) => {
                    const status = getEmployeeStatus(employee.id)
                    const session = activeSessions.find(s => s.employeeId === employee.id)

                    return (
                      <div key={employee.id} className="flex items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
                          <Avatar className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
                            <AvatarImage
                              src={employee.image || "/placeholder.svg"}
                              alt={employee.name}
                            />
                            <AvatarFallback className="bg-green-100 text-green-600 text-xs sm:text-sm">
                              {employee.name.split(" ").map((n) => n[0]).join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0 flex-1">
                            <button
                              onClick={() => handleOpenEmployeeDetails(employee)}
                              className="font-medium text-gray-900 hover:text-blue-600 hover:underline cursor-pointer text-left text-sm sm:text-base truncate block w-full text-start"
                            >
                              {employee.name}
                            </button>
                            <p className="text-xs sm:text-sm text-gray-600 truncate">{employee.emp_type}</p>
                            <div className="flex items-center space-x-1 sm:space-x-2 mt-0.5 sm:mt-1">
                              <MapPin className="h-3 w-3 text-gray-400 flex-shrink-0" />
                              <span className="text-xs text-gray-500 truncate">{session?.location || "Office"}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right space-y-1 sm:space-y-2 ml-2 flex-shrink-0">
                          <Badge
                            variant="outline"
                            className={`${getStatusColor(status)} flex items-center space-x-1 text-xs px-2 py-0.5 sm:px-2 sm:py-1`}
                          >
                            {getStatusIcon(status)}
                            <span className="capitalize hidden xs:inline">{status.replace("-", " ")}</span>
                          </Badge>
                          <div className="text-xs sm:text-sm text-gray-600">
                            {session?.clockInTime && <p className="whitespace-nowrap">In: {session.clockInTime}</p>}
                            {session?.totalWorkHours && <p className="whitespace-nowrap">Hours: {formatNumber(session.totalWorkHours)}</p>}
                          </div>
                        </div>
                      </div>
                    )
                  })}

                  {/* Employee Status Pagination */}
                  {employees.length > employeeStatusPerPage && (
                    <div className="flex flex-col sm:flex-row items-center justify-between px-3 sm:px-6 py-3 border-t space-y-2 sm:space-y-0">
                      <div className="text-xs sm:text-sm text-gray-700 text-center sm:text-left">
                        Showing {((employeeStatusPage - 1) * employeeStatusPerPage) + 1} to {Math.min(employeeStatusPage * employeeStatusPerPage, employees.length)} of {employees.length} employees
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEmployeeStatusPage(Math.max(1, employeeStatusPage - 1))}
                          disabled={employeeStatusPage === 1}
                          className="h-8 px-2 text-xs"
                        >
                          <ChevronLeft className="h-3 w-3 mr-1" />
                          Prev
                        </Button>

                        {/* Page Numbers */}
                        <div className="flex items-center space-x-1">
                          {Array.from({ length: Math.min(3, totalEmployeeStatusPages) }, (_, i) => {
                            const pageNum = Math.max(1, Math.min(totalEmployeeStatusPages - 2, employeeStatusPage - 1)) + i
                            if (pageNum > totalEmployeeStatusPages) return null

                            return (
                              <Button
                                key={pageNum}
                                variant={employeeStatusPage === pageNum ? "default" : "outline"}
                                size="sm"
                                onClick={() => setEmployeeStatusPage(pageNum)}
                                className="h-8 w-8 p-0 text-xs"
                              >
                                {pageNum}
                              </Button>
                            )
                          })}
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEmployeeStatusPage(Math.min(totalEmployeeStatusPages, employeeStatusPage + 1))}
                          disabled={employeeStatusPage === totalEmployeeStatusPages}
                          className="h-8 px-2 text-xs"
                        >
                          Next
                          <ChevronRight className="h-3 w-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Time Records */}
      <Card>
        <CardHeader className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row items-start sm:items-center justify-between pb-3">
          <CardTitle className="flex items-center space-x-2 text-lg sm:text-xl">
            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
            <span>Time Records</span>
          </CardTitle>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 w-full sm:w-auto">
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full sm:w-40 text-sm"
              disabled={loading}
            />
            <Button variant="outline" size="sm" className="text-xs sm:text-sm" disabled={loading}>
              <Filter className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-2 sm:p-6">
          <div className="rounded-md border overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-xs sm:text-sm px-2 sm:px-4 py-3 whitespace-nowrap">Employee</TableHead>
                    <TableHead className="text-xs sm:text-sm px-2 sm:px-4 py-3 whitespace-nowrap hidden sm:table-cell">Date</TableHead>
                    <TableHead className="text-xs sm:text-sm px-2 sm:px-4 py-3 whitespace-nowrap">Clock In</TableHead>
                    <TableHead className="text-xs sm:text-sm px-2 sm:px-4 py-3 whitespace-nowrap hidden xs:table-cell">Clock Out</TableHead>
                    <TableHead className="text-xs sm:text-sm px-2 sm:px-4 py-3 whitespace-nowrap hidden lg:table-cell">Break Time</TableHead>
                    <TableHead className="text-xs sm:text-sm px-2 sm:px-4 py-3 whitespace-nowrap">Total Hours</TableHead>
                    <TableHead className="text-xs sm:text-sm px-2 sm:px-4 py-3 whitespace-nowrap hidden md:table-cell">Overtime</TableHead>
                    <TableHead className="text-xs sm:text-sm px-2 sm:px-4 py-3 whitespace-nowrap hidden xl:table-cell">Location</TableHead>
                    <TableHead className="text-xs sm:text-sm px-2 sm:px-4 py-3 whitespace-nowrap">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-6 sm:py-8 text-gray-500 px-4">
                        <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 text-gray-300 animate-spin" />
                        <p className="text-sm sm:text-base">Loading time records...</p>
                      </TableCell>
                    </TableRow>
                  ) : timeRecords.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-6 sm:py-8 text-gray-500 px-4">
                        <Clock className="h-6 w-6 sm:h-8 sm:w-8 mx-auto mb-2 text-gray-300" />
                        <p className="text-sm sm:text-base">No time records found for this date</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedTimeRecords.map((record) => (
                      <TableRow key={record.id} className="text-xs sm:text-sm">
                        <TableCell className="font-medium px-2 sm:px-4 py-2 whitespace-nowrap truncate max-w-[100px] sm:max-w-none">
                          {record.emp_name || `Employee ${record.employee_id}`}
                        </TableCell>
                        <TableCell className="px-2 sm:px-4 py-2 whitespace-nowrap hidden sm:table-cell">
                          {formatDate(record.date)}
                        </TableCell>
                        <TableCell className="px-2 sm:px-4 py-2 whitespace-nowrap">
                          {record.clock_in_time || "-"}
                        </TableCell>
                        <TableCell className="px-2 sm:px-4 py-2 whitespace-nowrap hidden xs:table-cell">
                          {record.clock_out_time || "-"}
                        </TableCell>
                        <TableCell className="px-2 sm:px-4 py-2 whitespace-nowrap hidden lg:table-cell">
                          {record.break_start_time && record.break_end_time
                            ? `${record.break_start_time} - ${record.break_end_time}`
                            : record.break_start_time
                              ? `${record.break_start_time} - (ongoing)`
                              : "-"
                          }
                        </TableCell>
                        <TableCell className="font-medium px-2 sm:px-4 py-2 whitespace-nowrap">
                          {record.total_work_hours ? `${formatNumber(record.total_work_hours)}h` : "-"}
                        </TableCell>
                        <TableCell className="px-2 sm:px-4 py-2 whitespace-nowrap hidden md:table-cell">
                          {record.overtime_hours && record.overtime_hours > 0 ? (
                            <div className="flex items-center space-x-1">
                              <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-orange-500" />
                              <span className="text-orange-600 font-medium">{formatNumber(record.overtime_hours)}h</span>
                            </div>
                          ) : (
                            <div className="flex items-center space-x-1">
                              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-500" />
                              <span className="text-green-600">0h</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-gray-600 px-2 sm:px-4 py-2 whitespace-nowrap hidden xl:table-cell">
                          {record.location || "Office"}
                        </TableCell>
                        <TableCell className="px-2 sm:px-4 py-2 whitespace-nowrap">
                          <Badge
                            variant="outline"
                            className={`text-xs ${record.is_active === 0 ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"}`}
                          >
                            {record.is_active === 0 ? "completed" : "active"}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Time Records Pagination Controls */}
            {timeRecords.length > 0 && (
              <div className="flex flex-col sm:flex-row items-center justify-between px-3 sm:px-6 py-3 border-t space-y-2 sm:space-y-0">
                <div className="text-xs sm:text-sm text-gray-700 text-center sm:text-left">
                  Showing {Math.min(1, timeRecords.length)} to {Math.min(timeRecordsPage * timeRecordsPerPage, timeRecords.length)} of {timeRecords.length} records
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTimeRecordsPage(Math.max(1, timeRecordsPage - 1))}
                    disabled={timeRecordsPage === 1}
                    className="h-8 px-2 text-xs"
                  >
                    <ChevronLeft className="h-3 w-3 mr-1" />
                    Prev
                  </Button>

                  {/* Page Numbers */}
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(3, totalTimeRecordsPages) }, (_, i) => {
                      const pageNum = Math.max(1, Math.min(totalTimeRecordsPages - 2, timeRecordsPage - 1)) + i
                      if (pageNum > totalTimeRecordsPages) return null

                      return (
                        <Button
                          key={pageNum}
                          variant={timeRecordsPage === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => setTimeRecordsPage(pageNum)}
                          className="h-8 w-8 p-0 text-xs"
                        >
                          {pageNum}
                        </Button>
                      )
                    })}
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTimeRecordsPage(Math.min(totalTimeRecordsPages, timeRecordsPage + 1))}
                    disabled={timeRecordsPage === totalTimeRecordsPages}
                    className="h-8 px-2 text-xs"
                  >
                    Next
                    <ChevronRight className="h-3 w-3 ml-1" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Employee Details Modal */}
      <EmployeeDetailsModal
        isOpen={isEmployeeDetailsOpen}
        onClose={() => {
          setIsEmployeeDetailsOpen(false)
          setSelectedEmployeeForDetails(null)
        }}
        employee={selectedEmployeeForDetails}
        activeSession={selectedEmployeeForDetails ? activeSessions.find(s => s.employeeId === selectedEmployeeForDetails.id) : undefined}
        timeRecords={timeRecords}
        onClockAction={(employeeId, action) => handleClockAction(action as ClockAction)}
      />
    </div>
  )
}