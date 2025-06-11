
import { NextResponse } from "next/server";
import { client } from "@/sanity/lib/client";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not set in environment variables");
}
const secretKey = process.env.JWT_SECRET;

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "All fields are required." ,success:false },
        { status: 400 }
      );
    }
    if (password.length < 8) {
      return NextResponse.json(
        { message: "password must be at least 8 characters.", success: false },
        { status: 400 }
      );
    }

    const User = await client.fetch(
      `*[_type == "user" && email == $email][0]`,
    {email});

    if (!User) {
      return NextResponse.json(
        { message: "Invalid credentials.",success:false },
        { status: 401 },
      );
    }



    const isMatched = await bcrypt.compare(password,User.password);
    if (!isMatched) {
      return NextResponse.json(
        { message: "Invalid credentials.", success: false },
        { status: 401 }
      );
    }

    const token = jwt.sign({ _id: User._id, name:User.fname , email }, secretKey, {
      expiresIn: '2d',
    });

    const response = NextResponse.json(
      { message: "Login successfully",success:true},
      { status: 201 }
    );

     response.cookies.set("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== "development",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 2,
      path: "/",
    });

    return response;

  } catch (error) {
    console.error("Error  Logging user:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}