"use client"

import type React from "react"

import { useEffect, useMemo, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

type EntryType = "in" | "break-start" | "break-end" | "out"

type Entry = {
  type: EntryType
  at: number // epoch ms
  breakType?: string
}

type TimeTrackingSession = {
  id: number
  employee_id: number
  company_id: number
  date: string
  clock_in_time: string
  clock_out_time: string | null
  break_start_time: string | null
  break_end_time: string | null
  total_work_hours: number
  total_break_hours: number
  overtime_hours: number
  location: string
  device_info: string
  ip_address: string
  is_active: number
  created_at: string
  updated_at: string
}

type LeaveStatus = "Pending" | "Approved" | "Cancelled"

type LeaveRequest = {
  id: string
  reason: string
  from: string // yyyy-mm-dd
  to: string // yyyy-mm-dd
  days: number
  status: LeaveStatus
  createdAt: number // epoch ms
}

function formatDuration(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000))
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`
}

function formatTime(ts: number) {
  try {
    return new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  } catch {
    return ""
  }
}

function todayKey() {
  const d = new Date()
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  const dd = String(d.getDate()).padStart(2, "0")
  return `time-tracker:v1:${yyyy}-${mm}-${dd}`
}

function dateStrFromDate(d: Date) {
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  const dd = String(d.getDate()).padStart(2, "0")
  return `${yyyy}-${mm}-${dd}`
}

function keyForDate(dateStr: string) {
  return `time-tracker:v1:${dateStr}`
}

function isTodayDateStr(dateStr: string) {
  return dateStrFromDate(new Date()) === dateStr
}

export default function JobSeekerTimeTrackerPage() {
  // State
  const [isHired, setIsHired] = useState<boolean | null>(null)
  const [loadingHired, setLoadingHired] = useState<boolean>(true)
  const [entries, setEntries] = useState<Entry[]>([])
  const [now, setNow] = useState<number>(() => Date.now())
  const [isBreakDialogOpen, setIsBreakDialogOpen] = useState(false)
  const [selectedBreakType, setSelectedBreakType] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>(() => dateStrFromDate(new Date()))
  const [activeSession, setActiveSession] = useState<TimeTrackingSession | null>(null)
  const [sessions, setSessions] = useState<TimeTrackingSession[]>([])
  const [loading, setLoading] = useState(false)
  const breakOptions = [
    { type: "Lunch", duration: "1 hour" }
  ]
  const [leaveReason, setLeaveReason] = useState("")
  const [leaveFrom, setLeaveFrom] = useState<string>("")
  const [leaveTo, setLeaveTo] = useState<string>("")
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([])

  // API functions
  const mapBackendLeaveToUI = (row: any): LeaveRequest => {
    // Support both snake_case (DB-like) and camelCase (API-normalized) payloads
    const rawStatus = row?.status
    let status: LeaveStatus = 'Pending'
    if (typeof rawStatus === 'number') {
      status = rawStatus === 1 ? 'Approved' : rawStatus === 2 ? 'Cancelled' : 'Pending'
    } else if (typeof rawStatus === 'string') {
      const s = rawStatus.toLowerCase()
      status = s === 'approved' ? 'Approved' : s === 'rejected' ? 'Cancelled' : 'Pending'
    }

    const createdAtStr = row?.created_at ?? row?.createdAt
    const fromStr = row?.apply_strt_date ?? row?.applyStartDate ?? row?.from
    const toStr = row?.apply_end_date ?? row?.applyEndDate ?? row?.to
    const daysNum = row?.num_aprv_day ?? row?.numApprovedDays ?? row?.days

    return {
      id: String(row?.leave_appl_id ?? row?.id ?? Math.random()),
      reason: String(row?.reason ?? ''),
      from: String(fromStr ?? ''),
      to: String(toStr ?? ''),
      days: Number(daysNum ?? 0) || 0,
      status,
      createdAt: createdAtStr ? new Date(createdAtStr).getTime() : Date.now(),
    }
  }

  const loadActiveSession = async () => {
    try {
      const jsId = typeof window !== 'undefined' ? (window.localStorage.getItem('jobseeker_id') || window.localStorage.getItem('user_id')) : null
      if (!jsId) return

      const res = await fetch(`/api/seeker/time-tracking/active_session?jobseeker_id=${encodeURIComponent(jsId)}`, { 
        credentials: 'include' 
      })
      const data = await res.json()
      if (data.success) {
        setActiveSession(data.data)
      }
    } catch (error) {
      console.error('Error loading active session:', error)
    }
  }

  const loadSessions = async (date: string) => {
    try {
      const jsId = typeof window !== 'undefined' ? (window.localStorage.getItem('jobseeker_id') || window.localStorage.getItem('user_id')) : null
      if (!jsId) return

      const res = await fetch(`/api/seeker/time-tracking/sessions?jobseeker_id=${encodeURIComponent(jsId)}&date=${encodeURIComponent(date)}`, { 
        credentials: 'include' 
      })
      const data = await res.json()
      if (data.success) {
        setSessions(data.data || [])
        // Convert sessions to entries for display
        convertSessionsToEntries(data.data || [])
      }
    } catch (error) {
      console.error('Error loading sessions:', error)
    }
  }

  const loadLeaves = async () => {
    try {
      const jsId = typeof window !== 'undefined' ? (window.localStorage.getItem('jobseeker_id') || window.localStorage.getItem('user_id')) : null
      if (!jsId) return

      const res = await fetch(`/api/seeker/leaves/list?jobseeker_id=${encodeURIComponent(jsId)}`, {
        credentials: 'include'
      })
      const data = await res.json().catch(() => ({} as any))
      if (data?.success && Array.isArray(data?.data)) {
        setLeaveRequests(data.data.map(mapBackendLeaveToUI))
      } else if (Array.isArray(data)) {
        setLeaveRequests(data.map(mapBackendLeaveToUI))
      }
    } catch (error) {
      console.error('Error loading leaves:', error)
    }
  }

  const resolveCompanyId = async (jobseekerId: string): Promise<string | null> => {
    // 1) From localStorage
    const fromStorage = typeof window !== 'undefined' ? (window.localStorage.getItem('company_id') || '') : ''
    if (fromStorage) return fromStorage
    // 2) From active time-tracking session
    if (activeSession?.company_id) return String(activeSession.company_id)
    // 3) From hiring employers endpoint
    try {
      const res = await fetch(`/api/seeker/profile/get_hiring_employers?jobseeker_id=${encodeURIComponent(jobseekerId)}`, { credentials: 'include' })
      const data = await res.json().catch(() => ({} as any))
      const first = Array.isArray(data?.data) && data.data.length ? data.data[0] : null
      if (first?.company_id) return String(first.company_id)
    } catch {
      // ignore
    }
    return null
  }

  const resolveEmployeeId = async (jobseekerId: string): Promise<string | null> => {
    // Prefer active session mapping (ew_companyemp.id)
    if (activeSession?.employee_id) return String(activeSession.employee_id)
    // Try hiring employers list if it contains mapping
    try {
      const res = await fetch(`/api/seeker/profile/get_hiring_employers?jobseeker_id=${encodeURIComponent(jobseekerId)}`, { credentials: 'include' })
      const data = await res.json().catch(() => ({} as any))
      // Accept common shapes: data[0].employee_id or data.employee_id
      if (Array.isArray(data?.data) && data.data.length) {
        const first = data.data[0]
        if (first?.employee_id) return String(first.employee_id)
      }
      if (data?.data?.employee_id) return String(data.data.employee_id)
    } catch {
      // ignore
    }
    return null
  }

  const convertSessionsToEntries = (sessions: TimeTrackingSession[]) => {
    const newEntries: Entry[] = []
    
    sessions.forEach(session => {
      if (session.clock_in_time) {
        const clockInTime = new Date(`${session.date}T${session.clock_in_time}`).getTime()
        newEntries.push({ type: "in", at: clockInTime })
      }
      
      if (session.break_start_time) {
        const breakStartTime = new Date(`${session.date}T${session.break_start_time}`).getTime()
        newEntries.push({ type: "break-start", at: breakStartTime, breakType: "Break" })
      }
      
      if (session.break_end_time) {
        const breakEndTime = new Date(`${session.date}T${session.break_end_time}`).getTime()
        newEntries.push({ type: "break-end", at: breakEndTime })
      }
      
      if (session.clock_out_time) {
        const clockOutTime = new Date(`${session.date}T${session.clock_out_time}`).getTime()
        newEntries.push({ type: "out", at: clockOutTime })
      }
    })
    
    // Sort by time
    newEntries.sort((a, b) => a.at - b.at)
    setEntries(newEntries)
  }

  // Check hire status on mount
  useEffect(() => {
    const checkHired = async () => {
      try {
        const jsId = typeof window !== 'undefined' ? (window.localStorage.getItem('jobseeker_id') || window.localStorage.getItem('user_id')) : null
        if (!jsId) {
          setIsHired(false)
          return
        }
        const res = await fetch(`/api/seeker/profile/is_hired?jobseeker_id=${encodeURIComponent(jsId)}`, { credentials: 'include' })
        const data = await res.json().catch(() => ({} as any))
        const hired = !!(data?.data?.is_hired)
        setIsHired(hired)
        
        if (hired) {
          await loadActiveSession()
          await loadSessions(selectedDate)
        }
      } catch {
        setIsHired(false)
      } finally {
        setLoadingHired(false)
      }
    }
    checkHired()
  }, [])

  // Load entries for the selected day
  useEffect(() => {
    if (isHired) {
      loadSessions(selectedDate)
    }
  }, [selectedDate, isHired])

  // Check if a break type has already been taken today
  const getTakenBreakTypes = useMemo(() => {
    const takenBreaks = new Set<string>()
    entries.forEach(entry => {
      if (entry.type === "break-start" && entry.breakType) {
        takenBreaks.add(entry.breakType)
      }
    })
    return takenBreaks
  }, [entries])

  // Tick only when viewing today; past/future dates are static
  const isSelectedToday = isTodayDateStr(selectedDate)
  useEffect(() => {
    if (!isSelectedToday) return
    const id = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(id)
  }, [isSelectedToday])

  // Compute calcNow depending on selected day (today ticks; others static at last event time)
  const lastEventTs = entries.length ? entries[entries.length - 1].at : null
  const startOfSelectedDay = useMemo(() => {
    const d = new Date(selectedDate + "T00:00:00")
    return d.getTime()
  }, [selectedDate])
  const calcNow = isSelectedToday ? now : (lastEventTs ?? startOfSelectedDay)

  // Derive status + durations from active session
  const { isClockedIn, isOnBreak, workedMs, breakMs, sessionWorkedMs, sessionBreakMs } = useMemo(() => {
    if (!activeSession) {
      return {
        isClockedIn: false,
        isOnBreak: false,
        workedMs: 0,
        breakMs: 0,
        sessionWorkedMs: 0,
        sessionBreakMs: 0,
      }
    }

    const isIn = activeSession.clock_in_time && !activeSession.clock_out_time
    const onBreak = activeSession.break_start_time && !activeSession.break_end_time

    // Calculate total work time from database
    const totalWorkHours = activeSession.total_work_hours || 0
    const totalBreakHours = activeSession.total_break_hours || 0
    const workMs = totalWorkHours * 60 * 60 * 1000
    const bMs = totalBreakHours * 60 * 60 * 1000

    // Calculate current session work time
    let sessWork = 0
    let sessBreak = 0

    if (isIn && activeSession.clock_in_time) {
      const clockInTime = new Date(`${activeSession.date}T${activeSession.clock_in_time}`).getTime()
      const currentTime = calcNow
      
      if (onBreak && activeSession.break_start_time) {
        // Currently on break
        const breakStartTime = new Date(`${activeSession.date}T${activeSession.break_start_time}`).getTime()
        sessWork = breakStartTime - clockInTime
        sessBreak = currentTime - breakStartTime
      } else {
        // Currently working
        sessWork = currentTime - clockInTime
        if (activeSession.break_start_time && activeSession.break_end_time) {
          // Had breaks before
          const breakStartTime = new Date(`${activeSession.date}T${activeSession.break_start_time}`).getTime()
          const breakEndTime = new Date(`${activeSession.date}T${activeSession.break_end_time}`).getTime()
          sessBreak = breakEndTime - breakStartTime
          sessWork = breakEndTime - clockInTime
        }
      }
    }

    return {
      isClockedIn: isIn,
      isOnBreak: onBreak,
      workedMs: workMs,
      breakMs: bMs,
      sessionWorkedMs: sessWork,
      sessionBreakMs: sessBreak,
    }
  }, [activeSession, calcNow])

  // Derive auto-calculated days from date range
  const derivedDays = useMemo(() => {
    if (!leaveFrom || !leaveTo) return null
    try {
      const start = new Date(leaveFrom + "T00:00:00")
      const end = new Date(leaveTo + "T00:00:00")
      const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1
      return isNaN(diff) || diff < 1 ? 1 : diff
    } catch {
      return null
    }
  }, [leaveFrom, leaveTo])

  // Load leaves from backend
  useEffect(() => {
    if (isHired) {
      loadLeaves()
    }
  }, [isHired])

  const handleClockIn = async () => {
    if (!isSelectedToday) return
    if (isClockedIn) return
    
    setLoading(true)
    try {
      const jsId = typeof window !== 'undefined' ? (window.localStorage.getItem('jobseeker_id') || window.localStorage.getItem('user_id')) : null
      if (!jsId) {
        alert('Please log in to use time tracking')
        return
      }

      const formData = new FormData()
      formData.append('jobseeker_id', jsId)
      formData.append('location', navigator.geolocation ? 'Browser' : 'Unknown')
      formData.append('device_info', navigator.userAgent)
      formData.append('ip_address', 'Unknown')

      const res = await fetch('/api/seeker/time-tracking/clock_in', {
        method: 'POST',
        credentials: 'include',
        body: formData
      })

      const data = await res.json()
      if (data.success) {
        await loadActiveSession()
        await loadSessions(selectedDate)
      } else {
        alert(data.message || 'Failed to clock in')
      }
    } catch (error) {
      console.error('Clock in error:', error)
      alert('Failed to clock in')
    } finally {
      setLoading(false)
    }
  }

  const handleStartBreak = () => {
    if (!isSelectedToday) return
    if (!isClockedIn || isOnBreak) return
    setSelectedBreakType(null)
    setIsBreakDialogOpen(true)
  }

  const confirmStartBreak = async () => {
    if (!selectedBreakType) return
    
    setLoading(true)
    try {
      const jsId = typeof window !== 'undefined' ? (window.localStorage.getItem('jobseeker_id') || window.localStorage.getItem('user_id')) : null
      if (!jsId) return

      const formData = new FormData()
      formData.append('jobseeker_id', jsId)
      formData.append('break_type', selectedBreakType)

      const res = await fetch('/api/seeker/time-tracking/start_break', {
        method: 'POST',
        credentials: 'include',
        body: formData
      })

      const data = await res.json()
      if (data.success) {
        await loadActiveSession()
        await loadSessions(selectedDate)
        setIsBreakDialogOpen(false)
      } else {
        alert(data.message || 'Failed to start break')
      }
    } catch (error) {
      console.error('Start break error:', error)
      alert('Failed to start break')
    } finally {
      setLoading(false)
    }
  }

  const handleEndBreak = async () => {
    if (!isSelectedToday) return
    if (!isClockedIn || !isOnBreak) return
    
    setLoading(true)
    try {
      const jsId = typeof window !== 'undefined' ? (window.localStorage.getItem('jobseeker_id') || window.localStorage.getItem('user_id')) : null
      if (!jsId) return

      const formData = new FormData()
      formData.append('jobseeker_id', jsId)

      const res = await fetch('/api/seeker/time-tracking/end_break', {
        method: 'POST',
        credentials: 'include',
        body: formData
      })

      const data = await res.json()
      if (data.success) {
        await loadActiveSession()
        await loadSessions(selectedDate)
      } else {
        alert(data.message || 'Failed to end break')
      }
    } catch (error) {
      console.error('End break error:', error)
      alert('Failed to end break')
    } finally {
      setLoading(false)
    }
  }

  const handleToggleBreak = () => {
    if (!isSelectedToday) return
    if (!isClockedIn) return
    if (!isOnBreak) {
      handleStartBreak()
    } else {
      handleEndBreak()
    }
  }

  const handleClockOut = async () => {
    if (!isSelectedToday) return
    if (!isClockedIn) return
    
    setLoading(true)
    try {
      const jsId = typeof window !== 'undefined' ? (window.localStorage.getItem('jobseeker_id') || window.localStorage.getItem('user_id')) : null
      if (!jsId) return

      const formData = new FormData()
      formData.append('jobseeker_id', jsId)
      if (activeSession?.id) {
        formData.append('session_id', activeSession.id.toString())
      }

      const res = await fetch('/api/seeker/time-tracking/clock_out', {
        method: 'POST',
        credentials: 'include',
        body: formData
      })

      const data = await res.json()
      if (data.success) {
        await loadActiveSession()
        await loadSessions(selectedDate)
      } else {
        alert(data.message || 'Failed to clock out')
      }
    } catch (error) {
      console.error('Clock out error:', error)
      alert('Failed to clock out')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmitLeave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!leaveReason.trim() || !leaveFrom || !leaveTo) return
    try {
      setLoading(true)
      const jsId = typeof window !== 'undefined' ? (window.localStorage.getItem('jobseeker_id') || window.localStorage.getItem('user_id')) : null
      if (!jsId) return
      const companyId = await resolveCompanyId(jsId)
      const employeeId = await resolveEmployeeId(jsId)

      const form = new FormData()
      // Always include jobseeker_id so API proxy can resolve in background if needed
      form.append('jobseeker_id', jsId)
      if (employeeId) form.append('employee_id', employeeId)
      if (companyId) form.append('company_id', companyId)
      form.append('leave_type', 'General')
      form.append('apply_strt_date', leaveFrom)
      form.append('apply_end_date', leaveTo)
      form.append('num_aprv_day', String(derivedDays ?? 1))
      form.append('reason', leaveReason.trim())

      const qs: string[] = []
      if (companyId) qs.push(`company_id=${encodeURIComponent(companyId)}`)
      qs.push(`jobseeker_id=${encodeURIComponent(jsId)}`)
      const createUrl = `/api/seeker/leaves/create${qs.length ? `?${qs.join('&')}` : ''}`

      const res = await fetch(createUrl, {
        method: 'POST',
        credentials: 'include',
        body: form,
      })
      const data = await res.json().catch(() => ({} as any))
      if (data?.success) {
        await loadLeaves()
        setLeaveReason("")
        setLeaveFrom("")
        setLeaveTo("")
      } else {
        alert(data?.message || 'Failed to submit leave request')
      }
    } catch (err) {
      console.error('Leave submit error:', err)
      alert('Failed to submit leave request')
    } finally {
      setLoading(false)
    }
  }

  const statusLabel = isClockedIn ? (isOnBreak ? "On Break" : "On the Clock") : "Off the Clock"

  if (loadingHired) {
    return (
      <div className="rounded-xl border bg-background p-6 text-center text-sm text-muted-foreground">Checking access…</div>
    )
  }

  if (!isHired) {
    return (
      <div className="rounded-xl border bg-amber-50 border-amber-200 p-6 text-center">
        <h2 className="text-lg font-semibold text-foreground">Time Tracker is available after you are hired</h2>
        <p className="text-sm text-muted-foreground mt-2">Once an employer marks you as hired, this section will unlock.</p>
      </div>
    )
  }

  return (
    <div>
      {/* Header Section - Improved for mobile */}
      <header className="mb-6 sm:mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 rounded-2xl p-6 text-white">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground text-white">Time Tracker</h1>
            <p className="text-sm text-muted-foreground mt-2 sm:mt-1 text-white">
              Clock in/out and track breaks. Entries are saved day-wise locally.
            </p>
          </div>
          {/* Date selector - Improved mobile layout */}
          <div className="flex items-center gap-3 bg-muted/50 p-3 rounded-lg sm:bg-transparent sm:p-0">
            <label htmlFor="tt-date" className="text-sm font-medium text-foreground text-white whitespace-nowrap">
              View Date:
            </label>
            <input
              id="tt-date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="rounded-md border bg-background px-3 py-2 text-sm flex-1 sm:flex-none text-black"
              aria-label="Select date to view log"
            />
          </div>
        </div>
      </header>

      {/* Main Grid - Improved mobile stacking */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
        {/* Left: Timer + Controls - Improved mobile layout */}
        <div className="rounded-xl border bg-background p-5 sm:p-6 flex flex-col justify-between space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <span className="text-sm font-medium px-3 py-2 rounded-full bg-muted text-muted-foreground w-fit mx-auto sm:mx-0">
              {statusLabel}
            </span>
            <div className="text-center sm:text-right">
              <p className="text-sm text-muted-foreground">Today Worked</p>
              <p className="text-xl font-bold text-foreground">{formatDuration(workedMs)}</p>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center py-6 sm:py-8">
            <div className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter text-foreground text-center">
              {formatDuration(sessionWorkedMs)}
            </div>
            <p className="mt-3 text-sm text-muted-foreground">Break time: {formatDuration(sessionBreakMs)}</p>
          </div>

          {/* Buttons - Stack on mobile, row on larger screens */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-2">
            <button
              type="button"
              onClick={handleClockIn}
              disabled={!isSelectedToday || isClockedIn || loading}
              className="inline-flex items-center justify-center rounded-lg px-4 py-3 text-base font-medium bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors sm:flex-1"
              aria-label="Clock In"
            >
              {loading ? "..." : "Clock In"}
            </button>
            <button
              type="button"
              onClick={handleToggleBreak}
              disabled={!isSelectedToday || !isClockedIn || loading}
              className="inline-flex items-center justify-center rounded-lg px-4 py-3 text-base font-medium bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors sm:flex-1"
              aria-label={isOnBreak ? "End Break" : "Start Break"}
            >
              {loading ? "..." : (isOnBreak ? "End Break" : "Start Break")}
            </button>
            <button
              type="button"
              onClick={handleClockOut}
              disabled={!isSelectedToday || !isClockedIn || loading}
              className="inline-flex items-center justify-center rounded-lg px-4 py-3 text-base font-medium bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors sm:flex-1"
              aria-label="Clock Out"
            >
              {loading ? "..." : "Clock Out"}
            </button>
          </div>
        </div>

        {/* Right: Day Log - Improved mobile layout */}
        <div className="rounded-xl border bg-background p-5 sm:p-6">
          <h2 className="text-lg font-semibold text-foreground mb-3">Log for {selectedDate}</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Exact timestamps for clock-in, breaks, and clock-out.
            {!isSelectedToday && (
              <span className="block mt-1 text-amber-600 font-medium">
                Controls are disabled when viewing other days.
              </span>
            )}
          </p>

          {entries.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No entries yet.</p>
              <p className="text-sm text-muted-foreground mt-1">Clock in to start tracking time.</p>
            </div>
          ) : (
            <div className="max-h-80 overflow-y-auto">
              <ul className="space-y-3">
                {entries.map((e, idx) => (
                  <li
                    key={`${e.type}-${e.at}-${idx}`}
                    className="flex items-center justify-between rounded-lg border px-4 py-3 text-sm bg-card"
                  >
                    <span className="font-medium capitalize text-sm">
                      {e.type === "in"
                        ? "🟢 Clock In"
                        : e.type === "out"
                          ? "🔴 Clock Out"
                          : e.type === "break-start"
                            ? `🟡 Break Start${e.breakType ? ` • ${e.breakType}` : ""}`
                            : "🟢 Break End"}
                    </span>
                    <span className="text-muted-foreground font-medium">{formatTime(e.at)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* Leave Requests Section - Improved mobile layout */}
      <section className="space-y-6 sm:space-y-8">
        <header>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">Leave Requests</h2>
          <p className="text-sm text-muted-foreground mt-2">Request time off and track the status of your leaves.</p>
        </header>

        {/* Leave Request Form - Improved mobile layout */}
        <form onSubmit={handleSubmitLeave} className="rounded-xl border bg-background p-5 sm:p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <label htmlFor="leave-reason" className="block text-sm font-medium text-foreground mb-2">
                Leave Reason *
              </label>
              <textarea
                id="leave-reason"
                value={leaveReason}
                onChange={(e) => setLeaveReason(e.target.value)}
                rows={3}
                placeholder="Describe the reason for your leave..."
                className="w-full rounded-lg border bg-background px-4 py-3 text-sm resize-vertical min-h-[100px]"
                required
              />
            </div>

            <div>
              <label htmlFor="leave-from" className="block text-sm font-medium text-foreground mb-2">
                From Date *
              </label>
              <input
                id="leave-from"
                type="date"
                value={leaveFrom}
                onChange={(e) => {
                  const v = e.target.value
                  setLeaveFrom(v)
                  if (leaveTo && leaveTo < v) {
                    setLeaveTo(v)
                  }
                }}
                className="w-full rounded-lg border bg-background px-4 py-3 text-sm"
                required
              />
            </div>

            <div>
              <label htmlFor="leave-to" className="block text-sm font-medium text-foreground mb-2">
                To Date *
              </label>
              <input
                id="leave-to"
                type="date"
                value={leaveTo}
                min={leaveFrom || undefined}
                onChange={(e) => setLeaveTo(e.target.value)}
                className="w-full rounded-lg border bg-background px-4 py-3 text-sm"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="leave-days" className="block text-sm font-medium text-foreground mb-2">
                Number of Days
              </label>
              <input
                id="leave-days"
                type="number"
                value={derivedDays ?? ""}
                readOnly
                className="w-full rounded-lg border bg-muted px-4 py-3 text-sm text-foreground font-medium"
                placeholder="Auto-calculated"
                aria-readonly="true"
              />
              {derivedDays != null && (
                <p className="mt-2 text-sm text-muted-foreground">
                  Auto-calculated from date range: <strong>{derivedDays}</strong> day{derivedDays === 1 ? "" : "s"}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-base font-medium bg-emerald-600 text-white hover:bg-emerald-700 transition-colors w-full sm:w-auto"
            >
              Request Leave
            </button>
          </div>
        </form>

        {/* Leave List - Improved mobile layout */}
        <div className="rounded-xl border bg-background p-5 sm:p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Your Leave History</h3>

          {leaveRequests.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No leave requests yet.</p>
              <p className="text-sm text-muted-foreground mt-1">Submit a request above to get started.</p>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-2 sm:mx-0">
              <div className="min-w-full">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b text-left text-muted-foreground">
                      <th className="py-3 pr-4 font-medium whitespace-nowrap">Reason</th>
                      <th className="py-3 pr-4 font-medium whitespace-nowrap hidden sm:table-cell">From</th>
                      <th className="py-3 pr-4 font-medium whitespace-nowrap hidden sm:table-cell">To</th>
                      <th className="py-3 pr-4 font-medium whitespace-nowrap">Status</th>
                      <th className="py-3 pr-4 font-medium whitespace-nowrap hidden xs:table-cell">Requested</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaveRequests.map((lr) => (
                      <tr key={lr.id} className="border-b last:border-0">
                        <td className="py-3 pr-4 align-top">
                          <div className="max-w-[200px] sm:max-w-[300px] text-foreground text-sm break-words">
                            {lr.reason}
                            <div className="sm:hidden text-xs text-muted-foreground mt-1">
                              {lr.from} to {lr.to}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 pr-4 align-top text-sm hidden sm:table-cell">{lr.from}</td>
                        <td className="py-3 pr-4 align-top text-sm hidden sm:table-cell">{lr.to}</td>
                        <td className="py-3 pr-4 align-top">
                          <span
                            className={[
                              "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium whitespace-nowrap",
                              lr.status === "Approved"
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                : lr.status === "Cancelled"
                                  ? "bg-red-100 text-red-800 border border-red-200"
                                  : "bg-amber-100 text-amber-800 border border-amber-200",
                            ].join(" ")}
                          >
                            {lr.status}
                          </span>
                        </td>
                        <td className="py-3 pr-4 align-top text-xs hidden xs:table-cell">
                          {new Date(lr.createdAt).toLocaleString([], { 
                            dateStyle: "medium", 
                            timeStyle: "short" 
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Break Selection Dialog - Updated with durations and taken breaks */}
      <Dialog open={isBreakDialogOpen} onOpenChange={setIsBreakDialogOpen}>
        <DialogContent className="sm:max-w-md mx-4">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Select Break Type</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            {breakOptions.map((opt) => {
              const isTaken = getTakenBreakTypes.has(opt.type)
              return (
                <label 
                  key={opt.type} 
                  className={`flex items-center gap-3 rounded-lg border p-4 transition-colors ${
                    isTaken 
                      ? 'opacity-50 cursor-not-allowed bg-muted/30' 
                      : 'cursor-pointer hover:bg-accent'
                  }`}
                >
                  <input
                    type="radio"
                    name="break-option"
                    value={opt.type}
                    checked={selectedBreakType === opt.type}
                    onChange={() => !isTaken && setSelectedBreakType(opt.type)}
                    disabled={isTaken}
                    className="w-4 h-4 text-emerald-600"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-medium ${isTaken ? 'text-muted-foreground' : 'text-foreground'}`}>
                        {opt.type}
                      </span>
                      <span className="text-xs text-muted-foreground font-medium">
                        {opt.duration}
                      </span>
                    </div>
                    {isTaken && (
                      <p className="text-xs text-amber-600 mt-1 font-medium">
                        Already taken today
                      </p>
                    )}
                  </div>
                </label>
              )
            })}
          </div>
          <div className="mt-6 flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
            <button
              type="button"
              onClick={() => setIsBreakDialogOpen(false)}
              className="inline-flex items-center justify-center rounded-lg px-4 py-3 text-sm font-medium border border-gray-300 bg-background text-foreground hover:bg-muted transition-colors order-2 sm:order-1"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={confirmStartBreak}
              disabled={!selectedBreakType}
              className="inline-flex items-center justify-center rounded-lg px-4 py-3 text-sm font-medium bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors order-1 sm:order-2"
            >
              Start Break
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}