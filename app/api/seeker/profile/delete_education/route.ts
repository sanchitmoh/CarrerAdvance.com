import { NextRequest, NextResponse } from 'next/server'
import { getApiUrl } from '@/lib/api-config'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const jobseekerId = searchParams.get('jobseeker_id')
    const educationId = searchParams.get('id')
    
    if (!jobseekerId || !educationId) {
      return NextResponse.json(
        { success: false, message: 'Jobseeker ID and Education ID are required' },
        { status: 400 }
      )
    }

    // Proxy the request to the PHP backend
    const response = await fetch(
      getApiUrl(`seeker/profile/delete_education?jobseeker_id=${jobseekerId}&id=${educationId}`),
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
    console.error('Error in delete_education API:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}