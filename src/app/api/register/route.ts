
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
    const { fname,lname, email, password } = await req.json();

    if (!fname || !lname || !email || !password) {
      return NextResponse.json(
        { message: "All fields are required." ,success:false },
        { status: 400 }
      );
    }

    const url = `https://emailvalidation.abstractapi.com/v1/?api_key=${process.env.ABSTRACT_API_KEY}&email=${encodeURIComponent(email)}`;

    const res = await fetch(url);
    const data = await res.json();

    if (!data.is_valid_format.value) {
      return NextResponse.json(
        { message: "Invalid email format", success: false },
        { status: 200 }
      );
    }
    if (!data.is_mx_found.value) {
      return NextResponse.json(
      { message: "Email domain not found", success: false },
      { status: 400 })
    }
    if (data.is_disposable_email.value) {
      return NextResponse.json(
      { message: "Disposable emails are not allowed", success: false },
        { status: 400 })
    }
    if (!data.is_smtp_valid.value) {
      return NextResponse.json(
      { message: "Email address does not exist", success: false },
      { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json(
        { message: "password must be at least 8 characters.", success: false },
        { status: 400 }
      );
    }

    const existingUser = await client.fetch(
      `*[_type == "user" && email == $email][0]`,
      { email }
    );
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists with this email.",success:false },
        { status: 409 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 11);

    const result = await client.create({
      _type: "user",
      fname,
      lname,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    });

    const token = jwt.sign({ _id: result._id, name:fname , email }, secretKey, {
      expiresIn: '2d',
    });

    const response = NextResponse.json(
      { message: "User created successfully",success:true ,token},
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
    console.error("Error creating user:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}