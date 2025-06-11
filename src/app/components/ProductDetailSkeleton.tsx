import { Skeleton } from "@/components/ui/skeleton"

export default function ProductDetailSkeleton() {
  return (
    <div className="px-5 lg:px-12 py-8 pb-32">
      {/* Breadcrumb Skeleton */}
      <div className="text-xs space-x-2 text-gray-800">
        <Skeleton className="h-3 w-64 inline-block" />
      </div>

      <section className="mt-12">
        <main className="grid md:grid-cols-2 gap-5 lg:gap-5 xl:gap-7 lg:container lg:mx-auto">
          {/* Product Images Skeleton */}
          <div className="mx-auto z-20">
            {/* Main Image Skeleton */}
            <div className="relative w-full h-[550px]">
              <Skeleton className="w-full h-full" />
            </div>

            {/* Thumbnail Images Skeleton */}
            <div className="flex flex-wrap gap-3 mt-3 p-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="sm:w-28 w-24 h-32 sm:h-36 shrink-0 relative">
                  <Skeleton className="w-full h-full" />
                </div>
              ))}
            </div>
          </div>

          {/* Product Details Skeleton */}
          <div className="flex flex-col px-0.5 gap-5 overflow-hidden">
            {/* Product Title Skeleton */}
            <div>
              <Skeleton className="h-6 w-3/4" />
            </div>

            {/* Description Skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-5/6" />
              <Skeleton className="h-3 w-4/6" />
            </div>

            {/* Availability Skeleton */}
            <Skeleton className="h-3 w-32" />

            {/* Price Skeleton */}
            <div className="flex gap-2">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-20" />
            </div>

            {/* Tags Skeleton */}
            <div className="flex flex-wrap gap-2 mt-2">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton key={index} className="h-6 w-16" />
              ))}
            </div>

            {/* Size Selection Skeleton */}
            <div className="z-10">
              <Skeleton className="h-3 w-20 mb-3" />
              <div className="flex items-center gap-2 flex-wrap">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={index} className="h-10 w-16" />
                ))}
              </div>
            </div>

            {/* Size Guide Skeleton */}
            <Skeleton className="h-4 w-24" />

            {/* Quantity and Add to Cart Skeleton */}
            <div className="mt-7">
              <Skeleton className="h-3 w-16 mb-2" />
              <div className="flex sm:flex-row flex-col gap-5">
                <Skeleton className="h-12 w-24 sm:w-28" />
                <Skeleton className="h-12 flex-1" />
              </div>
            </div>
          </div>
        </main>
      </section>
    </div>
  )
}
