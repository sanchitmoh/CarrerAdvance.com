"use client"

import { useEffect, useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Clock,
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Download,
  Plus,
  Eye,
  Edit,
} from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  fetchAttendance,
  fetchAttendanceAll,
  fetchCompanyEmployees,
  markAttendance,
  type AttendanceRecord as ApiAttendanceRecord,
  type AttendanceStatus,
  type CompanyEmployee,
  type EmployeeAttendanceRow,
} from "@/lib/hrms-api"
import { getLeaveRequests, type LeaveRequest } from "@/lib/leave-api"
import LeaveApprovalModal from "@/components/leave-approval-modal"

export default function AttendancePage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [isMarkAttendanceOpen, setIsMarkAttendanceOpen] = useState(false)
  const [isLeaveRequestOpen, setIsLeaveRequestOpen] = useState(false)

  // Employees
  const [employees, setEmployees] = useState<CompanyEmployee[]>([])
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>("")
  const [attendanceStatus, setAttendanceStatus] = useState<AttendanceStatus | "">("")
  const [notes, setNotes] = useState("")
  const [loading, setLoading] = useState(false)

  // Attendance and Leave
  const [attendanceRecords, setAttendanceRecords] = useState<ApiAttendanceRecord[]>([])
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([])
  const [selectedLeaveRequest, setSelectedLeaveRequest] = useState<LeaveRequest | null>(null)
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false)

  // SSR-safe date formatting
  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return ""
    const dt = new Date(dateString)
    const y = dt.getUTCFullYear()
    const m = String(dt.getUTCMonth() + 1).padStart(2, "0")
    const d = String(dt.getUTCDate()).padStart(2, "0")
    return `${y}-${m}-${d}`
  }

  useEffect(() => {
    const run = async () => {
      try {
        const list = await fetchCompanyEmployees()
        setEmployees(list)
      } catch (err) {
        console.error("Failed to fetch employees:", err)
        setEmployees([])
      }
    }
    run()
  }, [])

  useEffect(() => {
    const run = async () => {
      setLoading(true)
      try {
        // Fetch all employees' attendance for the selected date
        const rows: EmployeeAttendanceRow[] = await fetchAttendanceAll(selectedDate, selectedDate)
        const nameById = new Map<number, string>()
        const codeById = new Map<number, string>()
        employees.filter(Boolean).forEach((e) => {
          if (e && typeof e.id === "number") {
            nameById.set(e.id, e.name || `Emp #${e.id}`)
            codeById.set(e.id, e.emp_code || String(e.id))
          }
        })
        const mapped: ApiAttendanceRecord[] = rows.map((r) => ({
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
      } catch (err) {
        console.error("Failed to fetch attendance:", err)
        setAttendanceRecords([])
      } finally {
        setLoading(false)
      }
    }
    run()
  }, [selectedDate, employees])

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
        return <AlertCircle className="h-4 w-4" />
      case "leave":
        return <Calendar className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const filteredRecords = useMemo(() => {
    return attendanceRecords.filter((record) => {
      const employeeCode = employees.find((e) => String(e.id) === String(record.employeeId))?.emp_code || ""
      const matchesSearch =
        record.employeeName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(employeeCode).toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || record.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [attendanceRecords, employees, searchTerm, statusFilter])

  const todayStats = useMemo(() => ({
    totalEmployees: employees.length,
    presentToday: attendanceRecords.filter((r) => r.status === "present").length,
    absentToday: attendanceRecords.filter((r) => r.status === "absent").length,
    onLeave: attendanceRecords.filter((r) => r.status === "leave").length,
    lateArrivals: attendanceRecords.filter((r) => r.status === "late").length,
  }), [attendanceRecords, employees])

  const handleSubmitMarkAttendance = async () => {
    if (!selectedEmployeeId || !attendanceStatus) return
    const employee = employees.find((e) => String(e.id) === String(selectedEmployeeId))
    if (!employee) return
    setLoading(true)
    try {
      const res = await markAttendance({
        employee_id: Number(employee.id),
        date: selectedDate,
        status: attendanceStatus as AttendanceStatus,
        checkIn: attendanceStatus === "present" || attendanceStatus === "late" ? "09:00:00" : undefined,
        checkOut: attendanceStatus === "present" || attendanceStatus === "late" ? "17:30:00" : undefined,
        note: notes || undefined,
      })
      if (res?.success) {
        // Refresh records for the selected date
        const updated = await fetchAttendance(Number(employee.id), selectedDate, selectedDate, employee.name || "")
        // Merge into current view when employee is part of the day view
        const others = attendanceRecords.filter((r) => String(r.employeeId) !== String(employee.id))
        setAttendanceRecords([...others, ...updated])
        setIsMarkAttendanceOpen(false)
        setSelectedEmployeeId("")
        setAttendanceStatus("")
        setNotes("")
      }
    } catch (err) {
      console.error("Failed to mark attendance:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Attendance Management</h1>
          <p className="text-gray-600 mt-1">Track and manage employee attendance</p>
        </div>
        <div className="flex space-x-3 mt-4 md:mt-0">
          <Dialog open={isMarkAttendanceOpen} onOpenChange={setIsMarkAttendanceOpen}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Plus className="h-4 w-4 mr-2" />
                Mark Attendance
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Mark Employee Attendance</DialogTitle>
                <DialogDescription>Manually mark attendance for an employee</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="employee" className="text-right">
                    Employee
                  </Label>
                  <Select value={selectedEmployeeId} onValueChange={setSelectedEmployeeId}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.filter(Boolean).map((emp) => (
                        <SelectItem key={emp.id ?? Math.random()} value={(emp.id ?? '').toString()}>
                          {emp.name} ({emp.emp_code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="date" className="text-right">
                    Date
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    className="col-span-3"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Status
                  </Label>
                  <Select value={attendanceStatus} onValueChange={(v) => setAttendanceStatus(v as AttendanceStatus)}>
                    <SelectTrigger className="col-span-3">
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
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="notes" className="text-right">
                    Notes
                  </Label>
                  <Textarea id="notes" placeholder="Optional notes..." className="col-span-3" value={notes} onChange={(e) => setNotes(e.target.value)} />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" onClick={handleSubmitMarkAttendance} disabled={loading || !selectedEmployeeId || !attendanceStatus} className="bg-emerald-600 hover:bg-emerald-700">
                  Mark Attendance
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{todayStats.totalEmployees}</p>
                <p className="text-sm text-gray-600">Total Employees</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{todayStats.presentToday}</p>
                <p className="text-sm text-gray-600">Present Today</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <XCircle className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{todayStats.absentToday}</p>
                <p className="text-sm text-gray-600">Absent Today</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{todayStats.onLeave}</p>
                <p className="text-sm text-gray-600">On Leave</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">{todayStats.lateArrivals}</p>
                <p className="text-sm text-gray-600">Late Arrivals</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="attendance" className="space-y-4">
        <TabsList>
          <TabsTrigger value="attendance">Daily Attendance</TabsTrigger>
          <TabsTrigger value="leave-requests">Leave Requests</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="attendance" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search employees..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-40"
                  />
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="present">Present</SelectItem>
                      <SelectItem value="absent">Absent</SelectItem>
                      <SelectItem value="late">Late</SelectItem>
                      <SelectItem value="leave">On Leave</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Attendance Table */}
          <Card>
            <CardHeader>
              <CardTitle>Attendance Records</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Clock In</TableHead>
                    <TableHead>Clock Out</TableHead>
                    <TableHead>Work Hours</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRecords.map((record, idx) => (
                    <TableRow key={record.id ?? `${record.employeeId}-${record.date}-${idx}`}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src="/placeholder.svg" alt={record.employeeName} />
                            <AvatarFallback className="bg-emerald-100 text-emerald-600">
                              {record.employeeName
                                ?.split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-900">{record.employeeName}</p>
                            <p className="text-sm text-gray-500">{employees.find((e) => String(e.id) === String(record.employeeId))?.emp_code}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{
                        employees.find((e) => String(e.id) === String(record.employeeId))?.department ||
                        employees.find((e) => String(e.id) === String(record.employeeId))?.department_name ||
                        "-"
                      }</TableCell>
                      <TableCell>{record.checkIn || "-"}</TableCell>
                      <TableCell>{record.checkOut || "-"}</TableCell>
                      <TableCell>{record.totalHours || record.hours || "-"}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`${getStatusColor(record.status)} flex items-center space-x-1 w-fit`}
                        >
                          {getStatusIcon(record.status)}
                          <span className="capitalize">{record.status}</span>
                        </Badge>
                      </TableCell>
                      <TableCell>{record.notes || "-"}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="leave-requests" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Leave Requests</CardTitle>
              <Dialog open={isLeaveRequestOpen} onOpenChange={setIsLeaveRequestOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    <Plus className="h-4 w-4 mr-2" />
                    New Leave Request
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Process Leave Request</DialogTitle>
                    <DialogDescription>Review and approve/reject leave requests</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="employee" className="text-right">
                        Employee
                      </Label>
                      <Select>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select employee" />
                        </SelectTrigger>
                        <SelectContent>
                          {employees.filter(Boolean).slice(0,5).map((emp) => (
                            <SelectItem key={emp.id ?? Math.random()} value={(emp.id ?? '').toString()}>
                              {emp.name} ({emp.emp_code})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="leave-type" className="text-right">
                        Leave Type
                      </Label>
                      <Select>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Select leave type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="annual">Annual Leave</SelectItem>
                          <SelectItem value="sick">Sick Leave</SelectItem>
                          <SelectItem value="personal">Personal Leave</SelectItem>
                          <SelectItem value="emergency">Emergency Leave</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="start-date" className="text-right">
                        Start Date
                      </Label>
                      <Input id="start-date" type="date" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="end-date" className="text-right">
                        End Date
                      </Label>
                      <Input id="end-date" type="date" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="reason" className="text-right">
                        Reason
                      </Label>
                      <Textarea id="reason" placeholder="Reason for leave..." className="col-span-3" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline">Reject</Button>
                    <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
                      Approve
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Employee</TableHead>
                    <TableHead>Leave Type</TableHead>
                    <TableHead>Start Date</TableHead>
                    <TableHead>End Date</TableHead>
                    <TableHead>Days</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {leaveRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-gray-900">{request.employeeName}</p>
                          <p className="text-sm text-gray-500">{request.companyemp_id}</p>
                        </div>
                      </TableCell>
                      <TableCell>{request.leaveType}</TableCell>
                      <TableCell>{formatDate(request.applyStartDate)}</TableCell>
                      <TableCell>{formatDate(request.applyEndDate)}</TableCell>
                      <TableCell>{request.numDays ? `${request.numDays} days` : '-'}</TableCell>
                      <TableCell>{request.reason}</TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`${
                            request.status === "approved"
                              ? "bg-green-100 text-green-800"
                              : request.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {request.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          {request.status === "pending" && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-green-600 hover:text-green-700 bg-transparent"
                                onClick={() => {
                                  setSelectedLeaveRequest(request)
                                  setIsApprovalModalOpen(true)
                                }}
                              >
                                Approve
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:text-red-700 bg-transparent"
                                onClick={() => {
                                  setSelectedLeaveRequest(request)
                                  setIsApprovalModalOpen(true)
                                }}
                              >
                                Reject
                              </Button>
                            </>
                          )}
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Attendance Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Average Attendance Rate</span>
                    <span className="text-2xl font-bold text-green-600">94.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Working Days</span>
                    <span className="text-lg font-semibold">22</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Average Late Arrivals</span>
                    <span className="text-lg font-semibold">3.2%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Department Wise Attendance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Engineering</span>
                    <span className="text-lg font-semibold">96.5%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Marketing</span>
                    <span className="text-lg font-semibold">92.8%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Sales</span>
                    <span className="text-lg font-semibold">89.3%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">HR</span>
                    <span className="text-lg font-semibold">98.1%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Leave Approval Modal */}
      <LeaveApprovalModal
        isOpen={isApprovalModalOpen}
        onClose={() => {
          setIsApprovalModalOpen(false)
          setSelectedLeaveRequest(null)
        }}
        leaveRequest={selectedLeaveRequest}
        onApprove={(updated) => {
          setLeaveRequests((prev) => prev.map((r) => (r.id === updated.id ? updated : r)))
        }}
        onReject={(updated) => {
          setLeaveRequests((prev) => prev.map((r) => (r.id === updated.id ? updated : r)))
        }}
      />
    </div>
  )
}
