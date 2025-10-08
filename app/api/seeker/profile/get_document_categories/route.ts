import { NextRequest, NextResponse } from 'next/server'
import { getBackendUrl } from '@/lib/api-config'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const jobseekerId = searchParams.get('jobseeker_id')
    const employerId = searchParams.get('employer_id')
    
    if (!jobseekerId && !employerId) {
      return NextResponse.json(
        { success: false, message: 'jobseeker_id or employer_id is required' },
        { status: 400 }
      )
    }

    // Build query string
    const queryParams = new URLSearchParams()
    if (jobseekerId) queryParams.append('jobseeker_id', jobseekerId)
    if (employerId) queryParams.append('employer_id', employerId)
    
    // Use the configured backend URL
    const backendUrl = getBackendUrl(`/api/seeker/profile/get_document_categories?${queryParams.toString()}`)
    
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
    console.error('Get document categories error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}