import { NextRequest, NextResponse } from 'next/server'
import { getBaseUrl } from '@/lib/api-config'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Forward the request to the PHP backend
    const response = await fetch(getBaseUrl('admin/auth/login'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    
    if (response.ok) {
      // If backend indicates direct success without OTP, set admin cookies
      if (data && data.success && !data.requires_otp) {
        const res = NextResponse.json(data)
        
        // Set admin_jwt cookie
        res.cookies.set('admin_jwt', '1', {
          httpOnly: true,
          sameSite: 'lax',
          path: '/',
          maxAge: 7 * 24 * 60 * 60,
        })
        
        // Set admin_id cookie if available in response
        if (data.admin_id) {
          res.cookies.set('admin_id', data.admin_id.toString(), {
            httpOnly: true,
            sameSite: 'lax',
            path: '/',
            maxAge: 7 * 24 * 60 * 60,
          })
        }
        
        return res
      }
      
      // If OTP is required, also set admin_id cookie if available
      if (data && data.success && data.requires_otp && data.admin_id) {
        const res = NextResponse.json(data)
        res.cookies.set('admin_id', data.admin_id.toString(), {
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
        { success: false, message: data.message || 'Login failed' },
        { status: response.status }
      )
    }
  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
