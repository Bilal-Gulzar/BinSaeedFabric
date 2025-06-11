import Image from 'next/image';
import React from 'react'

export default function ProductCart() {
  return (
    <div className="text-xs text-center relative space-y-3">
      <Image src="/img4.jpg" alt="" width={500} height={500} />
      <div className="hover:underline underline-offset-4 text-gray-700 font-medium">
        DP-0367- 3 Piece Lawn Printed UnStitched Suit
      </div>
      <div className="font-semibold text-sm ">RS.6,500</div>
      <div className="absolute top-1 sm:top-3 left-0 font-medium  text-[9px] sm:text-xs text-white bg-[#ffbb49]  sm:py-1 sm:px-2 px-1 py-0.5">
        New In
      </div>
    </div>
  );
}
