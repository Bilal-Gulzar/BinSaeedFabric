"use client"
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useRef } from 'react'
import { IoCloseOutline } from 'react-icons/io5';
import { MdOutlineAccountCircle } from "react-icons/md";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import useAppContext from '@/context/ContextAPI';


export default function MenuBar() {
const {menuBar,setMenuBar} = useAppContext()
  const modalRef = useRef<HTMLDivElement| null>(null);
    
       useEffect(() => {
         if (!modalRef.current) return;
    
         if (menuBar) {
           disableBodyScroll(modalRef.current);
         } else {
           enableBodyScroll(modalRef.current);
         }
    
         return () => {
           if (modalRef.current) enableBodyScroll(modalRef.current);
         };
       }, [menuBar]);
  return (
    <div
      className={`${
        menuBar ? "fixed bg-black/80 inset-0 z-50 min-h-screen lg:hidden" : ""
      }`}
    >
      <section
        className={` ${
          menuBar ? "" : "-translate-x-full"
        }  min-h-screen transition-all duration-500 overflow-x-hidden border-t border-gray-500 bg-white fixed  left-0 top-0 bottom-0 z-30 w-[80vw] lg:hidden p-4`}
        ref={modalRef}
      >
        <div className="py-2 relative flex   justify-between  ">
          <h1 className=" font-semibold tracking-wide">MENU</h1>
          <span onClick={() => setMenuBar(false)}>
            <IoCloseOutline className="size-5" />
          </span>
        </div>
        <div>
          <div className="font-semibold break-all mt-5">
            
            <Link href="/collection?category=Men">
              <div className=" flex items-center tracking-wider justify-between cursor-pointer  py-3.5 border-y border-gray-200 uppercase">
               Men
                <span>
                  <ChevronRight className="size-5" />
                </span>
              </div>
            </Link>
            <Link href="/collection?category=Women">
              <div className=" flex items-center tracking-wider justify-between cursor-pointer  py-3.5 border-y border-gray-200 uppercase">
               Women
                <span>
                  <ChevronRight className="size-5" />
                </span>
              </div>
            </Link>
            <Link href="/collection?category=Kids">
              <div className=" flex items-center tracking-wider justify-between cursor-pointer  py-3.5 border-y border-gray-200 uppercase">
                Kids
                <span>
                  <ChevronRight className="size-5" />
                </span>
              </div>
            </Link>
            <Link href="/collection?category=Perfume">
              <div className=" flex items-center tracking-wider justify-between cursor-pointer  py-3.5 border-y border-gray-200 uppercase">
                Perfume
                <span>
                  <ChevronRight className="size-5" />
                </span>
              </div>
            </Link>
            <Link href="/collection">
              <div className=" flex items-center tracking-wider justify-between cursor-pointer  py-3.5 border-y border-gray-200 uppercase">
                Collection
                <span>
                  <ChevronRight className="size-5" />
                </span>
              </div>
            </Link>
            <Link href="/profile">
              <div className=" flex items-center text-xs tracking-wider  cursor-pointer  py-3.5 border-y border-gray-200 gap-2 text-gray-700 font-medium">
                <span>
                  <MdOutlineAccountCircle className="size-5" />
                </span>
                Logout / My Account
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
