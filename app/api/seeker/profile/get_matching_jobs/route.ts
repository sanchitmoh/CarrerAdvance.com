import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const jobseekerId = searchParams.get('jobseeker_id')
    const page = searchParams.get('page') || '1'
    const limit = searchParams.get('limit') || '5'
    
    if (!jobseekerId) {
      return NextResponse.json({ success: false, message: 'jobseeker_id is required' }, { status: 400 })
    }

    // Use environment variable for backend URL
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080'
    const apiUrl = `${backendUrl}/index.php/api/seeker/profile/get_matching_jobs?jobseeker_id=${encodeURIComponent(jobseekerId)}&page=${page}&limit=${limit}`

    const backend = await fetch(apiUrl, {
      method: 'GET', 
      headers: { 
        'Content-Type': 'application/json', 
        'Accept': 'application/json' 
      }
    })

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







