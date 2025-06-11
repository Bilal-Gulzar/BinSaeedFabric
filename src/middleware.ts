import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
export { auth } from "@/auth";

// This function can be marked `async` if using `await` inside
const SECRET_KEY = process.env.JWT_SECRET!;
const encoder = new TextEncoder();
const secret = encoder.encode(SECRET_KEY);

export async function middleware(request: NextRequest) {
  let cookie = request.cookies.get("authToken")?.value;
  const { pathname, searchParams } = request.nextUrl;
  
  const isStripeSuccess =
    pathname.startsWith("/orders/") && searchParams.get("payment") === "true";
  const isStripeCancel =
    pathname === "/orders" && searchParams.get("canceled") === "1";

  if (isStripeSuccess || isStripeCancel) {
    return NextResponse.next(); // Skip auth check
  }




  if(!cookie){

  return NextResponse.redirect(new URL("/register", request.url));
  }

const response = NextResponse.next();

  try{ 

    await jwtVerify(cookie,secret) 
    // if (request.nextUrl.pathname.startsWith("/register")) {
    //   return NextResponse.redirect(new URL("/", request.url));
    // }
  
  }
  catch (error){
    console.error("JWT verification failed:", error);
    return NextResponse.redirect(new URL("/register", request.url));
  }
  
  
  return response;
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/cart", "/profile", "/orders/:path*","/logout",]
}
