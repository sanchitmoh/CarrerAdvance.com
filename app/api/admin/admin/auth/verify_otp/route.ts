import { NextRequest, NextResponse } from 'next/server'
import { getBaseUrl } from '@/lib/api-config'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Forward the request to the PHP backend
    const response = await fetch(getBaseUrl('admin/auth/verify_otp'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    
    if (response.ok) {
      // On success, set an httpOnly cookie so middleware recognizes admin session
      if (data && data.success) {
        const res = NextResponse.json(data)
        // Minimal token: presence is enough for middleware; value can be anything non-empty
        // Set to '1' and expire in 7 days; secure flag will be auto-managed by Next based on protocol
        res.cookies.set('admin_jwt', '1', {
          httpOnly: true,
          sameSite: 'lax',
          path: '/',
          maxAge: 7 * 24 * 60 * 60,
        })
        return res
      }
      return NextResponse.json(data)
    } else {
      return NextResponse.json(
        { success: false, message: data.message || 'OTP verification failed' },
        { status: response.status }
      )
    }
  } catch (error) {
    console.error('OTP verification error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
