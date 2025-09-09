"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  User,
  Mail,
  Phone,
  MapPin,
  Clock,
  Calendar,
  Briefcase,
  Building,
  Award,
  TrendingUp,
  Activity,
  Coffee,
  LogOut,
  LogIn,
  Pause,
  Play,
  X,
  Edit,
  Download,
  Eye
} from "lucide-react"
import { TimeTrackingSession, TimeRecord, getEmployeeHistory } from "@/lib/time-tracking-api"
import { CompanyEmployee, fetchDepartments, fetchDesignations, type Department, type Designation, fetchAttendance, type AttendanceRecord } from "@/lib/hrms-api"
import { formatNumber } from "@/lib/utils"

interface EmployeeDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  employee: CompanyEmployee | null
  activeSession?: TimeTrackingSession
  timeRecords: TimeRecord[]
  onClockAction?: (employeeId: number, action: string) => void
}

export default function EmployeeDetailsModal({
  isOpen,
  onClose,
  employee,
  activeSession,
  timeRecords,
  onClockAction
}: EmployeeDetailsModalProps) {
  const [selectedTab, setSelectedTab] = useState<'overview' | 'attendance' | 'history'>('overview')
  const [departments, setDepartments] = useState<Department[]>([])
  const [designations, setDesignations] = useState<Designation[]>([])
  const [history, setHistory] = useState<TimeRecord[]>([])
  const [loadingHistory, setLoadingHistory] = useState(false)
  const [attendanceHistory, setAttendanceHistory] = useState<AttendanceRecord[]>([])
  const [loadingAttendanceHistory, setLoadingAttendanceHistory] = useState(false)

  useEffect(() => {
    const loadLookups = async () => {
      try {
        const [deps, dess] = await Promise.all([fetchDepartments(), fetchDesignations()])
        setDepartments(deps)
        setDesignations(dess)
      } catch (e) {
        setDepartments([])
        setDesignations([])
      }
    }
    loadLookups()
  }, [])

  // Fetch full history when modal opens to ensure we have complete data
  useEffect(() => {
    const loadHistory = async () => {
      if (!isOpen || !employee) return
      try {
        setLoadingHistory(true)
        const records = await getEmployeeHistory(employee.id)
        setHistory(records || [])
      } catch {
        setHistory([])
      } finally {
        setLoadingHistory(false)
      }
    }
    loadHistory()
  }, [isOpen, employee?.id])

  // Fetch attendance table history for History tab (ew_employee_attendance)
  useEffect(() => {
    const loadAttendanceHistory = async () => {
      if (!isOpen || !employee) return
      try {
        setLoadingAttendanceHistory(true)
        const today = new Date()
        const fromDate = new Date()
        fromDate.setDate(today.getDate() - 4) // last 5 days including today
        const toStr = today.toLocaleDateString('en-CA')
        const fromStr = fromDate.toLocaleDateString('en-CA')
        const records = await fetchAttendance(employee.id, fromStr, toStr)
        const sorted = (records || []).sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
        setAttendanceHistory(sorted.slice(0, 5))
      } catch {
        setAttendanceHistory([])
      } finally {
        setLoadingAttendanceHistory(false)
      }
    }
    loadAttendanceHistory()
  }, [isOpen, employee?.id])

  if (!employee) return null

  // Calculate today's statistics (from ew_time_tracking_sessions via timeRecords prop)
  const todayLocal = new Date().toLocaleDateString('en-CA') // YYYY-MM-DD in local tz
  const todaySessionRecords = (timeRecords || []).filter((record: any) => 
    record.employeeId === employee.id && record.date === todayLocal
  )
  const totalWorkHoursToday = todaySessionRecords.reduce((sum: number, record: any) => 
    sum + (Number(record.totalWorkHours) || 0), 0
  )
  const totalOvertimeToday = todaySessionRecords.reduce((sum: number, record: any) => 
    sum + (Number(record.overtimeHours) || 0), 0
  )

  const recentAttendanceRecords = (attendanceHistory || [])
    .filter(record => record.employeeId === employee.id)
    .slice(0, 10)

  

  const getStatusColor = (status: string) => {
    switch (status) {
      case "clocked-in":
        return "bg-green-100 text-green-800"
      case "clocked-out":
        return "bg-gray-100 text-gray-800"
      case "on-break":
        return "bg-yellow-100 text-yellow-800"
      case "on-leave":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "clocked-in":
        return <LogIn className="h-4 w-4" />
      case "clocked-out":
        return <LogOut className="h-4 w-4" />
      case "on-break":
        return <Coffee className="h-4 w-4" />
      case "on-leave":
        return <Calendar className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getCurrentStatus = () => {
    if (activeSession) {
      if (activeSession.clockOutTime) return "clocked-out"
      if (activeSession.breakStartTime && !activeSession.breakEndTime) return "on-break"
      return "clocked-in"
    }
    return "clocked-out"
  }

  const currentStatus = getCurrentStatus()

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage 
                src={employee.image || "/placeholder.svg"} 
                alt={employee.name} 
              />
              <AvatarFallback className="bg-blue-100 text-blue-600 text-lg">
                {employee.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{employee.name}</h2>
              <p className="text-gray-600">{employee.emp_code} • {employee.emp_type}</p>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Status Badge */}
        <div className="flex items-center justify-between">
          <Badge
            variant="outline"
            className={`${getStatusColor(currentStatus)} flex items-center space-x-2 text-sm px-3 py-1`}
          >
            {getStatusIcon(currentStatus)}
            <span className="capitalize">{currentStatus.replace("-", " ")}</span>
          </Badge>
          
          {activeSession && (
            <div className="text-sm text-gray-600">
              {activeSession.clockInTime && (
                <span>Clocked in at {activeSession.clockInTime}</span>
              )}
            </div>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 border-b">
          {[
            { id: 'overview', label: 'Overview', icon: User },
            { id: 'attendance', label: 'Today\'s Attendance', icon: Calendar },
            { id: 'history', label: 'History', icon: Activity }
          ].map(({ id, label, icon: Icon }) => (
            <Button
              key={id}
              variant={selectedTab === id ? "default" : "ghost"}
              onClick={() => setSelectedTab(id as any)}
              className="flex items-center space-x-2"
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </Button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {selectedTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Personal Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Personal Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-gray-600">{employee.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">Phone</p>
                      <p className="text-sm text-gray-600">{employee.mobile}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Briefcase className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">Employee Type</p>
                      <p className="text-sm text-gray-600">{employee.emp_type}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Building className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">Department</p>
                      <p className="text-sm text-gray-600">
                        {(() => {
                          if (!employee.department_id) return 'Not assigned'
                          const d = departments.find(d => d.id === employee.department_id)
                          return d ? d.name : `Department #${employee.department_id}`
                        })()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Briefcase className="h-4 w-4 text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">Designation</p>
                      <p className="text-sm text-gray-600">
                        {(() => {
                          if (!employee.designation_id) return 'Not assigned'
                          const des = designations.find(x => x.id === employee.designation_id)
                          return des ? des.name : `Designation #${employee.designation_id}`
                        })()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Today's Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5" />
                    <span>Today's Summary</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <Clock className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-blue-600">{formatNumber(totalWorkHoursToday)}</p>
                      <p className="text-sm text-gray-600">Hours Worked</p>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-lg">
                      <Award className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                      <p className="text-2xl font-bold text-orange-600">{formatNumber(totalOvertimeToday)}</p>
                      <p className="text-sm text-gray-600">Overtime Hours</p>
                    </div>
                  </div>
                  
                  {activeSession && (
                    <div className="space-y-2">
                      <Separator />
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Current Session:</span>
                        <span className="font-medium">{activeSession.clockInTime}</span>
                      </div>
                      {activeSession.location && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Location:</span>
                          <span className="font-medium">{activeSession.location}</span>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {selectedTab === 'attendance' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Today's Attendance</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {todaySessionRecords.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No attendance records for today</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {todaySessionRecords.map((record: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            <p className="text-sm font-medium">{record.clockInTime}</p>
                            <p className="text-xs text-gray-500">Clock In</p>
                          </div>
                          {record.clockOutTime && (
                            <>
                              <div className="w-8 h-px bg-gray-300"></div>
                              <div className="text-center">
                                <p className="text-sm font-medium">{record.clockOutTime}</p>
                                <p className="text-xs text-gray-500">Clock Out</p>
                              </div>
                            </>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{formatNumber(record.totalWorkHours || 0)} hours</p>
                          <p className="text-xs text-gray-500">
                            {record.isActive ? 'Active' : 'Completed'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {selectedTab === 'history' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Activity className="h-5 w-5" />
                  <span>Recent History</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentAttendanceRecords.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                    <p>No recent records found</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentAttendanceRecords.map((record, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="text-center">
                            <p className="text-sm font-medium">{record.date}</p>
                            <p className="text-xs text-gray-500">Date</p>
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-medium">{record.checkIn || '-'}</p>
                            <p className="text-xs text-gray-500">In</p>
                          </div>
                          {record.checkOut && (
                            <div className="text-center">
                              <p className="text-sm font-medium">{record.checkOut}</p>
                              <p className="text-xs text-gray-500">Out</p>
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{record.totalHours ?? record.employmentType ?? ''}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            <X className="h-4 w-4 mr-2" />
            Close
          </Button>
          {onClockAction && (
            <>
              {currentStatus === 'clocked-out' && (
                <Button 
                  onClick={() => onClockAction(employee.id, 'clock-in')}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Clock In
                </Button>
              )}
              {currentStatus === 'clocked-in' && (
                <>
                  <Button 
                    onClick={() => onClockAction(employee.id, 'break-start')}
                    variant="outline"
                    className="text-yellow-600 hover:bg-yellow-50"
                  >
                    <Pause className="h-4 w-4 mr-2" />
                    Start Break
                  </Button>
                  <Button 
                    onClick={() => onClockAction(employee.id, 'clock-out')}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Clock Out
                  </Button>
                </>
              )}
              {currentStatus === 'on-break' && (
                <>
                  <Button 
                    onClick={() => onClockAction(employee.id, 'break-end')}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    End Break
                  </Button>
                  <Button 
                    onClick={() => onClockAction(employee.id, 'clock-out')}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Clock Out
                  </Button>
                </>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
