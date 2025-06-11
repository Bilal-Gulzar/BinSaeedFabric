import { NextRequest, NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  const { orderId} = await req.json();
  const getcookies = await cookies()
  const authtoken = getcookies.get('authToken')?.value || ''
if(!authtoken){
  return NextResponse.json(
    { error: "unauthenticated" },
    { status: 400});

}

  if (!orderId) {
    return NextResponse.json({ error: "Missing data" }, { status: 400 });
  }

  try {
    await client.patch(orderId).set({ paymentStatus: "cancelled",isPaid:false}).commit();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating payment status:", error);
    return NextResponse.json(
      { error: "Sanity update failed" },
      { status: 500 }
    );
  }
}
