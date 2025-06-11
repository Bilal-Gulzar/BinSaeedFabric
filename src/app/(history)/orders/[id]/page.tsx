"use client"
import OrderPageNavBar from '@/app/components/orderPageNavBar';
import React, { useEffect, useState } from 'react'
import SkeletonForOrderDetailpage from '../../SkeletonForOrderDetailpage';
import { CgCloseO, CgShoppingCart } from 'react-icons/cg';
import { IoChevronDown, IoChevronUp } from 'react-icons/io5';
import Image from 'next/image';
import Link from 'next/link';
import { HiOutlineArrowLeft } from 'react-icons/hi';
import { AiOutlineCheck } from 'react-icons/ai';
import Svg from '@/app/components/Svg';
import OrderPageFooter from '@/app/components/orderPageFooter';
import { checkOrderAvailability, getorder } from '@/action';
import { useParams, useRouter } from 'next/navigation';
import { urlFor } from '@/sanity/lib/image';
import { format, parseISO } from "date-fns";
import toast from 'react-hot-toast';
import useAppContext from '@/context/ContextAPI';

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
  _id: string;
  _createdAt: Date;
  orderDate: string;
  customerName: string;
  subtotal: number;
  city:string;
  phone:number;
  address:string;
  customerEmail: string;
  paymentMethod: string;
  paymentStatus: string;
  isPaid: boolean;
  shippingFee:number;
  totalAmount: number;
  items: Item[];
}

