
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
    const url = getBaseUrl('admin/employer/datatable_json')
    const res = await fetch(url, { headers: { 'Accept': 'application/json' } })
    const txt = await res.text()
    const json = (() => { try { return JSON.parse(txt) } catch { return {} } })()
    const rows = parse(json)
    const data = rows.map((row: any) => {
      const companyName = String(row?.[1] ?? '')
      const email = String(row?.[2] ?? '')
      return { type: 'employer', name: companyName, email, role: 'Employer', status: 'Active' }
    })
    return NextResponse.json({ success: true, data })
  } catch (e) {
    return NextResponse.json({ success: false, data: [] }, { status: 500 })
  }
}




