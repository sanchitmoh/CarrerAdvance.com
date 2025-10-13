import { NextRequest, NextResponse } from 'next/server'
import { getBackendUrl } from '@/lib/api-config'

// Ensure Node runtime (not edge) for FormData/file forwarding reliability
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    // Use the configured backend URL
    const backendUrl = getBackendUrl('/api/seeker/profile/upload_document')
    
    // Forward the request to the PHP backend
    const response = await fetch(backendUrl, {
      method: 'POST',
      body: formData,
      // Let fetch set proper multipart boundary; just forward auth context
      headers: {
        Cookie: request.headers.get('cookie') || '',
        Authorization: request.headers.get('authorization') || '',
      },
      cache: 'no-store',
    })

    // Try to parse JSON; fallback to text to avoid throwing on HTML/PHP error pages
    let payload: any
    try {
      payload = await response.json()
    } catch {
      const text = await response.text()
      payload = { success: false, message: 'Upstream error', detail: text }
    }

    return NextResponse.json(payload, { status: response.status })
  } catch (error) {
    console.error('Upload document error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
