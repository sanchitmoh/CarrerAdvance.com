import { NextResponse } from 'next/server'
import { getApiUrl } from '@/lib/api-config'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const jobseekerId = searchParams.get('jobseeker_id')
    const page = searchParams.get('page') || '1'
    const limit = searchParams.get('limit') || '5'
    const search = searchParams.get('search')
    const status = searchParams.get('status')
    if (!jobseekerId) {
      return NextResponse.json({ success: false, message: 'jobseeker_id is required' }, { status: 400 })
    }

    const qs = new URLSearchParams()
    qs.set('jobseeker_id', jobseekerId)
    qs.set('page', page)
    qs.set('limit', limit)
    if (search) qs.set('search', search)
    if (status) qs.set('status', status)

    const backend = await fetch(
      getApiUrl(`seeker/profile/get_applications?${qs.toString()}`),
      { method: 'GET', headers: { 'Content-Type': 'application/json', Accept: 'application/json' } }
    )

    const raw = await backend.text()
    let payload: any
    try {
      payload = raw ? JSON.parse(raw) : null
    } catch {
      return NextResponse.json({ success: false, message: 'Invalid response from backend', raw }, { status: 502 })
    }

    const ok = payload?.success === true || payload?.status === 1
    if (ok) {
      return NextResponse.json({
        success: true,
        data: payload?.data ?? [],
        pagination: payload?.pagination ?? undefined
      }, { status: 200 })
    }
    return NextResponse.json({ success: false, message: payload?.message ?? 'Failed' }, { status: 400 })
  } catch (err) {
    console.error('Error in get_applications API:', err)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}







