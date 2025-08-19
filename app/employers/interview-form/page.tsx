import InterviewScheduler from "@/components/interview-form"
import { Suspense } from "react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50 to-teal-100">
      <Suspense fallback={<div className="p-6 text-center text-slate-600">Loading interview form...</div>}>
        <InterviewScheduler />
      </Suspense>
    </div>
  )
}
