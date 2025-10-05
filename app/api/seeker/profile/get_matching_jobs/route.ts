import { NextResponse } from 'next/server'
import { getApiUrl } from '@/lib/api-config'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const jobseekerId = searchParams.get('jobseeker_id')
    const page = searchParams.get('page') || '1'
    const limit = searchParams.get('limit') || '5'
    const location = searchParams.get('location')
    const minSalary = searchParams.get('min_salary')
    const maxSalary = searchParams.get('max_salary')
    const jobType = searchParams.get('job_type')
    const industry = searchParams.get('industry')
    const experience = searchParams.get('experience')
    const remote = searchParams.get('remote')
    const search = searchParams.get('search')

    if (!jobseekerId) {
      return NextResponse.json({ success: false, message: 'jobseeker_id is required' }, { status: 400 })
    }

    const qs = new URLSearchParams()
    qs.set('jobseeker_id', jobseekerId)
    qs.set('page', page)
    qs.set('limit', limit)
    if (location) qs.set('location', location)
    if (minSalary) qs.set('min_salary', minSalary)
    if (maxSalary) qs.set('max_salary', maxSalary)
    if (jobType) qs.set('job_type', jobType)
    if (industry) qs.set('industry', industry)
    if (experience) qs.set('experience', experience)
    if (remote) qs.set('remote', remote)
    if (search) qs.set('search', search)

    const backend = await fetch(
      getApiUrl(`seeker/profile/get_matching_jobs?${qs.toString()}`), {
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
    if (ok) {
      return NextResponse.json({
        success: true,
        data: payload?.data ?? [],
        pagination: payload?.pagination ?? undefined
      }, { status: 200 })
    }
    return NextResponse.json({ success: false, message: payload?.message ?? 'Failed' }, { status: 400 })
  } catch (err) {
    console.error('Error in get_matching_jobs API:', err)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}







