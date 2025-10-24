import { NextRequest, NextResponse } from 'next/server'
import { getBackendUrl } from '@/lib/api-config'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.log('Received request body:', body)
    const { type, id } = body

    console.log('Extracted type:', type)
    console.log('Extracted id:', id)

    // Validate required fields
    if (!type || !id) {
      console.log('Validation failed - type:', type, 'id:', id)
      return NextResponse.json(
        { success: false, message: 'type and id are required' },
        { status: 400 }
      )
    }

    // Validate type
    if (!['jobseeker', 'employer', 'student'].includes(type)) {
      return NextResponse.json(
        { success: false, message: 'Invalid type. Must be jobseeker, employer, or student' },
        { status: 400 }
      )
    }

    // Call the backend API
    const backendUrl = getBackendUrl('index.php/api/admin/users/suspend')
    
    // Forward cookies from the original request to maintain session
    const cookieHeader = req.headers.get('cookie')
    console.log('Forwarding cookies for suspend:', cookieHeader)
    
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(cookieHeader && { 'Cookie': cookieHeader }),
      },
      body: JSON.stringify({ type, id }),
    })

    const result = await response.json()

    if (result.success) {
      return NextResponse.json(result)
    } else {
      return NextResponse.json(
        { success: false, message: result.message || 'Failed to suspend user' },
        { status: response.status }
      )
    }
  } catch (error) {
    console.error('Error in suspend API:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
