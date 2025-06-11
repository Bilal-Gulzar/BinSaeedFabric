// app/api/stripe/webhook/route.ts
import { handleOrderConfirmation } from "@/action";
import { client } from "@/sanity/lib/client";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const POST = async (req: NextRequest) => {
  const sig = req.headers.get("stripe-signature")!;
  const body = await req.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // ✅ Handle the session completion
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    // const billingAddress = session.customer_details?.address;
    // const customerEmail = session.customer_details?.email;
    // const customerName = session.customer_details?.name;

   

    const Id = event?.data?.object?.metadata?.orderId as string;
    const isPaid = event?.data?.object?.payment_status === "paid";
    if (isPaid) {
     await handleOrderConfirmation(Id);
      await client
        .patch(Id)
        .set({
          isPaid,
          paymentStatus: "confirmed",
        })
        .commit();
    }else{
        await client
          .patch(Id)
          .set({
            paymentStatus: "cancelled",
          })
          .commit();
    }

  }

  return NextResponse.json({ received: true });
};
