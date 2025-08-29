import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function CareerRoadmapLoading() {
  return (
    <div className="min-h-screen bg-gray-50 ml-16 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <Skeleton className="h-8 w-64 mb-2" />
            <Skeleton className="h-4 w-96" />
          </div>
          <Skeleton className="h-10 w-32 mt-4 sm:mt-0" />
        </div>

        {/* Progress Card Skeleton */}
        <Card className="mb-8">
          <CardHeader>
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-8" />
                </div>
                <Skeleton className="h-3 w-full" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-white rounded-lg p-4 border border-gray-200">
                    <Skeleton className="h-8 w-8 mx-auto mb-2" />
                    <Skeleton className="h-4 w-16 mx-auto" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Empty State Skeleton */}
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 px-6">
            <Skeleton className="w-16 h-16 rounded-full mb-6" />
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-96 mb-6" />
            <Skeleton className="h-10 w-32" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
