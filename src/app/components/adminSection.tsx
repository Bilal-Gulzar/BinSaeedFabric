"use client"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, X } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import OrderSectionForAdmin from './orderSectionForAdmin';
import { getorder, updateOrder } from '@/action';
import Image from 'next/image';
import { urlFor } from '@/sanity/lib/image';
import { Switch } from "@/components/ui/switch";
import { set } from 'date-fns';
import toast from 'react-hot-toast';

interface Item {
  id: string;
  _key: string;
  productName: string;
  size?: string;
  imageUrl:string
  quantity: number;
  price: number;
}

interface Product {
  _id: string;
  _createdAt: Date;
  orderDate: string;
  customerName: string;
  subtotal: number;
  city: string;
  phone: number;
  address: string;
  customerEmail: string;
  paymentMethod: string;
  paymentStatus: string;
  isPaid: boolean;
  shippingFee: number;
  totalAmount: number;
  items: Item[];
}

  export default function AdminSection() {
    const [id, setId] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [disabled, setDisabled] = useState<boolean>(false);
    const [order, setOrder] = useState<Product | null | "NoFound">(null);
    const [selectedStatus, setSelectedStatus] = useState("pending");
    const allStatuses = ["pending", "cancelled", "confirmed", "Delivered"]
    // const paymentMethod = order && order !== "NoFound" ? order.paymentMethod : "cod";
  const [isPaid, setIsPaid] = useState(false);
  const filteredStatuses =
    order && order !== "NoFound" && order.paymentMethod === "cod"
      ? allStatuses.filter((status) => status !== "confirmed")
      : allStatuses;

    const fetchOrder = async (evt: React.FormEvent<HTMLFormElement>) => {
     evt.preventDefault();
     setOrder(null)
     setIsLoading(true)
     try{
      const hasOrder = await getorder(id);
      if (hasOrder) {
        setOrder(hasOrder);
        setSelectedStatus(hasOrder.paymentStatus);
        setIsPaid(hasOrder.isPaid);
      }else{
        setOrder("NoFound");
      }
    }catch(error){
        console.log("INTERNAL_SERVER_ERROR",error)
      setOrder("NoFound")
    } finally{
        setIsLoading(false)
    }
    };

    useEffect(() => {
      if (selectedStatus === "confirmed" || selectedStatus === "Delivered") {
        setIsPaid(true);
      } else {
        setIsPaid(false);
      }
    }, [selectedStatus]);


    const updatePaymentStatus = async () => {
      if (!order || order === "NoFound") return toast.error("orderr Not Found!")

        if (
          (selectedStatus === "confirmed" || selectedStatus === "Delivered") &&
          !isPaid
        ) {
          return toast.error(
            "You can't confirm or deliver an unpaid order."
          );
        }


        if (
          (selectedStatus === "pending" || selectedStatus === "cancelled") &&
          isPaid
        ) {
          return toast.error(
            "You can't canceled or pending a paid order"
          );
        }

      setDisabled(true);
      try {
         await updateOrder(order._id, {
          paymentStatus: selectedStatus,
          isPaid: isPaid,
          orderDate: new Date().toISOString(),
        })

        toast.success("Order updated successfully!");
      } catch (err) {
        console.error(err);
        toast.error("Failed to update order.");
      } finally {
        setDisabled(false);
      }
    };
      



    return (
      <div className="w-full ">
        <section className="w-full flex pb-20  text-center flex-col items-center minh-[50vh] px-4 pt-12 gap-6">
          <div className="font-bold text-xl uppercase">
            🔐 Admin: Update COD Payment Status
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Enter the Order ID below to mark the payment status as "Paid"
            (isPaid = true) in Sanity.
          </p>
          <form
            onSubmit={fetchOrder}
            className="flex w-full max-w-3xl items-center space-x-2 "
          >
            <div className="w-full relative">
              <Input
                type="text"
                value={id}
                disabled={isLoading || disabled}
                onChange={(e) => setId(e.target.value)}
                placeholder="Example ID:8f3c7e91-5b9d-45a7-bc3f-d9c123456789"
                className="!text-xs pe-10"
              />
              <span
                onClick={() => setId("")}
                className="absolute cursor-pointer top-4 right-3 text-[#375c9a]"
              >
                <X size={15} />
              </span>
            </div>
            <Button
              disabled={isLoading || disabled || id == ""}
              type="submit"
              className="hover:bg-transparent hover:text-black hover:border border-gray-400 duration-300 !px-6"
            >
              <Send size={25} />
            </Button>
          </form>
        </section>
        <section className="flex justify-center">
          {isLoading && (
            <div className="lds-ring">
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </div>
          )}
          {!isLoading && order == "NoFound" && (
            <div className="text-xl uppercase font-bold ">No order found</div>
          )}

          <div></div>
        </section>
        {!isLoading && order && order !== "NoFound" && (
          <section className="sm:container xl:max-w-5xl mx-auto">
            <div className="bg-white p-5 rounded-lg ">
              <div>
                <h1 className="font-semibold mb-5">Order ID {order._id}</h1>
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
                <div className="flex justify-between text-xs gap-3 font-medium">
                  <div className="">Customer Name</div>
                  <p>{order.customerName}</p>
                </div>
                <div className="flex justify-between text-xs gap-3  font-medium">
                  <div className="">Customer Email</div>
                  <p>{order.customerEmail}</p>
                </div>
                <div className="flex justify-between text-xs gap-3  font-medium">
                  <div className="">Customer Phone</div>
                  <p>{order.phone}</p>
                </div>
                <div className="flex justify-between  gap-3  text-xs font-medium">
                  <div className="">Payment Method</div>
                  <p>
                    {order.paymentMethod == "cod"
                      ? "Cash on  Delivery (COD)"
                      : "Online Payment"}
                  </p>
                </div>
                <div className="flex justify-between gap-3  text-xs font-medium">
                  <div className="">Payment Status</div>
                  <p>{order.paymentStatus}</p>
                </div>
                <div className="flex justify-between gap-3  text-xs font-medium">
                  <div className="">IsPaid</div>
                  <p>{order.isPaid ? "True" : "False"}</p>
                </div>
                <div className="flex justify-between gap-3  text-xs font-medium">
                  <div className="">Subtotal</div>
                  <p>Rs.{order?.subtotal || 0}</p>
                </div>
                <div className="flex justify-between  gap-3  text-xs font-medium">
                  <div className="">Shipping</div>
                  <p>Rs.{order?.shippingFee || 0}</p>
                </div>
                <div className="flex font-semibold gap-3  justify-between text-xl mt-4">
                  <div>Total</div>
                  <p>
                    <span className="text-gray-500 font-normal text-xs">
                      PKR
                    </span>{" "}
                    Rs.
                    {order?.totalAmount || 0}
                  </p>
                </div>
              </div>
              <div className="border-t mt-20 pt-6">
                <h1 className="text-xl text-center font-bold">
                  Configure Delivery and Payment Status{" "}
                </h1>

                <h1 className="text- mt-16  font-bold">Order Status</h1>
                <div className="flex flex-col gap-3.5 mt-7 mb-1">
                  {filteredStatuses.map((status) => (
                    <div
                      key={status}
                      className="flex justify-between text-xs font-medium"
                    >
                      <p>{status}</p>
                      <div className="">
                        <Switch
                          checked={selectedStatus === status}
                          onCheckedChange={() => setSelectedStatus(status)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <h1 className="text- mt-16  font-bold">Payment</h1>
              <div className="flex flex-col gap-3.5 mt-7 mb-1">
                <div className="flex justify-between text-xs font-medium">
                  <p> IsPaid</p>
                  <div className="">
                    <Switch
                      checked={isPaid}
                      onCheckedChange={() => setIsPaid(!isPaid)}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-end mt-12 mb-2">
                <Button
                  disabled={disabled}
                  onClick={updatePaymentStatus}
                  type="button"
                  className="hover:bg-transparent rounded-md hover:text-black hover:border border-gray-400 duration-300 !px-6"
                >
                  Update Order
                </Button>
              </div>
            </div>
          </section>
        )}
      </div>
    );
  }
