import { NextRequest, NextResponse } from 'next/server'
import { getBackendUrl } from '@/lib/api-config'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const jobseeker_id = formData.get('jobseeker_id') as string
    const location = formData.get('location') as string
    const device_info = formData.get('device_info') as string
    const ip_address = formData.get('ip_address') as string
    
    if (!jobseeker_id) {
      return NextResponse.json(
        { success: false, message: 'Jobseeker ID is required' },
        { status: 400 }
      )
    }

    // Use the configured backend URL
    const backendUrl = getBackendUrl('/index.php/api/seeker/time-tracking/clock_in')
    
    // Create FormData for the backend
    const backendFormData = new FormData()
    backendFormData.append('jobseeker_id', jobseeker_id)
    backendFormData.append('location', location || '')
    backendFormData.append('device_info', device_info || '')
    backendFormData.append('ip_address', ip_address || '')
    
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
    console.error('Clock in error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
