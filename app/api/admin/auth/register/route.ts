import { NextRequest, NextResponse } from 'next/server'
import { getBaseUrl } from '@/lib/api-config'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    const backendUrl = getBaseUrl('admin/auth/register')
    console.log('Backend URL:', backendUrl)
    console.log('Request body:', body)
    
    // Forward the request to the PHP backend
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: JSON.stringify(body),
    })

    console.log('Response status:', response.status)
    console.log('Response headers:', response.headers)
    
    const data = await response.json()
    console.log('Response data:', data)
    
    if (response.ok) {
      return NextResponse.json(data)
    } else {
      return NextResponse.json(
        { success: false, message: data.message || 'Registration failed' },
        { status: response.status }
      )
    }
  } catch (error) {
    console.error('Admin registration error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
