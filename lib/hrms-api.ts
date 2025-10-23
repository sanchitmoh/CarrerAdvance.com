import { getBaseUrl } from './api-config'

export type AttendanceCoreStatus = 'present' | 'absent' | 'late' | 'leave'
export type AttendanceApprovalStatus = 'pending' | 'approved' | 'rejected'
export type AttendanceStatus = AttendanceCoreStatus | AttendanceApprovalStatus

export type EmployeeAttendanceRow = {
  id: number
  companyemp_id: number
  company_id: number
  date: string
  check_in_time: string | null
  break_in_time: string | null
  break_out_time: string | null
  check_out_time: string | null
  total_hours: string | null
  hours: string | null
  state: string | null
  note: string | null
  emp_note: string | null
  status: AttendanceStatus
  available: number
  created_date: string | null
  created_by: number | null
  updated_on: string | null
  updated_by: number | null
  employmentType: string | null
}

export type AttendanceRecord = {
  id: number
  employeeId: number
  employeeName: string
  date: string
  status: AttendanceStatus
  checkIn?: string | null
  checkOut?: string | null
  breakIn?: string | null
  breakOut?: string | null
  totalHours?: string | null
  notes?: string | null
  employeeNotes?: string | null
  employmentType?: string | null
  available?: boolean
}

export type CompanyEmployee = {
  id: number
  company_id: number
  department_id: number | null
  designation_id: number | null
  work_status: 'active' | 'left'
  name: string
  email: string
  mobile: string
  emp_type: string
  emp_code: string
  image: string
}

export type Department = { id: number; name: string }
export type Designation = { id: number; department_id: number | null; name: string }

export async function fetchDepartments(): Promise<Department[]> {
  const url = getBaseUrl('/api/lookups/departments')
  const res = await fetch(url, { credentials: 'include' })
  const json = await res.json().catch(() => ({}))
  if (!res.ok || !json?.success) return []
  return (json.data || []) as Department[]
}

export async function fetchDesignations(): Promise<Designation[]> {
  const url = getBaseUrl('/api/lookups/designations')
  const res = await fetch(url, { credentials: 'include' })
  const json = await res.json().catch(() => ({}))
  if (!res.ok || !json?.success) return []
  return (json.data || []) as Designation[]
}

export async function fetchCompanyEmployees(): Promise<CompanyEmployee[]> {
  // Build URL and include company_id when available
  const params = new URLSearchParams()
  try {
    if (typeof window !== 'undefined') {
      const cid = window.localStorage?.getItem('company_id') || ''
      if (cid) params.set('company_id', cid)
    }
  } catch (_) {}
  const url = getBaseUrl(`/attendance/employees${params.toString() ? `?${params.toString()}` : ''}`)
  const res = await fetch(url, { credentials: 'include' })
  const json = await res.json().catch(() => ({}))
  if (!res.ok || !json?.success) return []
  return (json.data || []) as CompanyEmployee[]
}

// KPI Categories
export interface KpiCategoryRow {
  id: number
  company_id: number
  name: string
  description?: string
  is_active: 0 | 1
  created_at?: string
  updated_at?: string
}

export async function fetchKpiCategories(): Promise<KpiCategoryRow[]> {
  // Build URL without duplicate /api and include company_id when available
  const params = new URLSearchParams()
  try {
    if (typeof window !== 'undefined') {
      const cid = window.localStorage?.getItem('company_id') || ''
      if (cid) params.set('company_id', cid)
    }
  } catch (_) {}
  const url = getBaseUrl(`/kpi-categories${params.toString() ? `?${params.toString()}` : ''}`)
  const res = await fetch(url, { credentials: 'include' })
  const json = await res.json().catch(() => ({}))
  if (!res.ok || !json?.success) return []
  return (json.data || []) as KpiCategoryRow[]
}

// Performance Reviews
export interface CreatePerformanceReviewPayload {
  employee_id: number
  reviewer_id: number
  review_period_id?: number | null
  overall_score?: number | null
  feedback?: string
  goals?: string
  improvements?: string
  status?: string
  review_date?: string
  next_review_date?: string | null
  kpi_scores: Array<{ kpi_category_id: number; score: number; comments?: string }>
}

export async function createPerformanceReview(payload: CreatePerformanceReviewPayload): Promise<{ success: boolean; data?: any; message?: string }> {
  const url = getBaseUrl('/performance-reviews')
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  })
  const json = await res.json().catch(() => ({}))
  return json
}

export interface PerformanceReviewRow {
  id: number
  company_id: number
  employee_id: number
  reviewer_id: number
  review_period_id: number | null
  overall_score: number | null
  feedback?: string | null
  goals?: string | null
  improvements?: string | null
  status: string
  review_date: string
  next_review_date?: string | null
  created_at?: string
  updated_at?: string
  employee_name?: string
  reviewer_name?: string
  period_name?: string
  review_type?: string
  department_name?: string
  designation_name?: string
  kpi_scores?: Array<{ review_id: number; kpi_category_id: number; score: number; comments?: string | null }>
}

