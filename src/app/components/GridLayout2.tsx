"use client"
import Image from 'next/image'
import React from 'react'
import GridLayout1 from './gridLayout1';
import { useRouter } from 'next/navigation';

type GridSize = 2 | 3 | 4;

export default function GridLayout2({ gridCols=2 }: { gridCols :number}) {
  const array = Array.from([1,2,3,4,5])
  const router = useRouter()
  const gridClass: Record<number, string> = {
    2: "lg:grid-cols-2",
    3: "lg:grid-cols-3",
    4: "lg:grid-cols-4",
  };
  const navigate = ()=>{
    router.push('/productDetail/1')
  }
  if(gridCols == 1 ) return <div><GridLayout1/></div>
  if(gridCols != 1) return (
    <div
      className={`grid grid-cols-1 xs:grid-cols-2 ${gridClass[gridCols]} gap-5 sm:gap-7 md:gap-10`}
      style={{ width: "100%", height: "100%" }}
    >
      {array.map((x,index) => (
        <div key={index} className="text-xs text-center relative space-y-3">
          <Image
            src="/img4.jpg"
            alt="bb" 
            width={500}
            height={500}
            onClick={navigate}
            style={{ display: "block", flexGrow: 0, flexShrink: 0,cursor:"pointer" }}
          />
          <div className="hover:underline underline-offset-4 text-gray-700 font-medium">
            DP-0367- 3 Piece Lawn Printed UnStitched Suit
          </div>
          <div className="font-semibold text-sm ">RS.6,500</div>
          <div className="absolute top-1 sm:top-3 left-0 font-medium  text-[9px] sm:text-xs text-white bg-[#ffbb49]  sm:py-1 sm:px-2 px-1 py-0.5">
            New In
          </div>
        </div>
      ))}
    </div>
  );
}
