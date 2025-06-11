import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import React from 'react'

export default function Aside() {
  return (
    <aside className="col-span-3 text-xs px-2 lg:block hidden">
      <h3 className="border-b border-black pb-4">Availability</h3>
      <div className="mt-5 space-y-2.5">
        <div className=" flex items-center gap-2">
          <input type="checkbox" className="accent-black" />
          <label>In Stock (279)</label>
        </div>
        <div className=" flex items-center gap-2">
          <input type="checkbox" className="accent-black" />
          <label>Out Of Stock (1417)</label>
        </div>
      </div>
      <h3 className="border-b border-black pb-4 mt-12">Price</h3>
      <div className="mt-6 space-y-4">
        <Slider defaultValue={[0, 100]} max={100} step={1} />
        <div className="flex gap-4 items-center">
          <div className="relative font-medium">
            <Input className="text-end pl-6 no-spinner" type='number' placeholder="0" />
            <span className="absolute top-3.5 left-2">RS</span>
          </div>
          <span> to</span>
          <div className="relative font-medium">
            <Input className="text-end pl-6 no-spinner"  type='number' placeholder="5699" />
            <span className="absolute top-3.5 left-2">RS</span>
          </div>
        </div>
        <Button className="w-full">APPLY</Button>
      </div>
      <h3 className="border-b border-black pb-4 mt-12">Size</h3>
      <div className="flex flex-wrap gap-2 mt-5">
        <button className="text-xs px-2 relative  py-3 border  border-gray-300">
          Extra Small
        </button>
        <button className="text-xs px-2 relative  py-3 border  border-gray-300">
          Small
        </button>
        <button className="text-xs px-2 relative  py-3 border  border-gray-300">
          Medium
        </button>
        <button className="text-xs px-2 relative  py-3 border  border-gray-300">
          Medium
        </button>
        <button className="text-xs px-2 relative  py-3 border  border-gray-300">
          Large
        </button>
        <button className="text-xs px-2 relative  py-3 border  border-gray-300">
          Extra Large
        </button>
        <button className="text-xs px-2 relative  py-3 border  border-gray-300">
          Extra Large
        </button>
      </div>
      <h3 className="border-b border-black pb-4 mt-12">Fabric</h3>
      <div className="mt-5 flex items-center gap-1">
        <input type="checkbox" className="accent-black" />
        <label>Organza (3)</label>
      </div>
      <h3 className="border-b border-black pb-4 mt-12">Type</h3>
      <div className="mt-5 flex items-center gap-1">
        <input type="checkbox" className="accent-black" />
        <label>3 piece (14)</label>
      </div>
    </aside>
  );
}

