import { getBaseUrl } from './api-config'

// Time tracking status types
export type TimeTrackingStatus = 'clocked-in' | 'clocked-out' | 'on-break' | 'on-leave'
export type ClockAction = 'clock-in' | 'clock-out' | 'break-start' | 'break-end'
export type TimeRecordStatus = 'active' | 'completed' | 'incomplete' | 'overtime'

// Employee time status interface
export interface EmployeeTimeStatus {
  id: number
  employeeId: number
  employeeName: string
  department: string
  status: TimeTrackingStatus
  clockInTime?: string
  totalHours?: string
  breakTime?: string
  location?: string
  avatar?: string
  lastAction?: ClockAction
  lastActionTime?: string
}

// Time record interface matching the database schema
export interface TimeRecord {
  id: number
  employee_id: number
  company_id: number
  date: string
  clock_in_time: string
  clock_out_time?: string
  break_start_time?: string
  break_end_time?: string
  total_work_hours?: number
  total_break_hours?: number
  overtime_hours?: number
  location?: string
  device_info?: string
  ip_address?: string
  is_active: number
  created_at: string
  updated_at: string
  // Additional fields from join
  emp_name?: string
  emp_id?: string
  email?: string
  mobile?: string
  image?: string
}

// Time tracking session interface
export interface TimeTrackingSession {
  id: number
  employeeId: number
  employeeName: string
  date: string
  clockInTime: string
  clockOutTime?: string
  breakStartTime?: string
  breakEndTime?: string
  totalWorkHours?: number
  totalBreakHours?: number
  overtimeHours?: number
  isActive: boolean
  location?: string
  ipAddress?: string
  deviceInfo?: string
}

// Clock action payload
export interface ClockActionPayload {
  employee_id: number
  action: ClockAction
  location?: string
  device_info?: string
  ip_address?: string
  notes?: string
}

// Today's summary interface
export interface TodaySummary {
  clocked_in_count: number
  on_break_count: number
  clocked_out_count: number
  total_hours_today: number
  total_overtime_today: number
}

// API Response wrapper
interface ApiResponse<T> {
  success: boolean
  message: string
  data?: T
}

// Time Tracking API Service
class TimeTrackingApiService {
  private baseUrl: string

  constructor() {
    this.baseUrl = getBaseUrl('/api/time-tracking')
  }

  // Get active time tracking sessions
  async getActiveSessions(): Promise<TimeTrackingSession[]> {
    const response = await fetch(`${this.baseUrl}/active-sessions`, {
      credentials: 'include'
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch active sessions: ${response.statusText}`)
    }
    
    const result: ApiResponse<TimeTrackingSession[]> = await response.json()
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch active sessions')
    }
    
    return result.data || []
  }

  // Get time records for date range
  async getTimeRecords(fromDate?: string, toDate?: string, employeeId?: number): Promise<TimeRecord[]> {
    const params = new URLSearchParams()
    if (fromDate) params.append('from_date', fromDate)
    if (toDate) params.append('to_date', toDate)
    if (employeeId) params.append('employee_id', employeeId.toString())
    
    const url = `${this.baseUrl}/records?${params.toString()}`
    const response = await fetch(url, {
      credentials: 'include'
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch time records: ${response.statusText}`)
    }
    
    const result: ApiResponse<TimeRecord[]> = await response.json()
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch time records')
    }
    
    return result.data || []
  }

  // Perform clock action (clock-in, clock-out, break-start, break-end)
  async performClockAction(payload: ClockActionPayload): Promise<{ success: boolean; message: string; data?: any }> {
    const response = await fetch(`${this.baseUrl}/clock-action`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(payload)
    })
    
    if (!response.ok) {
      throw new Error(`Failed to perform clock action: ${response.statusText}`)
    }
    
    const result: ApiResponse<any> = await response.json()
    
    return {
      success: result.success,
      message: result.message,
      data: result.data
    }
  }

  // Get today's summary statistics
  async getTodaySummary(employeeId?: number): Promise<TodaySummary> {
    const params = new URLSearchParams()
    if (employeeId) params.append('employee_id', employeeId.toString())
    
    const url = `${this.baseUrl}/today-summary?${params.toString()}`
    const response = await fetch(url, {
      credentials: 'include'
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch today summary: ${response.statusText}`)
    }
    
    const result: ApiResponse<TodaySummary> = await response.json()
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch today summary')
    }
    
    return result.data || {
      clocked_in_count: 0,
      on_break_count: 0,
      clocked_out_count: 0,
      total_hours_today: 0,
      total_overtime_today: 0
    }
  }

  // Get employee time tracking history
  async getEmployeeHistory(employeeId: number, fromDate?: string, toDate?: string): Promise<TimeRecord[]> {
    const params = new URLSearchParams()
    params.append('employee_id', employeeId.toString())
    if (fromDate) params.append('from_date', fromDate)
    if (toDate) params.append('to_date', toDate)
    
    const url = `${this.baseUrl}/employee-history?${params.toString()}`
    const response = await fetch(url, {
      credentials: 'include'
    })
    
    if (!response.ok) {
      throw new Error(`Failed to fetch employee history: ${response.statusText}`)
    }
    
    const result: ApiResponse<TimeRecord[]> = await response.json()
    
    if (!result.success) {
      throw new Error(result.message || 'Failed to fetch employee history')
    }
    
    return result.data || []
  }
}

// Create service instance
const timeTrackingService = new TimeTrackingApiService()

// Export wrapper functions to ensure proper binding
export const getActiveSessions = () => timeTrackingService.getActiveSessions()
export const getTimeRecords = (fromDate?: string, toDate?: string, employeeId?: number) => 
  timeTrackingService.getTimeRecords(fromDate, toDate, employeeId)
export const performClockAction = (payload: ClockActionPayload) => 
  timeTrackingService.performClockAction(payload)
export const getTodaySummary = (employeeId?: number) => 
  timeTrackingService.getTodaySummary(employeeId)
export const getEmployeeHistory = (employeeId: number, fromDate?: string, toDate?: string) => 
  timeTrackingService.getEmployeeHistory(employeeId, fromDate, toDate)

// Helper function to transform TimeRecord to TimeTrackingSession
export function transformTimeRecordToSession(record: TimeRecord): TimeTrackingSession {
  return {
    id: record.id,
    employeeId: record.employee_id,
    employeeName: record.emp_name || `Employee ${record.employee_id}`,
    date: record.date,
    clockInTime: record.clock_in_time,
    clockOutTime: record.clock_out_time,
    breakStartTime: record.break_start_time,
    breakEndTime: record.break_end_time,
    totalWorkHours: record.total_work_hours,
    totalBreakHours: record.total_break_hours,
    overtimeHours: record.overtime_hours,
    isActive: record.is_active === 1,
    location: record.location,
    ipAddress: record.ip_address,
    deviceInfo: record.device_info
  }
}

// Helper function to get current time tracking status
export function getCurrentTimeStatus(record: TimeRecord): TimeTrackingStatus {
  if (!record.clock_in_time) return 'clocked-out'
  if (record.clock_out_time) return 'clocked-out'
  if (record.break_start_time && !record.break_end_time) return 'on-break'
  return 'clocked-in'
}