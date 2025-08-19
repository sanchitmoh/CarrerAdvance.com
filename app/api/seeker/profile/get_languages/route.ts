import { NextResponse } from 'next/server'
import { getApiUrl } from '@/lib/api-config'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const jobseekerId = searchParams.get('jobseeker_id')

    if (!jobseekerId) {
      return NextResponse.json(
        { success: false, message: 'jobseeker_id is required' },
        { status: 400 }
      )
    }

    // Connect to backend API for ew_seeker_languages table
    const backendRes = await fetch(
      getApiUrl(`seeker/profile/get_languages?jobseeker_id=${encodeURIComponent(jobseekerId)}`),
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
    )

    const payload = await backendRes.json()
    const ok = payload?.status === 1 || payload?.success === true
    
    return NextResponse.json(
      ok ? { success: true, data: payload?.data ?? [] } : { success: false, message: payload?.message ?? 'Failed to get languages' },
      { status: ok ? 200 : 400 }
    )
  } catch (error) {
    console.error('Error in get_languages API:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}


