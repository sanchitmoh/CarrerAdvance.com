import { NextRequest, NextResponse } from 'next/server'
import { getApiUrl } from '@/lib/api-config'


export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
	try {
		const { id } = params
		const url = `${getApiUrl(`jobs/${encodeURIComponent(id)}`)}`
		const res = await fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
		const data = await res.json()
		return NextResponse.json(data, { status: res.status })
	} catch (err: any) {
		return NextResponse.json({ success: false, message: err?.message || 'Failed to fetch job details' }, { status: 500 })
	}
}


