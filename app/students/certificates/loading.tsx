import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function CertificatesLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 ml-16 pt-20">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-16 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
