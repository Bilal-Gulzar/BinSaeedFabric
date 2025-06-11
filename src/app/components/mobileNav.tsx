"use client"
import { House } from 'lucide-react';
import Link from 'next/link';
import React from 'react'
import { LiaSearchSolid } from "react-icons/lia";
import { BiCategory } from "react-icons/bi";
import { RiAccountCircleLine } from "react-icons/ri";
import { BsBag } from "react-icons/bs";
import useAppContext from '@/context/ContextAPI';
import { useRouter } from 'next/navigation';


export default function MobileNav({ token }: { token: string | undefined }) {
  const { setSearch, setCart, setLogin, getTotalItems } = useAppContext();
  const router = useRouter()
  
  const account = ()=>{
    if(token){
      router.push('/orders')
    }else{
      setLogin(true)
    }

  }
  return (
    <section>
      <div className="lg:hidden flex justify-around z-30 items-center w-screen left-0 right-0 bg-white fixed bottom-0  shadow-lg text-xs font-medium h-14">
        <div className="flex flex-col items-center *:text-xs cursor-pointer">
          <Link href="/">
            <House className="size-[22px]" />
          </Link>
          <p>Home</p>
        </div>

        <div
          onClick={() => setSearch(true)}
          className="flex flex-col  cursor-pointer items-center"
        >
          <LiaSearchSolid className="size-[22px]  " />
          <p>Search</p>
        </div>
        <Link href={"/collection"}>
          <div className="flex flex-col items-center">
            <BiCategory className="size-[22px]  " />
            <p>Collection</p>
          </div>
        </Link>
        <div
          onClick={account}
          className="flex flex-col items-center"
        >
          <RiAccountCircleLine className="size-[22px]  " />
          <p className="cursor-pointer">Account</p>
        </div>
        <div
          onClick={() => setCart(true)}
          className="relative flex flex-col items-center cursor-pointer"
        >
          <BsBag size={26} />
          <span className="size-8   -top-1 left-2 flex absolute justify-center items-center text-xs rounded-full  bg-pink-100">
            {getTotalItems()}
          </span>
          <p>cart</p>
        </div>
      </div>
    </section>
  );
}
