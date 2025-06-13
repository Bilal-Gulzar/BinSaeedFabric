
"use client"
import { Minus, Plus, X } from "lucide-react"
import { useEffect, useRef } from "react"
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"
import useAppContext from "@/context/ContextAPI"
import { useRouter } from "next/navigation"

export default function ShoppingCart() {
  const { cart, setCart, cartItems, removeFromCart, updateQuantity, getTotalItems, getTotalPrice } = useAppContext()
  const modalRef = useRef<HTMLDivElement | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (!modalRef.current) return

    if (cart) {
      disableBodyScroll(modalRef.current)
    } else {
      enableBodyScroll(modalRef.current)
    }

    return () => {
      if (modalRef.current) enableBodyScroll(modalRef.current)
    }
  }, [cart])

  const navigate = () => {
    router.push("/cart")
    setCart(false)
  }

  const handleQuantityChange = (id: string, currentQuantity: number, change: number, size?: string) => {
    const newQuantity = currentQuantity + change
    updateQuantity(id, newQuantity, size)
  }

  const handleRemoveItem = (id: string, size?: string) => {
    removeFromCart(id, size)
  }

  return (
    <section
      className={`${cart ? "fixed bg-black/80 inset-0 z-50 min-h-screen" : ""}`}
    >
      <div
        className={`min-h-screen w-[90vw] sm:w-[410px] z-50 fixed right-0 top-0 bg-white ${
          cart ? "" : "translate-x-full"
        } transition-all duration-500 overflow-x-hidden`}
        ref={modalRef}
      >
        <div className=" py-10 px-7">
          <div className="flex items-center w-full justify-between">
            <div className="font-semibold uppercase text-sm">shopping cart</div>
            <div onClick={() => setCart(false)} className="cursor-pointer">
              <X size={20} />
            </div>
          </div>
          <div>
            <div className="text-gray-600 text-xs mt-2">
              {getTotalItems()} items
            </div>
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div className="mx-7 pt-5 text-center">
            <div className="text-gray-600 text-xs mt-7">Your cart is empty</div>
            <Link href="/collection">
              <Button
                className="uppercase text-sm w-full font-semibold mt-10"
                variant="outline"
                onClick={() => setCart(false)}
              >
                continue shopping
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="mx-7 pt-5 height pb-96 flex flex-col gap-6 scrollbar-hide bg-white overflow-y-auto overflow-x-hidden">
              {cartItems.map((item) => (
                <div
                  key={`${item.id}-${item.size}`}
                  className="flex gap-4 border-b-4 pb-7 border-gray-200"
                >
                  <div className="w-24 h-28 shrink-0 bg-gray-100 relative">
                    <Image
                      src={item.imageUrl || "/placeholder.svg"}
                      fill
                      alt={item.name}
                      sizes="100px"
                      className="object-cover"
                      priority
                    />
                  </div>
                  <div className="flex flex-col gap-5 text-sm w-full min-w-[170px]">
                    <div className="text-gray-700 space-y-2">
                      <p className="line-clamp-2 font-medium text-xs pb-1 pr-2">
                        {item.name}
                      </p>
                      {item.size && (
                        <p className="text-xs text-gray-500">
                          Size: {item.size}
                        </p>
                      )}
                      <div className="flex gap-2 items-center">
                        {item.originalPrice && (
                          <span className="text-gray-400 line-through text-xs">
                            Rs.{item.originalPrice.toLocaleString()}
                          </span>
                        )}
                        <span className="font-bold">
                          Rs.{item.price.toLocaleString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center w-full justify-between">
                      <div className="font-bold gap-4 w-fit p-3 flex border border-gray-300 items-center">
                        <span
                          className="cursor-pointer text-gray-500 hover:text-black"
                          onClick={() =>
                            handleQuantityChange(
                              item.id,
                              item.quantity,
                              -1,
                              item.size
                            )
                          }
                        >
                          <Minus size={16} />
                        </span>
                        <span className="text-xs text-gray-600 font-normal min-w-[20px] text-center">
                          {item.quantity}
                        </span>
                        <span
                          className="cursor-pointer text-gray-500 hover:text-black"
                          onClick={() =>{
                           if(item.stock > item.quantity){
                            handleQuantityChange(
                              item.id,
                              item.quantity,
                              1,
                              item.size
                            )
                          }
                          }
                          }
                        >
                          <Plus size={16} />
                        </span>
                      </div>
                      <div className="">
                        <X
                          size={20}
                          className="cursor-pointer text-gray-500 hover:text-red-500"
                          onClick={() => handleRemoveItem(item.id, item.size)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="absolute bottom-8 h-[320px] w-full z-50 bg-white px-7 flex flex-col gap-5">
              <div className="flex pt-2 font-semibold justify-between">
                <p className="text-xs">Subtotal:</p>
                <p>Rs.{getTotalPrice().toLocaleString()}</p>
              </div>

              <div className="flex flex-col text-xs font-medium text-white tracking-widest gap-3">
                <Button
                  onClick={navigate}
                  className="hover:bg-white hover:text-black hover:border-gray-400 font-semibold hover:border"
                >
                  <Link href="/cart">CHECKOUT</Link>
                </Button>
                <Button onClick={()=>setCart(false)} variant="outline" className="text-black font-semibold">
                    CONTINUE SHOPPING
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
