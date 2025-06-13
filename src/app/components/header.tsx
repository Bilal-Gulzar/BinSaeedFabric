
"use client"
import { AlignJustify, SearchIcon, UserRound } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import Marquee from "react-fast-marquee"
import { BsCart3 } from "react-icons/bs"
import { LiaShoppingBagSolid } from "react-icons/lia"
import MobileNav from "./mobileNav"
import MenuBar from "./menuBar"
import ShoppingCart from "./shoppingCart"
import { useParams, usePathname } from "next/navigation"
import useAppContext from "@/context/ContextAPI"


export default function Header({token}:{token:string | undefined}) {
  const { setSearch, setCart, setMenuBar, setLogin, getTotalItems } = useAppContext()
  const { id } = useParams()
  const path = usePathname()
  const noNavbarRoutes = ["/logout", "/orders", "/profile", `/orders/${id}`,"/orderID"]
  return (
    <header
      className={`shadow-sm pb-1 lg:pb-0  ${noNavbarRoutes.includes(path) ? "hidden" : ""}`}
    >
      <div className="bg-black font-Garamond font-semibold text-white text-sm p-2.5">
        <Marquee speed={40} gradient={false}>
          Cash on Delivery limit is PKR 20,000 Orders above PKR 20,000 have to
          pay 50% advance Cash Deposit via Bank Transfer. | No Exchange or
          Return on Sale Items.
        </Marquee>
      </div>
      <div className="flex justify-between gap-2 items-center  mx-2 lg:mx-10 ">
        <div className="flex lg:gap-4 gap-9 items-center">
          <div onClick={() => setMenuBar(true)} className="lg:hidden">
            <AlignJustify size={26} />
          </div>
          <Link
            href={"/"}
            className="size-10 my-2 hidden lg:block lg:size-auto"
          >
            <Image
              src="/logo.png"
              width={80}
              height={80}
              alt="binSaeedfabric"
            />
          </Link>
        </div>
        <Link href={"/"} className="size-10 my-2 lg:hidden">
          <Image src="/logo.png" width={80} height={80} alt="binSaeedfabric" />
        </Link>
        <div onClick={() => setSearch(true)} className="lg:hidden">
          <SearchIcon size={23} className="hover:scale-125 duration-300" />
        </div>
        <nav className="text-xs font-bold lg:flex gap-6   hidden">
          <Link
            href="/collection?category=Men"
            className="hover:underline underline-offset-2"
          >
            MEN
          </Link>
          <Link
            href="/collection?category=Women"
            className="hover:underline underline-offset-2"
          >
            WOMEN
          </Link>
          <Link
            href="/collection/?category=Kids"
            className="hover:underline underline-offset-2"
          >
            KIDS
          </Link>
          <Link
            href="/collection?category=Perfume"
            className="hover:underline underline-offset-2"
          >
            PERFUME
          </Link>
          <Link
            href="/collection"
            className="hover:underline underline-offset-2"
          >
            COLLECTION
          </Link>
        </nav>
        <div className="lg:flex hidden  gap-8 lg:gap-4 items-center">
          {token ? (
            <Link className="text-xs cursor-pointer" href="/orders">
              Accounts
            </Link>
          ) : (
            <div
              onClick={() => setLogin(true)}
              className="text-xs cursor-pointer "
            >
              <button className="cursor-pointer">Sign in</button>
            </div>
          )}
          <div onClick={() => setSearch(true)}>
            <SearchIcon
              size={23}
              className="hover:scale-125 cursor-pointer duration-300"
            />
          </div>
          <div
            onClick={() => setCart(true)}
            className="lg:block hidden cursor-pointer"
          >
            <BsCart3 size={23} className="hover:scale-125 duration-300" />
          </div>
          <div className="lg:hidden cursor-pointer">
            <UserRound size={26} />
          </div>
          <div className="size-7 lg:flex hidden justify-center items-center text-xs rounded-full  bg-pink-100">
            {getTotalItems()}
          </div>
          <div
            onClick={() => setCart(true)}
            className="relative cursor-pointer mr-3 lg:hidden"
          >
            <LiaShoppingBagSolid size={27} />
            <span className="size-5   -top-1 left-4 flex absolute justify-center items-center text-[9px] rounded-full  bg-pink-100">
              {getTotalItems()}
            </span>
          </div>
        </div>
      </div>
      <MobileNav token={token} />
      <MenuBar />
      <ShoppingCart />
    </header>
  );
}
