import { NextResponse } from 'next/server'
import { getApiUrl } from '@/lib/api-config'

export async function POST(request: Request) {
  try {
    // Get the form data from the request
    const formData = await request.formData()
    
    // Forward the request to the backend
    const backendUrl = getApiUrl('seeker/profile/update_resume')
    console.log('Calling backend API:', backendUrl)
    
    const backendRes = await fetch(backendUrl, {
      method: 'POST',
      body: formData,
    })
    
    console.log('Backend response status:', backendRes.status)
    
    if (!backendRes.ok) {
      const errorText = await backendRes.text()
      console.log('Backend error:', errorText)
      return NextResponse.json(
        { success: false, message: 'Backend request failed: ' + errorText },
        { status: backendRes.status }
      )
    }

    const payload = await backendRes.json()
    console.log('Backend response:', payload)
    return NextResponse.json(payload)
    
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    console.error('Error in update_resume API:', message)
    return NextResponse.json({ success: false, message }, { status: 500 })
  }
}







