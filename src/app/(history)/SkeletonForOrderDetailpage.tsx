import { Skeleton } from '@/components/ui/skeleton';
import React from 'react'

export default function SkeletonForOrderDetailpage() {
  return (
    <div>
      <div className="lg:hidden flex pb-7 gap-7 mb-10 justify-between  border-b border-gray-300">
        <div className="flex gap-2">
          <Skeleton className="w-8 h-8" />
          <Skeleton className="w-24 h-8" />
        </div>
        <Skeleton className="w-32 h-8" />
      </div>
      <div className="flex gap-2 mb-7">
        <Skeleton className="w-5 h-5" />
        <div className="flex flex-col gap-2">
          <Skeleton className="w-36 h-8" />

          <Skeleton className="w-60 h-5 " />
        </div>
      </div>
      <div className="mb-10">
        <Skeleton className="lg:hidden w-full h-16" />
      </div>

      <div className="lg:grid-cols-[55%_auto] gap-5  grid ">
        <div className="bg-white flex flex-col  lg:order-1 order-2 gap-10 px-5 py-10 sm:p-10 rounded-lg">
          <div className="flex gap-1.5 ">
            <Skeleton className="w-16 h-16  rounded-md " />
            <Skeleton className="w-16 h-16 rounded-md " />
            <Skeleton className="w-16 h-16 rounded-md " />
          </div>
          <div className="flex gap-2 ">
            <Skeleton className="w-5 h-5" />
            <div className="flex flex-col gap-1 items-start">
              <Skeleton className="w-20 h-5 " />
              <Skeleton className="w-52 h-5" />
              <Skeleton className="w-36 h-5 " />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-5 lg:order-2 order-1 ">
          <div className="bg-white sm:p-10  px-5 py-10 flex rounded-lg flex-col gap-1">
            <Skeleton className="w-32 h-7" />
            <Skeleton className="w-44 h-5" />
          </div>
          <div className="lg:block hidden bg-white p-8 rounded-lg">
            <Skeleton className="w-24 h-6 mb-8" />
            <div className="flex items-center justify-between">
              <div className="flex gap-1 items-center">
                <Skeleton className="w-16 h-16" />
                <div className="flex flex-col gap-1">
                  <Skeleton className="w-28 h-5" />
                  <Skeleton className="w-36 h-5" />
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <Skeleton className="w-14 h-5" />
                <Skeleton className="w-20 h-5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
