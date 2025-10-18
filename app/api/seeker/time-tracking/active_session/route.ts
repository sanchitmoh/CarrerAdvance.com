import { NextRequest, NextResponse } from 'next/server'
import { getBackendUrl } from '@/lib/api-config'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const jobseekerId = searchParams.get('jobseeker_id')
    
    if (!jobseekerId) {
      return NextResponse.json(
        { success: false, message: 'Jobseeker ID is required' },
        { status: 400 }
      )
    }

    // Use the configured backend URL
    const backendUrl = getBackendUrl(`/index.php/api/seeker/time-tracking/active_session?jobseeker_id=${encodeURIComponent(jobseekerId)}`)
    
    // Forward the request to the PHP backend
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        // Forward cookies for authentication
        'Cookie': request.headers.get('cookie') || '',
      },
    })

    if (!response.ok) {
      console.error('Backend request failed:', response.status, response.statusText)
      return NextResponse.json(
        { success: false, message: `Backend server error: ${response.status}` },
        { status: 500 }
      )
    }

    const data = await response.json()
    
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Get active session error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}


