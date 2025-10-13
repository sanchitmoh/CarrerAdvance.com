import { NextRequest, NextResponse } from 'next/server'
import { getBackendUrl } from '@/lib/api-config'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const jobseekerId = searchParams.get('jobseeker_id')
    const explicitEmployeeId = searchParams.get('employee_id')

    if (!jobseekerId && !explicitEmployeeId) {
      return NextResponse.json({ success: false, message: 'jobseeker_id or employee_id is required' }, { status: 400 })
    }

    // Resolve company_id from cookie or query param
    const cookieHeader = request.headers.get('cookie') || ''
    const employerIdMatch = /(?:^|; )employer_id=([^;]+)/.exec(cookieHeader)
    const cookieCompanyId = employerIdMatch ? decodeURIComponent(employerIdMatch[1]) : ''
    const qpCompanyId = searchParams.get('company_id')
    let effectiveCompanyId = qpCompanyId || cookieCompanyId

    // Resolve employee_id if not provided, using hiring employers list
    let employeeId = explicitEmployeeId || ''
    if (!employeeId && jobseekerId) {
      try {
        const hiringRes = await fetch(`${getBackendUrl('api/seeker/profile/get_hiring_employers')}?jobseeker_id=${encodeURIComponent(jobseekerId)}`, {
          headers: { Cookie: cookieHeader },
          cache: 'no-store',
          credentials: 'include',
        })
        const hiringPayload = await hiringRes.json().catch(() => ({} as any))
        const first = Array.isArray(hiringPayload?.data) && hiringPayload.data.length ? hiringPayload.data[0] : null
        if (first?.employee_id) employeeId = String(first.employee_id)
        if (!effectiveCompanyId && first?.company_id) effectiveCompanyId = String(first.company_id)
        // Fallback: active session has mapping
        if (!employeeId) {
          const sessionRes = await fetch(`${request.nextUrl.origin}/api/seeker/time-tracking/active_session?jobseeker_id=${encodeURIComponent(jobseekerId)}`, {
            headers: { Cookie: cookieHeader },
            cache: 'no-store',
            credentials: 'include',
          })
          const sessionPayload = await sessionRes.json().catch(() => ({} as any))
          if (sessionPayload?.success && sessionPayload?.data) {
            if (sessionPayload.data.employee_id) employeeId = String(sessionPayload.data.employee_id)
            if (!effectiveCompanyId && sessionPayload.data.company_id) effectiveCompanyId = String(sessionPayload.data.company_id)
          }
        }
      } catch {
        // ignore resolution errors
      }
    }

    if (!employeeId) {
      return NextResponse.json({ success: true, data: [] }, { status: 200 })
    }

    const base = getBackendUrl(`api/leave-requests/employee/${encodeURIComponent(employeeId)}`)
    const backendUrl = effectiveCompanyId ? `${base}?company_id=${encodeURIComponent(effectiveCompanyId)}` : base

    const res = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        Cookie: request.headers.get('cookie') || '',
        Authorization: request.headers.get('authorization') || '',
      },
      cache: 'no-store',
      credentials: 'include',
    })

    let payload: any
    try {
      payload = await res.json()
    } catch {
      const text = await res.text()
      payload = { success: false, message: 'Upstream error', detail: text }
    }
    return NextResponse.json(payload, { status: res.status })
  } catch (e) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}


