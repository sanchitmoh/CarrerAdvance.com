import { NextRequest, NextResponse } from 'next/server'
import { getBackendUrl } from '@/lib/api-config'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const jobseekerId = searchParams.get('jobseeker_id')
    const date = searchParams.get('date')
    
    if (!jobseekerId) {
      return NextResponse.json(
        { success: false, message: 'Jobseeker ID is required' },
        { status: 400 }
      )
    }

    // Use the configured backend URL
    const queryParams = new URLSearchParams()
    queryParams.append('jobseeker_id', jobseekerId)
    if (date) queryParams.append('date', date)
    
    const backendUrl = getBackendUrl(`/api/seeker/time-tracking/sessions?${queryParams.toString()}`)
    
    // Forward the request to the PHP backend
    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        // Forward cookies for authentication
        'Cookie': request.headers.get('cookie') || '',
      },
    })

    const data = await response.json()
    
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Get sessions error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}


