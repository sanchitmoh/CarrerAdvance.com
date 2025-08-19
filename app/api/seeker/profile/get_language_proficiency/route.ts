import { NextResponse } from 'next/server'
import { getApiUrl } from '@/lib/api-config'

export async function GET() {
  try {
    // Mock language proficiency levels for now until backend is fixed
    const proficiencyLevels = [
      { id: 1, name: 'Beginner', value: 1 },
      { id: 2, name: 'Elementary', value: 2 },
      { id: 3, name: 'Intermediate', value: 3 },
      { id: 4, name: 'Upper Intermediate', value: 4 },
      { id: 5, name: 'Advanced', value: 5 },
      { id: 6, name: 'Native/Fluent', value: 6 }
    ]
    
    return NextResponse.json({ success: true, data: proficiencyLevels })
  } catch (error) {
    console.error('Error in get_language_proficiency API:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}





