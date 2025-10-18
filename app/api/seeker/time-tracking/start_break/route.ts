import { NextRequest, NextResponse } from 'next/server'
import { getBackendUrl } from '@/lib/api-config'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json({ success: true, message: 'Start break API is working' })
}

export async function POST(request: NextRequest) {
  console.log('Start break API route called')
  try {
    // Read the body once and determine the content type
    const contentType = request.headers.get('content-type') || ''
    let incoming: any = null
    
    if (contentType.includes('application/json')) {
      incoming = await request.json()
      console.log('Parsed as JSON:', incoming)
    } else {
      const fd = await request.formData()
      incoming = Object.fromEntries(fd.entries())
      console.log('Parsed as FormData:', incoming)
    }

    console.log('Start break API - incoming data:', incoming)
    const backendUrl = getBackendUrl('/index.php/api/seeker/time-tracking/start_break')
    console.log('Backend URL:', backendUrl)

    // Build form-data for PHP backend
    const backendForm = new FormData()
    if (incoming?.jobseeker_id) backendForm.append('jobseeker_id', String(incoming.jobseeker_id))
    if (incoming?.session_id) backendForm.append('session_id', String(incoming.session_id))
    if (incoming?.location) backendForm.append('location', String(incoming.location))
    if (incoming?.device_info) backendForm.append('device_info', String(incoming.device_info))
    if (incoming?.ip_address) backendForm.append('ip_address', String(incoming.ip_address))
    if (incoming?.notes) backendForm.append('notes', String(incoming.notes))

    console.log('Sending request to backend with form data:', Object.fromEntries(backendForm.entries()))
    
    // Test if backend is reachable first
    try {
      const testRes = await fetch(backendUrl, { method: 'HEAD' })
      console.log('Backend reachability test - status:', testRes.status)
    } catch (testError) {
      console.error('Backend not reachable:', testError)
    }
    
    const res = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        Cookie: request.headers.get('cookie') || '',
        Authorization: request.headers.get('authorization') || '',
      },
      cache: 'no-store',
      credentials: 'include',
      body: backendForm,
    })

    console.log('Backend response status:', res.status)
    console.log('Backend response headers:', Object.fromEntries(res.headers.entries()))

    let responsePayload: any
    try {
      // Read response as text first
      const responseText = await res.text()
      console.log('Backend response text:', responseText)
      
      // Try to parse as JSON
      try {
        responsePayload = JSON.parse(responseText)
        console.log('Backend response payload:', responsePayload)
      } catch (jsonError) {
        console.log('Response is not valid JSON, treating as text')
        
        // Check if it's an HTML error page (like database errors)
        if (responseText.includes('<!DOCTYPE html>') || responseText.includes('Database Error')) {
          // Extract meaningful error information from HTML
          const errorMatch = responseText.match(/Error Number: (\d+)/)
          const messageMatch = responseText.match(/Message<\/h2>\s*<pre>(.*?)<\/pre>/s)
          
          let errorMessage = 'Database error occurred'
          if (errorMatch && messageMatch) {
            const errorNumber = errorMatch[1]
            const errorDetail = messageMatch[1]
              .replace(/&lt;/g, '<')
              .replace(/&gt;/g, '>')
              .replace(/&#039;/g, "'")
              .replace(/&quot;/g, '"')
            
            if (errorNumber === '1452') {
              errorMessage = 'Foreign key constraint failed - referenced record does not exist'
            }
            
            responsePayload = { 
              success: false, 
              message: errorMessage, 
              errorCode: errorNumber,
              detail: errorDetail 
            }
          } else {
            responsePayload = { success: false, message: 'Database error', detail: responseText }
          }
        } else {
          responsePayload = { success: false, message: 'Upstream error', detail: responseText }
        }
      }
    } catch (e) {
      console.log('Could not read response body:', e)
      responsePayload = { success: false, message: 'Upstream error', detail: 'Unable to read response body' }
    }
    return NextResponse.json(responsePayload, { status: res.status })
  } catch (e) {
    console.error('Start break API error:', e)
    return NextResponse.json({ success: false, message: 'Internal server error', error: e instanceof Error ? e.message : String(e) }, { status: 500 })
  }
}


