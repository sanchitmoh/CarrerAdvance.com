import { NextResponse } from "next/server"

// Proxies to the PHP backend Resume/complete_job_analysis endpoint
export async function POST(request: Request) {
  try {
    const body = await request.json()

    const base = process.env.NEXT_PUBLIC_BASE_URL || process.env.NEXT_PUBLIC_BACKEND_BASE_URL
    if (!base) {
      return NextResponse.json({ success: false, message: "Backend base URL not configured" }, { status: 500 })
    }

    // Ensure no trailing slash issues
    const url = `${base.replace(/\/$/, "")}/resume/complete_job_analysis`

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // Server-side request; cookies from Next server won't carry browser session.
      // If your PHP requires session cookies, prefer calling directly from the browser or
      // implement token-based auth here.
      body: JSON.stringify(body),
    })

    const contentType = res.headers.get("content-type") || ""
    if (!contentType.includes("application/json")) {
      const text = await res.text()
      return NextResponse.json(
        { success: false, message: "Non-JSON response from backend", backend: text.slice(0, 500) },
        { status: res.status || 502 }
      )
    }

    const data = await res.json()
    return NextResponse.json(data, { status: res.status || 200 })
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: err?.message || "Unexpected error" },
      { status: 500 }
    )
  }
}


