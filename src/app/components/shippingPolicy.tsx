"use client";
import React, { useEffect, useRef,} from "react";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
export default function ShippingPolicy({
  shipping,
  setShipping,
}: {
  shipping: boolean;
  setShipping: React.Dispatch<React.SetStateAction<boolean>>
}) {
const modalRef = useRef<HTMLDivElement | null>(null);
    
  useEffect(() => {
    if (!modalRef.current) return;

    if (shipping) {
      disableBodyScroll(modalRef.current);
    } else {
      enableBodyScroll(modalRef.current);
    }

    return () => {
      if (modalRef.current) enableBodyScroll(modalRef.current);
    };
  }, [shipping])
  return (
    <div
      className={`fixed right-0 ${
        shipping ? "" : "translate-y-full"
      } justify-center  flex left-0 top-0 backdrop-blur-sm bg-[#666666]/80  w-full h-full items-end md:items-center  z-50 `}
    >
      <div
        className={`${
          shipping ? "translate-y-0" : "translate-y-full"
        }   duration-200 transition-all flex flex-col ease-in overflow-hidden max-h-[75vh] text-black fixed w-full md:w-3xl rounded-md  px-5 bg-white `}
        ref={modalRef}
      >
        <div className="flex border-b pb-4  pt-2 border-gray-300 justify-between items-center mt-3">
          <h1 className="text-xl font-semibold">Shipping policy:</h1>
          <div
            onClick={() => setShipping(false)}
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
        <div className=" overflow-y-auto max-h-[calc(75vh-40px)] pb-8 scrollbar-hide  mt-5 text-xs">
          <div className="mb-5">
            <h2 className="text-gray-600 text-sm mb-2 font-medium">
              Domestic Shipping
            </h2>
            <p>
              T SELF is offering “Charged Shipping” via M&P for over
              Pakistan. All domestic orders once processed will be delivered
              within 3-7 working days; the processing time of order is not
              included in the mentioned timeframe and this processing time may
              vary accordingly.
              <br />
              <br />
              Please have a look on our Return and Exchange Policy for all the
              returns and refunds of domestically shipped orders.
            </p>
          </div>
          <div className="mb-5">
            <h2 className="text-gray-600 text-sm mb-2 font-medium">
              International Shipping
            </h2>
            <p>
              Dear Valuable Customer, please note that the shipping charges for
              all the international orders will be applied on the basis of
              quantity and the destination where the order is to be shipped. The
              items in stock will be delivered to you in 5-7 working days once
              the order is placed, this doesn’t include the processing time of
              order. T Self is only responsible for providing the tracking
              number for International Parcels after two days of payment
              received. In case of Delays , Misplace, Damages or any other
              Condition faces will be the responsibility of the Logistic Company
              as the parcels are not insured . If the Parcel is imposed with any
              Custom Duties the Consignee have to Bear the Custom Duty. Due to
              Current Situation In Covid 19. the Company can not promise for the
              Time Frame for Delivering the Parcels Internationally.
            </p>
          </div>
          <div className="mb-5">
            <h2 className="text-gray-600 text-sm mb-2 font-medium">
              Returns & Exchange for International Orders
            </h2>
            <p>
              There will be no return or exchange facility for all the orders
              that are or will be shipped across the border. But, you may
              contact at{" "}
              <span className="text-blue-500">tselffabric@gmail.com</span> ,
              and let our Customer Services Representative know if you receive
              the ordered item in wrong size or defective condition, then he or
              she will assist you accordingly and resolve the issue you are
              facing with.
            </p>
          </div>
          <div className="mb-5">
            <h2 className="text-gray-600 text-sm mb-2 font-medium">
              Duties and Taxes
            </h2>
            <p>
              T SELF ships all the orders on Delivery Duty Unpaid (DDU) basis
              which means that a customer is liable for paying any sort of
              import duties or local sales tax which may be charged from you at
              the time of purchasing.
              <br />
              <br />T SELF will make deduction of shipping charges as well
              as sales and duty tax from the total amount, in case the shipment
              is refused at the time of delivery.
              <br />
              <br />
              Note : Due to various types of lighting and flash used while photo
              shoot, or maybe due to the difference in electronic digital device
              capturing effects and screen resolutions, the design color shade
              of the product may slightly vary. The brightest shade seen is the
              closest color of the product.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
