"use client"
import { useParams, usePathname } from 'next/navigation';
import React from 'react'
import { BsChatLeftDotsFill } from "react-icons/bs";

export default function ChatComponent() {
    const path = usePathname()
        const { id } = useParams();
    const noNavbarRoutes = [
      "/logout",
      "/orders",
      "/profile",
      `/orders/${id}`,
    ];

  return (
    <div
      className={`${path == "/orderID" ? "hidden" : ""}`}
    >
      <a
        href="https://wa.me/923278690391"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div
          className={`bg-red-700 size-14 flex items-center z-30 justify-center  fixed  lg:bottom-5  rounded-full left-4 lg:left-6  ${noNavbarRoutes.includes(path) ? "bottom-7" : "bottom-16 "} `}
        >
          <BsChatLeftDotsFill size={30} className="text-white" />
        </div>
      </a>
    </div>
  );
}
