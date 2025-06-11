"use client";
import React, { useEffect, useRef,} from "react";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
export default function RefundPolicy({
  refund,
  setRefund,
}: {
  refund: boolean;
  setRefund: React.Dispatch<React.SetStateAction<boolean>>
}) {
const modalRef = useRef<HTMLDivElement | null>(null);
    
  useEffect(() => {
    if (!modalRef.current) return;

    if (refund) {
      disableBodyScroll(modalRef.current);
    } else {
      enableBodyScroll(modalRef.current);
    }

    return () => {
      if (modalRef.current) enableBodyScroll(modalRef.current);
    };
  }, [refund])
  return (
    <div
      className={`fixed right-0 ${
        refund ? "" : "translate-y-full"
      } justify-center  flex left-0 top-0 backdrop-blur-sm bg-[#666666]/80  w-full h-full items-end md:items-center  z-50 `}
    >
      <div
        className={`${
          refund ? "translate-y-0" : "translate-y-full"
        }   duration-200 transition-all ease-in flex flex-col overflow-hidden max-h-[75vh]  text-black fixed w-full md:w-3xl rounded-md  px-5 bg-white `}
        ref={modalRef}
      >
        <div className="flex border-b pb-4  pt-2 border-gray-300 justify-between items-center mt-3">
          <h1 className="text-xl font-semibold">Refund policy:</h1>
          <div
            onClick={() => setRefund(false)}
            className="hover:bg-[#f5f5f5] rounded-md p-1 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.07797 6.07797C6.22442 5.93153 6.46186 5.93153 6.6083 6.07797L12 11.4697L17.3917 6.07797C17.5381 5.93153 17.7756 5.93153 17.922 6.07797C18.0685 6.22442 18.0685 6.46186 17.922 6.6083L12.5303 12L17.922 17.3917C18.0685 17.5381 18.0685 17.7756 17.922 17.922C17.7756 18.0685 17.5381 18.0685 17.3917 17.922L12 12.5303L6.6083 17.922C6.46186 18.0685 6.22442 18.0685 6.07797 17.922C5.93153 17.7756 5.93153 17.5381 6.07797 17.3917L11.4697 12L6.07797 6.6083C5.93153 6.46186 5.93153 6.22442 6.07797 6.07797Z"
                stroke="black"
                strokeWidth="1"
                fill="none"
              />
            </svg>
          </div>
        </div>
        <div className="pb-8 scrollbar-hide overflow-y-auto flex-1  mt-5 text-xs">
          We have a ‘No Refund’ policy. However, refunds may be allowed in
          exceptional cases wherein the product is out of stock or appears to be
          faulty. Refunds will be issued via Bank Transfer. You will be credited
          for the cost of the item(s) and applicable taxes. Shipping and
          handling costs are non-refundable. Please allow 14 days for the
          processing of returns .
        </div>
      </div>
    </div>
  );
}
