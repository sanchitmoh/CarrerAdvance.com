"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export function BackButton() {
  const router = useRouter()

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push("/")
    }
  }

  return (
    <Button
      onClick={handleBack}
      variant="outline"
      size="sm"
      className="mb-4 flex items-center gap-2 hover:bg-gray-100 bg-transparent"
    >
      <span className="text-lg">←</span>
      Back to previous
    </Button>
  )
}

// Keep default export for backward compatibility
export default BackButton
