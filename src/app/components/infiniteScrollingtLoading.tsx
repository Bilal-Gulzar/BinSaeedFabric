
// "use client"
// import { useEffect, useState } from "react"
// import { Loader2 } from "lucide-react"

// const InfiniteScrollingLoading = () => {
//   const [isLoading, setIsLoading] = useState(false)
//   const [allLoaded, setAllLoaded] = useState(false)

//   useEffect(() => {
//     const handleScroll = () => {
//       // Check if user has scrolled to the bottom
//       if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 && !isLoading && !allLoaded) {
//         loadMoreItems()
//       }
//     }

//     window.addEventListener("scroll", handleScroll)
//     return () => window.removeEventListener("scroll", handleScroll)
//   }, [isLoading, allLoaded])

//   const loadMoreItems = () => {
//     setIsLoading(true)

//     // Simulate loading more items
//     setTimeout(() => {
//       // In a real app, you would fetch more products here
//       // For now, we'll just simulate that all items are loaded after first attempt
//       setIsLoading(false)
//       setAllLoaded(true)
//     }, 1500)
//   }

//   if (allLoaded) return null

//   return (
//     <div className="flex justify-center items-center py-8">
//       {isLoading ? (
//         <div className="flex items-center gap-2">
//           <Loader2 className="h-5 w-5 animate-spin" />
//           <span className="text-sm text-gray-600">Loading more products...</span>
//         </div>
//       ) : (
//         <div className="text-sm text-gray-400">Scroll for more</div>
//       )}
//     </div>
//   )
// }

// export default InfiniteScrollingLoading


import React from "react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

export default function InfiniteScrollingtLoading({
  progress = 0,
  loadedCount,
  totalCount,
}: {
  progress?: number;
  loadedCount: number;
  totalCount: number;
}) {
  return (
    <div className="flex my-20  flex-col items-center ">
      <div className=" max-w-md min-w-1/2 sm:min-w-1/3 flex flex-col items-center space-y-5 ">
        <div className="text-xs text-gray-600">
          {" "}
          Showing {loadedCount} of {totalCount} total
        </div>
        <div className="w-full -mt-2">
          <Progress value={progress} />
        </div>

        <Button
          variant="ghost"
          className="w-full hover:bg-black duration-300  border border-gray-300 !py-4 "
        >
          <div className="lds-dual-ring"></div>
        </Button>
      </div>
    </div>
  );
}
