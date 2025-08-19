import { NextResponse } from 'next/server'
import { getApiUrl } from '@/lib/api-config'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { id, language, proficiency } = body || {}

    if (!id || !language || !proficiency) {
      return NextResponse.json(
        { success: false, message: 'id, language and proficiency are required' },
        { status: 400 }
      )
    }

    // Connect to backend API for ew_seeker_languages table
    const backendRes = await fetch(
      getApiUrl('seeker/profile/update_language'),
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, language, proficiency }),
      }
    )

    const payload = await backendRes.json()
    const ok = payload?.status === 1 || payload?.success === true
    return NextResponse.json(
      ok ? { success: true, message: payload?.message ?? 'Language updated successfully' } : { success: false, message: payload?.message ?? 'Failed to update language' },
      { status: ok ? 200 : 400 }
    )
  } catch (error) {
    console.error('Error in update_language API:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}


