import { NextRequest, NextResponse } from 'next/server'
import { getBackendUrl } from '@/lib/api-config'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const jobseekerId = searchParams.get('jobseeker_id')
    const companyId = searchParams.get('company_id')

    if (!jobseekerId) {
      return NextResponse.json({ success: false, message: 'jobseeker_id is required' }, { status: 400 })
    }

    // Build backend URL with all query parameters
    const base = getBackendUrl(`api/seeker/leaves/list`)
    const backendUrl = `${base}?jobseeker_id=${encodeURIComponent(jobseekerId)}${companyId ? `&company_id=${encodeURIComponent(companyId)}` : ''}`

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


