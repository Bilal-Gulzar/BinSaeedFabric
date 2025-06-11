"use client"
import { usePathname } from 'next/navigation';
import React from 'react'
import { BsChatLeftDotsFill } from "react-icons/bs";

export default function ChatComponent() {
    const path = usePathname()
    const noNavbarRoutes = ["/orderID"]
  return (
    <div className={`${noNavbarRoutes.includes(path) ? "hidden" : ""}`}>

    <a
      href="https://wa.me/923278690391"
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className="bg-red-700 size-14 flex items-center z-40 justify-center  fixed bottom-16 lg:bottom-5  rounded-full left-4 lg:left-6">
        <BsChatLeftDotsFill size={30} className="text-white" />
      </div>
    </a>
    </div>
  );
}
