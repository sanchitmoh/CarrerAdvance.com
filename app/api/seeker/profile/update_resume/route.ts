import { NextResponse } from 'next/server'
import { getApiUrl } from '@/lib/api-config'

export async function POST(request: Request) {
  try {
    const form = await request.formData()
    const user_id = form.get('user_id') as string | null
    const resume = form.get('resume') as File | null
  
    if (!user_id || !resume) {
      return NextResponse.json(
        { success: false, message: 'user_id and resume file are required' },
        { status: 400 }
      )
    }

    const backendForm = new FormData()
    backendForm.append('user_id', user_id)
    // Recreate the file blob and ensure filename is sent for PHP $_FILES
    const resumeBlob = new Blob([await resume.arrayBuffer()], { type: (resume as any).type || 'application/pdf' })
    const resumeName = (resume as any).name || 'resume.pdf'
    backendForm.append('resume', resumeBlob, resumeName)

    const backendRes = await fetch(getApiUrl('user_api/updateresume'), {
      method: 'POST',
      body: backendForm,
      // Do not set Content-Type; let fetch set proper multipart boundary
    })

    let payload: any = null
    let ok = false
    const contentType = backendRes.headers.get('content-type') || ''
    try {
      if (contentType.includes('application/json')) {
        payload = await backendRes.json()
      } else {
        const text = await backendRes.text()
        // Attempt to parse JSON if text looks like JSON
        try { payload = JSON.parse(text) } catch { payload = { status: backendRes.ok ? 1 : 0, message: text } }
      }
    } catch (e) {
      // If parsing fails, fallback to generic message
      const msg = e instanceof Error ? e.message : 'Unexpected response from backend'
      payload = { status: 0, message: msg }
    }

    ok = payload?.status === 1 || payload?.success === true || backendRes.ok
    return NextResponse.json(
      ok ? { success: true, data: payload?.data ?? null, message: payload?.message ?? 'Resume updated' }
         : { success: false, message: payload?.message ?? 'Failed to update resume' },
      { status: ok ? 200 : 502 }
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Internal server error'
    console.error('Error in update_resume API:', message)
    return NextResponse.json({ success: false, message }, { status: 500 })
  }
}







