import { Card, CardContent, CardHeader } from "@/components/ui/card"

export default function CoursesLoading() {
  return (
    <div className="p-6 space-y-6">
      {/* Header Skeleton */}
      <div className="flex justify-between items-start">
        <div>
          <div className="h-8 bg-gray-200 rounded w-64 mb-2 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-96 animate-pulse"></div>
        </div>
        <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="space-y-0 pb-2">
              <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-16 animate-pulse"></div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search and Filter Skeleton */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="h-10 bg-gray-200 rounded flex-1 animate-pulse"></div>
        <div className="h-10 bg-gray-200 rounded w-[180px] animate-pulse"></div>
      </div>

      {/* Filter Tabs Skeleton */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-8 bg-gray-200 rounded w-24 animate-pulse"></div>
        ))}
      </div>

      {/* Table Skeleton */}
      <Card>
        <CardHeader>
          <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-gray-200 rounded-lg animate-pulse"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
                  <div className="h-3 bg-gray-200 rounded w-32 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
