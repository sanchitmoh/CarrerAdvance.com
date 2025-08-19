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
    backendForm.append('resume', resume)

    const backendRes = await fetch(
      getApiUrl('user_api/updateresume'),
      {
        method: 'POST',
        body: backendForm
      }
    )

    const payload = await backendRes.json()
    const ok = payload?.status === 1
    return NextResponse.json(
      ok ? { success: true, data: payload?.data, message: payload?.message ?? 'Resume updated' }
         : { success: false, message: payload?.message ?? 'Failed to update resume' },
      { status: ok ? 200 : 400 }
    )
  } catch (error) {
    console.error('Error in update_resume API:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}







