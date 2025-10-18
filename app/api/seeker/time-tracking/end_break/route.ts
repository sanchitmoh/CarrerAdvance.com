import { NextRequest, NextResponse } from 'next/server'
import { getBackendUrl } from '@/lib/api-config'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // Check content type to determine how to read the body
    const contentType = request.headers.get('content-type') || ''
    let incoming: any = null
    
    if (contentType.includes('application/json')) {
      incoming = await request.json()
    } else {
      const fd = await request.formData()
      incoming = Object.fromEntries(fd.entries())
    }

    const backendUrl = getBackendUrl('/index.php/api/seeker/time-tracking/end_break')
    console.log('Backend URL:', backendUrl)
    console.log('Incoming data:', incoming)

    // Build form-data for PHP backend
    const backendForm = new FormData()
    if (incoming?.jobseeker_id) backendForm.append('jobseeker_id', String(incoming.jobseeker_id))
    if (incoming?.session_id) backendForm.append('session_id', String(incoming.session_id))
    if (incoming?.location) backendForm.append('location', String(incoming.location))
    if (incoming?.device_info) backendForm.append('device_info', String(incoming.device_info))
    if (incoming?.ip_address) backendForm.append('ip_address', String(incoming.ip_address))
    if (incoming?.notes) backendForm.append('notes', String(incoming.notes))

    console.log('Making request to backend...')
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

    console.log('Backend response status:', res.status)
    console.log('Backend response headers:', Object.fromEntries(res.headers.entries()))

    let responsePayload: any
    try {
      responsePayload = await res.json()
      console.log('Backend response payload:', responsePayload)
    } catch {
      const text = await res.text()
      console.log('Backend response text:', text)
      responsePayload = { success: false, message: 'Upstream error', detail: text }
    }
    return NextResponse.json(responsePayload, { status: res.status })
  } catch (e) {
    console.error('Error in end_break API route:', e)
    return NextResponse.json({ success: false, message: 'Internal server error', error: e.message }, { status: 500 })
  }
}


