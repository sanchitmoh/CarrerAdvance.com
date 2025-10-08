import { NextRequest, NextResponse } from 'next/server'
import { getBackendUrl } from '@/lib/api-config'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const jobseeker_id = formData.get('jobseeker_id') as string
    
    if (!jobseeker_id) {
      return NextResponse.json(
        { success: false, message: 'Jobseeker ID is required' },
        { status: 400 }
      )
    }

    // Use the configured backend URL
    const backendUrl = getBackendUrl('/api/seeker/time-tracking/end_break')
    
    // Create FormData for the backend
    const backendFormData = new FormData()
    backendFormData.append('jobseeker_id', jobseeker_id)
    
    // Forward the request to the PHP backend
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        // Forward cookies for authentication
        'Cookie': request.headers.get('cookie') || '',
      },
      body: backendFormData,
    })

    const data = await response.json()
    
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('End break error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}


