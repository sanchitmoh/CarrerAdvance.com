import { NextRequest, NextResponse } from 'next/server'
import { getBackendUrl } from '@/lib/api-config'

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData()
    const file = form.get('file') as File | null
    const jobseekerId = form.get('jobseeker_id') as string | null
    const apply = form.get('apply') ?? '0'

    if (!file || !jobseekerId) {
      return NextResponse.json({ success: false, message: 'file and jobseeker_id are required' }, { status: 400 })
    }

    // Prefer non-index path; backend routes include both variants
    const backendUrl = getBackendUrl('/api/resume_parser/parse_and_apply')

    const forward = new FormData()
    forward.append('file', file)
    forward.append('jobseeker_id', jobseekerId)
    forward.append('apply', String(apply))

    let res = await fetch(backendUrl, {
      method: 'POST',
      body: forward,
      // no headers: browser will set multipart boundaries
      // credentials not needed for backend on same network
    })
    // Fallback to index.php form if first attempt is not OK
    if (!res.ok) {
      const altUrl = getBackendUrl('/index.php/api/resume_parser/parse_and_apply')
      res = await fetch(altUrl, { method: 'POST', body: forward })
    }
    const contentType = res.headers.get('content-type') || ''
    if (contentType.includes('application/json')) {
      try {
        const data = await res.clone().json()
        return NextResponse.json(data, { status: res.ok ? 200 : 500 })
      } catch {
        // Fall back to text body then attempt manual JSON.parse; include raw if still invalid
        const raw = await res.text().catch(() => '')
        try {
          const parsed = JSON.parse(raw)
          return NextResponse.json(parsed, { status: res.ok ? 200 : 500 })
        } catch {
          return NextResponse.json(
            {
              success: false,
              message: 'Invalid backend response (bad JSON body)',
              backendStatus: res.status,
              backendContentType: contentType,
              raw
            },
            { status: 500 }
          )
        }
      }
    } else {
      // Fallback: backend may mislabel JSON; attempt to parse text
      const raw = await res.text()
      try {
        const parsed = JSON.parse(raw)
        return NextResponse.json(parsed, { status: res.ok ? 200 : 500 })
      } catch {
        return NextResponse.json(
          {
            success: false,
            message: 'Invalid backend response',
            backendStatus: res.status,
            backendContentType: contentType,
            raw
          },
          { status: 500 }
        )
      }
    }
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e?.message || 'Unexpected error' }, { status: 500 })
  }
}





