import { Skeleton } from "@/components/ui/skeleton"

interface ProductGridSkeletonProps {
  gridCols: 1 | 2 | 3 | 4
  itemCount?: number
}

export default function ProductGridSkeleton({ gridCols, itemCount = 8 }: ProductGridSkeletonProps) {
  const getGridClass = () => {
    switch (gridCols) {
      case 1:
        return "grid-cols-1"
      case 2:
        return "grid-cols-1 xs:grid-cols-2"
      case 3:
        return "grid-cols-1 xs:grid-cols-2 md:grid-cols-3"
      case 4:
        return "grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
      default:
        return "grid-cols-1 xs:grid-cols-2"
    }
  } 

  return (
    <div className="p-4">
      {/* Loading text skeleton */}
      <div className="mb-4">
        <Skeleton className="h-3 w-48" />
      </div>

      {/* Products grid skeleton */}
      <div className={`grid ${getGridClass()} gap-5 sm:gap-8`}>
        {Array.from({ length: itemCount }).map((_, index) => (
          <div key={index} className="text-xs text-center relative space-y-3">
            {/* Product Image Skeleton */}
            <Skeleton className="w-full aspect-square" />

            {/* Category Skeleton */}
            <Skeleton className="h-3 w-16 mx-auto" />

            {/* Product Title Skeleton */}
            <Skeleton className="h-4 w-3/4 mx-auto" />

            {/* Price Skeleton */}
            <div className="flex gap-2 items-center justify-center">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-16" />
            </div>

            {/* New In Badge Skeleton */}
            <div className="absolute top-1 sm:top-3 left-0">
              <Skeleton className="h-5 w-12 sm:h-6 sm:w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
