"use client"
import OrderPageFooter from '@/app/components/orderPageFooter';
import OrderPageNavBar from '@/app/components/orderPageNavBar';
import { Skeleton } from '@/components/ui/skeleton';
import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { AiOutlineCheck } from 'react-icons/ai';
import { IoAlertCircleOutline } from 'react-icons/io5';
import { MdPayment } from 'react-icons/md';
import { CgCloseO, CgSortAz } from "react-icons/cg";
import { checkOrderAvailability, GetUserOrders } from '@/action';
import { format, parseISO } from "date-fns";
import { urlFor } from '@/sanity/lib/image';
import { MdFilterList } from "react-icons/md";
import useAppContext from '@/context/ContextAPI';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface Item {
  id: string;
  _key: string;
  productName: string;
  size?: string;
  quantity: number;
  imageUrl: string;
  price: number;
} 


interface Product {
  _id:string,
  _createdAt:Date,
  orderDate:string,
  customerName:string,
  customerEmail:string,
  paymentMethod:string,
   paymentStatus:string,
  isPaid:boolean,
  totalAmount:number,
  items:Item[]
}

export default function Orders() {
      const [orders,setOrders] = useState<Product[]>([])
      const [isLoading,setIsLoading] = useState<boolean>(true)
      const { addToCart ,clearCart} = useAppContext();
      const router =  useRouter()
     useEffect(()=>{

  if (typeof window !== "undefined") {
    const url = new URL(window.location.href); 
    const params = url.searchParams;
  
    if (params.get("canceled") === "1") {
      const orderId = params.get("sessionID"); 
  
      toast.error("Order canceled.");
  
      if (orderId) {
        fetch("/api/update-payment-status", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderId }),
        })
          .then((res) => res.json())
          // .then((data) => console.log(data));
      }
  
      setTimeout(() => {
        params.delete("canceled");
        params.delete("sessionID");
  
        const cleanedUrl = `${url.origin}${url.pathname}${
          params.toString() ? "?" + params.toString() : ""
        }`;
  
        window.history.replaceState({}, "", cleanedUrl);
      }, 5000);
  }
  }



const getAllOrders = async()=>{
  try{
 let AllOrders:Product[] =  await GetUserOrders()
 if(AllOrders && AllOrders?.length > 0){
 setOrders(AllOrders)
 }
}
 catch(e){
  console.log("ERROR",e)
  setOrders([])

 }finally{
  setIsLoading(false)
 }
}

getAllOrders()
},[])


