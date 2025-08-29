// File: careeradvance-frontend (1)/app/api/resume/store-parsed-data/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getApiUrl } from '@/lib/api-config'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { parsedData } = body

    if (!parsedData) {
      return NextResponse.json({ success: false, message: 'Parsed data is required' }, { status: 400 })
    }

    // Forward the request to the backend PHP API
    const backendResponse = await fetch(getApiUrl('resume/store_parsed_data'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ parsedData })
    })

    if (!backendResponse.ok) {
      throw new Error(`Backend responded with status: ${backendResponse.status}`)
    }

    const result = await backendResponse.json()
    return NextResponse.json(result)

  } catch (error) {
    console.error('Store parsed data error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to store parsed data' },
      { status: 500 }
    )
  }
}