import { NextRequest, NextResponse } from 'next/server'
import { getBackendUrl } from '@/lib/api-config'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    // POST maps to create in Leave_api::index_post via routes.php
    // Also forward company_id from cookie if present to satisfy backend scoping
    const cookieHeader = request.headers.get('cookie') || ''
    const employerIdMatch = /(?:^|; )employer_id=([^;]+)/.exec(cookieHeader)
    const companyId = employerIdMatch ? decodeURIComponent(employerIdMatch[1]) : ''
    const baseUrl = getBackendUrl('api/leave-requests')
    const reqUrl = new URL(request.url)
    const companyIdQP = reqUrl.searchParams.get('company_id')
    const effectiveCompanyId = companyIdQP || companyId
    const backendUrl = effectiveCompanyId ? `${baseUrl}?company_id=${encodeURIComponent(effectiveCompanyId)}` : baseUrl

    // If employee_id missing but jobseeker_id provided, try resolving via active_session
    const hasEmployeeId = !!formData.get('employee_id')
    const jobseekerId = formData.get('jobseeker_id') || reqUrl.searchParams.get('jobseeker_id')
    if (!hasEmployeeId && jobseekerId) {
      try {
        const sessionRes = await fetch(`${request.nextUrl.origin}/api/seeker/time-tracking/active_session?jobseeker_id=${encodeURIComponent(String(jobseekerId))}`, {
          headers: { Cookie: cookieHeader },
          cache: 'no-store',
          credentials: 'include',
        })
        const sessionPayload = await sessionRes.json().catch(() => ({} as any))
        if (sessionPayload?.success && sessionPayload?.data) {
          if (sessionPayload.data.employee_id && !formData.get('employee_id')) {
            formData.append('employee_id', String(sessionPayload.data.employee_id))
          }
          if (!effectiveCompanyId && sessionPayload.data.company_id && !formData.get('company_id')) {
            formData.append('company_id', String(sessionPayload.data.company_id))
          }
        }
      } catch {
        // ignore; will proceed with whatever we have
      }
    }

    const res = await fetch(backendUrl, {
      method: 'POST',
      body: formData,
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


