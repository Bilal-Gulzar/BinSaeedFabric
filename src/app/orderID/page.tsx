import React from 'react'
import { auth, signIn, signOut } from "@/auth";
import { Button } from '@/components/ui/button';
import { FcGoogle } from "react-icons/fc";
import OrderPageNavBar from '../components/orderPageNavBar';
import OrderPageFooter from '../components/orderPageFooter';
import AdminSection from '../components/adminSection';
import AdminPageNavbar from '../components/adminpageNavbar';

export default async function OrderID() {
    const session = await auth()
    if(!session){
      return(
    <div className="bg-[#f5f5f5] justify-center w-full items-center  flex flex-col h-screen">
    <form
          action={async () => {
            "use server";
            await signIn("google", {
              callbackUrl: "/orderID",
            });
          }}
        >
          <Button type="submit" className="!px-10 cursor-pointer rounded-md !py-2 ">
            <FcGoogle /> Signin with Google
          </Button>
        </form>
        </div>
    )
  }else{
    return (
    <div className="bg-[#f5f5f5] justify-between w-full  flex flex-col min-h-screen">
      <AdminPageNavbar/>
      <div className="flex grow flex-col items-center">
      <AdminSection/>
      </div>
      <OrderPageFooter />
    </div>
  );
}
}
