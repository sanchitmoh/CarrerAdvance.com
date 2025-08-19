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
import Link from "next/link" // Added Link import for navigation

export default function AttendanceManagementPage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])
  const [selectedEmployee, setSelectedEmployee] = useState("")
  const [attendanceStatus, setAttendanceStatus] = useState("")
  const [notes, setNotes] = useState("")
  const [viewMode, setViewMode] = useState("daily")

  // Sample employee data
  const employees = [
    {
      id: 1,
      name: "Sarah Johnson",
      email: "sarah@company.com",
      department: "Engineering",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      name: "Michael Chen",
      email: "michael@company.com",
      department: "Marketing",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      name: "Emily Davis",
      email: "emily@company.com",
      department: "Design",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 4,
      name: "David Wilson",
      email: "david@company.com",
      department: "Sales",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 5,
      name: "Lisa Anderson",
      email: "lisa@company.com",
      department: "HR",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  // Sample attendance data
  const [attendanceRecords, setAttendanceRecords] = useState([
    {
      id: 1,
      employeeId: 1,
      employeeName: "Sarah Johnson",
      date: "2024-01-22",
      status: "present",
      checkIn: "09:00",
      checkOut: "17:30",
      notes: "",
    },
    {
      id: 2,
      employeeId: 2,
      employeeName: "Michael Chen",
      date: "2024-01-22",
      status: "late",
      checkIn: "09:15",
      checkOut: "17:30",
      notes: "Traffic delay",
    },
    {
      id: 3,
      employeeId: 3,
      employeeName: "Emily Davis",
      date: "2024-01-22",
      status: "absent",
      checkIn: "",
      checkOut: "",
      notes: "Sick leave",
    },
    {
      id: 4,
      employeeId: 4,
      employeeName: "David Wilson",
      date: "2024-01-22",
      status: "present",
      checkIn: "08:45",
      checkOut: "17:15",
      notes: "",
    },
    {
      id: 5,
      employeeId: 5,
      employeeName: "Lisa Anderson",
      date: "2024-01-22",
      status: "leave",
      checkIn: "",
      checkOut: "",
      notes: "Annual leave",
    },
  ])

  // Sample leave requests
  const [leaveRequests] = useState([
    {
      id: 1,
      employeeName: "Sarah Johnson",
      type: "Annual Leave",
      startDate: "2024-01-25",
      endDate: "2024-01-26",
      status: "pending",
      reason: "Family vacation",
    },
    {
      id: 2,
      employeeName: "Michael Chen",
      type: "Sick Leave",
      startDate: "2024-01-23",
      endDate: "2024-01-23",
      status: "approved",
      reason: "Medical appointment",
    },
    {
      id: 3,
      employeeName: "Emily Davis",
      type: "Personal Leave",
      startDate: "2024-01-28",
      endDate: "2024-01-29",
      status: "pending",
      reason: "Personal matters",
    },
  ])

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

  const handleMarkAttendance = () => {
    if (!selectedEmployee || !attendanceStatus) return

    const employee = employees.find((emp) => emp.id.toString() === selectedEmployee)
    if (!employee) return

    const newRecord = {
      id: attendanceRecords.length + 1,
      employeeId: employee.id,
      employeeName: employee.name,
      date: selectedDate,
      status: attendanceStatus,
      checkIn: attendanceStatus === "present" || attendanceStatus === "late" ? "09:00" : "",
      checkOut: attendanceStatus === "present" || attendanceStatus === "late" ? "17:30" : "",
      notes: notes,
    }

    setAttendanceRecords([...attendanceRecords, newRecord])
    setSelectedEmployee("")
    setAttendanceStatus("")
    setNotes("")
  }

  const todayStats = {
    present: attendanceRecords.filter((r) => r.status === "present").length,
    absent: attendanceRecords.filter((r) => r.status === "absent").length,
    late: attendanceRecords.filter((r) => r.status === "late").length,
    onLeave: attendanceRecords.filter((r) => r.status === "leave").length,
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
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
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id.toString()}>
                      {employee.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={attendanceStatus} onValueChange={setAttendanceStatus}>
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
            <Button onClick={handleMarkAttendance} className="w-full">
              Mark Attendance
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
            <div className="space-y-4">
              {leaveRequests.map((request) => (
                <div key={request.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <div>
                        <p className="font-medium text-gray-900">{request.employeeName}</p>
                        <p className="text-sm text-gray-600">{request.type}</p>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                      <p>
                        {request.startDate} to {request.endDate}
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
                        <Button size="sm" variant="outline" className="text-green-600 hover:bg-green-50 bg-transparent">
                          Approve
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50 bg-transparent">
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
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
                  <TableHead>Status</TableHead>
                  <TableHead>Check In</TableHead>
                  <TableHead>Check Out</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendanceRecords.map((record) => (
                  <TableRow key={record.id}>
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
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
