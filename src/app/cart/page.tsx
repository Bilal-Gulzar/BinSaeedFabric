"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Minus, Plus, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MdOutlineSecurity } from "react-icons/md";
import useAppContext from "@/context/ContextAPI";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";
import { getCookies, getShippingSettings, validatePhone } from "@/action";
import { client } from "@/sanity/lib/client";
import ChevronUP from "../components/chevronUP";

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice, clearCart } =
    useAppContext();
  const [paymentMethod, setPaymentMethod] = useState<string>("cod");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [chevron, setChevron] = useState<boolean>(true);
  const [email,setEmail] = useState<string>('')
  const [shippingFee, setShippingFee] = useState(0);
  const router = useRouter();
  const navigateToBack = () => {
    router.push('/collection');
  };


  const [form, setForm] = useState({
    customerName: "",
    address: "",
    paymentMethod: "cod",
    phone: "",
    city: "",
  });
  useEffect(() => {
    async function fetchShipping() {
      try {
        const e = await getCookies()
        setEmail(e.email as string);
        const data = await getShippingSettings();
        setShippingFee(data.shippingFee);
      } catch (error) {
        console.error("Failed to fetch shipping settings:", error);
      }
    }

    fetchShipping();
  }, []);

 

  const handleQuantityChange = (
    id: string,
    currentQuantity: number,
    change: number,
    size?: string
  ) => {
    const newQuantity = currentQuantity + change;
    updateQuantity(id, newQuantity, size);
  };

  const handleRemoveItem = (id: string, size?: string) => {
    removeFromCart(id, size);
  };

  const handleCheckout = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    try {
      setIsLoading(true);
      // const data = await validatePhone(form.phone);
      //  if (!data.phone_valid || data.country_code !== "PK") {
      //   toast.error("Invalid or non-Pakistani number");
      //   return
      // }
      let subtotal = getTotalPrice();
      const checkoutdata = {
        ...form,
        email,
        cartItems,
        subtotal,
        shippingFee,
      };
      if (form.paymentMethod === "cod") {
        let res =  await fetch("/api/placeOrder/Cod", {
          method: "POST",
          body: JSON.stringify(checkoutdata),
        });
       let response  = await res.json() 
       if(response.success){
         toast.success("Order placed successfully! Payment on delivery.", {
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
          setTimeout(()=>{
           router.push(`/orders/${response.order_ID}`)
           clearCart()
          },3000)

       }else{
        toast.error("Failed to place order.");

       }
      } else {
        // Redirect to Stripe
        const res = await fetch("/api/placeOrder/onlinePayment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(checkoutdata),
        });
        const data = await res.json();
        if(data.success){
        toast.success("Redirecting to Stripe Checkout...", {
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
        setTimeout(()=>{
          window.location.href = data.url
        },3000)
      }else{
        toast.error("Failed to place order.");
      }
      }
    } catch (e) {
      console.log("ERROR_OCCURED", e);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="px-5 md:px-12 py-8 pb-32">
      <section className="flex flex-col gap-5">
        <div className="text-xs  space-x-2 text-gray-800">
          <Link href={"/"}>Home</Link>
          <span className="font-semibold">&gt;</span>
          <span> Your Cart </span>
        </div>

        <h1 className="font-semibold text-xl uppercase">Your cart</h1>
      </section>

      <section>
        <div className=" lg:grid hidden grid-cols-2 text-sm mt-12 bg-gray-100 p-3.5  border-gray-500 ">
          <div className="font-medium text-sm">PRODUCT</div>
          <div className="font-medium text-sm flex justify-between">
            <div>PRICE</div>
            <div>QUANTITY</div>
            <div>TOTAL</div>
            <div></div>
          </div>
        </div>
        <div className=" lg:hidden flex justify-between mt-12 bg-gray-100 p-3.5  border-gray-500 ">
          <div className="font-medium text-sm">PRODUCT</div>
          <div className="font-medium text-sm flex justify-between">
            <div className="md:block hidden">PRICE</div>
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div className="border border-gray-300 px-4 py-20 mt-3 text-center">
            <p className="text-gray-500 text-sm">Your cart is empty</p>
            <Button className="mt-4" variant="outline" onClick={navigateToBack}>
              Continue Shopping
            </Button>
          </div>
        ) : (
          cartItems.map((item) => (
            <div
              key={`${item.id}-${item.size}`}
              className="border border-gray-300 px-4 mt-3 "
            >
              <div className="grid grid-cols-2  mt-10 lg:mt-3">
                <div className="font-medium text-sm  borderb pb-3 md:pb-0 lg:py-5   border-gray-500   flex  md:gap-6 gap-4">
                  <div className="w-28 h-36  shrink-0 relative bg-gray-100">
                    <Image
                      src={item.imageUrl || "/placeholder.svg"}
                      fill
                      className="w-full h-full object-cover"
                      sizes="(min-width: 808px) 50vw, 100vw"
                      alt={item.name}
                      priority
                    />
                  </div>
                  <div>
                    <p className="text-xs">{item.name}</p>
                    {item.size && (
                      <p className="text-xs text-gray-500 mt-1">
                        Size: {item.size}
                      </p>
                    )}
                    <div className=" md:hidden text-gray-600 font-medium text-sm  py-2 ">
                      Rs.{item.price.toLocaleString()}
                    </div>
                    <div className="font-medium md:hidden text-sm py-5 flex-col lg:gap-0 md:gap-2 lg:flex-row  justify-between">
                      <div className="flex gap-4 items-center">
                        <div className="font-bold gap-4 w-24 sm:w-28 justify-between px-1 py-3 flex border border-gray-300 items-center">
                          <span
                            className="cursor-pointer text-gray-700 hover:text-black"
                            onClick={() =>
                              handleQuantityChange(
                                item.id,
                                item.quantity,
                                -1,
                                item.size
                              )
                            }
                          >
                            <Minus size={20} />
                          </span>
                          <span className="text-xs text-gray-600 font-normal min-w-[20px] text-center">
                            {item.quantity}
                          </span>
                          <span
                            className="cursor-pointer text-gray-500 hover:text-black"
                            onClick={() =>
                              handleQuantityChange(
                                item.id,
                                item.quantity,
                                1,
                                item.size
                              )
                            }
                          >
                            <Plus size={20} />
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
                    <div className="hidden text-gray-500 border-t border-gray-400 py-2 border-dashed">
                      Rs.{item.price.toLocaleString()}
                    </div>
                  </div>
                </div>
                <div className="font-medium md:flex hidden text-sm py-7 flex-col lg:gap-0 md:gap-2 lg:flex-row lg:items-center md:items-end justify-between">
                  <div className=" text-gray-600 font-medium text-sm">
                    Rs.{item.price.toLocaleString()}
                  </div>
                  <div className="">
                    <div className="font-bold gap-4 w-28 justify-between px-1 py-3 flex border border-gray-300 items-center">
                      <span
                        className="cursor-pointer text-gray-700 hover:text-black"
                        onClick={() =>
                          handleQuantityChange(
                            item.id,
                            item.quantity,
                            -1,
                            item.size
                          )
                        }
                      >
                        <Minus size={20} />
                      </span>
                      <span className="text-xs text-gray-600 font-normal min-w-[20px] text-center">
                        {item.quantity}
                      </span>
                      <span
                        className="cursor-pointer text-gray-500 hover:text-black"
                        onClick={() =>
                          handleQuantityChange(
                            item.id,
                            item.quantity,
                            1,
                            item.size
                          )
                        }
                      >
                        <Plus size={20} />
                      </span>
                    </div>
                  </div>
                  <div className=" text-gray-700 md:hidden lg:block font-medium text-sm">
                    Rs.{(item.price * item.quantity).toLocaleString()}
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
          ))
        )}
      </section>

      <section className="text-xs">
        {/* <div className="mt-8 space-y-4">
          <h5 className="font-bold">Additional Comments</h5>
          <Textarea
            placeholder="Special instruction for seller... "
            className="!text-xs !ring-0 w-[50vw] h-24 !rounded-none p-5"
          />
          <div className="flex item-center gap-2">
            <span>
              <MdOutlineSecurity size={20} />
            </span>
            <span className="text-gray-500">Secure Shopping Guarantee</span>
          </div>
        </div> */}
        <form onSubmit={handleCheckout}>
          <div className="grid  grid-cols-1 md:grid-cols-2 gap-3">
            <div className="mt-20">
              <div className="font-bold hidden md:block border-b-2 pb-4 border-black">
                Order summary
              </div>
              <div
                onClick={() => setChevron(!chevron)}
                className={`font-bold md:hidden flex items-center  justify-between border-b-2 pb-4  border-black`}
              >
                Order summary
                <span className={`${chevron ? "" : "rotate-180"} duration-500`}>
                  <ChevronUP />
                </span>
              </div>
              <div
                className={` overflow-hidden duration-500 transition-all ease-in-out  ${
                  chevron ? "max-h-[700px] " : "max-h-0 "
                }`}
              >
                <div className="font-bold  mt-8 pb-3 border-b border-gray-200 flex items-center justify-between">
                  Subtotal
                  <span className="text-base">
                    Rs.{getTotalPrice().toLocaleString()}
                  </span>
                </div>
                <div className="font-bold  mt-8 pb-3 border-b border-gray-200 flex items-center justify-between">
                  Shipping Fee
                  <span className="text-base">
                    Rs.{cartItems.length > 0 ? shippingFee : 0}
                  </span>
                </div>
                <div className="font-bold flex items-center mt-9  mb-12 pb-0 md:pb-3 border-b border-gray-200 justify-between">
                  TOTAL
                  <span className="text-base">
                    Rs.
                    {cartItems.length > 0 ? getTotalPrice() + shippingFee : 0}
                  </span>
                </div>
              </div>
              <div className="mt-8 md:mt-5">
                <div className="flex flex-col gap-2">
                  <label htmlFor="name" className="text-xs font-medium">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <Input
                    required
                    disabled={cartItems.length === 0 || isLoading}
                    value={form.customerName}
                    onChange={(e) =>
                      setForm({ ...form, customerName: e.target.value })
                    }
                    name="name"
                    type="text"
                    id="name"
                  />
                </div>
              </div>
              <div className="mt-5">
                <div className="flex flex-col gap-2">
                  <label htmlFor="email" className="text-xs font-medium">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <Input
                    required
                    disabled
                    className="bg-gray-100 border border-black"
                    value={email}
                    name="email"
                    type="email"
                    id="email"
                  />
                </div>
                <p className="text-gray-500 mt-2 text-xs border-b border-gray-200 pb-4 ">
                  Email can't be changed. It's used for login and order updates.
                </p>
              </div>
              <div className="mt-5">
                <div className="flex flex-col gap-2">
                  <label htmlFor="phone" className="text-xs font-medium">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <Input
                    required
                    disabled={cartItems.length === 0 || isLoading}
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    name="phone"
                    type="number"
                    id="phone"
                  />
                </div>
                <p className="text-gray-500 mt-2 border-b border-gray-200 pb-4 ">
                  Please enter a valid phone number.
                </p>
              </div>
              <div className="mt-5">
                <div className="flex flex-col gap-2">
                  <label htmlFor="phone" className="text-xs font-medium">
                    Select Payment Method{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <Select
                    required
                    disabled={cartItems.length === 0 || isLoading}
                    value={form.paymentMethod}
                    onValueChange={(value) =>
                      setForm((prev) => ({ ...prev, paymentMethod: value }))
                    }
                  >
                    <SelectTrigger className="w-full !h-11">
                      <SelectValue placeholder="Select Payment Method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cod">
                        Cash on Delivery (COD)
                      </SelectItem>
                      <SelectItem value="stripe">Pay with Stripe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="mt-5">
                <div className="flex flex-col gap-2">
                  <label htmlFor="address" className="text-xs font-medium">
                    Address <span className="text-red-500">*</span>
                  </label>
                  <Input
                    required
                    disabled={cartItems.length === 0 || isLoading}
                    value={form.address}
                    onChange={(e) =>
                      setForm({ ...form, address: e.target.value })
                    }
                    name="address"
                    type="text"
                    id="address"
                  />
                </div>
              </div>
              <div className="mt-5">
                <div className="flex flex-col gap-2">
                  <label htmlFor="city" className="text-xs font-medium">
                    City <span className="text-red-500">*</span>
                  </label>
                  <Input
                    required
                    disabled={cartItems.length === 0 || isLoading}
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    name="city"
                    type="text"
                    id="city"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-4 px-0 md:pl-5">
              <div className="pt-5 md:pt-28">
                <Button
                  type="submit"
                  className="hover:bg-white hover:text-black hover:border-gray-400 font-semibold hover:border w-full"
                  disabled={cartItems.length === 0 || isLoading}
                >
                  PROCEED TO CHECKOUT
                </Button>
              </div>
              <div>
                <Button
                  disabled={isLoading}
                  type="button"
                  onClick={navigateToBack}
                  variant="outline"
                  className="text-black w-full font-semibold"
                >
                  GO BACK TO PREVIOUS PAGE
                </Button>
              </div>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}
