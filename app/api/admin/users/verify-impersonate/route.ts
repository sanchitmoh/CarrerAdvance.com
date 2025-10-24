import { NextRequest, NextResponse } from 'next/server'
import { getBackendUrl } from '@/lib/api-config'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    console.log('Received verify token request:', body)
    
    const { token } = body

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Token is required' },
        { status: 400 }
      )
    }

    const backendUrl = getBackendUrl('index.php/api/admin/users/verify-impersonate')
    console.log('Verifying token with backend:', backendUrl)

    // Forward cookies from the original request to maintain session
    const cookieHeader = req.headers.get('cookie')
    console.log('Forwarding cookies for verification:', cookieHeader)

    const backendResponse = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(cookieHeader && { 'Cookie': cookieHeader }),
      },
      body: JSON.stringify({ token }),
    })

    console.log('Backend verification response status:', backendResponse.status)

    const responseText = await backendResponse.text()
    console.log('Backend verification response text:', responseText.substring(0, 500))

    let backendResult
    try {
      backendResult = JSON.parse(responseText)
    } catch (parseError) {
      console.error('Failed to parse backend verification response as JSON:', parseError)
      return NextResponse.json(
        { success: false, message: 'Backend returned invalid response' },
        { status: 500 }
      )
    }

    console.log('Backend verification result:', backendResult)

    if (backendResult.success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Token verified successfully',
        data: backendResult.data
      })
    } else {
      return NextResponse.json(
        { success: false, message: backendResult.message || 'Failed to verify token' },
        { status: backendResponse.status }
      )
    }
  } catch (error) {
    console.error('Error in verify token API route:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
