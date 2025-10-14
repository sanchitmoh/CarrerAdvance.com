import { NextRequest, NextResponse } from 'next/server'
import { getApiUrl } from '@/lib/api-config'

// Proxies ATS analysis requests to the PHP backend
export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || ''
    const backendUrl = getApiUrl('resume_api/ats_analysis')

    let res: Response
    if (contentType.includes('multipart/form-data')) {
      // Clone the request to avoid "Body has already been read" error
      const clonedRequest = request.clone()
      const form = await clonedRequest.formData()
      // Forward FormData directly; fetch will set proper boundaries
      res = await fetch(backendUrl, {
        method: 'POST',
        body: form as any
      })
    } else {
      // Clone the request to avoid "Body has already been read" error
      const clonedRequest = request.clone()
      const body = await clonedRequest.json().catch(() => ({}))
      const { resumeText, industry } = body || {}
      res = await fetch(backendUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText, industry })
      })
    }

    try {
      const data = await res.json()
      return NextResponse.json(data, { status: res.status || 200 })
    } catch {
      const text = await res.text()
      return NextResponse.json(
        { success: false, message: 'Non-JSON response from backend', backend: text.slice(0, 1000) },
        { status: res.status || 502 }
      )
    }
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || 'Unexpected error' },
      { status: 500 }
    )
  }
}


