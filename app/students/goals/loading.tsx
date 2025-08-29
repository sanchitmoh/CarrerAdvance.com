import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function GoalsLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div className="space-y-2">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-10 w-32 mt-4 sm:mt-0" />
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-8" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Content Skeleton */}
        <Card>
          <CardContent className="py-16 text-center space-y-6">
            <Skeleton className="w-24 h-24 rounded-full mx-auto" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-32 mx-auto" />
              <Skeleton className="h-4 w-64 mx-auto" />
            </div>
            <Skeleton className="h-10 w-40 mx-auto" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
