import { getBaseUrl } from "@/lib/api-config"

export type Interview = {
  id: number
  candidateName: string
  candidateEmail: string
  position: string
  date: string
  time: string
  type: "video" | "phone" | "in-person"
  status: "scheduled" | "confirmed" | "completed" | "cancelled"
  interviewer?: string
  notes?: string
  meetingLink?: string
  phone?: string
  location?: string
  round?: string
  roundNumber?: number
  duration?: string
  review?: {
    rating: number
    feedback: string
    technicalSkills?: number | null
    communication?: number | null
    problemSolving?: number | null
    overallImpression?: string
    recommendation?: string
    nextSteps?: string
  } | null
}

export async function fetchInterviews(jobId?: number, employerId?: number): Promise<Interview[]> {
  const params = new URLSearchParams()
  if (jobId) params.append('job_id', jobId.toString())
  if (employerId) params.append('employer_id', employerId.toString())
  
  const url = `${getBaseUrl('/api/interviews')}${params.toString() ? `?${params.toString()}` : ''}`
  const res = await fetch(url, { credentials: 'include' })
  if (!res.ok) throw new Error(`Failed to fetch interviews (${res.status})`)
  const json = await res.json()
  if (!json?.success) throw new Error(json?.message || 'Failed to fetch interviews')
  return json.data as Interview[]
}

export async function updateInterviewStatus(id: number, status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled'): Promise<void> {
  const url = getBaseUrl(`/api/interviews/${id}/status`)
  const res = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ status })
  })
  // Treat plain 2xx as success even if body is empty or doesn't include { success }
  const contentType = res.headers.get('content-type') || ''
  const json = contentType.includes('application/json') ? await res.json().catch(() => ({})) : {}
  if (!res.ok) {
    throw new Error((json as any)?.message || `Failed to update status (${res.status})`)
  }
  if (contentType.includes('application/json') && (json as any)?.success === false) {
    throw new Error((json as any)?.message || `Failed to update status (${res.status})`)
  }
}

export async function saveInterviewReview(id: number, review: NonNullable<Interview['review']>, markCompleted?: boolean): Promise<void> {
  const url = getBaseUrl(`/api/interviews/${id}/review`)
  const payload = { ...review, markCompleted: !!markCompleted }
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload)
  })
  // Accept 2xx with empty body or different shape; only fail when explicit error or non-2xx
  const contentType = res.headers.get('content-type') || ''
  const json = contentType.includes('application/json') ? await res.json().catch(() => ({})) : {}
  if (!res.ok) {
    throw new Error((json as any)?.message || `Failed to save review (${res.status})`)
  }
  if (contentType.includes('application/json') && (json as any)?.success === false) {
    throw new Error((json as any)?.message || `Failed to save review (${res.status})`)
  }
}


