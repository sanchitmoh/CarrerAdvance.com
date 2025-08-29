import { NextRequest, NextResponse } from 'next/server'
import { getApiUrl } from '@/lib/api-config'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { filename } = body

    if (!filename) {
      return NextResponse.json({ success: false, message: 'Filename is required' }, { status: 400 })
    }

    // Forward the request to the backend PHP API
    const backendResponse = await fetch(getApiUrl('resume/parse_resume'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `filename=${encodeURIComponent(filename)}`
    })

    const text = await backendResponse.text()
    let data: any
    try {
      data = text ? JSON.parse(text) : null
    } catch (e) {
      data = { success: false, message: 'Invalid JSON from backend', raw: text }
    }

    if (!backendResponse.ok) {
      return NextResponse.json(
        data || { success: false, message: `Backend error ${backendResponse.status}` },
        { status: backendResponse.status }
      )
    }

    return NextResponse.json(data ?? { success: false, message: 'Empty response from backend' })

  } catch (error: any) {
    console.error('Resume parse error:', error)
    return NextResponse.json({ success: false, message: error?.message || 'Failed to parse resume' }, { status: 500 })
  }
}
