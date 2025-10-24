import { NextRequest, NextResponse } from 'next/server'
import { getBackendUrl } from '@/lib/api-config'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.log('Received login request body:', body)
    
    const { type, id, redirect } = body

    console.log('Extracted login params - type:', type, 'id:', id, 'redirect:', redirect)

    // Validate required fields
    if (!type || !id) {
      console.log('Validation failed - type:', type, 'id:', id)
      return NextResponse.json(
        { success: false, message: 'type and id are required' },
        { status: 400 }
      )
    }

    // Validate user type
    if (!['jobseeker', 'employer', 'student'].includes(type)) {
      return NextResponse.json(
        { success: false, message: 'Invalid type. Must be jobseeker, employer, or student' },
        { status: 400 }
      )
    }

    // Validate id is a positive number
    if (typeof id !== 'number' || id <= 0) {
      return NextResponse.json(
        { success: false, message: 'id must be a positive number' },
        { status: 400 }
      )
    }

    const backendUrl = getBackendUrl('index.php/api/admin/users/impersonate')
    console.log('Forwarding login request to backend:', backendUrl)

    const requestBody = {
      type,
      id,
      ...(redirect && { redirect })
    }

    console.log('Request body to backend:', requestBody)

    // Forward cookies from the original request to maintain session
    const cookieHeader = req.headers.get('cookie')
    console.log('Forwarding cookies:', cookieHeader)

    const backendResponse = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(cookieHeader && { 'Cookie': cookieHeader }),
      },
      body: JSON.stringify(requestBody),
    })

    console.log('Backend response status:', backendResponse.status)
    console.log('Backend response headers:', Object.fromEntries(backendResponse.headers.entries()))

    const responseText = await backendResponse.text()
    console.log('Backend response text:', responseText.substring(0, 500)) // First 500 chars

    let backendResult
    try {
      backendResult = JSON.parse(responseText)
    } catch (parseError) {
      console.error('Failed to parse backend response as JSON:', parseError)
      console.error('Response was:', responseText)
      return NextResponse.json(
        { success: false, message: 'Backend returned invalid response' },
        { status: 500 }
      )
    }

    console.log('Backend login response:', backendResult)

    if (backendResult.success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Login link generated successfully',
        data: {
          link: backendResult.data.link,
          token: backendResult.data.token,
          expires_in: backendResult.data.expires_in
        }
      })
    } else {
      return NextResponse.json(
        { success: false, message: backendResult.message || 'Failed to generate login link' },
        { status: backendResponse.status }
      )
    }
  } catch (error) {
    console.error('Error in login API route:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
