"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useEffect, useRef, useState } from "react";
import { FaFacebookF, FaInstagramSquare } from "react-icons/fa";
import { IoCloseOutline } from "react-icons/io5";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import ReCAPTCHA from "react-google-recaptcha";
import AOS from "aos";
import "aos/dist/aos.css";
import toast from "react-hot-toast";
import { subscribe } from "@/action";

export default function NewsLetter() {
  const [popUp, setPopUp] = useState(false);
  const recaptchaRef = useRef<ReCAPTCHA>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const POPUP_KEY = "newsletter-popup-last-shown";
  const TWELVE_HOURS = 12 * 60 * 60 * 1000;

  useEffect(() => {
    const lastShown = localStorage.getItem(POPUP_KEY);
    const now = Date.now();

      if (!lastShown || now - parseInt(lastShown, 10) > TWELVE_HOURS) {
    AOS.init({ once: true, duration: 500 });
    setTimeout(() => {
      setPopUp(true);
        localStorage.setItem(POPUP_KEY, now.toString());
      setTimeout(() => AOS.refresh(), 100);
    }, 1000);
      }
  }, []);

  useEffect(() => {
    if (!modalRef.current) return;

    if (popUp) {
      disableBodyScroll(modalRef.current);
    } else {
      enableBodyScroll(modalRef.current);
    }

    return () => {
      if (modalRef.current) enableBodyScroll(modalRef.current);
    };
  }, [popUp]);

  const handleSubscriber = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!recaptchaRef.current) {
      toast.error("reCAPTCHA not loaded. Please refresh the page.");
      return;
    }

    const token = await recaptchaRef.current?.executeAsync();

    if (!token) {
      toast.error("reCAPTCHA failed. Try again.");
      return;
    }

    if (!formRef.current) {
      toast.error("Form not ready. Try again.");
      return;
    }

    const formData = new FormData(formRef.current);
    formData.append("g-recaptcha-response", token || "");
    try {
      const result = await subscribe(formData);
      recaptchaRef.current?.reset();

      if (result.success) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    } catch (e) {
      toast.error("Subscription failed. Please try again.");
    }
  };

  return (
    <div
      //   data-aos="fade-zoom-in"
      //   data-aos-easing="ease-in-back"
      //   data-aos-delay="300"
      //   data-aos-offset="0"
      onClick={() => setPopUp(false)}
      className={`bg-black/70 fixed inset-0 flex z-50 items-center justify-center ${popUp ? "" : "hidden"}`}
    >
      <div
        data-aos="zoom-in"
        onClick={(e) => e.stopPropagation()}
        className={`bg-white relative md:h-[500px] w-full xs:w-auto mx-7 sm:mx-10 sm:w-fit md:w-3xl lg:w-5xl md:grid grid-cols-2 transform transition-all duration-3000 ease-out ${popUp ? "" : "hidden"} `}
        ref={modalRef}
      >
        <div className="h-[500px] md:flex hidden relative">
          <img src="newletter.webp" className="img-slider-img" />
        </div>
        <div className="flex w-full gap-5 justify-center items-center  py-20 px-6 xs:px-10 md:py-0 md:px-0  flex-col ">
          <h1 className="font-bold text-xl ">Join Our Mailing List</h1>
          <p className="text-xs md:max-w-[300px] leading-6 text-gray-800 text-center">
            Sign Up for exclusive updates, new arrivals & insider only
            discounts.
          </p>
          <form ref={formRef} onSubmit={handleSubscriber} className="w-full sm:w-2xs ">
            <div className="flex  w-full flex-col gap-3">
              <div className="">
                <Input
                  type="email"
                  name="email"
                  placeholder="enter your email address"
                  className="border-gray-400 input focusplaceholder:opacity-0 duration-500 text-center bg-white !text-xs text-gray-600 w-full "
                />
              </div>
              <Button
                type="submit"
                variant="default"
                className=" w-full  cursor-pointer hover:bg-white hover:text-black hover:border duration-500  hover:border-black font-bold uppercase"
              >
                Submit
              </Button>
              <ReCAPTCHA
                sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!}
                size="invisible"
                ref={recaptchaRef}
              />
            </div>
          </form>
          <div className="flex gap-4 mt-5 ">
            <span>
              <FaFacebookF size={19} />
            </span>
            <span>
              <FaInstagramSquare size={19} />
            </span>
          </div>
          <p
            onClick={() => setPopUp(false)}
            className="text-xs cursor-pointer underline mt-3 underline-offset-4"
          >
            No, Thanks
          </p>
        </div>
        <div
          onClick={() => {
            setPopUp(false);
          }}
          className="-top-2.5 -right-2.5 cursor-pointer absolute bg-black text-white"
        >
          <IoCloseOutline className="size-7 m-1.5" />
        </div>
      </div>
    </div>
  );
}
