import { NextRequest, NextResponse } from 'next/server'
import { getApiUrl } from '@/lib/api-config'

export async function GET(_request: NextRequest) {
	try {
		const url = getApiUrl('jobs/industries')
		const res = await fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } })
		const data = await res.json()
		return NextResponse.json(data, { status: res.status })
	} catch (err: any) {
		return NextResponse.json({ success: false, message: err?.message || 'Failed to fetch industries' }, { status: 500 })
	}
}


