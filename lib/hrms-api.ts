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
  const url = getBaseUrl('/api/attendance/employees')
  const res = await fetch(url, { credentials: 'include' })
  const json = await res.json().catch(() => ({}))
  if (!res.ok || !json?.success) return []
  return (json.data || []) as CompanyEmployee[]
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


