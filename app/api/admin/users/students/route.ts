import { NextRequest, NextResponse } from 'next/server'
import { getBaseUrl } from '@/lib/api-config'

function parse(json: any): any[] {
  if (!json) return []
  if (Array.isArray(json)) return json
  if (Array.isArray(json.data)) return json.data
  return []
}

export async function GET(_req: NextRequest) {
  try {
    const url = getBaseUrl('admin/student/datatable_json')
    const res = await fetch(url, { headers: { 'Accept': 'application/json' } })
    const txt = await res.text()
    const json = (() => { try { return JSON.parse(txt) } catch { return {} } })()
    const rows = parse(json)
    const data = rows.map((row: any) => {
      const name = String(row?.[0] ?? '')
      const email = String(row?.[1] ?? '')
      const status = /Active/i.test(String(row?.[4] ?? '')) ? 'Active' : 'Deactive'
      return { type: 'student', name, email, role: 'Student', status }
    })
    return NextResponse.json({ success: true, data })
  } catch (e) {
    return NextResponse.json({ success: false, data: [] }, { status: 500 })
  }
}




