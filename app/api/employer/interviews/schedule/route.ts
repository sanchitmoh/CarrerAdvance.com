import { NextRequest, NextResponse } from 'next/server'

// We import lazily to avoid build-time failures if googleapis isn't installed yet
async function getGoogle() {
  const mod = await import('googleapis')
  return mod.google
}

export async function POST(req: NextRequest) {
  try {
    const {
      candidateEmail,
      candidateName,
      interviewerEmail,
      startISO,
      endISO,
      summary,
      description,
    } = await req.json()

    if (!candidateEmail || !interviewerEmail) {
      return NextResponse.json({ error: 'candidateEmail and interviewerEmail are required' }, { status: 400 })
    }

    const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
    const GOOGLE_PRIVATE_KEY = (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n')
    const GOOGLE_CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID
    const GOOGLE_IMPERSONATED_USER_EMAIL = process.env.GOOGLE_IMPERSONATED_USER_EMAIL

    if (!GOOGLE_SERVICE_ACCOUNT_EMAIL || !GOOGLE_PRIVATE_KEY || !GOOGLE_CALENDAR_ID || !GOOGLE_IMPERSONATED_USER_EMAIL) {
      return NextResponse.json({
        error: 'Missing Google Calendar env configuration. Required: GOOGLE_SERVICE_ACCOUNT_EMAIL, GOOGLE_PRIVATE_KEY, GOOGLE_CALENDAR_ID, GOOGLE_IMPERSONATED_USER_EMAIL',
      }, { status: 500 })
    }

    const google = await getGoogle()

    const jwt = new google.auth.JWT(
      GOOGLE_SERVICE_ACCOUNT_EMAIL,
      undefined,
      GOOGLE_PRIVATE_KEY,
      [
        'https://www.googleapis.com/auth/calendar',
      ],
      GOOGLE_IMPERSONATED_USER_EMAIL,
    )

    await jwt.authorize()

    const calendar = google.calendar({ version: 'v3', auth: jwt })

    const now = new Date()
    const start = startISO || new Date(now.getTime() + 60 * 60 * 1000).toISOString() // +1h
    const end = endISO || new Date(new Date(start).getTime() + 30 * 60 * 1000).toISOString() // +30m

    const eventResource: any = {
      summary: summary || `Interview: ${candidateName || candidateEmail}`,
      description: description || `Interview for ${candidateName || candidateEmail}`,
      start: { dateTime: start },
      end: { dateTime: end },
      attendees: [
        { email: candidateEmail, displayName: candidateName },
        { email: interviewerEmail },
      ],
      conferenceData: {
        createRequest: {
          requestId: `req-${Date.now()}-${Math.random().toString(36).slice(2)}`,
        },
      },
    }

    const { data } = await calendar.events.insert({
      calendarId: GOOGLE_CALENDAR_ID,
      requestBody: eventResource,
      conferenceDataVersion: 1,
      sendUpdates: 'all',
    })

    const meetLink = (data as any)?.hangoutLink || (data as any)?.conferenceData?.entryPoints?.find((e: any) => e.entryPointType === 'video')?.uri || null

    return NextResponse.json({ success: true, eventId: data.id, htmlLink: data.htmlLink, meetLink })
  } catch (err: any) {
    console.error('Schedule interview error:', err?.message || err)
    return NextResponse.json({ error: 'Failed to schedule interview', detail: err?.message || String(err) }, { status: 500 })
  }
}


