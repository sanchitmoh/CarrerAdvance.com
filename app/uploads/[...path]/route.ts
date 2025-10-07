import { NextRequest, NextResponse } from 'next/server'
import { BACKEND_URL } from '@/lib/api-config'

export async function GET(req: NextRequest, { params }: { params: { path: string[] } }) {
  try {
    const upstreamBase = (BACKEND_URL || '').replace(/\/$/, '')
    const slug = Array.isArray(params.path) ? params.path.join('/') : String(params.path || '')
    const targetUrl = `${upstreamBase}/uploads/${slug}`

    const upstream = await fetch(targetUrl, {
      method: 'GET',
      // Forward caching hints for static assets
      headers: {
        'Accept': req.headers.get('accept') || '*/*'
      },
      // Don't send cookies to asset host by default
      credentials: 'omit'
    })

    if (!upstream.ok) {
      return new NextResponse('Not Found', { status: upstream.status })
    }

    const contentType = upstream.headers.get('content-type') || 'application/octet-stream'
    const buffer = await upstream.arrayBuffer()
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        // Cache for 1 day at the edge and allow stale while revalidate
        'Cache-Control': 'public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800'
      }
    })
  } catch (e) {
    return NextResponse.redirect(new URL('/404', req.url))
  }
}


