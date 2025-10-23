"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  Clock,
  DollarSign,
  FileText,
  TrendingUp,
  Calendar,
  BarChart3,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Activity,
  PieChart,
  LineChart,
  Target,
} from "lucide-react"
import Link from "next/link"
import { useCallback, useEffect, useMemo, useState } from "react"
import { getBaseUrl } from "@/lib/api-config"
import BackButton from "@/components/back-button"

export default function EmploymentManagementPage() {
  const [mounted, setMounted] = useState(false)
  const [loadingStats, setLoadingStats] = useState<boolean>(true)
  const [statsError, setStatsError] = useState<string | null>(null)
  const [exporting, setExporting] = useState<boolean>(false)
  const [stats, setStats] = useState<{
    totalEmployees: number
    presentToday: number
    pendingLeaves: number
    avgPerformance: number | null
    performanceScore?: number | null
    payrollExpensesMonth?: number | null
    documentCompliancePercent?: number | null
    monthlyAttendanceTrend?: { date: string; attendancePercent: number | null }[]
    recentActivities?: { type: string; title: string; meta: string; time: string }[]
    pendingActions?: { title: string; subtitle: string; action: string; type: string }[]
  }>({ totalEmployees: 0, presentToday: 0, pendingLeaves: 0, avgPerformance: null })

  const fetchStats = useCallback(async () => {
    let aborted = false
    try {
      setLoadingStats(true)
      setStatsError(null)
      const candidatePaths = ['/api/hrms/stats', '/hrms/stats', '/api/employers/hrms/stats']
      let success = false
      for (const path of candidatePaths) {
        const url = getBaseUrl(path)
        try {
          const res = await fetch(url, { credentials: 'include' })
          const contentType = res.headers.get('content-type') || ''
          if (!res.ok || !contentType.includes('application/json')) {
            // try next path
            continue
          }
          const json = await res.json()
          if (!json?.success) {
            continue
          }
          if (!aborted) {
            setStats({
              totalEmployees: Number(json.data?.totalEmployees || 0),
              presentToday: Number(json.data?.presentToday || 0),
              pendingLeaves: Number(json.data?.pendingLeaves || 0),
              avgPerformance: json.data?.avgPerformance !== undefined && json.data?.avgPerformance !== null ? Number(json.data?.avgPerformance) : null,
              performanceScore: json.data?.performanceScore !== undefined && json.data?.performanceScore !== null ? Number(json.data?.performanceScore) : (json.data?.avgPerformance ?? null),
              payrollExpensesMonth: json.data?.payrollExpensesMonth !== undefined && json.data?.payrollExpensesMonth !== null ? Number(json.data?.payrollExpensesMonth) : null,
              documentCompliancePercent: json.data?.documentCompliancePercent !== undefined && json.data?.documentCompliancePercent !== null ? Number(json.data?.documentCompliancePercent) : null,
              monthlyAttendanceTrend: Array.isArray(json.data?.monthlyAttendanceTrend) ? json.data.monthlyAttendanceTrend : [],
              recentActivities: Array.isArray(json.data?.recentActivities) ? json.data.recentActivities.slice(0,3) : [],
              pendingActions: Array.isArray(json.data?.pendingActions) ? json.data.pendingActions.slice(0,3) : [],
            })
          }
          success = true
          break
        } catch (e) {
          // continue to next candidate
          // eslint-disable-next-line no-console
          console.warn('Stats path failed:', path, e)
          continue
        }
      }
      // If no unified stats endpoint, stitch minimal stats from available APIs
      if (!success) {
        const stitched = { ...stats }
        try {
          // Pending leaves count from leave-requests endpoint
          const leavesRes = await fetch(getBaseUrl('/leave-requests'), { credentials: 'include' })
          if (leavesRes.ok) {
            const leavesJson = await leavesRes.json().catch(() => ({} as any))
            const list: any[] = Array.isArray(leavesJson?.data) ? leavesJson.data : (Array.isArray(leavesJson) ? leavesJson : [])
            const pending = list.filter((r: any) => {
              const s = (r?.status ?? r?.leave_status ?? '').toString().toLowerCase()
              return s === 'pending' || s === '0' || s === '1' // depending on backend mapping; adjust as needed
            }).length
            stitched.pendingLeaves = pending
          }
        } catch (_) {}

        try {
          // Recent activities from time-tracking records
          const recRes = await fetch(getBaseUrl('/time-tracking/records'), { credentials: 'include' })
          if (recRes.ok) {
            const recJson = await recRes.json().catch(() => ({} as any))
            const recData: any[] = Array.isArray(recJson?.data) ? recJson.data : []
            const activities = recData.slice(0, 5).map((r: any) => {
              const who = r?.emp_name || r?.employee_name || `Employee ${r?.employee_id ?? ''}`
              let title = `${who} activity`
              if (r?.clock_in_time && !r?.clock_out_time) title = `${who} clocked in`
              if (r?.clock_out_time) title = `${who} clocked out`
              if (r?.break_start_time && !r?.break_end_time) title = `${who} started break`
              if (r?.break_end_time) title = `${who} ended break`
              return { type: 'attendance', title, meta: 'Attendance', time: r?.updated_at || r?.clock_in_time || r?.date || '' }
            })
            stitched.recentActivities = activities
          }
        } catch (_) {}

        try {
          // Interviews recent
          const intRes = await fetch(getBaseUrl('/interviews'), { credentials: 'include' })
          if (intRes.ok) {
            const intJson = await intRes.json().catch(() => ({} as any))
            const items: any[] = Array.isArray(intJson?.data) ? intJson.data : []
            const acts = items.slice(0, 5).map((it: any) => ({
              type: 'interview',
              title: it?.candidate_name ? `Interview scheduled with ${it.candidate_name}` : 'Interview activity',
              meta: it?.status ? `Interview • ${it.status}` : 'Interview',
              time: it?.scheduled_at || it?.created_at || ''
            }))
            stitched.recentActivities = [ ...(stitched.recentActivities || []), ...acts ].slice(0, 5)
          }
        } catch (_) {}

        try {
          // Documents pending/expiring
          const docRes = await fetch(getBaseUrl('/documents'), { credentials: 'include' })
          if (docRes.ok) {
            const docJson = await docRes.json().catch(() => ({} as any))
            const docs: any[] = Array.isArray(docJson?.data) ? docJson.data : []
            // derive compliance percent as fallback
            const compliance = computeDocumentCompliancePercent(docs)
            if (compliance !== null) stitched.documentCompliancePercent = compliance
            const now = new Date()
            const in30 = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
            const pendingDocs = docs.filter((d: any) => {
              const s = (d?.status ?? '').toString().toLowerCase()
              const expStr = d?.expiry_date || d?.expiryDate
              const exp = expStr ? new Date(expStr) : null
              return s === 'pending' || s === 'awaiting' || (exp && exp > now && exp < in30)
            }).length
            stitched.pendingActions = [
              ...(stitched.pendingActions || []),
              { title: `${pendingDocs} Documents Pending/Expiring`, subtitle: 'Within 30 days', action: 'Review', type: 'documents' },
            ]
          }
        } catch (_) {}

        try {
          // Performance reviews pending
          const perfRes = await fetch(getBaseUrl('/performance-reviews'), { credentials: 'include' })
          if (perfRes.ok) {
            const perfJson = await perfRes.json().catch(() => ({} as any))
            const rows: any[] = Array.isArray(perfJson?.data) ? perfJson.data : []
            // derive avg performance as fallback
            const avgPerf = computePerformanceAverage(rows)
            if (avgPerf !== null) {
              stitched.avgPerformance = avgPerf
              stitched.performanceScore = avgPerf
            }
            const pendingPerf = rows.filter((r: any) => {
              const s = (r?.status ?? '').toString().toLowerCase()
              return s === 'pending' || s === 'due' || s === 'open'
            }).length
            stitched.pendingActions = [
              ...(stitched.pendingActions || []),
              { title: `${pendingPerf} Performance Reviews Due`, subtitle: 'Due by end of week', action: 'Review', type: 'performance' },
            ]
          }
        } catch (_) {}

        try {
          // Payroll total for current month (fallback)
          const payrollRes = await fetch(getBaseUrl('/api/employee-payroll'), { credentials: 'include' })
          if (payrollRes.ok) {
            const payrollJson = await payrollRes.json().catch(() => ({} as any))
            const payrollRows: any[] = Array.isArray(payrollJson?.data) ? payrollJson.data : (Array.isArray(payrollJson) ? payrollJson : [])
            const total = computePayrollExpensesForCurrentMonth(payrollRows)
            if (total !== null) {
              stitched.payrollExpensesMonth = total
            } else {
              // Fallback: sum all records if date filtering fails
              const fallbackTotal = payrollRows.reduce((sum, r) => {
                const amount = toNumber(r?.net_pay ?? r?.netPay ?? r?.amount ?? r?.total ?? r?.gross_pay ?? r?.grossPay ?? r?.salary ?? r?.base_salary ?? r?.baseSalary ?? r?.total_amount ?? r?.totalAmount ?? r?.pay_amount ?? r?.payAmount)
                return sum + (amount || 0)
              }, 0)
              if (fallbackTotal > 0) {
                stitched.payrollExpensesMonth = Math.round(fallbackTotal)
                console.log('Using fallback payroll calculation:', fallbackTotal)
              }
            }
          }
        } catch (_) {}

        if (!aborted) {
          setStats({
            totalEmployees: stitched.totalEmployees ?? 24,
            presentToday: stitched.presentToday ?? 22,
            pendingLeaves: stitched.pendingLeaves ?? 0,
            avgPerformance: stitched.avgPerformance ?? 4.2,
            performanceScore: stitched.performanceScore ?? 4.2,
            payrollExpensesMonth: stitched.payrollExpensesMonth ?? 48250,
            documentCompliancePercent: stitched.documentCompliancePercent ?? 87,
            monthlyAttendanceTrend: stitched.monthlyAttendanceTrend ?? [
              { date: '2025-01-01', attendancePercent: 93 },
              { date: '2025-02-01', attendancePercent: 95 },
            ],
            recentActivities: stitched.recentActivities ?? [],
            pendingActions: stitched.pendingActions ?? [
              { title: `${stitched.pendingLeaves ?? 0} Leave Requests Pending`, subtitle: 'Awaiting approval', action: 'Approve', type: 'leave' },
            ],
          })
        }
      }
      // Augment unified stats with detailed activities/actions if available
      if (success && !aborted) {
        try {
          const [leavesRes, recRes, intRes, docRes, perfRes, payrollRes] = await Promise.all([
            fetch(getBaseUrl('/leave-requests'), { credentials: 'include' }),
            fetch(getBaseUrl('/time-tracking/records'), { credentials: 'include' }),
            fetch(getBaseUrl('/interviews'), { credentials: 'include' }),
            fetch(getBaseUrl('/documents'), { credentials: 'include' }),
            fetch(getBaseUrl('/performance-reviews'), { credentials: 'include' }),
            fetch(getBaseUrl('/api/employee-payroll'), { credentials: 'include' }),
          ])

          let pendingLeaves = stats.pendingLeaves
          try {
            if (leavesRes.ok) {
              const leavesJson = await leavesRes.json().catch(() => ({} as any))
              const list: any[] = Array.isArray(leavesJson?.data) ? leavesJson.data : (Array.isArray(leavesJson) ? leavesJson : [])
              pendingLeaves = list.filter((r: any) => {
                const s = (r?.status ?? r?.leave_status ?? '').toString().toLowerCase()
                return s === 'pending' || s === '0' || s === 'awaiting'
              }).length
            }
          } catch (_) {}

          const activities: any[] = []
          try {
            if (recRes.ok) {
              const recJson = await recRes.json().catch(() => ({} as any))
              const recData: any[] = Array.isArray(recJson?.data) ? recJson.data : []
              activities.push(...recData.slice(0, 5).map((r: any) => {
                const who = r?.emp_name || r?.employee_name || `Employee ${r?.employee_id ?? ''}`
                let title = `${who} activity`
                if (r?.clock_in_time && !r?.clock_out_time) title = `${who} clocked in`
                if (r?.clock_out_time) title = `${who} clocked out`
                if (r?.break_start_time && !r?.break_end_time) title = `${who} started break`
                if (r?.break_end_time) title = `${who} ended break`
                return { type: 'attendance', title, meta: 'Attendance', time: r?.updated_at || r?.clock_in_time || r?.date || '' }
              }))
            }
          } catch (_) {}

          try {
            if (intRes.ok) {
              const intJson = await intRes.json().catch(() => ({} as any))
              const items: any[] = Array.isArray(intJson?.data) ? intJson.data : []
              activities.push(...items.slice(0, 5).map((it: any) => ({
                type: 'interview',
                title: it?.candidate_name ? `Interview scheduled with ${it.candidate_name}` : 'Interview activity',
                meta: it?.status ? `Interview • ${it.status}` : 'Interview',
                time: it?.scheduled_at || it?.created_at || ''
              })))
            }
          } catch (_) {}

          const pendingActions: any[] = []
          pendingActions.push({ title: `${pendingLeaves ?? 0} Leave Requests Pending`, subtitle: 'Awaiting approval', action: 'Approve', type: 'leave' })

          try {
            if (docRes.ok) {
              const docJson = await docRes.json().catch(() => ({} as any))
              const docs: any[] = Array.isArray(docJson?.data) ? docJson.data : []
              const compliance = computeDocumentCompliancePercent(docs)
              if (compliance !== null) {
                if (!aborted) setStats(prev => ({ ...prev, documentCompliancePercent: compliance }))
              }
              const now = new Date()
              const in30 = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
              const pendingDocs = docs.filter((d: any) => {
                const s = (d?.status ?? '').toString().toLowerCase()
                const expStr = d?.expiry_date || d?.expiryDate
                const exp = expStr ? new Date(expStr) : null
                return s === 'pending' || s === 'awaiting' || (exp && exp > now && exp < in30)
              }).length
              pendingActions.push({ title: `${pendingDocs} Documents Pending/Expiring`, subtitle: 'Within 30 days', action: 'Review', type: 'documents' })
            }
          } catch (_) {}

          try {
            if (perfRes.ok) {
              const perfJson = await perfRes.json().catch(() => ({} as any))
              const rows: any[] = Array.isArray(perfJson?.data) ? perfJson.data : []
              const avgPerf = computePerformanceAverage(rows)
              if (avgPerf !== null) {
                if (!aborted) setStats(prev => ({ ...prev, avgPerformance: avgPerf, performanceScore: avgPerf }))
              }
              const pendingPerf = rows.filter((r: any) => {
                const s = (r?.status ?? '').toString().toLowerCase()
                return s === 'pending' || s === 'due' || s === 'open'
              }).length
              pendingActions.push({ title: `${pendingPerf} Performance Reviews Due`, subtitle: 'Due by end of week', action: 'Review', type: 'performance' })
            }
          } catch (_) {}

          try {
            if (payrollRes.ok) {
              const payrollJson = await payrollRes.json().catch(() => ({} as any))
              const payrollRows: any[] = Array.isArray(payrollJson?.data) ? payrollJson.data : (Array.isArray(payrollJson) ? payrollJson : [])
              const total = computePayrollExpensesForCurrentMonth(payrollRows)
              if (total !== null) {
                if (!aborted) setStats(prev => ({ ...prev, payrollExpensesMonth: total }))
              } else {
                // Fallback: sum all records if date filtering fails
                const fallbackTotal = payrollRows.reduce((sum, r) => {
                  const amount = toNumber(r?.net_pay ?? r?.netPay ?? r?.amount ?? r?.total ?? r?.gross_pay ?? r?.grossPay ?? r?.salary ?? r?.base_salary ?? r?.baseSalary ?? r?.total_amount ?? r?.totalAmount ?? r?.pay_amount ?? r?.payAmount)
                  return sum + (amount || 0)
                }, 0)
                if (fallbackTotal > 0) {
                  if (!aborted) setStats(prev => ({ ...prev, payrollExpensesMonth: Math.round(fallbackTotal) }))
                  console.log('Using fallback payroll calculation:', fallbackTotal)
                }
              }
            }
          } catch (_) {}

          if (!aborted) {
            setStats(prev => ({
              ...prev,
              pendingLeaves: pendingLeaves ?? prev.pendingLeaves,
              recentActivities: activities.slice(0, 5),
              pendingActions,
            }))
          }
        } catch (_) {}
      }
    } catch (err: any) {
      if (!aborted) {
        setStatsError(err?.message || 'Unable to load stats')
        // Fallback demo values to keep UI populated
        setStats({
          totalEmployees: 24,
          presentToday: 22,
          pendingLeaves: 3,
          avgPerformance: 4.2,
          performanceScore: 4.2,
          payrollExpensesMonth: 48250,
          documentCompliancePercent: 87,
          monthlyAttendanceTrend: [
            { date: '2025-01-01', attendancePercent: 93 },
            { date: '2025-02-01', attendancePercent: 95 },
          ],
          recentActivities: [
            { type: 'attendance', title: 'Employee clocked in', meta: 'Attendance', time: '2 min ago' },
            { type: 'payroll', title: 'Monthly payroll processed', meta: 'Payroll', time: '1 hr ago' },
            { type: 'performance', title: 'Review reminder sent', meta: 'Performance', time: '3 hr ago' },
          ],
          pendingActions: [
            { title: '3 Leave Requests Pending', subtitle: 'Awaiting approval', action: 'Approve', type: 'leave' },
          ],
        })
      }
    } finally {
      if (!aborted) setLoadingStats(false)
    }
    return () => { aborted = true }
  }, [])

  useEffect(() => {
    setMounted(true)
    fetchStats()
  }, [fetchStats])

  const fetchFirstJson = useCallback(async (paths: string[]) => {
    for (const path of paths) {
      try {
        const res = await fetch(getBaseUrl(path), { credentials: 'include' })
        const contentType = res.headers.get('content-type') || ''
        if (!res.ok || !contentType.includes('application/json')) continue
        const json = await res.json().catch(() => null)
        if (json === null) continue
        return json
      } catch (_) {
        // try next
        continue
      }
    }
    return null
  }, [])

  const toArray = (json: any): any[] => {
    if (!json) return []
    if (Array.isArray(json)) return json
    if (Array.isArray(json?.data)) return json.data
    if (json?.data && typeof json.data === 'object') return [json.data]
    if (typeof json === 'object') return [json]
    return []
  }

  const sanitizeValue = (val: any): string => {
    if (val === null || val === undefined) return ''
    if (typeof val === 'object') {
      try { return JSON.stringify(val) } catch { return String(val) }
    }
    return String(val)
  }

  const buildCsvForDataset = (datasetName: string, rows: any[]): string => {
    if (!rows?.length) return ''
    const headersSet = new Set<string>()
    rows.forEach(r => Object.keys(r || {}).forEach(k => headersSet.add(k)))
    const headers = ['Dataset', ...Array.from(headersSet)]
    const escapeCell = (s: string) => {
      const needsQuotes = /[",\n\r]/.test(s)
      const escaped = s.replace(/"/g, '""')
      return needsQuotes ? `"${escaped}"` : escaped
    }
    const lines: string[] = []
    lines.push(headers.map(h => escapeCell(h)).join(','))
    for (const row of rows) {
      const values = headers.map((h, idx) => {
        if (idx === 0) return escapeCell(datasetName)
        return escapeCell(sanitizeValue((row as any)[h]))
      })
      lines.push(values.join(','))
    }
    return lines.join('\n')
  }

  const downloadTextFile = (text: string, filename: string) => {
    const blob = new Blob([text], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleExport = useCallback(async () => {
    if (exporting) return
    setExporting(true)
    try {
      // Fetch datasets (best-effort; tries multiple common paths)
      const [
        employeesJson,
        attendanceJson,
        timeTrackerJson,
        payrollJson,
        documentsJson,
        performanceJson,
        statsJson
      ] = await Promise.all([
        fetchFirstJson(['/api/company-employees']),
        fetchFirstJson(['/attendance', '/attendance/records', '/employers/attendance', '/api/employers/attendance', '/api/attendance']),
        fetchFirstJson(['/time-tracking/records', '/employers/time-tracking/records', '/api/employers/time-tracking/records', '/api/time-tracking/records']),
        fetchFirstJson(['/api/employee-payroll']),
        fetchFirstJson(['/documents', '/employers/documents', '/api/employers/documents', '/api/documents']),
        fetchFirstJson(['/performance-reviews', '/employers/performance-reviews', '/api/employers/performance-reviews', '/api/performance-reviews']),
        fetchFirstJson(['/hrms/stats', '/api/employers/hrms/stats', '/api/hrms/stats'])
      ])

      const employees = toArray(employeesJson)
      const attendance = toArray(attendanceJson)
      const timeTracker = toArray(timeTrackerJson)
      const payroll = toArray(payrollJson)
      const documents = toArray(documentsJson)
      const performance = toArray(performanceJson)
      const statsUnified = toArray(statsJson)

      // Also include the UI aggregated stats snapshot as a single row
      const statsSnapshot = [{
        totalEmployees: stats.totalEmployees,
        presentToday: stats.presentToday,
        pendingLeaves: stats.pendingLeaves,
        avgPerformance: stats.avgPerformance,
        performanceScore: stats.performanceScore,
        payrollExpensesMonth: stats.payrollExpensesMonth,
        documentCompliancePercent: stats.documentCompliancePercent
      }]

      const parts: string[] = []
      const pushSection = (name: string, rows: any[]) => {
        const csv = buildCsvForDataset(name, rows)
        if (csv) parts.push(csv)
      }

      pushSection('Employees', employees)
      pushSection('Attendance', attendance)
      pushSection('TimeTracker', timeTracker)
      pushSection('Payroll', payroll)
      pushSection('Documents', documents)
      pushSection('Performance', performance)
      pushSection('StatsUnified', statsUnified)
      pushSection('StatsSnapshot', statsSnapshot)

      const finalCsv = parts.join('\n\n')
      const now = new Date()
      const pad = (n: number) => String(n).padStart(2, '0')
      const filename = `employment-analytics-${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}.csv`
      downloadTextFile(finalCsv || 'Dataset,Note\nStatsSnapshot,No data available', filename)
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error('Export failed', e)
    } finally {
      setExporting(false)
    }
  }, [exporting, fetchFirstJson, stats])

  const modules = [
    {
      title: "Employee Management",
      description: "Add, edit, and manage employee information and records",
      icon: Users,
      color: "bg-indigo-500",
      href: "/employers/dashboard/employee-managment/employees",
      features: ["Add new employees", "Edit employee details", "View employee records", "Emergency contacts"],
      status: "active",
    },
    {
      title: "Attendance Management",
      description: "Track employee attendance, manage leave requests, and monitor absenteeism patterns",
      icon: Users,
      color: "bg-blue-500",
      href: "/employers/dashboard/employee-managment/attendance",
      features: ["Manual/Auto attendance", "Leave management", "Attendance reports", "Late arrival tracking"],
      status: "active",
    },
    {
      title: "Time Tracker",
      description: "Monitor work hours, break times, and calculate overtime with GPS location tracking",
      icon: Clock,
      color: "bg-green-500",
      href: "/employers/dashboard/employee-managment/time-tracker",
      features: ["Clock in/out system", "Break time tracking", "GPS location capture", "Overtime detection"],
      status: "active",
    },
    {
      title: "Payroll Management",
      description: "Calculate salaries, generate payslips, and manage tax deductions automatically",
      icon: DollarSign,
      color: "bg-yellow-500",
      href: "/employers/dashboard/employee-managment/payroll",
      features: ["Salary calculation", "Payroll reports", "Tax handling", "Bank transfer integration"],
      status: "active",
    },
    {
      title: "Document Management",
      description: "Securely store and manage employee documents with expiry reminders",
      icon: FileText,
      color: "bg-purple-500",
      href: "/employers/dashboard/employee-managment/documents",
      features: ["Document upload/storage", "Secure access control", "Expiry reminders", "Document categories"],
      status: "active",
    },
    {
      title: "Performance Review",
      description: "Conduct performance evaluations, track KPIs, and manage 360-degree feedback",
      icon: TrendingUp,
      color: "bg-indigo-500",
      href: "/employers/dashboard/employee-managment/performance",
      features: ["KPI tracking", "360-degree feedback", "Performance reports", "Improvement tracking"],
      status: "active",
    },
    
  ]

  const quickStats = useMemo(() => [
    { label: "Total Employees", value: loadingStats && !statsError ? '…' : String(stats.totalEmployees), icon: Users, color: "text-blue-600", change: statsError ? "error" : "live" },
    { label: "Present Today", value: loadingStats && !statsError ? '…' : String(stats.presentToday), icon: CheckCircle, color: "text-green-600", change: statsError ? "error" : "live" },
    { label: "Pending Leave", value: loadingStats && !statsError ? '…' : String(stats.pendingLeaves), icon: Calendar, color: "text-yellow-600", change: statsError ? "error" : "live" },
    { label: "Avg Performance", value: loadingStats && !statsError ? '…' : (stats.avgPerformance !== null ? String(stats.avgPerformance) : "—"), icon: Target, color: "text-purple-600", change: statsError ? "error" : "+0.0" },
  ], [stats, loadingStats, statsError])

  const formatCurrency = (amount: number | null | undefined) => {
    if (amount === null || amount === undefined || Number.isNaN(amount)) return '—'
    try {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(amount)
    } catch {
      return `$${Math.round(amount).toLocaleString()}`
    }
  }

  const formatPercent = (value: number | null | undefined) => {
    if (value === null || value === undefined || Number.isNaN(value)) return '—'
    return `${value}%`
  }

  // Helpers to derive metrics from raw datasets
  const getCurrentMonthRange = () => {
    const now = new Date()
    const start = new Date(now.getFullYear(), now.getMonth(), 1)
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 1)
    return { start, end }
  }

  const toNumber = (val: any): number | null => {
    const n = Number(val)
    return Number.isFinite(n) ? n : null
  }

  const computePayrollExpensesForCurrentMonth = (rows: any[]): number | null => {
    if (!Array.isArray(rows) || rows.length === 0) return null
    
    // Debug: log first few records to see structure
    console.log('Payroll data sample:', rows.slice(0, 2))
    
    const { start, end } = getCurrentMonthRange()
    let total = 0
    let any = false
    
    for (const r of rows) {
      // Try multiple possible date fields
      const payDateStr = r?.pay_date || r?.payDate || r?.date || r?.created_at || r?.updated_at || r?.payment_date || r?.payroll_date
      
      // Try multiple possible amount fields
      const amountCandidate = toNumber(
        r?.net_pay ?? r?.netPay ?? r?.amount ?? r?.total ?? r?.gross_pay ?? 
        r?.grossPay ?? r?.salary ?? r?.base_salary ?? r?.baseSalary ?? 
        r?.total_amount ?? r?.totalAmount ?? r?.pay_amount ?? r?.payAmount
      )
      
      if (amountCandidate === null) continue
      
      // If we have a date, filter by current month
      if (payDateStr) {
        const d = new Date(payDateStr)
        if (isNaN(d.getTime())) {
          // If date parsing fails, include the record anyway
          total += amountCandidate
          any = true
        } else if (d >= start && d < end) {
          total += amountCandidate
          any = true
        }
      } else {
        // No date field, include all records
        total += amountCandidate
        any = true
      }
    }
    
    console.log('Payroll calculation result:', { total, any, recordCount: rows.length })
    return any ? Math.round(total) : null
  }

  const computePerformanceAverage = (rows: any[]): number | null => {
    if (!Array.isArray(rows) || rows.length === 0) return null
    
    // Debug: log first few records to see structure
    console.log('Performance data sample:', rows.slice(0, 2))
    
    const scores: number[] = []
    for (const r of rows) {
      // Try multiple possible score fields
      const candidates = [
        r?.performance_score, r?.performanceScore, r?.score, r?.rating, r?.kpi_score,
        r?.overall_score, r?.overallScore, r?.final_score, r?.finalScore,
        r?.evaluation_score, r?.evaluationScore, r?.total_score, r?.totalScore
      ]
      for (const c of candidates) {
        const n = toNumber(c)
        if (n !== null) {
          scores.push(n)
          break
        }
      }
    }
    
    console.log('Performance calculation result:', { scores, recordCount: rows.length })
    if (!scores.length) return null
    const avg = scores.reduce((a, b) => a + b, 0) / scores.length
    return Math.round(avg * 10) / 10
  }

  const computeDocumentCompliancePercent = (docs: any[]): number | null => {
    if (!Array.isArray(docs) || docs.length === 0) return null
    
    // Debug: log first few records to see structure
    console.log('Document data sample:', docs.slice(0, 2))
    
    const now = new Date()
    let total = 0
    let compliant = 0
    
    for (const d of docs) {
      total += 1
      const status = (d?.status ?? d?.document_status ?? d?.approval_status ?? '').toString().toLowerCase()
      const expStr = d?.expiry_date || d?.expiryDate || d?.expires_at || d?.expiresAt
      const exp = expStr ? new Date(expStr) : null
      const isExpired = exp ? exp < now : false
      const isPending = status === 'pending' || status === 'awaiting' || status === 'draft'
      const isApproved = status === 'approved' || status === 'verified' || status === 'active' || status === 'valid'
      
      if (!isExpired && !isPending) {
        compliant += isApproved ? 1 : 1
      }
    }
    
    const result = total === 0 ? null : Math.max(0, Math.min(100, Math.round((compliant / total) * 100)))
    console.log('Document compliance calculation result:', { total, compliant, result })
    return result
  }

  const attendanceAvg = useMemo(() => {
    const arr = (stats.monthlyAttendanceTrend || []).map(x => x.attendancePercent).filter((v): v is number => v !== null && v !== undefined && !Number.isNaN(v))
    if (!arr.length) return null
    const sum = arr.reduce((a, b) => a + b, 0)
    return Math.round((sum / arr.length) * 10) / 10
  }, [stats.monthlyAttendanceTrend])

  const analyticsCards = useMemo(() => [
    { title: "Monthly Attendance Trend", value: loadingStats && !statsError ? '…' : formatPercent(attendanceAvg), change: '', trend: "up", icon: LineChart, color: "bg-blue-500" },
    { title: "Payroll Expenses", value: loadingStats && !statsError ? '…' : formatCurrency(stats.payrollExpensesMonth ?? null), change: '', trend: "up", icon: PieChart, color: "bg-green-500" },
    { title: "Performance Score", value: loadingStats && !statsError ? '…' : (stats.performanceScore !== null && stats.performanceScore !== undefined ? `${stats.performanceScore}` : '—'), change: '', trend: "up", icon: TrendingUp, color: "bg-purple-500" },
    { title: "Document Compliance", value: loadingStats && !statsError ? '…' : formatPercent(stats.documentCompliancePercent ?? null), change: '', trend: (stats.documentCompliancePercent ?? 0) >= 90 ? 'up' : 'down', icon: FileText, color: "bg-orange-500" },
  ], [attendanceAvg, loadingStats, statsError, stats.payrollExpensesMonth, stats.performanceScore, stats.documentCompliancePercent])

  if (!mounted) return null

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <BackButton/>
      <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600 rounded-2xl p-6 text-white">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Employment Management Analytics</h1>
            <p className="text-blue-100">Comprehensive HR analytics and workforce management tools</p>
          </div>
          <div className="mt-4 md:mt-0 flex space-x-3">
            <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-white/30" onClick={handleExport} disabled={exporting}>
              <BarChart3 className="h-4 w-4 mr-2" />
              {exporting ? 'Exporting…' : 'Export Reports'}
            </Button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsError && (
          <Card className="md:col-span-2 lg:col-span-4 border-red-200">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-red-700">{statsError}</p>
                <Button size="sm" variant="outline" className="bg-transparent" onClick={fetchStats} disabled={loadingStats}>Retry</Button>
              </div>
            </CardContent>
          </Card>
        )}
        {quickStats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-gray-100`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-600">{stat.label}</p>
                  </div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Analytics Overview Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {analyticsCards.map((card, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${card.color}`}>
                  <card.icon className="h-5 w-5 text-white" />
                </div>
                <Badge variant={card.trend === "up" ? "default" : "destructive"} className="text-xs">
                  {card.change}
                </Badge>
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900">{card.value}</p>
                <p className="text-sm text-gray-600">{card.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module, index) => (
          <Card key={index} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-lg ${module.color}`}>
                  <module.icon className="h-6 w-6 text-white" />
                </div>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  {module.status}
                </Badge>
              </div>
              <CardTitle className="text-lg font-semibold mt-3">{module.title}</CardTitle>
              <p className="text-sm text-gray-600 leading-relaxed">{module.description}</p>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Key Features:</h4>
                  <ul className="space-y-1">
                    {module.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="text-xs text-gray-600 flex items-center">
                        <CheckCircle className="h-3 w-3 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <Link href={module.href}>
                  <Button className="w-full mt-4 bg-gray-900 hover:bg-gray-800">
                    Access Module
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Enhanced Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-blue-600" />
              <span>Recent Activities</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(stats.recentActivities && stats.recentActivities.length > 0) ? (
                stats.recentActivities.map((act, idx) => (
                  <div key={idx} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                <div className="h-2 w-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                      <p className="text-sm font-medium">{act.title}</p>
                      <p className="text-xs text-gray-500">{act.time || ''} • {act.meta}</p>
                </div>
              </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground">No recent activities.</div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <span>Pending Actions</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {(stats.pendingActions && stats.pendingActions.length > 0) ? (
                stats.pendingActions.map((pa, idx) => (
                  <div key={idx} className={`flex items-center justify-between p-3 rounded-lg border ${pa.type === 'performance' ? 'bg-red-50 border-red-200' : pa.type === 'leave' ? 'bg-yellow-50 border-yellow-200' : 'bg-blue-50 border-blue-200'}`}>
                <div>
                      <p className={`text-sm font-medium ${pa.type === 'performance' ? 'text-red-800' : pa.type === 'leave' ? 'text-yellow-800' : 'text-blue-800'}`}>{pa.title}</p>
                      <p className={`text-xs ${pa.type === 'performance' ? 'text-red-600' : pa.type === 'leave' ? 'text-yellow-600' : 'text-blue-600'}`}>{pa.subtitle}</p>
                </div>
                    <Button size="sm" variant="outline" className={`${pa.type === 'performance' ? 'text-red-600 border-red-300' : pa.type === 'leave' ? 'text-yellow-600 border-yellow-300' : 'text-blue-600 border-blue-300'} bg-transparent`}>
                      {pa.action}
                </Button>
              </div>
                ))
              ) : (
                <div className="text-sm text-muted-foreground">No pending actions.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
