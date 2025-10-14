import { NextRequest, NextResponse } from 'next/server'
import { getBackendUrl } from '@/lib/api-config'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const jobseekerId = searchParams.get('jobseeker_id')
    const companyId = searchParams.get('company_id')
    const cookieHeader = request.headers.get('cookie') || ''
    const employerIdMatch = /(?:^|; )employer_id=([^;]+)/.exec(cookieHeader)
    const cookieCompanyId = employerIdMatch ? decodeURIComponent(employerIdMatch[1]) : ''
    const effectiveCompanyId = companyId || cookieCompanyId

    const qs = new URLSearchParams()
    if (jobseekerId) qs.set('jobseeker_id', jobseekerId)
    if (effectiveCompanyId) qs.set('company_id', effectiveCompanyId)

    const backendUrl = getBackendUrl(`api/seeker/profile/get_employee_mapping${qs.toString() ? `?${qs.toString()}` : ''}`)

    const res = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        Cookie: cookieHeader,
        Authorization: request.headers.get('authorization') || '',
      },
      cache: 'no-store',
      credentials: 'include',
    })

    let payload: any
    try { payload = await res.json() } catch { payload = { success: false, message: 'Upstream parse error' } }
    return NextResponse.json(payload, { status: res.status })
  } catch (e) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}


