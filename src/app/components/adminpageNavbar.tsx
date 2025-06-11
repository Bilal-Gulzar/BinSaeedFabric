"use client"
import { signOut } from "next-auth/react"; 
import Image from "next/image"
import Link from "next/link"
import React from 'react'

export default function AdminPageNavbar() {

    const handleSignOut = async () => {
      await signOut();
    };
  return (
    <section className="sticky  top-0 bg-white z-40">
      <div className="">
        <div className="lg:mx-auto  flex px-5 lg:max-w-[1200px] lg:px-14 justify-between items-center py-4">
          <div className="flex md:pl-10 lg:pl-0 gap-14 items-center ">
            <Link href="/">
              <Image
                src="/logo.png"
                width={50}
                height={50}
                className="h-auto "
                alt="accountsmm"
                priority
              />
            </Link>
          </div>
          <button
            onClick={handleSignOut}
            className='"w-full cursor-pointer font-medium text-red-700 text-xs tracking-wider hover:text-red-800 p-3  bg-white border-gray-200 rounded-md  flex justify-center items-center border-[1.5px] '
          >
            Sign out
          </button>
        </div>
        <div className="md:hidden" />
      </div>
    </section>
  );
}