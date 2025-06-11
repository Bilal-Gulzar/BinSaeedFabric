import { Skeleton } from "@/components/ui/skeleton"

interface LatestInSkeletonProps {
  itemCount?: number
}

export default function LatestInSkeleton({ itemCount = 8 }: LatestInSkeletonProps) {
  return (
    <div className="flex overflow-x-auto scrollbar-hide sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-8">
      {Array.from({ length: itemCount }).map((_, index) => (
        <div key={index} className="min-w-[250px] sm:min-w-0">
          <div className="text-xs text-center relative space-y-3">
            {/* Product Image Skeleton */}
            <div className="relative">
              <Skeleton className="w-full aspect-square" />

              {/* New In Badge Skeleton */}
              <div className="absolute top-1 sm:top-3 left-0">
                <Skeleton className="h-5 w-12 sm:h-6 sm:w-16" />
              </div>
            </div>

            {/* Product Title Skeleton */}
            <Skeleton className="h-4 w-3/4 mx-auto" />

            {/* Product Price Skeleton */}
            <Skeleton className="h-4 w-16 mx-auto" />
          </div>
        </div>
      ))}
    </div>
  )
}
