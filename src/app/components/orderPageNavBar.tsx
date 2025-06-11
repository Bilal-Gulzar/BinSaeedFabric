"use client"
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { IoCloseOutline, IoMenu } from 'react-icons/io5';
import { MdOutlineKeyboardArrowDown, MdOutlineKeyboardArrowUp } from 'react-icons/md';
import AsideBar from './asideBar';
import { getCookies } from '@/action';
import { client } from '@/sanity/lib/client';
import { usePathname } from 'next/navigation';



type user = {
  _id: string;
  fname: string;
  lname: string;
  email: string;
};
export default function OrderPageNavBar() {
const [showdiv,setShowdiv] = useState<Boolean>(false)
  const [alpha,setAlpha] = useState<string>('')
  const [email,setEmail] = useState<string>('')
  const [fullname,setFullname] = useState<string>('')
  const path = usePathname()
  const fetchingAlpha = async () => {
  const { _id } = await getCookies();

  const query = `*[_type == "user" && _id == $_id][0]`;
  const userID = { _id };
  const user: user = await client.fetch(query, userID);
  if (user) {
    let first = user.fname ? user.fname.charAt(0).toLocaleUpperCase() : "";
    let second = user.lname ? user.lname.charAt(0).toLocaleUpperCase() : "";
    let name = first + second;
    setAlpha(name);
    setFullname(user.fname + " " + user.lname || "");
    setEmail(user.email);
  }
};

useEffect(()=>{
  fetchingAlpha();
},[])
  return (
    <section className="sticky  top-0 bg-white z-40">
      <div className="">
        <div className="lg:mx-auto  flex px-5 lg:max-w-[1200px] lg:px-14 justify-between items-center py-4">
          <div onClick={() => setShowdiv(!showdiv)} className="md:hidden">
            {showdiv ? (
              <IoCloseOutline className="size-6" />
            ) : (
              <IoMenu className="size-6" />
            )}
            <AsideBar
              showdiv={showdiv}
              setShowdiv={setShowdiv}
              email={email}
              fullname={fullname}
              alpha={alpha}
            />
          </div>
          <div className="flex pl-10 mlg:pl-0 gap-14 items-center ">
            <div onClick={() => setShowdiv(false)} className="relative">
              <Link href="/">
                <Image
                  src="/logo.png"
                  width={55}
                  height={55}
                  className="h-auto "
                  alt="accountsmm"
                  priority
                />
              </Link>
            </div>
            <div className="flex items-center gap-2 text-sm text-black">
              <Link href="/" className=" md:block hidden">
                <p
                  onClick={() => setShowdiv(false)}
                  className="py-2 px-2  rounded-md hover:bg-[#f5f5f5]"
                >
                  Shop
                </p>
              </Link>
              <Link href="/orders" className=" md:block hidden">
                <p
                  onClick={() => setShowdiv(false)}
                  className={`hover:bg-[#f5f5f5] p-2  ${
                    path.includes("/orders") ? "underline" : "no-underline"
                  }`}>
                  orders
                </p>
              </Link>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <div className="hover:bg-[#f5f5f5] relative  py-2.5 px-3 rounded-md">
              <div
                onClick={() => setShowdiv(!showdiv)}
                className="cursor-pointer flex items-center gap-2"
              >
                {alpha ? (
                  <div className="w-9 h-9 text-black rounded-full bg-[#f5f5f5] flex justify-center items-center text-sm">
                    {alpha}
                  </div>
                ) : (
                  <div onClick={() => setShowdiv(!showdiv)}>
                    <svg
                      height="35"
                      width="35"
                      viewBox="0 0 19.05 19.05"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <defs />
                      <g style={{ opacity: 1 }}>
                        <g>
                          <circle
                            cx="9.6948"
                            cy="8.6535"
                            r="2.8189"
                            style={{
                              fill: "none",
                              stroke: "#707070", // Updated color
                              strokeWidth: 0.5,
                              strokeLinecap: "round",
                              strokeLinejoin: "round",
                            }}
                          />
                          <path
                            d="M4.6323,15.2284 A5.1757,5.1757 0 0 1 9.5562,11.6475 A5.1757,5.1757 0 0 1 14.4801,15.2281"
                            style={{
                              fill: "none",
                              stroke: "#707070", // Updated color
                              strokeWidth: 0.5,
                              strokeLinecap: "round",
                              strokeLinejoin: "round",
                            }}
                          />
                          <circle
                            cx="9.5562"
                            cy="9.3467"
                            r="7.6711"
                            style={{
                              fill: "none",
                              stroke: "#707070", // Updated color
                              strokeWidth: 0.5,
                              strokeLinecap: "round",
                              strokeLinejoin: "round",
                            }}
                          />
                        </g>
                      </g>
                    </svg>
                  </div>
                )}
                {showdiv && <MdOutlineKeyboardArrowUp />}
                {!showdiv && <MdOutlineKeyboardArrowDown />}
              </div>
              <AsideBar
                showdiv={showdiv}
                setShowdiv={setShowdiv}
                email={email}
                fullname={fullname}
                alpha={alpha}
              />
            </div>
          </div>
          <div className="md:hidden" />
        </div>
      </div>
    </section>
  );
}