const handleBuyAgain = async (orderId: string,items:Item[]) => {
  const result = await checkOrderAvailability(orderId);

  if (!result.success) {
    const message = result.details?.length
      ? `Some items unavailable:\n${result.details.join("\n")}`
      : "Some items are unavailable.";
    toast.error(message);
  } else {
    clearCart()
    for (const product of items){
      for (let i = 0; i < product.quantity; i++) {
       addToCart({
      id: product.id,
      name: product.productName,
      price: product.price,
      imageUrl: product.imageUrl,
      size: product.size,
    }); 
  }
  }
    toast.success("All items added to cart");
     setTimeout(()=>{
      router.push('/cart')
    },2500)

    // Proceed to add items to cart...
  }
};



  return (
    <main className="bg-[#f5f5f5] flex flex-col justify-between overflow-hidden min-h-screen ">
      <div>
        <OrderPageNavBar />
        <div className=" lg:max-w-[1100px]  mx-5 lg:mx-auto sm:mx-5">
          <div className="flex items-center  mt-8  justify-between gap-4">
            <h1 className="text-xl font-semibold">Orders</h1>
            {/* {orders && orders.length > 0 && (
              <span className="bg-white size-9 flex justify-center items-center rounded-lg">
                <MdFilterList
                  onClick={() => setSorting(true)}
                  className="text-gray-500 cursor-pointer"
                  size={25}
                />
              </span>
            )} */}
          </div>
          {!isLoading ? (
            <div>
              {orders && orders.length > 0 ? (
                <div className="grid sm:grid-cols-2  gap-5 lg:grid-cols-3 pb-52 pt-10">
                  {orders.map((v) => (
                    <div
                      key={v._id}
                      className="px-4 py-5 gap-5 rounded-lg bg-white flex flex-col"
                    >
                      <div className="text-xs py-4 rounded-md px-5 bg-[#f5f5f5]">
                        {v.paymentMethod == "stripe" && (
                          <div className="flex items-center gap-1.5">
                            {v.isPaid ? (
                              <div className="flex items-center gap-1.5">
                                <AiOutlineCheck className="size-4" />
                                <p className="font-semibold">
                                  {v.paymentStatus == "Delivered"
                                    ? "Delivered!"
                                    : "Confirm"}
                                </p>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5">
                                <CgCloseO className="size-4" />
                                <p className="font-semibold">cancelled</p>
                              </div>
                            )}
                          </div>
                        )}
                        {v.paymentMethod == "cod" && (
                          <div>
                            {v.paymentStatus == "pending" && (
                              <div className="flex items-center gap-1.5">
                                <p className="font-semibold">⏳Pending</p>
                              </div>
                            )}
                            {v.paymentStatus == "cancelled" && (
                              <div className="flex items-center gap-1.5">
                                <span>
                                  <CgCloseO className="size-4" />
                                </span>
                                <p className="font-semibold">Canceled</p>
                              </div>
                            )}
                            {v.paymentStatus == "Delivered" && v.isPaid && (
                              <div className="flex items-center gap-1.5">
                                <span>
                                  <AiOutlineCheck className="size-4" />
                                </span>
                                <p className="font-semibold">Delivered!</p>
                              </div>
                            )}
                          </div>
                        )}
                        <p className="ml-5">
                          {v.isPaid && "Last updated"}{" "}
                          {format(parseISO(v.orderDate), "MMM d")}
                        </p>
                      </div>

                      {/* <Link href={`/orders/${v._id}`}>
                        {v.items && v.items?.[0]?.imageUrl ? (
                          <div className="mx-auto  h-[300px] xs:h-96 bg-[#f5f5f5] rounded-md">
                            <Image
                              src="/im3.jpg"
                              // fill
                              width={400}
                              height={400}=                              alt={v.items?.[0].name || "order image"}
                              className="img-slider-img"
                              priority
                            />
                          </div>
                        ) : (
                          <div className="bg-[#f5f5f5] w-full h-[300px] xs:h-96"></div>
                        )}
                      </Link> */}
                      {/* <Link href={`/orders/${v._id}`}>
                        {v.items && v.items.length > 0 ? (
                          <div className="relative h-[300px] xs:h-96 bg-[#f5f5f5] rounded-md overflow-hidden">
                            {v.items.length === 1 ? (
                              <Image
                                src={urlFor(v.items[0].imageUrl).url()}
                                fill
                                alt={v.items[0].name || "Order item"}
                                className="object-cover"
                              />
                            ) : (
                              <div className="grid grid-cols-2 grid-rows-2 h-full w-full gap-1">
                                {v.items.slice(0, 4).map((item, index) => (
                                  <div
                                    key={item._key}
                                    className={`relative ${index === 0 && v.items.length > 1 ? "row-span-2" : ""}`}
                                  >
                                    {item.imageUrl && (
                                      <Image
                                        src={urlFor(item.imageUrl).url()}
                                        fill
                                        alt={item.name || "Order item"}
                                        className="object-cover"
                                      />
                                    )}
                                    {index === 3 && v.items.length > 4 && (
                                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-xl">
                                        +{v.items.length - 4}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="h-[300px] xs:h-96 bg-[#f5f5f5] rounded-md flex items-center justify-center">
                            No images available
                          </div>
                        )}
                      </Link> */}
                      <Link href={`/orders/${v._id}`} className="block">
                        <div className="relative h-[300px] xs:h-96 bg-[#f5f5f5] rounded-md overflow-hidden">
                          {v.items.length === 1 && (
                            <Image
                              src={urlFor(v.items[0].imageUrl).url()}
                              alt={v.items[0].productName || "Order item"}
                              fill
                              className="object-cover"
                            />
                          )}

                          {v.items.length === 2 && (
                            <div className="grid grid-cols-2 h-full w-full gap-1">
                              {v.items.map((item) => (
                                <div key={item._key} className="relative">
                                  <Image
                                    src={urlFor(item.imageUrl).url()}
                                    alt={item.productName || "Order item"}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              ))}
                            </div>
                          )}

                          {v.items.length === 3 && (
                            <div className="grid grid-cols-3 grid-rows-2 h-full w-full gap-1">
                              <div className="relative col-span-2 row-span-2">
                                <Image
                                  src={urlFor(v.items[0].imageUrl).url()}
                                  alt={v.items[0].productName || "Order item"}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              {v.items.slice(1, 3).map((item) => (
                                <div key={item._key} className="relative">
                                  <Image
                                    src={urlFor(item.imageUrl).url()}
                                    alt={item.productName || "Order item"}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              ))}
                            </div>
                          )}

                          {v.items.length >= 4 && (
                            <div className="grid grid-cols-2 grid-rows-2 h-full w-full gap-1">
                              {v.items.slice(0, 4).map((item, index) => (
                                <div key={item._key} className="relative">
                                  <Image
                                    src={urlFor(item.imageUrl).url()}
                                    alt={item.productName || "Order item"}
                                    fill
                                    className="object-cover"
                                  />
                                  {/* Show "+X more" as a small badge */}
                                  {index === 3 && v.items.length > 4 && (
                                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-0.5 rounded">
                                      +{v.items.length - 4} more
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </Link>

                      <div className="text-xs">
                        <p className="font-semibold">
                          {v.items.length}{" "}
                          {v.items.length > 1 ? "Items" : "Item"}
                        </p>
                        <p className="text-gray-500 mt-1">
                          <span className="font-semibold text-black">
                            Order:
                          </span>
                          <span className="text-xs font-medium"> {v._id}</span>
                        </p>
                      </div>
                      <div className="flex gap-4 items-center text-sm">
                        <p className="font-semibold">RS.{v.totalAmount}</p>

                        {v.paymentMethod == "stripe" && (
                          <div>
                            {v.isPaid ? (
                              <div className="bg-[#f5f5f5] items-center  text-xs py-2 px-4 rounded-full gap-1 flex">
                                <span>
                                  <MdPayment className="size-4" />
                                </span>
                                <p>Payment successful</p>
                              </div>
                            ) : (
                              <div className="bg-[#f5f5f5] items-center text-xs py-2 px-4 rounded-full gap-1 flex">
                                <span>
                                  <img
                                    src="paymentcancel.png"
                                    width={20}
                                    height={20}
                                    className="shrink-0"
                                  />
                                </span>
                                <p>Payment Canceled</p>
                              </div>
                            )}
                          </div>
                        )}
                        {v.paymentMethod == "cod" && (
                          <div>
                            {v.paymentStatus == "Delivered" && (
                              <div className="bg-[#f5f5f5] items-center  text-xs py-2 px-4 rounded-full gap-1 flex">
                                <span>
                                  <MdPayment className="size-4" />
                                </span>
                                <p>payment successful</p>
                              </div>
                            )}
                            {v.paymentStatus == "pending" && (
                              <div className="bg-[#f5f5f5] items-center text-xs py-2 px-4 rounded-full gap-1 flex">
                                <span>
                                  <IoAlertCircleOutline className="size-4" />
                                </span>
                                <p>Payment pending</p>
                              </div>
                            )}
                            {v.paymentStatus == "cancelled" && (
                              <div className="bg-[#f5f5f5] items-center text-xs py-2 px-4 rounded-full gap-1 flex">
                                <span>
                                  <img
                                    src="paymentcancel.png"
                                    width={20}
                                    height={20}
                                    className="shrink-0"
                                  />
                                </span>
                                <p>Payment Canceled</p>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="w-full">
                        <button
                          onClick={()=>handleBuyAgain(v._id,v.items)}
                          className="w-full font-semibold cursor-pointer hover:text-red-800  text-red-600 text-sm tracking-wider  px-8 py-4 border-gray-300 rounded-md  flex justify-center items-center border-[1.5px] "
                        >
                          Buy again
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-8 sm:mx-10 mx-5">
                  <div className="bg-white p-6 flex flex-col gap-3 mt-12 ">
                    <p className="font-medium text-center">No orders yet</p>
                    <p className="text-sm text-center">
                      Go to store to place an order.
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-5 lg:grid-cols-3 pb-52 pt-10">
              <div className="gap-5 rounded-lg p-3 bg-white flex flex-col">
                <div className="text-xs w-full  py-4 rounded-md px-5 bg-[#f5f5f5]">
                  <Skeleton className=" sm:w-48 h-5" />
                  <Skeleton className="w-24 h-5 mt-2" />
                </div>
                <Skeleton className="w-full h-[300px] xs:h-96" />
                <div className="flex flex-col gap-2">
                  <Skeleton className="w-14 h-5" />
                  <Skeleton className="w-28 h-5" />
                  <Skeleton className="w-40 h-5" />
                </div>
                <Skeleton className="w-full h-12 mt-2" />
              </div>
            </div>
          )}
        </div>
      </div>
      <OrderPageFooter />
    </main>
  );
}
