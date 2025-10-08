import { NextRequest, NextResponse } from 'next/server'
import { getBackendUrl } from '@/lib/api-config'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    // Use the configured backend URL
    const backendUrl = getBackendUrl('/api/seeker/profile/upload_document')
    
    // Forward the request to the PHP backend
    const response = await fetch(backendUrl, {
      method: 'POST',
      body: formData,
      headers: {
        // Forward cookies for authentication
        'Cookie': request.headers.get('cookie') || '',
      },
    })

    const data = await response.json()
    
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Upload document error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
