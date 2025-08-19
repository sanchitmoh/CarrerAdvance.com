import { NextResponse } from 'next/server'
import { getApiUrl } from '@/lib/api-config'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const user_id = searchParams.get('user_id')
    if (!user_id) {
      return NextResponse.json(
        { success: false, message: 'user_id is required' },
        { status: 400 }
      )
    }

    // Re-use profile endpoint that returns resume path in ew_users.resume if available
    const backendRes = await fetch(getApiUrl(`seeker/profile/get_resume?user_id=${encodeURIComponent(user_id)}`), {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' }
    })

    const raw = await backendRes.text()
    let payload: any = null
    try {
      payload = raw ? JSON.parse(raw) : null
    } catch (e) {
      // Backend did not return JSON; surface minimal info but avoid 500
      return NextResponse.json(
        { success: false, message: 'Invalid response from backend', raw },
        { status: 502 }
      )
    }

    const ok = payload?.success === true || payload?.status === 1
    if (!ok) {
      return NextResponse.json(
        { success: false, message: payload?.message ?? 'Failed', data: payload?.data ?? null },
        { status: 400 }
      )
    }
    const resume = payload?.data?.resume ?? payload?.data?.user_info?.resume ?? null
    return NextResponse.json({ success: true, data: { resume } })
  } catch (error) {
    console.error('Error in get_resume API:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}


