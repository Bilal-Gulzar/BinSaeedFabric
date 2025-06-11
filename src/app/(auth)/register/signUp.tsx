"use client";
import { getCookies } from "@/action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function SignUp({token}:{token:string}) {
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [disabled, setDisabled] = useState(false);
  const router = useRouter();
  async function handleSubmit(evt: React.FormEvent<HTMLFormElement>) {
    evt.preventDefault();
    setDisabled(true);
    let data = { fname, lname, email, password };
    try {
      let res = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      let result = await res.json();
      if (result.success) {
        toast.success("Your account created successfully!");
        setTimeout(() => {
          router.push("/orders");
        }, 1500);
      } else {
        toast.error(result.message);
      }
    } catch (e) {
      console.log("INTERNAL_SERVER_ERROR", e);
      toast.error("something went wrong");
    } finally {
      setDisabled(false);
    }
  }

  useEffect(() => {
      if (token) {
        router.push("/");
      }
  }, []);

  return (
    <div className="px-12 py-8">
      <section className="flex flex-col gap-5">
        <div className="text-xs  space-x-2 text-gray-800">
          <Link href={"/"}>Home</Link>
          <span className="font-semibold">&gt;</span>

          <span> Create Account </span>
        </div>

        <h1 className="font-semibold text-xl uppercase">Create Account</h1>

        <p className="text-xs text-gray-800">
          Please register below to create an account
        </p>
      </section>
      <form onSubmit={handleSubmit} className="sm:w-md w-full">
        <div className="flex flex-col gap-3 mt-6 text-xs">
          <label htmlFor="fname">First Name</label>
          <Input
            id="fname"
            value={fname}
            disabled={disabled}
            required
            onChange={(e) => setFname(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-3 mt-6 text-xs">
          <label htmlFor="lname">Last Name</label>
          <Input
            id="lname"
            value={lname}
            disabled={disabled}
            required
            onChange={(e) => setLname(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-3 mt-6 text-xs">
          <label htmlFor="email">
            Your Email Address <span className="text-red-500">*</span>
          </label>
          <Input
            id="email"
            type="text"
            required
            disabled={disabled}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-3 mt-6 text-xs">
          <label htmlFor="password">
            Your Password <span className="text-red-500">*</span>
          </label>
          <Input
            id="password"
            value={password}
            required
            disabled={disabled}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="mt-5">
          <Button type="submit" disabled={disabled} className="sm:!px-12 px-4">
            CREATE AN ACCOUNT
          </Button>
        </div>
      </form>
    </div>
  );
}
