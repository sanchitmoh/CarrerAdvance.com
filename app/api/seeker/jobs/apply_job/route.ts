import { NextRequest, NextResponse } from 'next/server'
import { getApiUrl } from '@/lib/api-config'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    if (!body.jobseeker_id || !body.job_id) {
      return NextResponse.json(
        { success: false, message: 'Jobseeker ID and Job ID are required' },
        { status: 400 }
      )
    }

    // Proxy the request to the PHP backend
    const response = await fetch(
      getApiUrl('seeker/profile/apply_job'),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    )

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in apply_job API:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}