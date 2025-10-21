import { NextRequest, NextResponse } from 'next/server'
import { getBackendUrl } from '@/lib/api-config'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // Get the request body
    const contentType = request.headers.get('content-type') || ''
    let body: URLSearchParams
    
    if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await request.formData()
      body = new URLSearchParams()
      for (const [key, value] of formData.entries()) {
        body.append(key, value.toString())
      }
    } else {
      const json = await request.json()
      body = new URLSearchParams()
      for (const [key, value] of Object.entries(json)) {
        body.append(key, String(value))
      }
    }

    // Forward the request to the PHP backend
    const backendUrl = getBackendUrl('/api/employers/payroll/calculate_payroll')
    
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Cookie: request.headers.get('cookie') || '',
        Authorization: request.headers.get('authorization') || '',
      },
      credentials: 'include',
      body: body.toString(),
    })

    // Try to parse JSON response
    let responseData: any
    try {
      responseData = await response.json()
    } catch {
      const text = await response.text()
      responseData = { success: false, message: 'Upstream error', detail: text }
    }

    return NextResponse.json(responseData, { status: response.status })
  } catch (error) {
    console.error('Payroll calculation error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}




