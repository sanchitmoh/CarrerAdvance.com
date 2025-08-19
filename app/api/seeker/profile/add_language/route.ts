import { NextResponse } from 'next/server'
import { getApiUrl } from '@/lib/api-config'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { user_id, language, lang_level } = body || {}

    if (!user_id || !language || !lang_level) {
      return NextResponse.json(
        { success: false, message: 'user_id, language and lang_level are required' },
        { status: 400 }
      )
    }

    // Connect to backend API for ew_seeker_languages table
    const backendRes = await fetch(
      getApiUrl('seeker/profile/add_language'),
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          user_id: parseInt(user_id),
          language: language,
          proficiency: lang_level,
          updated_date: new Date().toISOString().split('T')[0]
        }),
      }
    )

    const payload = await backendRes.json()
    const ok = payload?.status === 1 || payload?.success === true
    
    return NextResponse.json(
      ok ? { success: true, message: payload?.message ?? 'Language added successfully' } : { success: false, message: payload?.message ?? 'Failed to add language' },
      { status: ok ? 200 : 400 }
    )
  } catch (error) {
    console.error('Error in add_language API:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}


