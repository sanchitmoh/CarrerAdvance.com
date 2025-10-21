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

    // Extract cookies and prepare headers
    const cookies = request.headers.get('cookie') || ''
    const cookieMap = new Map()
    cookies.split(';').forEach(cookie => {
      const [key, value] = cookie.trim().split('=')
      if (key && value) {
        cookieMap.set(key, value)
      }
    })

    // Forward the request to the PHP backend
    const backendUrl = getBackendUrl('/api/employers/payroll/calculate_payroll')
    
    // Extract cycle_id from the body
    const cycleId = body.get('cycle_id')
    const employerId = cookieMap.get('employer_id')
    
    console.log('Payroll calculation request:', {
      backendUrl,
      body: body.toString(),
      cycleId,
      employerId,
      cookies: cookies,
      cookieMap: Object.fromEntries(cookieMap),
      userAgent: request.headers.get('user-agent'),
      environment: process.env.NODE_ENV
    })
    
    // If we have the employer_id in cookies, add it to the body as well
    if (employerId && !body.has('company_id')) {
      body.append('company_id', employerId)
    }
    
    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Cookie': cookies,
        'Authorization': request.headers.get('authorization') || '',
        'User-Agent': 'CareerAdvance-Frontend/1.0',
        'X-Forwarded-For': request.headers.get('x-forwarded-for') || '',
        'X-Real-IP': request.headers.get('x-real-ip') || '',
        'Referer': request.headers.get('referer') || '',
      },
      credentials: 'include',
      body: body.toString(),
    })
    
    console.log('Backend response:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    })

    // Try to parse JSON response
    let responseData: any
    try {
      responseData = await response.json()
    } catch (parseError) {
      const text = await response.text()
      console.error('Failed to parse backend response:', parseError)
      console.error('Raw response text:', text)
      responseData = { 
        success: false, 
        message: 'Upstream error', 
        detail: text,
        backendUrl,
        status: response.status,
        statusText: response.statusText,
        requestBody: body.toString(),
        requestCookies: cookies
      }
    }

    console.log('Final response data:', responseData)
    return NextResponse.json(responseData, { status: response.status })
  } catch (error) {
    console.error('Payroll calculation error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Internal server error',
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}




