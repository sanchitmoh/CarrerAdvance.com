import { NextRequest, NextResponse } from 'next/server'
import { getApiUrl } from '@/lib/api-config'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('resume') as File
    
    if (!file) {
      return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 })
    }

    // Forward the file to the backend PHP API
    const backendFormData = new FormData()
    backendFormData.append('resume', file)

    const backendResponse = await fetch(getApiUrl('resume/upload_resume'), {
      method: 'POST',
      body: backendFormData
    })

    if (!backendResponse.ok) {
      throw new Error(`Backend responded with status: ${backendResponse.status}`)
    }

    const result = await backendResponse.json()
    return NextResponse.json(result)

  } catch (error) {
    console.error('Resume upload error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to upload resume' },
      { status: 500 }
    )
  }
}
