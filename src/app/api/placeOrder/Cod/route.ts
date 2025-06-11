import { handleOrderConfirmation } from "@/action";
import { client } from "@/sanity/lib/client";
import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

interface product {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  size?: string;
  quantity: number;
}


interface Item {
  id: string;
  _key: string;
  productName: string;
  size?: string;
  quantity: number;
  imageUrl?: string;
  price: number;
}

interface Argument {
  _id: string;
  _createdAt:string;
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
export const POST = async (req: NextRequest) => {
  async function uploadAndGetRef(imageUrl: string) {
    const response = await fetch(imageUrl);
    const buffer = await response.arrayBuffer();
    const result = await client.assets.upload("image", Buffer.from(buffer));
    return result._id;
  }
  
  try {
    const body = await req.json();

   let Subtotal = 0;
    const Creating_order = await client.create({
      _type: "order",
      customerName: body.customerName,
      customerEmail: body.email,
      phone: body.phone,
      items: await Promise.all(
        body.cartItems.map(async (item: product) => {
          let query = `*[_type == "product" && _id == "${item.id}"][0]`;
          let productInfo = await client.fetch(query);
          Subtotal += productInfo.price * item.quantity;
          let Quantity =
            productInfo.qty - item.quantity > 0
              ? productInfo.qty - item.quantity
              : 0;
          await client.patch(productInfo._id).set({ qty: Quantity }).commit();

          const imageRef = item.imageUrl
            ? await uploadAndGetRef(item.imageUrl)
            : null;

          return {
            image: imageRef
              ? {
                  _type: "image",
                  asset: {
                    _type: "reference",
                    _ref: imageRef,
                  },
                }
              : null,
            _key: uuidv4(),
            id: item.id,
            productName: item.name,
            quantity: item.quantity || 1,
            size: item.size || "",
            price: productInfo.price || 0,
          };
        })
      ),
      paymentMethod: body.paymentMethod,
      paymentStatus: "pending",
      address: body.address,
      city: body.city,
      subtotal: Subtotal,
      shippingFee: body.shippingFee,
      totalAmount: Subtotal + body.shippingFee,
      isPaid: false,
      orderDate: new Date(),
    });

    await handleOrderConfirmation(Creating_order._id);
    return NextResponse.json({success:true,order_ID:Creating_order._id});
  } catch (error) {
    console.log("INTERNAL_SERVER_ERROR", error);
    return NextResponse.json(error);
  }
};
