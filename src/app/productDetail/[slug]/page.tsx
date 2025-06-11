"use client"
import SizeGuide from '@/app/components/sizeChart';
import { Button } from '@/components/ui/button';
import { Minus, Plus, RulerDimensionLine } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import ReactImageMagnify from "react-image-magnify";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";

export default function ProductDetail() {
  const [showSize,setShowSize] = useState<Boolean>(false)
    
  return (
    <div className="px-5 lg:px-12 py-8 pb-32">
      <div className="text-xs  space-x-2 text-gray-800">
        <Link href={"/"}>Home</Link>
        <span className="font-semibold">&gt;</span>

        <span>DP-0369- 3 Piece Lawn Printed UnStitched Suit </span>
      </div>
      <section className="mt-12">
        <main className="grid md:grid-cols-2  gap-5 lg:gap-5 xl:gap-7 lg:container lg:mx-auto">
          <div className="mx-auto z-20">
            <div className="lg:block  hidden">
              <ReactImageMagnify
                {...{
                  smallImage: {
                    alt: "Product",
                    isFluidWidth: false,
                    width: 450, // 👈
                    height: 550,
                    src: "/im3.jpg",
                  },
                  largeImage: {
                    src: "/im3.jpg",
                    width: 1200,
                    height: 1800,
                  },
                  enlargedImageContainerDimensions: {
                    width: "200%",
                    height: "100%",
                  },
                  isHintEnabled: true,
                }}
              />
            </div>
            <div className="relative lg:hidden overflow-x-hidden">
              <Zoom>
                {/* <ReactImageMagnify
                  {...{
                    smallImage: {
                      alt: "Product",
                      isFluidWidth: true,
                      width: 450, // 👈
                      height: 550,
                      src: "/im3.jpg",
                    },
                    largeImage: {
                      src: "/im3.jpg",
                      width: 1200,
                      height: 1800,
                    },
                    enlargedImageContainerDimensions: {
                      width: "200%",
                      height: "100%",
                    },
                    enlargedImagePosition: "over",
                    shouldUsePositiveSpaceLens: true,
                    isHintEnabled: true,
                  }}
                /> */}
                <img src="/im3.jpg" />
              </Zoom>
            </div>
            <div className="flex flex-wrap gap-10 mt-3 p-3">
              <div className="sm:w-28 w-24 h-32 sm:h-36 shrink-0 relative">
                <Image
                  src="/img1.png"
                  fill
                  alt="img"
                  sizes="100vw"
                  className="w-full full"
                  priority
                />
                <div className="absolute inset-0 bg-white/70"></div>
              </div>
              <div className="sm:w-28 w-24 h-32 sm:h-36 shrink-0  relative">
                <Image
                  src="/img4.jpg"
                  fill
                  alt="img"
                  sizes="100vw"
                  className="w-full full"
                  priority
                />
              </div>
              <div className="sm:w-28 w-24 h-32 sm:h-36 shrink-0  relative">
                <Image
                  src="/im3.jpg"
                  fill
                  alt="img"
                  sizes="100vw"
                  className="w-full full"
                  priority
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col px-0.5 gap-5 overflow-hidden break-all">
            <div className="">
              <p className="font-semibold text-xl">
                DP-0369- 3 Piece Lawn Printed UnStitched Suit
              </p>
            </div>
            <p className="text-gray-600 font-medium  text-xs ">
              3 Piece Coral Pink Color Lawn Printed UnStitched Suit with Lawn
              Dupatta & Plain Trouser.
            </p>
            <div className=" text-gray-600 font-medium  mt-2 text-xs">
              Availability: In Stock
            </div>
            <div className="font-bold mt-2 flex gap-2">
              <span className="line-through">Rs.4,995.00</span>
              <span className='text-[#D12442]'>Rs.2,995.00</span>
            </div>
            <div className="z-10">
              <div className=" text-gray-600 font-medium  mb-3  text-xs">
                Size: Medium
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2 relative  overflow-hidden text-gray-400 py-3 border  border-gray-300">
                  Small
                  <span className="absolute left-[-10%] top-1/2 w-[120%] h-[1px] bg-red-300 -rotate-45 -translate-y-1/2 pointer-events-none" />
                </span>
                <span className="text-xs px-2 py-3 border border-black">
                  Medium
                </span>
                <span className="text-xs px-2 relative  overflow-hidden text-gray-400 py-3 border  border-gray-300">
                  Large
                </span>
                <span className="text-xs px-2 relative  overflow-hidden text-gray-400 py-3 border  border-gray-300">
                  Extra Large
                  <span className="absolute left-[-10%] top-1/2 w-[120%] h-[1px] bg-red-300 -rotate-45 -translate-y-1/2 pointer-events-none" />
                </span>
              </div>
            </div>
            <div
              onClick={() => setShowSize(true)}
              className=" text-gray-600 font-medium flex hover:underline underline-offset-4 items-center gap-2 mt-2 text-xs cursor-pointer"
            >
              <RulerDimensionLine className="text-black" /> size Guide
            </div>
            <div className="mt-7">
              <span className="text-xs text-gray-600 font-medium mb-2">
                Quantity:
              </span>
              <div className="flex sm:flex-row flex-col gap-5">
                <div className="font-bold gap-4 w-24 sm:w-28 justify-between px-1 py-3 flex border border-gray-300 items-center shrink-0">
                  <span className="cursor-pointe text-gray-700">
                    <Minus size={20} />
                  </span>
                  <span className="text-xs text-gray-600 font-normal  ">1</span>
                  <span className="cursor-pointe text-gray-700">
                    <Plus size={20} />
                  </span>
                </div>
                <Button className="bg-black py-2.5  grow  text-sm sm:w-auto  text-white font-semibold hover:bg-white hover:text-black hover:border-gray-400 hover:border">
                  ADD TO CART
                </Button>
              </div>
            </div>
          </div>
        </main>
      </section>
      {/* <SizeGuide show={showSize} hide={setShowSize} /> */}
    </div>
  );
}
