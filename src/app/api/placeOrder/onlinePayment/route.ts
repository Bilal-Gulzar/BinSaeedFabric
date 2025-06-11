import { client } from '@/sanity/lib/client';
import Stripe from 'stripe';
import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from "uuid";
import { urlFor } from '@/sanity/lib/image';


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string);


interface product {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  size?: string;
  quantity: number;
}
export const POST = async(req:NextRequest)=>{

 async function uploadAndGetRef(imageUrl: string) {
    const response = await fetch(imageUrl);
    const buffer = await response.arrayBuffer();
    const result = await client.assets.upload("image", Buffer.from(buffer));
    return result._id;
  }


try{
  const body = await req.json();

  let Subtotal = 0;

  const CartItems = await Promise.all(
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
  );

  const Creating_order = await client.create({
    _type: "order",
    customerName: body.customerName,
    customerEmail: body.email,
    phone: body.phone,
    items: CartItems,
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

  const lineItems = CartItems.map((item) => {
   
    const imageUrl = item.image ? urlFor(item.image.asset._ref).url() : "";
    return {
      price_data: {
        currency: "pkr",
        product_data: {
          name: item.productName,
          images: imageUrl ? [imageUrl] : [],
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    };
  });

  // lineItems.push({
  //   price_data: {
  //     currency: "pkr",
  //     product_data: {
  //       name: "Shipping Fee",
  //       images: [],
  //     },
  //     unit_amount: body.shippingFee * 100,
  //   },
  //   quantity: 1,
  // });

  // Create Stripe Checkout session with shipping_options
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    // shipping_address_collection: {
    //   allowed_countries: ["PK"],
    // },
    shipping_options: [
      {
        shipping_rate_data: {
          display_name: "Flat Shipping",
          type: "fixed_amount",
          fixed_amount: {
            amount: body.shippingFee * 100,
            currency: "pkr",
          },
          delivery_estimate: {
            minimum: { unit: "business_day", value: 2 },
            maximum: { unit: "business_day", value: 5 },
          },
        },
      },
    ],
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/orders/${Creating_order._id}?payment=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/orders?canceled=1&sessionID=${Creating_order._id}`,
    billing_address_collection: "required",
    metadata: {
      orderId: Creating_order._id,
      customerEmail: body.email,
    },
  });
  
  return NextResponse.json({ url: session.url, success:true});

} catch (e) {
  console.error('Stripe Checkout Error:', e);
  return NextResponse.json(
    { error: 'INTERNAL_SERVER_ERROR' },
    { status: 500 })
   
   }

}