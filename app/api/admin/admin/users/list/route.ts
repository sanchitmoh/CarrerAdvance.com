

import { NextRequest, NextResponse } from 'next/server'
import { getBackendUrl } from '@/lib/api-config'

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
  } catch (error) {
    return { success: false, data: [] }
  }
}

export async function GET(_req: NextRequest) {
  try {
    const usersUrl = getBackendUrl('index.php/api/admin/users/jobseekers')
    const employersUrl = getBackendUrl('index.php/api/admin/users/employers')
    const studentsUrl = getBackendUrl('index.php/api/admin/users/students')

    const [usersJson, employersJson, studentsJson] = await Promise.all([
      fetchJson(usersUrl),
      fetchJson(employersUrl),
      fetchJson(studentsUrl),
    ])

    // Parse API responses - they return {success: true, data: [...]}
    const usersData = usersJson.success ? usersJson.data : []
    const employersData = employersJson.success ? employersJson.data : []
    const studentsData = studentsJson.success ? studentsJson.data : []

    console.log('Raw API responses:')
    console.log('Users data:', usersData)
    console.log('Employers data:', employersData)
    console.log('Students data:', studentsData)

    // Normalize to a unified shape - use status directly from API
    const normUsers = usersData.map((user: any) => ({
      type: 'jobseeker',
      id: user.id || 0,
      name: user.name || '',
      email: user.email || '',
      role: 'Job-Seeker',
      status: user.status || 'Deactive', // Use status from API response
      created_date: user.created_date || 'N/A',
    }))

    const normEmployers = employersData.map((employer: any) => ({
      type: 'employer',
      id: employer.id || 0,
      name: employer.name || '',
      email: employer.email || '',
      role: 'Employer',
      status: employer.status || 'Deactive', // Use status from API response
      updated_date: employer.updated_date || 'N/A',
    }))

    const normStudents = studentsData.map((student: any) => ({
      type: 'student',
      id: student.id || 0,
      name: student.name || '',
      email: student.email || '',
      role: 'Student',
      status: student.status || 'Deactive', // Use status from API response
      created_date: student.created_date || 'N/A',
    }))

    const combined = [...normUsers, ...normEmployers, ...normStudents]

    return NextResponse.json({ success: true, data: combined })
  } catch (error) {
    console.error('Aggregate users error:', error)
    return NextResponse.json({ success: false, data: [] }, { status: 500 })
  }
}





