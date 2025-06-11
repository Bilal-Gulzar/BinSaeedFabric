"use client"
import React from 'react'
import OrderPageNavBar from '../components/orderPageNavBar';
import { RxLockClosed } from 'react-icons/rx';
import OrderPageFooter from '../components/orderPageFooter';
import { useRouter } from 'next/navigation';
import { Logingout } from "@/action";
import useAppContext from '@/context/ContextAPI';
import LogOut from '../components/Logout';

export default function LogoutPage() {
  const {setLogout } = useAppContext();
  const router = useRouter()

  const handleLogout = async () => {
    setLogout(true)
    await Logingout(); 
    setTimeout(() => {
      setLogout(false);
      router.push("/register") 
    }, 3000);
  };

  return (
    <div className="bg-[#f5f5f5] flex flex-col justify-between overflow-hidden min-h-screen">
      <div>
        <OrderPageNavBar />
        <div className="mt-10 px-5  lg:max-w-[1200px] lg:mx-auto lg:px-14">
          <h1 className="font-medium text-2xl">Settings</h1>
          <div className="grid gap-7 md:gap-5 md:grid-cols-[40%_auto] mt-8">
            <div className="flex  flex-col gap-3">
              <h2 className="font-medium flex gap-2 items-center">
                <span>
                  <RxLockClosed className="size-5" />
                </span>
                Log out everywhere
              </h2>
              <p className="text-gray-600 text-sm">
                If you've lost a device or have security concerns, log out
                everywhere to ensure the security of your account.
              </p>
            </div>
            <div className="bg-white lg:flex-row flex-col flex gap-4 lg:items-center p-5 rounded-md ">
              <button
                onClick={handleLogout}
                className="py-4 flex justify-center items-center border-[1.5px] font-medium text-red-700 text-sm tracking-wide hover:text-red-900 px-8 border-gray-300 rounded-md"
              >
                Log out everywhere
              </button>
              <p className="text-sm text-gray-600">
                You will be logged out on this device as well.
              </p>
            </div>
          </div>
        </div>
      </div>
      <OrderPageFooter />
      <LogOut/>
    </div>
  );
}
