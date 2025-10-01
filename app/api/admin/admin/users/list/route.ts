

import { NextRequest, NextResponse } from 'next/server'
import { getBaseUrl } from '@/lib/api-config'

type AdminTableResponse = {
  data: any[]
}

function parseAdminTable(json: any): any[] {
  if (!json) return []
  // Some endpoints already return { data: [...] }
  if (Array.isArray(json)) return json
  if (Array.isArray(json.data)) return json.data
  return []
}

async function fetchJson(url: string): Promise<any> {
  const res = await fetch(url, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
    // We are reading public admin datatable endpoints
    // No credentials needed
  })
  const text = await res.text()
  try {
    return JSON.parse(text)
  } catch {
    return { data: [] }
  }
}

export async function GET(_req: NextRequest) {
  try {
    const usersUrl = getBaseUrl('admin/users/datatable_json')
    const employersUrl = getBaseUrl('admin/employer/datatable_json')
    const studentsUrl = getBaseUrl('admin/student/datatable_json')

    const [usersJson, employersJson, studentsJson] = await Promise.all([
      fetchJson(usersUrl),
      fetchJson(employersUrl),
      fetchJson(studentsUrl),
    ])

    const usersRows = parseAdminTable(usersJson)
    const employerRows = parseAdminTable(employersJson)
    const studentRows = parseAdminTable(studentsJson)

    // Normalize to a unified shape
    // Admin Users table row order (from PHP):
    // [username, email, mobile_no, job_title, status_html, actions_html]
    const normUsers = usersRows.map((row: any) => {
      const name = row[0] ?? ''
      const email = row[1] ?? ''
      const role = 'Job-Seeker'
      const status = /Active/i.test(String(row[4] ?? '')) ? 'Active' : 'Deactive'
      return {
        type: 'jobseeker',
        name,
        email,
        role,
        status,
      }
    })

    // Employers table row order (from PHP):
    // [id, company_name, email, phone_no, username, actions_html]
    const normEmployers = employerRows.map((row: any) => {
      const companyName = row[1] ?? ''
      const email = row[2] ?? ''
      return {
        type: 'employer',
        name: companyName,
        email,
        role: 'Employer',
        status: 'Active',
      }
    })

    // Students table row order mirrors users with status html
    const normStudents = studentRows.map((row: any) => {
      const name = row[0] ?? ''
      const email = row[1] ?? ''
      const status = /Active/i.test(String(row[4] ?? '')) ? 'Active' : 'Deactive'
      return {
        type: 'student',
        name,
        email,
        role: 'Student',
        status,
      }
    })

    const combined = [...normUsers, ...normEmployers, ...normStudents]

    return NextResponse.json({ success: true, data: combined })
  } catch (error) {
    console.error('Aggregate users error:', error)
    return NextResponse.json({ success: false, data: [] }, { status: 500 })
  }
}





