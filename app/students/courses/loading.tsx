import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function CoursesLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 ml-16 pt-20">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header Skeleton */}
        <div className="mb-8">
          <Skeleton className="h-10 w-48 mb-2" />
          <Skeleton className="h-6 w-96" />
        </div>

        {/* Stats Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-8" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs Skeleton */}
        <div className="mb-6">
          <Skeleton className="h-10 w-full max-w-md mb-6" />
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-full sm:w-[200px]" />
          </div>
        </div>

        {/* Content Skeleton */}
        <div className="flex flex-col items-center justify-center py-16">
          <Skeleton className="w-24 h-24 rounded-full mb-6" />
          <Skeleton className="h-6 w-48 mb-2" />
          <Skeleton className="h-4 w-64 mb-6" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
    </div>
  )
}
