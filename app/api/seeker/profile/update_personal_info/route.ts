import { NextRequest, NextResponse } from 'next/server'
import { getApiUrl } from '@/lib/api-config'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    // Remove bio from payload if present
    if ('bio' in body) {
      delete body.bio
    }
    
    if (!body.jobseeker_id) {
      return NextResponse.json(
        { success: false, message: 'Jobseeker ID is required' },
        { status: 400 }
      )
    }

    // Proxy the request to the PHP backend
    const response = await fetch(
      getApiUrl('profile/update_personal_info'),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      }
    )

    const raw = await response.text()
    let data: any
    try {
      data = raw ? JSON.parse(raw) : null
      return NextResponse.json(data)
    } catch (e) {
      // If backend returns non-JSON but HTTP is OK, treat as success to avoid blocking the UI
      if (response.ok) {
        return NextResponse.json({ success: true, message: 'Updated successfully' })
      }
      return NextResponse.json({ success: false, message: 'Invalid response from backend', raw }, { status: 502 })
    }
  } catch (error) {
    console.error('Error in update_personal_info API:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}