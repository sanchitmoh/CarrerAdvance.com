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

export default function TimeTrackerPage() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [selectedEmployee, setSelectedEmployee] = useState("")
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  // Sample employee data
  const employees = [
    {
      id: 1,
      name: "Sarah Johnson",
      department: "Engineering",
      status: "clocked-in",
      clockInTime: "09:00",
      totalHours: "7.5",
      breakTime: "0.5",
      location: "San Francisco, CA",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 2,
      name: "Michael Chen",
      department: "Marketing",
      status: "on-break",
      clockInTime: "08:45",
      totalHours: "6.2",
      breakTime: "1.0",
      location: "Seattle, WA",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 3,
      name: "Emily Davis",
      department: "Design",
      status: "clocked-out",
      clockInTime: "09:15",
      totalHours: "8.0",
      breakTime: "0.5",
      location: "Austin, TX",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    {
      id: 4,
      name: "David Wilson",
      department: "Sales",
      status: "clocked-in",
      clockInTime: "08:30",
      totalHours: "8.5",
      breakTime: "0.5",
      location: "New York, NY",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  ]

  // Sample time records
  const [timeRecords] = useState([
    {
      id: 1,
      employeeName: "Sarah Johnson",
      date: "2024-01-22",
      clockIn: "09:00",
      clockOut: "17:30",
      breakStart: "12:00",
      breakEnd: "12:30",
      totalHours: 8.0,
      overtime: 0,
      location: "San Francisco, CA",
      status: "completed",
    },
    {
      id: 2,
      employeeName: "Michael Chen",
      date: "2024-01-22",
      clockIn: "08:45",
      clockOut: "17:15",
      breakStart: "12:15",
      breakEnd: "13:15",
      totalHours: 7.5,
      overtime: 0,
      location: "Seattle, WA",
      status: "completed",
    },
    {
      id: 3,
      employeeName: "Emily Davis",
      date: "2024-01-22",
      clockIn: "09:15",
      clockOut: "18:00",
      breakStart: "12:30",
      breakEnd: "13:00",
      totalHours: 8.25,
      overtime: 0.25,
      location: "Austin, TX",
      status: "completed",
    },
    {
      id: 4,
      employeeName: "David Wilson",
      date: "2024-01-22",
      clockIn: "08:30",
      clockOut: "18:30",
      breakStart: "12:00",
      breakEnd: "12:30",
      totalHours: 9.5,
      overtime: 1.5,
      location: "New York, NY",
      status: "completed",
    },
  ])

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

  const totalEmployees = employees.length
  const clockedIn = employees.filter((emp) => emp.status === "clocked-in").length
  const onBreak = employees.filter((emp) => emp.status === "on-break").length
  const clockedOut = employees.filter((emp) => emp.status === "clocked-out").length

  const totalHoursToday = timeRecords.reduce((sum, record) => sum + record.totalHours, 0)
  const totalOvertimeToday = timeRecords.reduce((sum, record) => sum + record.overtime, 0)

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
              <p className="text-xl font-mono font-bold">{currentTime.toLocaleTimeString()}</p>
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
                <p className="text-2xl font-bold text-gray-900">{totalHoursToday.toFixed(1)}</p>
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
                <p className="text-2xl font-bold text-gray-900">{totalOvertimeToday.toFixed(1)}</p>
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
              <Button className="bg-green-600 hover:bg-green-700">
                <Play className="h-4 w-4 mr-2" />
                Clock In
              </Button>
              <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 bg-transparent">
                <Square className="h-4 w-4 mr-2" />
                Clock Out
              </Button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" className="border-yellow-200 text-yellow-600 hover:bg-yellow-50 bg-transparent">
                <Pause className="h-4 w-4 mr-2" />
                Start Break
              </Button>
              <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent">
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
            <div className="space-y-4">
              {employees.map((employee) => (
                <div key={employee.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={employee.avatar || "/placeholder.svg"} alt={employee.name} />
                      <AvatarFallback className="bg-green-100 text-green-600">
                        {employee.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-gray-900">{employee.name}</p>
                      <p className="text-sm text-gray-600">{employee.department}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <MapPin className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-500">{employee.location}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <Badge
                      variant="outline"
                      className={`${getStatusColor(employee.status)} flex items-center space-x-1`}
                    >
                      {getStatusIcon(employee.status)}
                      <span className="capitalize">{employee.status.replace("-", " ")}</span>
                    </Badge>
                    <div className="text-sm text-gray-600">
                      <p>In: {employee.clockInTime}</p>
                      <p>Hours: {employee.totalHours}</p>
                    </div>
                  </div>
                </div>
              ))}
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
                {timeRecords.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-medium">{record.employeeName}</TableCell>
                    <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                    <TableCell>{record.clockIn}</TableCell>
                    <TableCell>{record.clockOut}</TableCell>
                    <TableCell>
                      {record.breakStart} - {record.breakEnd}
                    </TableCell>
                    <TableCell className="font-medium">{record.totalHours.toFixed(1)}h</TableCell>
                    <TableCell>
                      {record.overtime > 0 ? (
                        <div className="flex items-center space-x-1">
                          <AlertTriangle className="h-4 w-4 text-orange-500" />
                          <span className="text-orange-600 font-medium">{record.overtime.toFixed(1)}h</span>
                        </div>
                      ) : (
                        <div className="flex items-center space-x-1">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-green-600">0h</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">{record.location}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          record.status === "completed" ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"
                        }
                      >
                        {record.status}
                      </Badge>
                    </TableCell>
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
