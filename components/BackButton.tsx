"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"

type BackButtonProps = {
  label?: string
  className?: string
}

export default function BackButton({ label = "Back", className = "" }: BackButtonProps) {
  const router = useRouter()

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className={`inline-flex items-center gap-2 rounded-xl border border-white/20 px-3 py-2 text-sm text-white hover:border-emerald-400 hover:text-emerald-300 transition-colors ${className}`}
      aria-label="Go back"
    >
      <ArrowLeft className="w-4 h-4" />
      <span>{label}</span>
    </button>
  )
}








