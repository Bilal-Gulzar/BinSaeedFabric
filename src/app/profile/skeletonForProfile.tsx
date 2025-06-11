import { Skeleton } from '@/components/ui/skeleton';
import React from 'react'

export default function SkeletonForProfile() {
  return (
    <div className="mt-5 px-5  lg:max-w-[1200px] lg:mx-auto flex flex-col gap-8 lg:px-14">
      <Skeleton className="w-32 h-7 " />
      <div className="bg-white p-10  rounded-md">
        <div className="flex flex-col gap-2">
          <Skeleton className="w-44 h-7" />
          <Skeleton className="w-20 h-7" />
          <Skeleton className="w-full  sm:w-72 h-7" />
        </div>
      </div>
      <div className="bg-white p-10  rounded-md">
        <div className="flex flex-col gap-2 flex-grow">
          <Skeleton className="w-44 h-7" />
          <Skeleton className="w-[80%] sm:w-72 h-7" />
          <Skeleton className="w-full sm:w-96 h-7" />
        </div>
      </div>
    </div>
  );
}
