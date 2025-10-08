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
    const backendUrl = getBackendUrl(`/api/seeker/profile/is_hired?jobseeker_id=${encodeURIComponent(jobseekerId)}`)
    
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
    console.error('Check hired status error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}