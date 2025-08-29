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
