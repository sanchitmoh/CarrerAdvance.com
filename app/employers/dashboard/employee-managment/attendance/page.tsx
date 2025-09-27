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
  Mail,
  Phone,
  Briefcase,
  Salad as Salary,
  Menu,
  X,
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

interface UserData {
  emp_id: string
  emp_name: string
  email: string
  mobile: string
  designation: string
  work_status: "active" | "left"
  emergency_contact: string
  emergency_contact_name: string
  salary: string
  joining_date: string
  emp_type: string
  image: string
}

function UserInfoPopover({ user, children }: { user: UserData; children: React.ReactNode }) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
        className="cursor-pointer"
      >
        {children}
      </div>

      {isVisible && (
        <div
          className="absolute left-0 top-full mt-2 w-44 max-w-[75vw] sm:w-56 bg-white border border-gray-200 rounded-lg shadow-xl z-[9999] p-2"
          style={{ zIndex: 9999 }}
        >
          <div className="flex items-start space-x-2 mb-2">
            <img
              src={user.image || "/placeholder.svg"}
              alt={user.emp_name}
              className="w-6 h-6 sm:w-8 sm:h-8 rounded-full object-cover border border-gray-200 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 text-xs sm:text-sm truncate">{user.emp_name}</h3>
              <p className="text-[10px] sm:text-xs text-gray-600 truncate">{user.designation}</p>
              <div className="flex items-center mt-0.5">
                <Badge
                  variant={user.work_status === "active" ? "default" : "secondary"}
                  className={`text-[9px] sm:text-xs px-1 py-0 ${user.work_status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                >
                  {user.work_status === "active" ? "Active" : "Left"}
                </Badge>
              </div>
            </div>
          </div>

          <div className="space-y-1 text-[10px] sm:text-xs">
            <div className="flex items-center space-x-1.5">
              <Mail className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-gray-500 flex-shrink-0" />
              <span className="text-gray-600 flex-shrink-0 text-[9px] sm:text-xs">Email:</span>
              <span className="font-medium truncate text-[9px] sm:text-xs">{user.email}</span>
            </div>

            <div className="flex items-center space-x-1.5">
              <Phone className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-gray-500 flex-shrink-0" />
              <span className="text-gray-600 flex-shrink-0 text-[9px] sm:text-xs">Mobile:</span>
              <span className="font-medium truncate text-[9px] sm:text-xs">{user.mobile}</span>
            </div>

            <div className="flex items-center space-x-1.5">
              <Briefcase className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-gray-500 flex-shrink-0" />
              <span className="text-gray-600 flex-shrink-0 text-[9px] sm:text-xs">Type:</span>
              <span className="font-medium truncate text-[9px] sm:text-xs">{user.emp_type}</span>
            </div>

            <div className="flex items-center space-x-1.5">
              <Salary className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-gray-500 flex-shrink-0" />
              <span className="text-gray-600 flex-shrink-0 text-[9px] sm:text-xs">Salary:</span>
              <span className="font-medium truncate text-[9px] sm:text-xs">{user.salary}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function AttendanceManagementPage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [selectedEmployee, setSelectedEmployee] = useState("")
  const [attendanceStatus, setAttendanceStatus] = useState<AttendanceStatus | "">("")
  const [notes, setNotes] = useState("")
  const [viewMode, setViewMode] = useState("daily")
  const [loading, setLoading] = useState(false)
  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

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
  const [attendancePerPage] = useState(5) // Reduced for mobile

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
        return <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
      case "absent":
        return <XCircle className="h-3 w-3 sm:h-4 sm:w-4" />
      case "late":
        return <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4" />
      case "leave":
        return <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
      default:
        return <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
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

  // Derived: Leave requests displayed (3 by default on mobile)
  const displayedLeaveRequests = leaveShowAll ? leaveRequests : leaveRequests.slice(0, 3)

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

  // Mobile-friendly table component
  const MobileAttendanceTable = () => {
    return (
      <div className="space-y-3 sm:hidden">
        {paginatedAttendance.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No attendance records found</p>
          </div>
        ) : (
          paginatedAttendance.filter(Boolean).map((record, idx) => {
            const employee = employees.find((emp) => emp.id === record.employeeId)
            const userData: UserData | null = employee ? {
              emp_id: employee.emp_code || '',
              emp_name: employee.name || '',
              email: employee.email || '',
              mobile: employee.mobile || '',
              designation: `Designation ${employee.designation_id || 'N/A'}`,
              work_status: employee.work_status,
              emergency_contact: '',
              emergency_contact_name: '',
              salary: 'N/A',
              joining_date: 'N/A',
              emp_type: employee.emp_type || '',
              image: '/placeholder.svg'
            } : null

            return (
              <Card key={record.id ?? `${record.employeeId}-${record.date}-${idx}`} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src="/placeholder.svg" alt={record.employeeName} />
                        <AvatarFallback className="bg-blue-100 text-blue-600 text-sm">
                          {record.employeeName.split(" ").map((n) => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{record.employeeName}</p>
                        <p className="text-xs text-gray-600">{new Date(record.date).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={`${getStatusColor(record.status)} flex items-center space-x-1 text-xs`}
                    >
                      {getStatusIcon(record.status)}
                      <span className="capitalize">{record.status}</span>
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600 text-xs">Check In:</span>
                      <p className="font-medium">{record.checkIn || "-"}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 text-xs">Check Out:</span>
                      <p className="font-medium">{record.checkOut || "-"}</p>
                    </div>
                  </div>
                  
                  {record.notes && (
                    <div>
                      <span className="text-gray-600 text-xs">Notes:</span>
                      <p className="text-sm mt-1">{record.notes}</p>
                    </div>
                  )}
                </div>
              </Card>
            )
          })
        )}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white lg:hidden">
        <div className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                className="p-1 h-8 w-8 bg-white/20"
                onClick={() => window.history.back()}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <h1 className="text-lg font-bold">Attendance</h1>
                <p className="text-blue-100 text-xs">Manage employee attendance</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="p-1 h-8 w-8 bg-white/20"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
          
          {isMobileMenuOpen && (
            <div className="mt-4 space-y-2">
              <Button variant="secondary" className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30 justify-start">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
              <Link href="/employers/dashboard/employee-managment" className="block">
                <Button variant="secondary" className="w-full bg-white/20 hover:bg-white/30 text-white border-white/30 justify-start">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Employment
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Desktop Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white hidden lg:block mx-4 mt-4">
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

      <div className="p-4 max-w-7xl mx-auto space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="p-1 sm:p-2 rounded-lg bg-green-100">
                  <UserCheck className="h-4 w-4 sm:h-6 sm:w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">{todayStats.present}</p>
                  <p className="text-xs sm:text-sm text-gray-600">Present</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="p-1 sm:p-2 rounded-lg bg-red-100">
                  <UserX className="h-4 w-4 sm:h-6 sm:w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">{todayStats.absent}</p>
                  <p className="text-xs sm:text-sm text-gray-600">Absent</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="p-1 sm:p-2 rounded-lg bg-yellow-100">
                  <AlertTriangle className="h-4 w-4 sm:h-6 sm:w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">{todayStats.late}</p>
                  <p className="text-xs sm:text-sm text-gray-600">Late</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center space-x-2 sm:space-x-3">
                <div className="p-1 sm:p-2 rounded-lg bg-blue-100">
                  <CalendarDays className="h-4 w-4 sm:h-6 sm:w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-lg sm:text-2xl font-bold text-gray-900">{todayStats.onLeave}</p>
                  <p className="text-xs sm:text-sm text-gray-600">On Leave</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Mark Attendance */}
          <Card className="lg:col-span-1">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Plus className="h-5 w-5 text-blue-600" />
                <span>Mark Attendance</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="space-y-2">
                <Label htmlFor="date" className="text-sm">Date</Label>
                <Input 
                  id="date" 
                  type="date" 
                  value={selectedDate} 
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="employee" className="text-sm">Employee</Label>
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
              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm">Status</Label>
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
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-sm">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="resize-none"
                />
              </div>
              <Button 
                onClick={handleMarkAttendance} 
                className="w-full" 
                disabled={loading || selectedEmployee === "all" || !selectedEmployee || !attendanceStatus}
                size="sm"
              >
                {loading ? "Marking..." : "Mark Attendance"}
              </Button>
            </CardContent>
          </Card>

          {/* Leave Requests */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                <CardTitle className="flex items-center space-x-2 text-lg">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <span>Leave Requests</span>
                </CardTitle>
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 w-fit text-xs">
                  {leaveRequests.filter((req) => req.status === "pending").length} Pending
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className={`space-y-3 ${leaveShowAll ? 'max-h-96 overflow-y-auto pr-2' : ''}`}>
                {leaveRequests.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">
                    <Calendar className="h-10 w-10 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm">No leave requests found</p>
                  </div>
                ) : (
                  displayedLeaveRequests.filter(Boolean).map((request) => {
                    const employee = employees.find((emp) => emp.name === request.employeeName)
                    const userData: UserData | null = employee ? {
                      emp_id: employee.emp_code || '',
                      emp_name: employee.name || '',
                      email: employee.email || '',
                      mobile: employee.mobile || '',
                      designation: `Designation ${employee.designation_id || 'N/A'}`,
                      work_status: employee.work_status,
                      emergency_contact: '',
                      emergency_contact_name: '',
                      salary: 'N/A',
                      joining_date: 'N/A',
                      emp_type: employee.emp_type || '',
                      image: '/placeholder.svg'
                    } : null

                    return (
                      <div
                        key={request.id ?? Math.random()}
                        className="flex flex-col p-3 bg-gray-50 rounded-lg space-y-3"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3 mb-2">
                            <Avatar className="h-8 w-8 flex-shrink-0">
                              <AvatarImage src="/placeholder.svg" alt={request.employeeName} />
                              <AvatarFallback className="bg-blue-100 text-blue-600 text-sm">
                                {request.employeeName.split(" ").map((n) => n[0]).join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                {employee && userData ? (
                                  <UserInfoPopover user={userData}>
                                    <span className="font-medium text-blue-600 hover:text-blue-800 hover:underline cursor-pointer transition-colors inline-block truncate text-sm">
                                      {request.employeeName}
                                    </span>
                                  </UserInfoPopover>
                                ) : (
                                  <p className="font-medium text-gray-900 truncate text-sm">{request.employeeName}</p>
                                )}
                                <p className="text-xs text-gray-600 truncate sm:ml-2">{request.leaveType}</p>
                              </div>
                              <div className="text-xs text-gray-600 space-y-1 mt-1">
                                <p className="break-words">
                                  {new Date(request.applyStartDate).toLocaleDateString()} to {new Date(request.applyEndDate).toLocaleDateString()}
                                </p>
                                <p className="text-xs break-words">{request.reason}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 flex-shrink-0">
                          <Badge
                            variant="outline"
                            className={`w-fit text-xs ${
                              request.status === "approved"
                                ? "bg-green-50 text-green-700"
                                : request.status === "rejected"
                                  ? "bg-red-50 text-red-700"
                                  : "bg-yellow-50 text-yellow-700"
                            }`}
                          >
                            {request.status}
                          </Badge>
                          {request.status === "pending" && (
                            <div className="flex space-x-2 w-full sm:w-auto">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-green-600 hover:bg-green-50 bg-transparent flex-1 sm:flex-none text-xs"
                                onClick={() => openApprovalModal(request)}
                              >
                                Approve
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-red-600 hover:bg-red-50 bg-transparent flex-1 sm:flex-none text-xs"
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
                    )
                  })
                )}
                {leaveRequests.length > 3 && (
                  <div className="text-center pt-2">
                    <Button
                      variant="outline"
                      onClick={() => setLeaveShowAll(!leaveShowAll)}
                      className="text-blue-700 hover:text-blue-800 hover:bg-blue-50 text-xs"
                      size="sm"
                    >
                      {leaveShowAll ? 'Show Less' : `Show More (${leaveRequests.length - 3} more)`}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Attendance Records */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Users className="h-5 w-5 text-blue-600" />
                <span>Attendance Records</span>
              </CardTitle>
              <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-2">
                <Select value={viewMode} onValueChange={setViewMode}>
                  <SelectTrigger className="w-full sm:w-32 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                  </SelectContent>
                </Select>
                <div className="grid grid-cols-2 gap-2 sm:flex sm:space-x-2">
                  <div className="col-span-2 grid grid-cols-2 gap-2 sm:flex sm:space-x-2">
                    <Input 
                      type="date" 
                      value={fromDate} 
                      onChange={(e) => setFromDate(e.target.value)} 
                      className="text-sm"
                      placeholder="From"
                    />
                    <Input 
                      type="date" 
                      value={toDate} 
                      onChange={(e) => setToDate(e.target.value)} 
                      className="text-sm"
                      placeholder="To"
                    />
                  </div>
                  <Button variant="outline" size="sm" onClick={handleDateRangeApply} className="bg-transparent text-xs col-span-1">
                    <Filter className="h-3 w-3 mr-1 sm:mr-2" />
                    Apply
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleDateRangeClear} className="text-xs col-span-1">
                    Clear
                  </Button>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <p>Loading attendance records...</p>
              </div>
            ) : (
              <>
                {/* Mobile View */}
                <MobileAttendanceTable />

                {/* Desktop View */}
                <div className="hidden sm:block">
                  <div className="rounded-md border overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="min-w-[150px] text-sm">Employee</TableHead>
                          <TableHead className="min-w-[100px] text-sm">Date</TableHead>
                          <TableHead className="min-w-[100px] text-sm">Status</TableHead>
                          <TableHead className="min-w-[80px] text-sm">Check In</TableHead>
                          <TableHead className="min-w-[80px] text-sm">Check Out</TableHead>
                          <TableHead className="min-w-[120px] text-sm">Notes</TableHead>
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
                          paginatedAttendance.filter(Boolean).map((record, idx) => {
                            const employee = employees.find((emp) => emp.id === record.employeeId)
                            const userData: UserData | null = employee ? {
                              emp_id: employee.emp_code || '',
                              emp_name: employee.name || '',
                              email: employee.email || '',
                              mobile: employee.mobile || '',
                              designation: `Designation ${employee.designation_id || 'N/A'}`,
                              work_status: employee.work_status,
                              emergency_contact: '',
                              emergency_contact_name: '',
                              salary: 'N/A',
                              joining_date: 'N/A',
                              emp_type: employee.emp_type || '',
                              image: '/placeholder.svg'
                            } : null

                            return (
                              <TableRow key={record.id ?? `${record.employeeId}-${record.date}-${idx}`}>
                                <TableCell className="min-w-[150px]">
                                  <div className="flex items-center space-x-3">
                                    <Avatar className="h-8 w-8 flex-shrink-0">
                                      <AvatarImage src="/placeholder.svg" alt={record.employeeName} />
                                      <AvatarFallback className="bg-blue-100 text-blue-600 text-sm">
                                        {record.employeeName.split(" ").map((n) => n[0]).join("")}
                                      </AvatarFallback>
                                    </Avatar>
                                    {employee && userData ? (
                                      <UserInfoPopover user={userData}>
                                        <span className="font-medium text-blue-600 hover:text-blue-800 hover:underline cursor-pointer transition-colors inline-block truncate text-sm">
                                          {record.employeeName}
                                        </span>
                                      </UserInfoPopover>
                                    ) : (
                                      <span className="font-medium truncate text-sm">{record.employeeName}</span>
                                    )}
                                  </div>
                                </TableCell>
                                <TableCell className="min-w-[100px] text-sm">{new Date(record.date).toLocaleDateString()}</TableCell>
                                <TableCell className="min-w-[100px]">
                                  <Badge
                                    variant="outline"
                                    className={`${getStatusColor(record.status)} flex items-center space-x-1 w-fit text-xs`}
                                  >
                                    {getStatusIcon(record.status)}
                                    <span className="capitalize">{record.status}</span>
                                  </Badge>
                                </TableCell>
                                <TableCell className="min-w-[80px] text-sm">{record.checkIn || "-"}</TableCell>
                                <TableCell className="min-w-[80px] text-sm">{record.checkOut || "-"}</TableCell>
                                <TableCell className="min-w-[120px] max-w-[200px]">
                                  <span className="break-words text-sm">{record.notes || "-"}</span>
                                </TableCell>
                              </TableRow>
                            )
                          })
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </>
            )}
            {attendanceRecords.length > attendancePerPage && (
              <div className="flex flex-col sm:flex-row items-center justify-between px-2 py-3 border-t space-y-2 sm:space-y-0 mt-4">
                <div className="text-sm text-gray-700">
                  Showing {((attendancePage - 1) * attendancePerPage) + 1} to {Math.min(attendancePage * attendancePerPage, attendanceRecords.length)} of {attendanceRecords.length}
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setAttendancePage(Math.max(1, attendancePage - 1))}
                    disabled={attendancePage === 1}
                    className="text-xs h-8"
                  >
                    Previous
                  </Button>
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: Math.min(3, totalAttendancePages) }, (_, i) => {
                      const pageNum = Math.max(1, Math.min(totalAttendancePages - 2, attendancePage - 1)) + i
                      if (pageNum > totalAttendancePages) return null
                      return (
                        <Button
                          key={pageNum}
                          variant={attendancePage === pageNum ? 'default' : 'outline'}
                          size="sm"
                          className="w-8 h-8 p-0 text-xs"
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
                    className="text-xs h-8"
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

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