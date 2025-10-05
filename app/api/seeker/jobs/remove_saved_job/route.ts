import { NextRequest, NextResponse } from 'next/server'
import { getApiUrl } from '@/lib/api-config'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const jobseekerId = searchParams.get('jobseeker_id')
    const jobId = searchParams.get('job_id')
    
    if (!jobseekerId || !jobId) {
      return NextResponse.json(
        { success: false, message: 'Jobseeker ID and Job ID are required' },
        { status: 400 }
      )
    }

    // Proxy the request to the PHP backend
    const backendUrl = getApiUrl(
      `seeker/profile/remove_saved_job?jobseeker_id=${encodeURIComponent(jobseekerId)}&job_id=${encodeURIComponent(jobId)}`
    )
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    })

    const raw = await response.text()
    let payload: any
    try {
      payload = raw ? JSON.parse(raw) : null
    } catch {
      payload = null
    }

    if (!response.ok) {
      return NextResponse.json(
        payload ?? { success: false, message: 'Failed to remove saved job' },
        { status: response.status }
      )
    }

    return NextResponse.json(
      payload ?? { success: true },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error in remove_saved_job API:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}