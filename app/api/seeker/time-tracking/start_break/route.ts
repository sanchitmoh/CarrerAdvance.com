import { NextRequest, NextResponse } from 'next/server'
import { getBackendUrl } from '@/lib/api-config'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // Accept JSON or form-data from client
    let incoming: any = null
    try {
      incoming = await request.json()
    } catch {
      const fd = await request.formData()
      incoming = Object.fromEntries(fd.entries())
    }

    const backendUrl = getBackendUrl('/api/seeker/time-tracking/start_break')

    // Build form-data for PHP backend
    const backendForm = new FormData()
    if (incoming?.jobseeker_id) backendForm.append('jobseeker_id', String(incoming.jobseeker_id))
    if (incoming?.break_type) backendForm.append('break_type', String(incoming.break_type))
    if (incoming?.session_id) backendForm.append('session_id', String(incoming.session_id))
    if (incoming?.location) backendForm.append('location', String(incoming.location))
    if (incoming?.device_info) backendForm.append('device_info', String(incoming.device_info))
    if (incoming?.ip_address) backendForm.append('ip_address', String(incoming.ip_address))
    if (incoming?.notes) backendForm.append('notes', String(incoming.notes))

    const res = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        Cookie: request.headers.get('cookie') || '',
        Authorization: request.headers.get('authorization') || '',
      },
      cache: 'no-store',
      credentials: 'include',
      body: backendForm,
    })

    let responsePayload: any
    try {
      responsePayload = await res.json()
    } catch {
      const text = await res.text()
      responsePayload = { success: false, message: 'Upstream error', detail: text }
    }
    return NextResponse.json(responsePayload, { status: res.status })
  } catch (e) {
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}


