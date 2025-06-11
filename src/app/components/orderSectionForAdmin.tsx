import { urlFor } from "@/sanity/lib/image";
import React from "react";

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
  


export default function OrderSectionForAdmin({order}:{order:Product}) {
  return (
  <div></div>
  );
}
