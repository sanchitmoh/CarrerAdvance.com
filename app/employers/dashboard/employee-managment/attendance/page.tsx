"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Users,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Plus,
  Download,
  Filter,
  UserCheck,
  UserX,
  CalendarDays,
  ArrowLeft,
} from "lucide-react"
import Link from "next/link"
import { 
  fetchAttendance, 
  fetchAttendanceAll, 
  fetchCompanyEmployees, 
  markAttendance, 
  type AttendanceRecord, 
  type AttendanceStatus, 
  type CompanyEmployee, 
  type EmployeeAttendanceRow 
} from "@/lib/hrms-api"
import { getLeaveRequests, type LeaveRequest } from "@/lib/leave-api"
import LeaveApprovalModal from "@/components/leave-approval-modal"

export default function AttendanceManagementPage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [selectedEmployee, setSelectedEmployee] = useState("")
  const [attendanceStatus, setAttendanceStatus] = useState<AttendanceStatus | "">("")
  const [notes, setNotes] = useState("")
  const [viewMode, setViewMode] = useState("daily")
  const [loading, setLoading] = useState(false)
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")

  // Employees from backend (ew_companyemp)
  const [employees, setEmployees] = useState<CompanyEmployee[]>([])
  
  useEffect(() => {
    const run = async () => {
      try {
        const list = await fetchCompanyEmployees()
        setEmployees(list)
        // Default to All Employees view
        if (!selectedEmployee) setSelectedEmployee("all")
      } catch (error) {
        console.error("Failed to fetch employees:", error)
        setEmployees([])
      }
    }
    run()
  }, [selectedEmployee])

  // Attendance data from backend
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])

  // Fetch attendance when employee or date changes (daily view fetch)
  useEffect(() => {
    const run = async () => {
      if (!selectedEmployee) return
      setLoading(true)
      try {
        // Determine date range: use custom if both set, else fallback to selectedDate
        const rangeFrom = fromDate || selectedDate
        const rangeTo = toDate || (fromDate ? fromDate : selectedDate)

        if (selectedEmployee === "all") {
          const rows: EmployeeAttendanceRow[] = await fetchAttendanceAll(rangeFrom, rangeTo)
          const nameById = new Map<number, string>()
          employees.filter(Boolean).forEach((e) => {
            if (e && typeof e.id === 'number') {
              nameById.set(e.id, e.name || `Emp #${e.id}`)
            }
          })
          const mapped: AttendanceRecord[] = rows.map((r) => ({
            id: r.id,
            employeeId: r.companyemp_id,
            employeeName: nameById.get(r.companyemp_id) || `Emp #${r.companyemp_id}`,
            date: r.date,
            status: r.status,
            checkIn: r.check_in_time,
            checkOut: r.check_out_time,
            breakIn: r.break_in_time,
            breakOut: r.break_out_time,
            totalHours: r.total_hours ?? r.hours,
            notes: r.note,
            employeeNotes: r.emp_note,
            employmentType: r.employmentType,
            available: r.available === 1,
          }))
          setAttendanceRecords(mapped)
        } else {
          const emp = employees.find((e) => String(e.id) === String(selectedEmployee))
          let records = await fetchAttendance(Number(selectedEmployee), rangeFrom, rangeTo, emp?.name || "")
          if (!records.length && !fromDate && !toDate) {
            // Fallback: fetch all records for employee if specific date is empty
            records = await fetchAttendance(Number(selectedEmployee), undefined, undefined, emp?.name || "")
          }
          setAttendanceRecords(records)
        }
      } catch (error) {
        console.error("Failed to fetch attendance:", error)
        setAttendanceRecords([])
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [selectedEmployee, selectedDate, employees, fromDate, toDate])

  // Leave requests from backend
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([])
  const [selectedLeaveRequest, setSelectedLeaveRequest] = useState<LeaveRequest | null>(null)
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false)

  // UI: Leave requests show more/less
  const [leaveShowAll, setLeaveShowAll] = useState(false)

  // UI: Attendance records pagination
  const [attendancePage, setAttendancePage] = useState(1)
  const [attendancePerPage] = useState(10)

  // Fetch leave requests
  useEffect(() => {
    const loadLeaveRequests = async () => {
      try {
        const requests = await getLeaveRequests()
        setLeaveRequests(requests)
      } catch (error) {
        console.error("Failed to fetch leave requests:", error)
        setLeaveRequests([])
      }
    }
    loadLeaveRequests()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "bg-green-100 text-green-800"
      case "absent":
        return "bg-red-100 text-red-800"
      case "late":
        return "bg-yellow-100 text-yellow-800"
      case "leave":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "present":
        return <CheckCircle className="h-4 w-4" />
      case "absent":
        return <XCircle className="h-4 w-4" />
      case "late":
        return <AlertTriangle className="h-4 w-4" />
      case "leave":
        return <Calendar className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const handleMarkAttendance = async () => {
    if (!selectedEmployee || !attendanceStatus || selectedEmployee === "all") return

    const employee = employees.find((emp) => emp.id.toString() === selectedEmployee)
    if (!employee) return

    setLoading(true)
    try {
      const res = await markAttendance({
        employee_id: employee.id,
        date: selectedDate,
        status: attendanceStatus as AttendanceStatus,
        checkIn: attendanceStatus === "present" || attendanceStatus === "late" ? "09:00:00" : undefined,
        checkOut: attendanceStatus === "present" || attendanceStatus === "late" ? "17:30:00" : undefined,
        note: notes || undefined,
      })
      if (res?.success) {
        const records = await fetchAttendance(employee.id, selectedDate, selectedDate, employee.name || "")
        setAttendanceRecords(records)
        setSelectedEmployee("")
        setAttendanceStatus("")
        setNotes("")
      }
    } catch (error) {
      console.error("Failed to mark attendance:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleApproveLeave = (approvedRequest: LeaveRequest) => {
    setLeaveRequests(prev => 
      prev.map(req => req.id === approvedRequest.id ? approvedRequest : req)
    )
  }

  const handleRejectLeave = (rejectedRequest: LeaveRequest) => {
    setLeaveRequests(prev => 
      prev.map(req => req.id === rejectedRequest.id ? rejectedRequest : req)
    )
  }

  const openApprovalModal = (request: LeaveRequest) => {
    setSelectedLeaveRequest(request)
    setIsApprovalModalOpen(true)
  }

  const todayStats = useMemo(() => ({
    present: attendanceRecords.filter((r) => r.status === "present").length,
    absent: attendanceRecords.filter((r) => r.status === "absent").length,
    late: attendanceRecords.filter((r) => r.status === "late").length,
    onLeave: attendanceRecords.filter((r) => r.status === "leave").length,
  }), [attendanceRecords])

  // Derived: Leave requests displayed (5 by default)
  const displayedLeaveRequests = leaveShowAll ? leaveRequests : leaveRequests.slice(0, 5)

  // Derived: Attendance pagination
  const totalAttendancePages = Math.ceil(attendanceRecords.length / attendancePerPage) || 1
  const paginatedAttendance = attendanceRecords.slice(
    (attendancePage - 1) * attendancePerPage,
    attendancePage * attendancePerPage
  )

  // Reset attendance pagination when filters change
  useEffect(() => {
    setAttendancePage(1)
  }, [selectedEmployee, selectedDate, fromDate, toDate])

  const handleDateRangeApply = () => {
    // This function triggers the useEffect by changing the dependency values
    // The actual filtering is handled in the useEffect
  }

  const handleDateRangeClear = () => {
    setFromDate("")
    setToDate("")
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
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
              <h1 className="text-2xl font-bold mb-2">Attendance Management</h1>
              <p className="text-blue-100">Track employee attendance, manage leave requests, and monitor patterns</p>
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
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
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{todayStats.present}</p>
                <p className="text-sm text-gray-600">Present Today</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-red-100">
                <UserX className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{todayStats.absent}</p>
                <p className="text-sm text-gray-600">Absent Today</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-yellow-100">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{todayStats.late}</p>
                <p className="text-sm text-gray-600">Late Arrivals</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <CalendarDays className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{todayStats.onLeave}</p>
                <p className="text-sm text-gray-600">On Leave</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Mark Attendance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="h-5 w-5 text-blue-600" />
              <span>Mark Attendance</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input id="date" type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="employee">Employee</Label>
              <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
                <SelectTrigger>
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem key="all" value="all">All Employees</SelectItem>
                  {employees.filter(Boolean).map((employee) => (
                    <SelectItem key={employee.id ?? Math.random()} value={(employee.id ?? '').toString()}>
                      {employee.name} ({employee.emp_code})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={attendanceStatus} onValueChange={(v) => setAttendanceStatus(v as AttendanceStatus)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="present">Present</SelectItem>
                  <SelectItem value="absent">Absent</SelectItem>
                  <SelectItem value="late">Late</SelectItem>
                  <SelectItem value="leave">On Leave</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                placeholder="Add any notes..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={3}
              />
            </div>
            <Button 
              onClick={handleMarkAttendance} 
              className="w-full" 
              disabled={loading || selectedEmployee === "all" || !selectedEmployee || !attendanceStatus}
            >
              {loading ? "Marking..." : "Mark Attendance"}
            </Button>
          </CardContent>
        </Card>

        {/* Leave Requests */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <span>Leave Requests</span>
            </CardTitle>
            <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
              {leaveRequests.filter((req) => req.status === "pending").length} Pending
            </Badge>
          </CardHeader>
          <CardContent>
            <div className={`space-y-4 ${leaveShowAll ? 'max-h-96 overflow-y-auto pr-2' : ''}`}>
              {leaveRequests.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No leave requests found</p>
                </div>
              ) : (
                displayedLeaveRequests.filter(Boolean).map((request) => (
                  <div key={request.id ?? Math.random()} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div>
                          <p className="font-medium text-gray-900">{request.employeeName}</p>
                          <p className="text-sm text-gray-600">{request.leaveType}</p>
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        <p>
                          {new Date(request.applyStartDate).toLocaleDateString()} to {new Date(request.applyEndDate).toLocaleDateString()}
                        </p>
                        <p className="text-xs mt-1">{request.reason}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant="outline"
                        className={
                          request.status === "approved"
                            ? "bg-green-50 text-green-700"
                            : request.status === "rejected"
                              ? "bg-red-50 text-red-700"
                              : "bg-yellow-50 text-yellow-700"
                        }
                      >
                        {request.status}
                      </Badge>
                      {request.status === "pending" && (
                        <div className="flex space-x-1">
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-green-600 hover:bg-green-50 bg-transparent"
                            onClick={() => openApprovalModal(request)}
                          >
                            Approve
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-red-600 hover:bg-red-50 bg-transparent"
                            onClick={() => {
                              setSelectedLeaveRequest(request)
                              setIsApprovalModalOpen(true)
                            }}
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
              {leaveRequests.length > 5 && (
                <div className="text-center">
                  <Button
                    variant="outline"
                    onClick={() => setLeaveShowAll(!leaveShowAll)}
                    className="text-blue-700 hover:text-blue-800 hover:bg-blue-50"
                  >
                    {leaveShowAll ? 'Show Less' : `Show More (${leaveRequests.length - 5} more)`}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Attendance Records */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-blue-600" />
            <span>Attendance Records</span>
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Select value={viewMode} onValueChange={setViewMode}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex items-center space-x-2">
              <Input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="w-40" />
              <span className="text-gray-500">to</span>
              <Input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="w-40" />
              <Button variant="outline" size="sm" onClick={handleDateRangeApply}>
                <Filter className="h-4 w-4 mr-2" />
                Apply
              </Button>
              <Button variant="ghost" size="sm" onClick={handleDateRangeClear}>
                Clear
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <p>Loading attendance records...</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Check In</TableHead>
                    <TableHead>Check Out</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedAttendance.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        No attendance records found
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedAttendance.filter(Boolean).map((record, idx) => (
                      <TableRow key={record.id ?? `${record.employeeId}-${record.date}-${idx}`}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src="/placeholder.svg" alt={record.employeeName} />
                              <AvatarFallback className="bg-blue-100 text-blue-600">
                                {record.employeeName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{record.employeeName}</span>
                          </div>
                        </TableCell>
                        <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={`${getStatusColor(record.status)} flex items-center space-x-1 w-fit`}
                          >
                            {getStatusIcon(record.status)}
                            <span className="capitalize">{record.status}</span>
                          </Badge>
                        </TableCell>
                        <TableCell>{record.checkIn || "-"}</TableCell>
                        <TableCell>{record.checkOut || "-"}</TableCell>
                        <TableCell className="max-w-xs truncate">{record.notes || "-"}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
          {attendanceRecords.length > attendancePerPage && (
            <div className="flex items-center justify-between px-2 py-3 border-t">
              <div className="text-sm text-gray-700">
                Showing {((attendancePage - 1) * attendancePerPage) + 1} to {Math.min(attendancePage * attendancePerPage, attendanceRecords.length)} of {attendanceRecords.length}
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAttendancePage(Math.max(1, attendancePage - 1))}
                  disabled={attendancePage === 1}
                >
                  Previous
                </Button>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalAttendancePages) }, (_, i) => {
                    const pageNum = Math.max(1, Math.min(totalAttendancePages - 4, attendancePage - 2)) + i
                    if (pageNum > totalAttendancePages) return null
                    return (
                      <Button
                        key={pageNum}
                        variant={attendancePage === pageNum ? 'default' : 'outline'}
                        size="sm"
                        className="w-8 h-8 p-0"
                        onClick={() => setAttendancePage(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAttendancePage(Math.min(totalAttendancePages, attendancePage + 1))}
                  disabled={attendancePage === totalAttendancePages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Leave Approval Modal */}
      <LeaveApprovalModal
        isOpen={isApprovalModalOpen}
        onClose={() => {
          setIsApprovalModalOpen(false)
          setSelectedLeaveRequest(null)
        }}
        leaveRequest={selectedLeaveRequest}
        onApprove={handleApproveLeave}
        onReject={handleRejectLeave}
      />
    </div>
  )
}