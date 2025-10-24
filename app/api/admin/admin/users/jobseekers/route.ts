import { NextRequest, NextResponse } from 'next/server'
import { getBackendUrl } from '@/lib/api-config'

function parse(json: any): any[] {
  if (!json) return []
  if (Array.isArray(json)) return json
  if (Array.isArray(json.data)) return json.data
  return []
}

export async function GET(_req: NextRequest) {
  try {
    const url = getBackendUrl('index.php/api/admin/users/jobseekers')
    const res = await fetch(url, { headers: { 'Accept': 'application/json' } })
    const txt = await res.text()
    const json = (() => { try { return JSON.parse(txt) } catch { return {} } })()
    const data = json.success ? json.data.map((user: any) => ({
      type: 'jobseeker',
      id: user.id || 0,
      name: user.name || '',
      email: user.email || '',
      role: 'Job-Seeker',
      status: user.status || 'Deactive', // Use status from API response
      created_date: user.created_date || 'N/A',
    })) : []
    return NextResponse.json({ success: true, data })
  } catch (e) {
    return NextResponse.json({ success: false, data: [] }, { status: 500 })
  }
}




