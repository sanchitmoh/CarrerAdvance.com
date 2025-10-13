import { NextRequest, NextResponse } from 'next/server'
import { getBackendUrl } from '@/lib/api-config'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const backendUrl = getBackendUrl('seeker/time-tracking/end_break')

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


