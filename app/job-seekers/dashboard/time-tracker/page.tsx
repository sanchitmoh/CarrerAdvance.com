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
  const [entries, setEntries] = useState<Entry[]>([])
  const [now, setNow] = useState<number>(() => Date.now())
  const [isBreakDialogOpen, setIsBreakDialogOpen] = useState(false)
  const [selectedBreakType, setSelectedBreakType] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<string>(() => dateStrFromDate(new Date()))
  const breakOptions = ["Lunch", "Coffee"]
  const [leaveReason, setLeaveReason] = useState("")
  const [leaveFrom, setLeaveFrom] = useState<string>("")
  const [leaveTo, setLeaveTo] = useState<string>("")
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([])

  // Load entries for the selected day
  useEffect(() => {
    try {
      const raw = localStorage.getItem(keyForDate(selectedDate))
      if (raw) {
        const parsed: Entry[] = JSON.parse(raw)
        if (Array.isArray(parsed)) setEntries(parsed)
        else setEntries([])
      } else {
        setEntries([])
      }
    } catch {
      setEntries([])
    }
  }, [selectedDate])

  // Persist entries per selected day
  useEffect(() => {
    try {
      localStorage.setItem(keyForDate(selectedDate), JSON.stringify(entries))
    } catch {
      // ignore
    }
  }, [entries, selectedDate])

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

  // Derive status + durations
  const { isClockedIn, isOnBreak, workedMs, breakMs, sessionWorkedMs, sessionBreakMs } = useMemo(() => {
    let isIn = false
    let onBreak = false
    let workMs = 0
    let bMs = 0
    let lastWorkStart: number | null = null
    let lastBreakStart: number | null = null

    for (const e of entries) {
      if (e.type === "in") {
        isIn = true
        onBreak = false
        lastWorkStart = e.at
        lastBreakStart = null
      } else if (e.type === "break-start" && isIn && !onBreak) {
        onBreak = true
        if (lastWorkStart != null) {
          workMs += e.at - lastWorkStart
          lastWorkStart = null
        }
        lastBreakStart = e.at
      } else if (e.type === "break-end" && isIn && onBreak) {
        onBreak = false
        if (lastBreakStart != null) {
          bMs += e.at - lastBreakStart
          lastBreakStart = null
        }
        lastWorkStart = e.at
      } else if (e.type === "out" && isIn) {
        if (onBreak && lastBreakStart != null) {
          bMs += e.at - lastBreakStart
          lastBreakStart = null
          onBreak = false
        }
        if (lastWorkStart != null) {
          workMs += e.at - lastWorkStart
          lastWorkStart = null
        }
        isIn = false
      }
    }

    if (isIn) {
      if (onBreak && lastBreakStart != null) {
        bMs += calcNow - lastBreakStart
      } else if (!onBreak && lastWorkStart != null) {
        workMs += calcNow - lastWorkStart
      }
    }

    let sessWork = 0
    let sessBreak = 0
    if (isIn) {
      let sessionStartIndex = -1
      for (let i = entries.length - 1; i >= 0; i--) {
        if (entries[i].type === "out") break
        if (entries[i].type === "in") {
          sessionStartIndex = i
          break
        }
      }
      if (sessionStartIndex !== -1) {
        let sIsIn = false
        let sOnBreak = false
        let sWorkStart: number | null = null
        let sBreakStart: number | null = null
        for (let i = sessionStartIndex; i < entries.length; i++) {
          const e = entries[i]
          if (e.type === "in") {
            sIsIn = true
            sOnBreak = false
            sWorkStart = e.at
            sBreakStart = null
          } else if (e.type === "break-start" && sIsIn && !sOnBreak) {
            sOnBreak = true
            if (sWorkStart != null) {
              sessWork += e.at - sWorkStart
              sWorkStart = null
            }
            sBreakStart = e.at
          } else if (e.type === "break-end" && sIsIn && sOnBreak) {
            sOnBreak = false
            if (sBreakStart != null) {
              sessBreak += e.at - sBreakStart
              sBreakStart = null
            }
            sWorkStart = e.at
          }
        }
        if (sIsIn) {
          if (sOnBreak && sBreakStart != null) {
            sessBreak += calcNow - sBreakStart
          } else if (!sOnBreak && sWorkStart != null) {
            sessWork += calcNow - sWorkStart
          }
        }
      }
    }

    return {
      isClockedIn: isIn,
      isOnBreak: onBreak,
      workedMs: workMs,
      breakMs: bMs,
      sessionWorkedMs: isIn ? sessWork : 0,
      sessionBreakMs: isIn ? sessBreak : 0,
    }
  }, [entries, calcNow])

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

  // Load/persist leave requests to localStorage (global, not per day)
  useEffect(() => {
    try {
      const raw = localStorage.getItem("leave-requests:v1")
      if (raw) {
        const parsed: LeaveRequest[] = JSON.parse(raw)
        if (Array.isArray(parsed)) setLeaveRequests(parsed)
      }
    } catch {
      // ignore
    }
  }, [])
  useEffect(() => {
    try {
      localStorage.setItem("leave-requests:v1", JSON.stringify(leaveRequests))
    } catch {
      // ignore
    }
  }, [leaveRequests])

  const handleClockIn = () => {
    if (!isSelectedToday) return
    if (isClockedIn) return
    setEntries((prev) => [...prev, { type: "in", at: Date.now() }])
  }

  const handleStartBreak = () => {
    if (!isSelectedToday) return
    if (!isClockedIn || isOnBreak) return
    setSelectedBreakType(null)
    setIsBreakDialogOpen(true)
  }

  const confirmStartBreak = () => {
    if (!selectedBreakType) return
    setEntries((prev) => [...prev, { type: "break-start", at: Date.now(), breakType: selectedBreakType }])
    setIsBreakDialogOpen(false)
  }

  const handleEndBreak = () => {
    if (!isSelectedToday) return
    if (!isClockedIn || !isOnBreak) return
    setEntries((prev) => [...prev, { type: "break-end", at: Date.now() }])
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

  const handleClockOut = () => {
    if (!isSelectedToday) return
    if (!isClockedIn) return
    const t = Date.now()
    const last = entries[entries.length - 1]
    const newEntries = [...entries]
    if (isOnBreak && last?.type !== "break-end") {
      newEntries.push({ type: "break-end", at: t })
    }
    newEntries.push({ type: "out", at: t })
    setEntries(newEntries)
  }

  const handleSubmitLeave = (e: React.FormEvent) => {
    e.preventDefault()
    if (!leaveReason.trim() || !leaveFrom || !leaveTo) return
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    const req: LeaveRequest = {
      id,
      reason: leaveReason.trim(),
      from: leaveFrom,
      to: leaveTo,
      days: derivedDays ?? 1,
      status: "Pending",
      createdAt: Date.now(),
    }
    setLeaveRequests((prev) => [req, ...prev])
    setLeaveReason("")
    setLeaveFrom("")
    setLeaveTo("")
  }

  const statusLabel = isClockedIn ? (isOnBreak ? "On Break" : "On the Clock") : "Off the Clock"

  return (
    <main className="p-4 sm:p-6 lg:p-8">
      {/* Header Section - Improved for mobile */}
      <header className="mb-6 sm:mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Time Tracker</h1>
            <p className="text-sm text-muted-foreground mt-2 sm:mt-1">
              Clock in/out and track breaks. Entries are saved day-wise locally.
            </p>
          </div>
          {/* Date selector - Improved mobile layout */}
          <div className="flex items-center gap-3 bg-muted/50 p-3 rounded-lg sm:bg-transparent sm:p-0">
            <label htmlFor="tt-date" className="text-sm font-medium text-foreground whitespace-nowrap">
              View Date:
            </label>
            <input
              id="tt-date"
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="rounded-md border bg-background px-3 py-2 text-sm flex-1 sm:flex-none"
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
              disabled={!isSelectedToday || isClockedIn}
              className="inline-flex items-center justify-center rounded-lg px-4 py-3 text-base font-medium bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors sm:flex-1"
              aria-label="Clock In"
            >
              Clock In
            </button>
            <button
              type="button"
              onClick={handleToggleBreak}
              disabled={!isSelectedToday || !isClockedIn}
              className="inline-flex items-center justify-center rounded-lg px-4 py-3 text-base font-medium bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors sm:flex-1"
              aria-label={isOnBreak ? "End Break" : "Start Break"}
            >
              {isOnBreak ? "End Break" : "Start Break"}
            </button>
            <button
              type="button"
              onClick={handleClockOut}
              disabled={!isSelectedToday || !isClockedIn}
              className="inline-flex items-center justify-center rounded-lg px-4 py-3 text-base font-medium bg-destructive text-destructive-foreground hover:bg-destructive/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors sm:flex-1"
              aria-label="Clock Out"
            >
              Clock Out
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
                onChange={(e) => setLeaveFrom(e.target.value)}
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
                      <th className="py-3 pr-4 font-medium whitespace-nowrap">Days</th>
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
                        <td className="py-3 pr-4 align-top text-sm font-medium">{lr.days}</td>
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

      {/* Break Selection Dialog - Improved mobile layout */}
      <Dialog open={isBreakDialogOpen} onOpenChange={setIsBreakDialogOpen}>
        <DialogContent className="sm:max-w-md mx-4">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl">Select Break Type</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            {breakOptions.map((opt) => (
              <label 
                key={opt} 
                className="flex items-center gap-3 rounded-lg border p-4 cursor-pointer hover:bg-accent transition-colors"
              >
                <input
                  type="radio"
                  name="break-option"
                  value={opt}
                  checked={selectedBreakType === opt}
                  onChange={() => setSelectedBreakType(opt)}
                  className="w-4 h-4 text-emerald-600"
                />
                <span className="text-sm font-medium">{opt}</span>
              </label>
            ))}
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
    </main>
  )
}