export async function fetchPerformanceReviews(reviewPeriodId?: number): Promise<PerformanceReviewRow[]> {
  const q = new URLSearchParams()
  if (reviewPeriodId) q.set('review_period_id', String(reviewPeriodId))
  // Add company_id when available
  try {
    if (typeof window !== 'undefined') {
      const cid = window.localStorage?.getItem('company_id') || ''
      if (cid) q.set('company_id', cid)
    }
  } catch (_) {}
  const url = getBaseUrl(`/performance-reviews${q.toString() ? `?${q.toString()}` : ''}`)
  const res = await fetch(url, { credentials: 'include' })
  const json = await res.json().catch(() => ({}))
  if (!res.ok || !json?.success) return []
  return (json.data || []) as PerformanceReviewRow[]
}

// Review Periods (Performance Cycle)
export type ReviewPeriodStatus = 'active' | 'completed' | 'cancelled'
export type ReviewType = 'quarterly' | 'annual' | 'probation' | 'promotion'

export interface ReviewPeriodRow {
  id: number
  company_id: number
  name: string
  start_date: string
  end_date: string
  review_type: ReviewType
  status: ReviewPeriodStatus
  created_at: string
  updated_at: string
}

export type ReviewPeriod = ReviewPeriodRow

export async function fetchReviewPeriods(): Promise<ReviewPeriod[]> {
  // Build URL and include company_id when available
  const params = new URLSearchParams()
  try {
    if (typeof window !== 'undefined') {
      const cid = window.localStorage?.getItem('company_id') || ''
      if (cid) params.set('company_id', cid)
    }
  } catch (_) {}
  const url = getBaseUrl(`/review-periods${params.toString() ? `?${params.toString()}` : ''}`)
  const res = await fetch(url, { credentials: 'include' })
  const json = await res.json().catch(() => ({}))
  if (!res.ok || !json?.success) return []
  return (json.data || []) as ReviewPeriod[]
}

export async function createReviewPeriod(payload: {
  name: string
  start_date: string
  end_date: string
  review_type: ReviewType
  status: ReviewPeriodStatus
}): Promise<{ success: boolean; data?: ReviewPeriod; message?: string }> {
  const url = getBaseUrl('/review-periods')
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  })
  const json = await res.json().catch(() => ({}))
  return json
}

export async function updateReviewPeriod(id: number, payload: Partial<{
  name: string
  start_date: string
  end_date: string
  review_type: ReviewType
  status: ReviewPeriodStatus
}>): Promise<{ success: boolean; data?: ReviewPeriod; message?: string }> {
  const url = getBaseUrl(`/review-periods/${id}/update`)
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  })
  const json = await res.json().catch(() => ({}))
  return json
}

export async function deleteReviewPeriod(id: number): Promise<{ success: boolean; message?: string }> {
  const url = getBaseUrl(`/review-periods/${id}/delete`)
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
  })
  const json = await res.json().catch(() => ({}))
  return json
}

function mapRowToRecord(row: EmployeeAttendanceRow, employeeName: string): AttendanceRecord {
  return {
    id: row.id,
    employeeId: row.companyemp_id,
    employeeName,
    date: row.date,
    status: row.status,
    checkIn: row.check_in_time,
    checkOut: row.check_out_time,
    breakIn: row.break_in_time,
    breakOut: row.break_out_time,
    totalHours: row.total_hours ?? row.hours,
    notes: row.note,
    employeeNotes: row.emp_note,
    employmentType: row.employmentType,
    available: row.available === 1,
  }
}

export async function fetchAttendance(employeeId: number, from?: string, to?: string, employeeName = ''): Promise<AttendanceRecord[]> {
  const q = new URLSearchParams({ employee_id: String(employeeId) })
  if (from) q.set('from', from)
  if (to) q.set('to', to)
  const url = getBaseUrl(`/api/attendance?${q.toString()}`)
  const res = await fetch(url, { credentials: 'include' })
  const json = await res.json().catch(() => ({}))
  if (!res.ok || !json?.success) return []
  const rows: EmployeeAttendanceRow[] = json.data || []
  return rows.map((r) => mapRowToRecord(r, employeeName))
}

export async function markAttendance(payload: {
  employee_id: number
  date: string
  status: AttendanceStatus
  checkIn?: string
  checkOut?: string
  note?: string
}): Promise<{ success: boolean; id?: number; message?: string }> {
  const url = getBaseUrl('/api/attendance/mark')
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  })
  const json = await res.json().catch(() => ({}))
  return json
}


// Fetch attendance for ALL employees (omit employee_id). Defaults to today if no range is given.
export async function fetchAttendanceAll(from?: string, to?: string): Promise<EmployeeAttendanceRow[]> {
  const q = new URLSearchParams()
  if (from) q.set('from', from)
  if (to) q.set('to', to)
  const query = q.toString()
  const url = getBaseUrl(`/api/attendance${query ? `?${query}` : ''}`)
  const res = await fetch(url, { credentials: 'include' })
  const json = await res.json().catch(() => ({}))
  if (!res.ok || !json?.success) return []
  return (json.data || []) as EmployeeAttendanceRow[]
}