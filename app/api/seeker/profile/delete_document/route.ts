import { NextRequest, NextResponse } from 'next/server'
import { getBackendUrl } from '@/lib/api-config'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { jobseeker_id, document_id } = body
    
    if (!jobseeker_id || !document_id) {
      return NextResponse.json(
        { success: false, message: 'Jobseeker ID and Document ID are required' },
        { status: 400 }
      )
    }

    // Use the configured backend URL
    const backendUrl = getBackendUrl('/api/seeker/profile/delete_document')
    
    // Forward the request to the PHP backend
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Forward cookies for authentication
        'Cookie': request.headers.get('cookie') || '',
      },
      body: JSON.stringify({ jobseeker_id, document_id }),
    })

    const data = await response.json()
    
    return NextResponse.json(data, { status: response.status })
  } catch (error) {
    console.error('Delete document error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
