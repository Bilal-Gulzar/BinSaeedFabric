import { Button } from '@/components/ui/button';
import React from 'react'

export default function AboutPage() {
  return (
    <div className="px-2 sm:px-5 lg:px-12 pt-14 lg:pt-0 pb-24">
      <div className="bg-gray-100  grid grid-cols-1 items-center  sm:grid-cols-2 ">
        <div className="p-4 sm:p-6 lg:p-20 space-y-5 sm:order-1 order-2">
          <h1 className="font-bold text-xl uppercase">About Us</h1>
          <p className="text-xs leading-6">
            Bin Saeed has set out to achieve success by crafting true
            relationships within the industry, maintaining high quality of our
            products, and solid partnerships with our clients. Over the years,
            Bin Saeed has transformed into a well-established brand by
            maintaining and staying true to our reality. We continue to produce
            fusion of styles to complement all your needs. We produce and
            deliver both private label garments. Product mix at Bin Saeed ranges
            from 3 piece lawn embroidery stitched & unstitched, 2 piece
            exclusive chiffon shirts. We use Pure Fabrics, Fine Embroidery &
            excellent stitching. At Bin Saeed, we strongly believe that Fashion
            should be affordable by everyone. Our presence keeps thriving and
            this is just the beginning!
          </p>
          <Button
            variant="outline"
            className="uppercase px-10 bg-orange-600 text-white font-semibold mt-6  hover:bg-background hover:text-black "
          >
            online store{" "}
          </Button>
        </div>
        <div className="sm:order-2 order-1">
          <img src="/img1.png" className="w-full" alt="saeedfabric" />
        </div>
      </div>
    </div>
  );
}
