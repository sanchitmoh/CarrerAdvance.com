import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const jobseekerId = searchParams.get('jobseeker_id')
    if (!jobseekerId) {
      return NextResponse.json({ success: false, message: 'jobseeker_id is required' }, { status: 400 })
    }

    const backend = await fetch(
      `http://localhost:8080/index.php/api/seeker/profile/get_matching_jobs?jobseeker_id=${encodeURIComponent(jobseekerId)}`,
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
    return NextResponse.json(
      ok ? { success: true, data: payload?.data ?? [] } : { success: false, message: payload?.message ?? 'Failed' },
      { status: ok ? 200 : 400 }
    )
  } catch (err) {
    console.error('Error in get_matching_jobs API:', err)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}







