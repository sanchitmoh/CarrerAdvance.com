import { NextResponse } from 'next/server'
import { getApiUrl } from '@/lib/api-config'

export async function GET() {
  try {
    const apiUrl = getApiUrl('backend')
    const response = await fetch(`${apiUrl}/api/common_api/language_proficiency`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error in get_language_proficiency API:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}





