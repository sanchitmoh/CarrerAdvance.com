import { NextRequest, NextResponse } from 'next/server'
import { getApiUrl } from '@/lib/api-config'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const jobseekerId = formData.get('jobseeker_id') as string | null
    const file = formData.get('profile_photo') as File | null

    if (!jobseekerId) {
      return NextResponse.json({ success: false, message: 'Missing jobseeker_id' }, { status: 400 })
    }
    if (!file) {
      return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 })
    }

    // Proxy multipart/form-data to PHP backend
    const backendUrl = getApiUrl('Seeker_api/upload_profile_photo')

    const proxyResponse = await fetch(backendUrl, {
      method: 'POST',
      body: formData as any,
      // Let fetch set the proper multipart boundary
    })

    const raw = await proxyResponse.text()
    try {
      const data = raw ? JSON.parse(raw) : null
      return NextResponse.json(data)
    } catch (e) {
      if (proxyResponse.ok) {
        return NextResponse.json({ success: true, message: 'Uploaded successfully' })
      }
      return NextResponse.json({ success: false, message: 'Invalid response from backend', raw }, { status: 502 })
    }
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Upload failed' }, { status: 500 })
  }
}


