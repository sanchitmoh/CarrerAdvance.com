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
    const url = getBackendUrl('index.php/api/admin/users/students')
    const res = await fetch(url, { headers: { 'Accept': 'application/json' } })
    const txt = await res.text()
    const json = (() => { try { return JSON.parse(txt) } catch { return {} } })()
    const data = json.success ? json.data.map((student: any) => ({
      type: 'student',
      id: student.id || 0,
      name: student.name || '',
      email: student.email || '',
      role: 'Student',
      status: student.status || 'Deactive', // Use status from API response
      created_date: student.created_date || 'N/A',
    })) : []
    return NextResponse.json({ success: true, data })
  } catch (e) {
    return NextResponse.json({ success: false, data: [] }, { status: 500 })
  }
}




