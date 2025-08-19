import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Mock language options for now until backend is fixed
    const languageOptions = [
      { lang_id: 1, lang_name: 'English' },
      { lang_id: 2, lang_name: 'Spanish' },
      { lang_id: 3, lang_name: 'French' },
      { lang_id: 4, lang_name: 'German' },
      { lang_id: 5, lang_name: 'Italian' },
      { lang_id: 6, lang_name: 'Portuguese' },
      { lang_id: 7, lang_name: 'Russian' },
      { lang_id: 8, lang_name: 'Japanese' },
      { lang_id: 9, lang_name: 'Korean' },
      { lang_id: 10, lang_name: 'Chinese' },
      { lang_id: 11, lang_name: 'Arabic' },
      { lang_id: 12, lang_name: 'Hindi' },
      { lang_id: 13, lang_name: 'Bengali' },
      { lang_id: 14, lang_name: 'Urdu' },
      { lang_id: 15, lang_name: 'Turkish' }
    ]
    
    return NextResponse.json({ success: true, data: languageOptions })
  } catch (error) {
    console.error('Error in get_language_options API:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}


