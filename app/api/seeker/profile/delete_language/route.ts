import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { id } = body || {}

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'id is required' },
        { status: 400 }
      )
    }

    // Connect to backend API for ew_seeker_languages table
    const backendRes = await fetch(
      `http://localhost:8080/index.php/api/seeker/profile/delete_language?id=${encodeURIComponent(id)}`,
      {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }
    )

    const payload = await backendRes.json()
    const ok = payload?.status === 1 || payload?.success === true
    return NextResponse.json(
      ok ? { success: true, message: payload?.message ?? 'Language deleted successfully' } : { success: false, message: payload?.message ?? 'Failed to delete language' },
      { status: ok ? 200 : 400 }
    )
  } catch (error) {
    console.error('Error in delete_language API:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}


