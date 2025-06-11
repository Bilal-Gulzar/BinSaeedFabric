import Image from 'next/image'
import React from 'react'

export default function GridLayout1() {
  
  return (
    <div className=" w-full mb-8">
      <div
        className="space-y-5 border-b  border-gray-300"
      >
        <div
          className="text-xs flex sm:flex-row flex-col gap-2 sm:gap-5   md:gap-10 relative space-y-3  pb-6"
        >
          <div>
            <Image src="/img4.jpg" alt="" className='img-slider-img' width={280} height={280} />
          </div>
          <div className="space-y-2">
            <div className="hover:underline underline-offset-4 font-medium">
              DP-0367- 3 Piece Lawn Printed UnStitched Suit
            </div>
            <div className="md:block hidden">
              3 Piece Maroon Color Lawn Printed UnStitched Suit with Lawn
              Dupatta & Plain Trouser.
            </div>
            <div className="font-semibold text-sm ">RS.6,500</div>
            <div className="absolute top-1 sm:top-3 left-0 font-medium  text-[9px] sm:text-xs text-white bg-[#ffbb49]  sm:py-1 sm:px-2 px-1 py-0.5">
              New In
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
