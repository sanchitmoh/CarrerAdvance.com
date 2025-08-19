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
    const response = await fetch(
      getApiUrl(`seeker/profile/remove_saved_job?jobseeker_id=${jobseekerId}&job_id=${jobId}`),
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in remove_saved_job API:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}