export default function OrderDetail() {
const param = useParams()
const [order,setOrder] = useState<Product>()
const [isLoading,setIsLoading] = useState<boolean>(true)
const [cart,setCart] = useState<boolean>(true)
const router = useRouter()
const { clearCart,addToCart} = useAppContext();

useEffect(()=>{
 if (typeof window !== "undefined") {
    if (window.location.href.includes("payment=true")) {
      toast.success("Payment successful — Thank you for your order!", {
        style: {
          border: "1px solid oklch(62.7% 0.194 149.214)",
          padding: "16px",
          color: "oklch(62.7% 0.194 149.214)",
        },
        iconTheme: {
          primary: "oklch(62.7% 0.194 149.214)",
          secondary: "#FFFAEE",
        },
      });
      clearCart()
      setTimeout(() => {
        const url = window.location.href;
        const newUrl = url.replace(/[?&]payment=true/, "");
        window.history.replaceState({}, "", newUrl);
      }, 5000);
    }
  }

fetchOrder()

},[])


async function fetchOrder (){
  try{
 let Order: Product = await getorder(param.id as string)
 if(Order){
 setOrder(Order)
 setIsLoading(false);
 }
}
 catch(e){
  console.log("ERROR",e)

 }

}

  const getdate =
    order?.orderDate && typeof order._createdAt === "string"
      ? format(parseISO(order._createdAt), "MMMM d, yyyy")
      : "No Date";
  const updateAtdate =
    order?.orderDate && typeof order.orderDate === "string"
      ? format(parseISO(order.orderDate), "MMMM d, yyyy")
      : "No Date";





const handleBuyAgain = async () => {
  const result = await checkOrderAvailability(order?._id as string);

  if (!result.success) {
    const message = result.details?.length
      ? `Some items unavailable:\n${result.details.join("\n")}`
      : "Some items are unavailable.";
    toast.error(message);
  } else {
    clearCart();
    if (order && order?.items?.length > 0) {
      for (const product of order.items) {
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
      setTimeout(() => {
        router.push("/cart");
      }, 2500);
    }

    // Proceed to add items to cart...
  }
};


  return (
    <div className="bg-[#f5f5f5] flex flex-col justify-between relative min-h-screen">
      <div>
        <OrderPageNavBar />
        <div className="lg:max-w-[1000px] pb-28 xl:max-w-[1100px] mt-8 mx-3 sm:mx-5 lg:mx-auto ">
          {isLoading ? (
            <SkeletonForOrderDetailpage />
          ) : (
            <>
              <div className="p-5 mb-3 lg:hidden">
                <div className="flex pb-7 gap-5 flexwrap justify-between items-center  border-b border-gray-300">
                  {!cart && (
                    <div
                      onClick={() => setCart(!cart)}
                      className="flex  text-red-500 cursor-pointer gap-3 items-center"
                    >
                      <div>
                        <h1 className="font-semibold">Show Order Summery</h1>
                      </div>
                      <div>
                        <IoChevronDown className="size-5" />
                      </div>
                    </div>
                  )}
                  {cart && (
                    <div
                      onClick={() => setCart(!cart)}
                      className="flex text-red-500 cursor-pointer gap-3 items-center"
                    >
                      <div>
                        <h1 className="font-semibold">Hide Order Summery</h1>
                      </div>
                      <div>
                        <IoChevronUp className="size-5" />
                      </div>
                    </div>
                  )}
                  <div className="font-semibold ">
                    <p>Rs.{order?.totalAmount}</p>
                  </div>
                </div>
                <div
                  className={`duration-300 transition-all ease-in-out  ${
                    cart ? "max-h-[1000px] pb-8 " : "max-h-0 "
                  } overflow-hidden  border-b border-gray-300`}
                >
                  <div className="flex flex-col">
                    {order &&
                      Object.keys(order).length > 0 &&
                      order.items.map((item,index) => (
                        <div
                          key={index}
                          className="flex mt-8 items-center gap-3 text-sm"
                        >
                          <div className="min-w-[5.3rem] max-w-[5.3rem] relative h-20 bg-[#ededed] px-2.5 border-gray-300 rounded-md border">
                            <Image
                              src={urlFor(item.imageUrl).url()}
                              width={50}
                              height={50}
                              alt={item.productName}
                              className="img-slider-img"
                              priority
                            />
                            <div className="absolute flex justify-center items-center -top-2 -right-3 w-5 h-5 rounded-full bg-black text-white font-medium text-sm">
                              {item.quantity}
                            </div>
                          </div>
                          <div className="flex justify-between text-xs font-medium w-full items-center gap-3">
                            <p className="break-words">{item.productName}</p>
                            <p>RS.{item.quantity * item.price}</p>
                          </div>
                        </div>
                      ))}
                  </div>
                  <div className="flex flex-col gap-3.5 mt-8">
                    <div className="flex justify-between text-xs font-medium ">
                      <div>Subtotal</div>
                      <p>Rs.{order?.subtotal || 0}</p>
                    </div>
                    <div className="flex justify-between text-xs font-medium ">
                      <div>Shipping</div>
                      <p>Rs.{order?.shippingFee || 0}</p>
                    </div>
                    <div className="flex font-medium justify-between text-xl mt-4">
                      <div>Total</div>
                      <p>
                        <span className="text-gray-500 font-normal text-xs">
                          PKR
                        </span>{" "}
                        Rs.{order?.totalAmount || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex md:flex-row flex-col gap-10 md:gap-0 md:justify-between">
                <div className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <Link href={"/orders"}>
                      <span>
                        <HiOutlineArrowLeft className="size-5" />
                      </span>
                    </Link>
                    <h1 className="font-semibold text-xl break-all">
                      OrderID: {order?._id}
                    </h1>
                  </div>
                  <div className="ml-8 text-gray-500 font-medium text-sm tracking-wide">
                    confirmed {getdate}
                  </div>
                </div>
                <button onClick={handleBuyAgain} className='"w-full cursor-pointer font-medium text-red-700 text-xs tracking-wider hover:text-red-800 p-3  bg-white border-gray-200 rounded-md  flex justify-center items-center border-[1.5px] '>
                  Buy again
                </button>
              </div>
              <div className="grid  lg:grid-cols-[55%_auto] gap-5 w-full mt-8">
                <div className=" lg:order-1 order-2 flex flex-col gap-5">
                  {order && order?.paymentMethod == "stripe" && (
                    <div className="bg-white p-5 rounded-lg">
                      <div className="text-sm  rounded-md px-3">
                        <div className="flex items-center gap-1.5">
                          {order.isPaid ? (
                            <div className="flex items-center gap-1.5">
                              <AiOutlineCheck className="size-4" />
                              <p className="font-semibold">
                                {order.paymentStatus == "Delivered"
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
                        <p className="ml-5  text-xs">
                          Last updated {updateAtdate}
                        </p>
                      </div>
                      {order.isPaid ? (
                        <div>
                          {order.paymentStatus == "Delivered" ? (
                            <div className="text-xs px-3 mt-6 ">
                              Your order has been delivered.
                            </div>
                          ) : (
                            <div className="text-xs px-3 mt-6 ">
                              We've received your order.
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-xs px-3 mt-6 ">
                          Your order has been canceled.
                        </div>
                      )}
                    </div>
                  )}
                  {order && order?.paymentMethod == "cod" && (
                    <div className="bg-white p-5 rounded-lg">
                      <div className="text-sm  rounded-md px-3">
                        {order.paymentStatus == "pending" && (
                          <div className="flex items-center gap-1.5">
                            <p className="font-semibold">⏳Pending</p>
                          </div>
                        )}
                        {order.paymentStatus == "cancelled" && (
                          <div className="flex items-center gap-1.5">
                            <CgCloseO className="size-4" />
                            <p className="font-semibold">cancelled</p>
                          </div>
                        )}
                        {order.paymentStatus == "Delivered" && order.isPaid && (
                          <div className="flex items-center gap-1.5">
                            <AiOutlineCheck className="size-4" />
                            <p className="font-semibold">Delivered!</p>
                          </div>
                        )}
                        <p className="ml-5  text-xs">Last updated {getdate}</p>
                      </div>
                      {order.paymentStatus == "pending" && (
                        <div className="text-xs px-3 mt-6 ">
                          We’ve received your order and it will be processed
                          soon.
                        </div>
                      )}
                      {order.paymentStatus == "cancelled" && (
                        <div className="text-xs px-3 mt-6 ">
                          Your order has been canceled.
                        </div>
                      )}
                      {order.paymentStatus == "Delivered" && order.isPaid && (
                        <div className="text-xs px-3 mt-6 ">
                          Your order has been delivered.
                        </div>
                      )}
                    </div>
                  )}
                  <div className="bg-white self-start w-full p-5  rounded-lg">
                    <div>
                      <h2 className="font-semibold">Order details</h2>
                    </div>
                    <div className="flex flex-col md:flex-row gap-7 md:gap-28 text-sm  mt-5">
                      <div className="flex flex-col gap-7">
                        <div className="flex flex-col gap-3">
                          <h2 className="text-sm font-semibold ">
                            Contact information
                          </h2>
                          <div className="text-xs font-medium">
                            <p>{order?.customerEmail}</p>
                            <p className="mt-1">{order?.phone}</p>
                          </div>
                        </div>
                        <div className="flex flex-col gap-3">
                          <h2 className="text-sm font-semibold ">
                            Shipping address
                          </h2>
                          <div className="flex flex-col gap-0.5 font-medium text-xs">
                            <p>{order?.customerName}</p>
                            <p>{order?.address}</p>
                            <p>{order?.city}</p>
                          </div>
                        </div>
                        <div className="flex flex-col gap-3">
                          <h2 className="text-sm font-semibold ">
                            Shipping method
                          </h2>
                          <p className="font-medium text-xs">
                            Standard Shipping
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-5">
                        <div className="flex flex-col gap-3">
                          <h2 className="text-sm font-semibold ">Payment</h2>
                          {order?.paymentMethod == "cod" && (
                            <div className="flex md:flex-row flex-col text-sm gap-1.5">
                              <div>
                                <p className="font-medium text-xs">
                                  {" "}
                                  Cash on Delivery (COD)
                                </p>
                                <p className="text-gray-500 text-xs mt-1">
                                  Rs.{order?.totalAmount}
                                </p>
                                {order && order.orderDate && (
                                  <p className="text-gray-500 text-xs mt-1">
                                    {getdate}
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                          {order?.paymentMethod == "stripe" && (
                            <div className="flex md:flex-row flex-col text-sm gap-1.5">
                              <div>
                                <p className="font-medium flex items-center text-xs">
                                  <span className="text-xl">💳</span>
                                  <span className="mt-1.5">Online Payment</span>
                                </p>
                                <p className="text-gray-500 text-xs mt-1">
                                  Rs.{order?.totalAmount}
                                </p>
                                {order && order.orderDate && (
                                  <p className="text-gray-500 text-xs mt-1">
                                    {getdate}
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col gap-3">
                          <h2 className="text-sm font-semibold ">
                            Billing address
                          </h2>
                          <div className="flex flex-col gap-0.5 font-medium text-xs">
                            <p>{order?.customerName}</p>
                            <p>{order?.address}</p>
                            <p>{order?.city}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col lg:order-2 order-1 gap-5">
                  <div className="bg-white p-5 rounded-lg ">
                    <div className="font-semibold text-sm mb-2">
                      RS.{order?.totalAmount} PKR
                    </div>
                    {order && order?.paymentMethod == "stripe" ? (
                      <div>
                        {order?.isPaid &&
                          order.paymentStatus == "confirmed" && (
                            <div className="flex flex-col gap-2">
                              <div className="font-semibold text-sm text-gray-600">
                                Payment Paid
                              </div>
                              <p className="text-xs font-medium text-gray-500">
                                Your order has been successfully placed with
                                online payment. It is currently being prepared
                                for shipment. Online payment is required for
                                international orders and for purchases exceeding
                                20,000 PKR.
                                <br />
                                <br /> If your transaction requires additional
                                verification or falls outside supported payment
                                regions, our team will contact you to complete
                                the process via bank transfer.
                              </p>
                            </div>
                          )}
                        {order.paymentStatus == "cancelled"   && (
                          <div className=" flex flex-col gap-2">
                            <div className="font-semibold text-sm text-gray-600">
                              {" "}
                              Payment Not Paid
                            </div>
                            <p className="text-xs font-medium text-gray-500">
                              This order was not completed due to a failed or
                              canceled payment. As a result, the order has been
                              marked as canceled and will not be processed
                              further.
                              <br />
                              <br />
                              Online payment is required for international
                              orders and for purchases above 20,000 PKR.
                              <br />
                              <br />
                              If you believe this was a mistake or would like to
                              complete your purchase, please place a new order
                              or wait for our team to follow up with updated
                              payment instructions. now!
                            </p>
                          </div>
                        )}
                        {order.paymentStatus == "pending"   && (
                          <div className=" flex flex-col gap-2">
                            <div className="font-semibold text-sm text-gray-600">
                              {" "}
                              Payment Not Paid
                            </div>
                            <p className="text-xs font-medium text-gray-500">
                              This order was not completed due to a failed or
                              canceled payment. As a result, the order has been
                              marked as canceled and will not be processed
                              further.
                              <br />
                              <br />
                              Online payment is required for international
                              orders and for purchases above 20,000 PKR.
                              <br />
                              <br />
                              If you believe this was a mistake or would like to
                              complete your purchase, please place a new order
                              or wait for our team to follow up with updated
                              payment instructions. now!
                            </p>
                          </div>
                        )}
                        {order?.isPaid &&
                          order.paymentStatus == "Delivered" && (
                            <div className=" flex flex-col gap-2">
                              <div className="font-semibold text-sm text-gray-600">
                                {" "}
                                Payment Paid
                              </div>
                              <p className="text-xs font-medium text-gray-500">
                                Your order has been successfully delivered. We
                                hope everything arrived in perfect condition and
                                met your expectations.
                                <br />
                                <br />
                                If you have any questions or concerns regarding
                                your order, feel free to get in touch with us
                                for further assistance.
                                <br />
                                <br />
                                Thank you for shopping with us — we look forward
                                to serving you again!
                              </p>
                            </div>
                          )}
                      </div>
                    ) : (
                      <div>
                        {!order?.isPaid &&
                          order?.paymentStatus == "pending" && (
                            <div className=" flex flex-col gap-2">
                              <p className="text-xs font-medium text-gray-500">
                                This order is currently pending and will be
                                processed for delivery. Payment will be
                                collected upon delivery, so please ensure
                                someone is available to receive the package.
                                <br />
                                <br />
                                Cash on Delivery (COD) is available only for
                                local orders under 20,000 PKR.
                                <br />
                                <br />
                                If your order exceeds this limit or the shipping
                                destination is outside Pakistan, our team will
                                reach out with details to complete payment via
                                bank transfer.
                              </p>
                            </div>
                          )}
                        {order?.isPaid &&
                          order?.paymentStatus == "Delivered" && (
                            <div className=" flex flex-col gap-2">
                              <p className="text-xs font-medium text-gray-500">
                                Your order has been successfully delivered and
                                payment was collected at the time of delivery.
                                We hope you are satisfied with your purchase.
                                <br />
                                <br />
                                If you notice any issues with your order or need
                                further assistance, feel free to contact us and
                                we’ll be happy to help.
                                <br />
                                <br />
                                Thank you for choosing our service — we look
                                forward to serving you again!
                              </p>
                            </div>
                          )}

                        {order?.paymentStatus == "cancelled" && (
                          <div className=" flex flex-col gap-2">
                            <p className="text-xs font-medium text-gray-500">
                              This order is currently pending and will be
                              processed for delivery. Payment will be collected
                              upon delivery, so please ensure someone is
                              available to receive the package.
                              <br />
                              <br />
                              Cash on Delivery (COD) is available only for local
                              orders under 20,000 PKR.
                              <br />
                              <br />
                              If your order exceeds this limit or the shipping
                              destination is outside Pakistan, our team will
                              reach out with details to complete payment via
                              bank transfer.
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="bg-white p-5 rounded-lg hidden lg:block">
                    <div>
                      <h1 className="font-semibold mb-5">Order Summery</h1>
                    </div>
                    <div className="flex flex-col gap-3.5">
                      {order &&
                        Object.keys(order).length > 0 &&
                        order.items.map((item) => (
                          <div
                            key={item._key}
                            className="flex items-center gap-2 text-xs font-medium"
                          >
                            <div className="min-w-[65px] max-w-[65px] relative h-16 bg-gray-100 px-2.5 border rounded-md">
                              <Image
                                src={urlFor(item.imageUrl).url()}
                                width={50}
                                height={50}
                                alt={item.productName}
                                priority
                                className="img-slider-img"
                              />
                              <div className="absolute flex justify-center items-center -top-2 -right-3 w-5 h-5 rounded-full bg-black text-white font-medium text-xs">
                                {item.quantity}
                              </div>
                            </div>
                            <div className="flex justify-between w-full items-center gap-3">
                              <p className="break-words">{item.productName}</p>
                              <p>RS.{item.price * item.quantity}</p>
                            </div>
                          </div>
                        ))}
                    </div>
                    <div className="flex flex-col gap-3.5 mt-7 mb-1">
                      <div className="flex justify-between text-xs font-medium">
                        <div className="">Subtotal</div>
                        <p>Rs.{order?.subtotal || 0}</p>
                      </div>
                      <div className="flex justify-between  text-xs font-medium">
                        <div className="">Shipping</div>
                        <p>Rs.{order?.shippingFee || 0}</p>
                      </div>
                      <div className="flex font-semibold justify-between text-xl mt-4">
                        <div>Total</div>
                        <p>
                          <span className="text-gray-500 font-normal text-xs">
                            PKR
                          </span>{" "}
                          Rs.{order?.totalAmount || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      <OrderPageFooter />
    </div>
  );
}
