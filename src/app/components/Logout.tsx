"use client";
import React, { useEffect, useRef, useState } from "react";
import { ImSpinner8 } from "react-icons/im";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import useAppContext from "@/context/ContextAPI";






export default function LogOut() {
  const modalRef = useRef<HTMLDivElement| null>(null);
  const { logout} = useAppContext();
   
     useEffect(()=>{  
     if (!modalRef.current) return;
    
        if (logout) {
          disableBodyScroll(modalRef.current);
        } else {
          enableBodyScroll(modalRef.current);
        }
    
        return () => {
          if (modalRef.current) enableBodyScroll(modalRef.current);
        };
      }, [logout]);
  return (
    <section
      className={`${logout ? "" : "translate-y-full"} z-50 fixed justify-center items-end sm:items-center left-0 top-0  backdrop-blur-sm bg-[#666666]/80 w-full h-full flex  `}
    >
      <div
        className={`${logout ? "translate-y-0 " : "translate-y-full"} transition-all duration-200 ease-in   bg-white  gap-3 flex flex-col items-center justify-center w-full mx-0 sm:w-[330px] h-[120px] rounded-t-2xl sm:rounded-lg`}
        ref={modalRef}
      >
        <button className="animate-spin">
          <ImSpinner8 className="size-8" />
        </button>
        <p className="text-sm ">Logging you out...</p>
      </div>
    </section>
  );
}
