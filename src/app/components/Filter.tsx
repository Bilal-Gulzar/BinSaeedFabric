"use client"
import React, { useEffect, useRef} from 'react'
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { IoCloseOutline } from 'react-icons/io5';


export default function Filter({
  isOpen,
  setIsOpen,
}: {
  isOpen: Boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<Boolean>>
}) {
  const modalRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!modalRef.current) return;

    if (isOpen) {
      disableBodyScroll(modalRef.current);
    } else {
      enableBodyScroll(modalRef.current);
    }

    return () => {
      if (modalRef.current) enableBodyScroll(modalRef.current);
    };
  }, [isOpen]);

  return (
    <div
      className={`${isOpen ? "fixed bg-black/80 inset-0 min-h-screen z-50 lg:hidden" : ""}`}
    >
      <aside
        className={`text-xs w-[270px] xs:w-[300px] min-h-screen scrollbar-hide  overflow-y-auto pb-20   fixed  bg-white px-5 transition-all duration-500 overflow-x-hidden top-0 left-0 z-50   ${
          isOpen ? "" : "-translate-x-full"
        }  `}
        ref={modalRef}
      >
        <div className=" font-bold text-sm my-8 ">Sidebar</div>
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
              <Input
                type="number"
                className="text-end pl-6 no-spinner"
                placeholder="0"
              />
              <span className="absolute top-3.5 left-2">RS</span>
            </div>
            <span> to</span>
            <div className="relative font-medium">
              <Input
                type="number"
                className="text-end pl-6 no-spinner"
                placeholder="5699"
              />
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
      <div
        className={`top-0  cursor-pointer fixed   bg-[#202020]  text-white ${
          isOpen ? "left-[270px] xs:left-[300px] " : "-translate-x-full -left-[300px]"
        } transition-all duration-500  `}
      >
        <IoCloseOutline
          onClick={() => setIsOpen(false)}
          className="size-7 m-1.5"
        />
      </div>
    </div>
  );
}
