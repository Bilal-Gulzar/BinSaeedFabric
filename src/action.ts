"use server"

import { cookies } from "next/headers"
import { client } from "./sanity/lib/client"
import { jwtVerify } from "jose";
import {
  generateAdminEmail,
  generateCustomerEmail,
  // generateAdminEmail,
} from "@/lib/email-templates";
import { sendEmail } from "@/lib/email-config";

interface Item {
  id: string;
  _key: string;
  productName: string;
  size?: string;
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

export  const getCookies = async ()=>{
 const cookieStore = await cookies();
 const token = cookieStore.get('authToken')?.value || ''
 const SECRET_KEY = process.env.JWT_SECRET!;
 const encoder = new TextEncoder();
 const secret = encoder.encode(SECRET_KEY);
 const {payload} =  await jwtVerify(token,secret) 
 const {email,_id,} = payload
 return {email ,_id}
 

 

}

export const Logingout = async ()=>{

  (await cookies()).delete('authToken')  

}


export const UserProfile = async () => {
  const {email} = await getCookies();
  const query = `*[_type == "user" && email == $email][0]`;
  const getEmail = { email};
  const user = await client.fetch(query, getEmail);
  return user;
};


export const UpdateUserInfo = async (
  fname: string,
  lname: string,
  country: string,
  city: string,
  postalcode:string | number,
  address: string,
  phone:string | number
) => {
  const {_id} = await getCookies();
  let documentId = _id as string
   await client
    .patch(documentId)
    .set({
      fname,
      lname,
      phone,
      country,
      city,
      postalcode,
      address,
    })
    .commit();
};



 export const contactWithUs = async (formdata:FormData)=>{

const a =  await client.create({
_type:"contactUs",
name:formdata.get('name') || '',
phone:formdata.get('phone') || '',
email:formdata.get('email') || '',
comment:formdata.get('comment') || ''
  })
console.log(a)
 } 


 export const updata_COD_Status = async(id:string)=>{
  try {
    await client.patch(id).set({ isPaid: true }).commit();

    // res.status(200).json({ success: true });
  } catch (error) {
    // res.status(500).json({ error: 'Failed to update payment status' });
  }
}




 export const validatePhone = async (phone: string) => {

    const normalizedPhone = phone.startsWith("0")
      ? "92" + phone.slice(1)
      : phone;

    const res = await fetch(
      `https://api.veriphone.io/v2/verify?phone=${normalizedPhone}&key=${process.env.VERIFICATION_API_KEY}`
    );
    const data = await res.json();
   return data

  };

  export async function getShippingSettings() {
    const settings = await client.fetch(
      `*[_type == "shippingSettings" && _id == "shippingSettings"][0]{
        shippingFee,
        deliveryTime
      }`
    );
    return settings
  }


  export const GetUserOrders = async ()=>{ 
   const { email } = await getCookies();
    const query = `*[_type == "order" &&  customerEmail == $email] | order(_createdAt desc){
      _id,
      _createdAt,
        orderDate,
      customerName,
      customerEmail,
      paymentMethod,
       paymentStatus,
      isPaid,
      totalAmount,
      items[]{
        _key,
        id,
        productName,
        quantity,
        price,
        size,
        "imageUrl": image.asset->url
      },
    }`;

    const params = {email};
    let AllOrders = await client.fetch(query, params);
    return AllOrders 


  } 

  export const getorder = async(id:string)=>{

    const query = `*[_type == "order" &&  _id == $id][0]{
      _id,
      _createdAt,
        orderDate,
      customerName,
      customerEmail,
      subtotal,
      paymentMethod,
       paymentStatus,
       shippingFee,
      isPaid,
      phone,
      address,
      city,
      totalAmount,
      items[]{
        _key,
        id,
        productName,
        quantity,
        price,
        size,
        "imageUrl": image.asset->url
      },
    }`;

    let order = await client.fetch(query,{id});
   return order

  }


export async function checkOrderAvailability(orderId: string) {
    const orderQuery = `*[_type == "order" && _id == $orderId][0]{
      _id,
      items[] {
        productName,
        quantity,
        size,
        id
      }
    }`;

    const order = await client.fetch(orderQuery, { orderId });

    if (!order) return { success: false, message: "Order not found" };

    const unavailableItems: string[] = [];

    for (const item of order.items) {
      const { productName, size, quantity,id } = item;
      
      // Step 2: Fetch matching product
      const productQuery = `*[_type == "product" && _id == $id][0]{
        title,
        qty,
        sizes
      }`;
      
      const product = await client.fetch(productQuery, {id});

      if (!product) {
        unavailableItems.push(`${productName}: not found`);
        continue;
      }

      if (size && !product.sizes?.includes(size)) {
        unavailableItems.push(`${productName}: size "${size}" not available`);
        continue;
      }

      if (product.qty < quantity) {
        unavailableItems.push(`${productName}: not enough quantity`);
        continue;
      }
    }

    if (unavailableItems.length) {
      return {
        success: false,
        message: "Some items are unavailable",
        details: unavailableItems,
      };
    }

    return {
      success: true,
      message: "All items available",
    }

  }
  


  export async function subscribe(formData: FormData) {
    const email = formData.get("email")?.toString();
    const recaptchaToken = formData.get("g-recaptcha-response");
    if (!email || !email.includes("@")) {
      return { success: false, message: "Invalid email" };
    }

    const API_KEY = process.env.MAILCHIMP_API_KEY!;
    const SERVER_PREFIX = process.env.MAILCHIMP_SERVER_PREFIX!;
    const AUDIENCE_ID = process.env.MAILCHIMP_AUDIENCE_ID!;
    const secret = process.env.RECAPTCHA_SECRET_KEY!;

    const verifyRes = await fetch(
      `https://www.google.com/recaptcha/api/siteverify`,
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `secret=${secret}&response=${recaptchaToken}`,
      }
    );
    const verifyData = await verifyRes.json();
    // console.log("Verify result:", recaptchaToken);
    if (!verifyData.success) {

      return {
        success:false,
        message:"Failed reCAPTCHA validation" ,
      }
    }

    const res = await fetch(
      `https://${SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${AUDIENCE_ID}/members`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${Buffer.from(`anystring:${API_KEY}`).toString("base64")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email_address: email,
          status: "subscribed",
        }),
      }
    );

    const result = await res.json();

    if (res.ok) {
      return { success: true, message: "Thank you for subscribing!" };
    } else {
      return {
        success: false,
        message: result.title || "Subscription failed",
      };
    }
  }





export async function handleOrderConfirmation(orderID:string) {
  const new_Order: Product = await getorder(orderID);

  const customerHtml = generateCustomerEmail(new_Order);
  const adminHtml = generateAdminEmail(new_Order);

  // Send to customer
  await sendEmail({
    to: new_Order.customerEmail,
    subject: "Your Order Confirmation",
    html: customerHtml,
  });

  const adminEmails =
    process.env.ADMIN_EMAILS?.split(",").map((e) => e.trim()) || [];

  // Send to admin
  await sendEmail({
    to: process.env.SMTP_USER!,
    subject: `New Order Received - ${new_Order._id}`,
    html: adminHtml,
    bcc: adminEmails,
  });
}




export const updateOrder = async (
  orderId: string,
  updateFields: {
    paymentStatus: string;
    isPaid: boolean;
    orderDate:string;
  }
) => {
  try {
    const updatedOrder = await client
      .patch(orderId) 
      .set(updateFields) 
      .commit(); 

    return updatedOrder;
  } catch (error) {
    console.error("Failed to update order in Sanity:", error);
    throw error;
  }
};