"use client";
import React, { useEffect, useRef,} from "react";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
export default function TermOfservice({
  term,
  setTerm,
}: {
  term: boolean;
  setTerm: React.Dispatch<React.SetStateAction<boolean>>
}) {
const modalRef = useRef<HTMLDivElement | null>(null);
    
  useEffect(() => {
    if (!modalRef.current) return;

    if (term) {
      disableBodyScroll(modalRef.current);
    } else {
      enableBodyScroll(modalRef.current);
    }

    return () => {
      if (modalRef.current) enableBodyScroll(modalRef.current);
    };
  }, [term])
  return (
    <div
      className={`fixed right-0 ${
        term ? "" : "translate-y-full"
      } justify-center  flex left-0 top-0 backdrop-blur-sm bg-[#666666]/80  w-full h-full items-end md:items-center  z-50 `}
    >
      <div
        className={`${
          term ? "translate-y-0" : "translate-y-full"
        }   duration-200 transition-all flex flex-col ease-in overflow-hidden max-h-[75vh] text-black fixed w-full md:w-3xl rounded-md  px-5 bg-white `}
        ref={modalRef}
      >
        <div className="flex border-b pb-4  pt-2 border-gray-300 justify-between items-center mt-3">
          <h1 className="text-xl font-semibold">Terms of service:</h1>
          <div
            onClick={() => setTerm(false)}
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
            <p>
              At T Self, we have a priority aim to enhance the experience of our
              valuable customers. We at T SELF guarantee the rights of our
              customers and keep them aware at every instant by offering advice
              through {process.env.NEXT_PUBLIC_BASE_URL}, social media, and
              catalog. The below mentioned policy is for the same services and
              applicable to all the placed orders within the country, on our
              online stores.
            </p>
          </div>
          <div className="mb-5">
            <h2 className="text-gray-600 underline underline-offset-2 text-sm mb-2 font-medium">
              Items that can be Returned
            </h2>
            <p>
              We are giving the facility of return service in case of receiving
              the defective product or not in accordance with our customer’s
              specifications. If the customer is not satisfied with what he or
              she ordered and what is received than the customer has a right to
              return it easily within the provided time limit and:
              <br />
              <br />
            </p>
            <ul className=" list-disc space-y-3">
              <li>
                The product that is being returned by the customer must be
                complete and intact.
              </li>
              <li>
                There should not be utilization of received product which is
                being returned.
              </li>
              <li>Item packaging should be unblemished and intact.</li>
              <li>
                Items that are physically present in Pakistan and are available
                for a reverse pickup
              </li>
            </ul>
          </div>
          <div className="mb-5">
            <h2 className="text-gray-600 underline underline-offset-2 text-sm mb-2 font-medium">
              Items that cannot be Returned
            </h2>
            <ul className="space-y-3 !list-disc">
              <li>
                If the product is not complete or if even a single item is
                missing.
              </li>
              <li>
                If the product is customized according to size, style, and
                fabric.
              </li>
              <li>
                If the product get stained, emitting perfume scent or body
                odors, and got damaged even a bit.
              </li>
              <li>The discounted sale merchandise cannot be returned.</li>
              <li>
                Generally, items present outside of Pakistan cannot be returned
                or exchanged. However, we will provide return and exchange
                service in some cases, provided the item is shipped to our
                premises in Pakistan by the customer
              </li>
            </ul>
          </div>
          <div className="mb-5">
            <h2 className="text-gray-600 text-sm mb-2 font-medium">
              Procedure for Return & Exchange
            </h2>
            <p>
              Product (s) can be exchanged 7 days from the date of purchase.
              Please note that the product must be unused with the price label
              attached along with the purchase invoice. Items bought on sale
              cannot be exchanged. Due to the differences in color
              monitors/screens and lighting used during photo shoots, the exact
              color or texture of the final item may vary from what is seen on
              screen, therefore products cannot be exchanged for this reason. We
              will only exchange or refund any product(s), if the product(s)
              received has any kind of manufacturing defect. If there is any
              Size Issue in our Product which is not up to provided Size Chart,
              that product can be exchanged. Contact our customer service center
              by emailing us images of defected product at
              <span className="text-blue-500"> tselffabric@gmail.com</span> or
              calling us at <span className="text-blue-500"> +923278690391</span>{" "}
              within 7 days of purchase along with the purchase invoice . Our
              team will reviews the product, you will be offered an exchange
              with same price value product.
            </p>
          </div>
          <div className="mb-5">
            <h2 className="text-gray-600 text-sm mb-2 font-medium">
              Refund Policy
            </h2>
            <p>
              We have a ‘No Refund’ policy. However, refunds may be allowed in
              exceptional cases wherein the product is out of stock or appears
              to be faulty. Refunds will be issued via Bank Transfer. You will
              be credited for the cost of the item(s) and applicable taxes.
              Shipping and handling costs are non-refundable. Please allow 14
              days for the processing of returns .
            </p>
          </div>
          <div className="mb-5">
            <h2 className="text-gray-600 text-sm mb-2 font-medium">
              Exchange Gifts
            </h2>
            <p>
              We do not entertain the refunds on gifts product if the delivery
              process is completed and the product is delivered. But if a person
              wish to return the product under this scenario, than he or she is
              advised to contact the person who made purchase of T SELF product
              and then the original purchaser is needed to follow the Exchange
              procedure within five (05) days time period.
            </p>
          </div>
          <div className="mb-5">
            <h2 className="text-gray-600 text-sm mb-2 font-medium">
              International Orders
            </h2>
            <p>
              For all the international orders, the facility of returns and
              exchange cannot be applicable at this moment; for having more
              detailed info please have a look at our Shipping Policy for the
              international orders.
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
