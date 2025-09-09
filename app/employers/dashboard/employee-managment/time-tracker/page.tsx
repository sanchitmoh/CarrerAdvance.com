
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
} from "lucide-react"
import Link from "next/link" // Added Link import for navigation
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
import EmployeeDetailsModal from "@/components/employee-details-modal"

export default function TimeTrackerPage() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null)
  const [selectedEmployee, setSelectedEmployee] = useState("")
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [loading, setLoading] = useState(false)

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

  // Pagination state
  const [showAllEmployees, setShowAllEmployees] = useState(false)
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
        const employeeList = await fetchCompanyEmployees()
        setEmployees(employeeList)
      } catch (error) {
        console.error("Failed to fetch employees:", error)
      }
    }
    loadEmployees()
  }, [])

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
      } catch (error) {
        console.error("Failed to fetch time tracking data:", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  // Fetch time records when date changes
  useEffect(() => {
    const loadTimeRecords = async () => {
      try {
        setLoading(true)
        const records = await getTimeRecords(selectedDate, selectedDate)
        setTimeRecords(records)
        // Reset pagination when date changes
        setTimeRecordsPage(1)
      } catch (error) {
        console.error("Failed to fetch time records:", error)
      } finally {
        setLoading(false)
      }
    }
    loadTimeRecords()
  }, [selectedDate])

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
      alert("Please select an employee first")
      return
    }

    try {
      setLoading(true)
      const result = await performClockAction({
        employee_id: parseInt(selectedEmployee),
        action,
        location: "Office", // You can get this from geolocation API
        device_info: navigator.userAgent,
        ip_address: "" // Will be set by backend
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
      } else {
        alert(result.message)
      }
    } catch (error) {
      console.error("Clock action failed:", error)
      alert("Failed to perform clock action")
    } finally {
      setLoading(false)
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

  // Pagination calculations
  const displayedEmployees = showAllEmployees ? employees : employees.slice(0, 5)
  const totalTimeRecordsPages = Math.ceil(timeRecords.length / timeRecordsPerPage)
  const paginatedTimeRecords = timeRecords.slice(
    (timeRecordsPage - 1) * timeRecordsPerPage,
    timeRecordsPage * timeRecordsPerPage
  )

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center space-x-4">
            {" "}
            {/* Added flex container for back button */}
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
              <h1 className="text-2xl font-bold mb-2">Time Tracker</h1>
              <p className="text-green-100">
                Monitor work hours, breaks, and calculate overtime with location tracking
              </p>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-green-100">Current Time</p>
              <p className="text-xl font-mono font-bold">
                {currentTime ? currentTime.toLocaleTimeString() : '--:--:--'}
              </p>
            </div>
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
              <div className="p-2 rounded-lg bg-green-100">
                <Play className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{clockedIn}</p>
                <p className="text-sm text-gray-600">Clocked In</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-yellow-100">
                <Coffee className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{onBreak}</p>
                <p className="text-sm text-gray-600">On Break</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <Timer className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(totalHoursToday)}</p>
                <p className="text-sm text-gray-600">Total Hours Today</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-orange-100">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(totalOvertimeToday)}</p>
                <p className="text-sm text-gray-600">Overtime Hours</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Clock Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-green-600" />
              <span>Quick Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="employee-select">Select Employee</Label>
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

            <div className="grid grid-cols-2 gap-2">
              <Button 
                className="bg-green-600 hover:bg-green-700"
                onClick={() => handleClockAction('clock-in')}
                disabled={loading || !selectedEmployee}
              >
                <Play className="h-4 w-4 mr-2" />
                Clock In
              </Button>
              <Button 
                variant="outline" 
                className="border-red-200 text-red-600 hover:bg-red-50 bg-transparent"
                onClick={() => handleClockAction('clock-out')}
                disabled={loading || !selectedEmployee}
              >
                <Square className="h-4 w-4 mr-2" />
                Clock Out
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button 
                variant="outline" 
                className="border-yellow-200 text-yellow-600 hover:bg-yellow-50 bg-transparent"
                onClick={() => handleClockAction('break-start')}
                disabled={loading || !selectedEmployee}
              >
                <Pause className="h-4 w-4 mr-2" />
                Start Break
              </Button>
              <Button 
                variant="outline" 
                className="border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
                onClick={() => handleClockAction('break-end')}
                disabled={loading || !selectedEmployee}
              >
                <Play className="h-4 w-4 mr-2" />
                End Break
              </Button>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>Location tracking enabled</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Status */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Timer className="h-5 w-5 text-green-600" />
              <span>Employee Status</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`space-y-4 ${showAllEmployees ? 'max-h-96 overflow-y-auto pr-2' : ''}`}>
              {loading ? (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300 animate-spin" />
                  <p>Loading employee status...</p>
                </div>
              ) : employees.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No employees found</p>
                </div>
              ) : (
                <>
                  {displayedEmployees.map((employee) => {
                  const status = getEmployeeStatus(employee.id)
                  const session = activeSessions.find(s => s.employeeId === employee.id)
                  
                  return (
                <div key={employee.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-10 w-10">
                          <AvatarImage 
                            src={employee.image || "/placeholder.svg"} 
                            alt={employee.name} 
                          />
                      <AvatarFallback className="bg-green-100 text-green-600">
                        {employee.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                          <button
                            onClick={() => handleOpenEmployeeDetails(employee)}
                            className="font-medium text-gray-900 hover:text-blue-600 hover:underline cursor-pointer text-left"
                          >
                            {employee.name}
                          </button>
                          <p className="text-sm text-gray-600">{employee.emp_type}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <MapPin className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-500">{session?.location || "Office"}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <Badge
                      variant="outline"
                          className={`${getStatusColor(status)} flex items-center space-x-1`}
                    >
                          {getStatusIcon(status)}
                          <span className="capitalize">{status.replace("-", " ")}</span>
                    </Badge>
                    <div className="text-sm text-gray-600">
                          {session?.clockInTime && <p>In: {session.clockInTime}</p>}
                          {session?.totalWorkHours && <p>Hours: {formatNumber(session.totalWorkHours)}</p>}
                    </div>
                  </div>
                </div>
                  )
                })}
                
                {/* Show More/Less Button */}
                {employees.length > 5 && (
                  <div className="text-center pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setShowAllEmployees(!showAllEmployees)}
                      className="text-green-600 hover:text-green-700 hover:bg-green-50"
                    >
                      {showAllEmployees ? (
                        <>
                          <ArrowLeft className="h-4 w-4 mr-2" />
                          Show Less
                        </>
                      ) : (
                        <>
                          Show More ({employees.length - 5} more)
                          <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                        </>
                      )}
                    </Button>
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
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-green-600" />
            <span>Time Records</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-40"
            />
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Clock In</TableHead>
                  <TableHead>Clock Out</TableHead>
                  <TableHead>Break Time</TableHead>
                  <TableHead>Total Hours</TableHead>
                  <TableHead>Overtime</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                      <Clock className="h-8 w-8 mx-auto mb-2 text-gray-300 animate-spin" />
                      Loading time records...
                    </TableCell>
                  </TableRow>
                ) : timeRecords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                      <Clock className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                      No time records found for this date
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedTimeRecords.map((record) => (
                  <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.emp_name || `Employee ${record.employee_id}`}</TableCell>
                      <TableCell>{formatDate(record.date)}</TableCell>
                      <TableCell>{record.clock_in_time || "-"}</TableCell>
                      <TableCell>{record.clock_out_time || "-"}</TableCell>
                    <TableCell>
                        {record.break_start_time && record.break_end_time 
                          ? `${record.break_start_time} - ${record.break_end_time}`
                          : record.break_start_time 
                            ? `${record.break_start_time} - (ongoing)`
                            : "-"
                        }
                      </TableCell>
                      <TableCell className="font-medium">
                        {record.total_work_hours ? `${formatNumber(record.total_work_hours)}h` : "-"}
                    </TableCell>
                    <TableCell>
                        {record.overtime_hours && record.overtime_hours > 0 ? (
                        <div className="flex items-center space-x-1">
                          <AlertTriangle className="h-4 w-4 text-orange-500" />
                            <span className="text-orange-600 font-medium">{formatNumber(record.overtime_hours)}h</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-green-600">0h</span>
                        </div>
                      )}
                    </TableCell>
                      <TableCell className="text-sm text-gray-600">{record.location || "Office"}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                            record.is_active === 0 ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"
                        }
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
          
          {/* Pagination Controls */}
          {timeRecords.length > timeRecordsPerPage && (
            <div className="flex items-center justify-between px-6 py-4 border-t">
              <div className="text-sm text-gray-700">
                Showing {((timeRecordsPage - 1) * timeRecordsPerPage) + 1} to {Math.min(timeRecordsPage * timeRecordsPerPage, timeRecords.length)} of {timeRecords.length} records
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setTimeRecordsPage(Math.max(1, timeRecordsPage - 1))}
                  disabled={timeRecordsPage === 1}
                >
                  Previous
                </Button>
                
                {/* Page Numbers */}
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalTimeRecordsPages) }, (_, i) => {
                    const pageNum = Math.max(1, Math.min(totalTimeRecordsPages - 4, timeRecordsPage - 2)) + i
                    if (pageNum > totalTimeRecordsPages) return null
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={timeRecordsPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setTimeRecordsPage(pageNum)}
                        className="w-8 h-8 p-0"
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
                >
                  Next
                </Button>
              </div>
            </div>
          )}
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
