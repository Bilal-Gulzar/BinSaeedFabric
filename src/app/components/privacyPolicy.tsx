"use client";
import React, { useEffect, useRef,} from "react";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
export default function PrivacyPolicy({
  privacy,
  setPrivacy,
}: {
  privacy: boolean;
  setPrivacy: React.Dispatch<React.SetStateAction<boolean>>
}) {
const modalRef = useRef<HTMLDivElement | null>(null);
    
  useEffect(() => {
    if (!modalRef.current) return;

    if (privacy) {
      disableBodyScroll(modalRef.current);
    } else {
      enableBodyScroll(modalRef.current);
    }

    return () => {
      if (modalRef.current) enableBodyScroll(modalRef.current);
    };
  }, [privacy])
  return (
    <div
      className={`fixed right-0 ${
        privacy ? "" : "translate-y-full"
      } justify-center  flex left-0 top-0 backdrop-blur-sm bg-[#666666]/80  w-full h-full items-end md:items-center  z-50 `}
    >
      <div
        className={`${
          privacy ? "translate-y-0" : "translate-y-full"
        }   duration-200 transition-all flex flex-col ease-in overflow-hidden max-h-[75vh] text-black fixed w-full md:w-3xl rounded-md  px-5 bg-white `}
        ref={modalRef}
      >
        <div className="flex border-b pb-4  pt-2 border-gray-300 justify-between items-center mt-3">
          <h1 className="text-xl font-semibold">Privacy policy:</h1>
          <div
            onClick={() => setPrivacy(false)}
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
              General Browsing Information
            </h2>
            <p>
              During each visit of our website by visitors, we collect as well
              as store navigational information. However, just non-personal
              detectable information may be collected which includes browser
              version, domain type, service provider and IP address. We also in
              a ease in assessing the capabilities of downloading and connecting
              the pages from our website. Visitor’ experience as well as
              feedback can be attained through navigational information. So that
              we can be able to offer our customers with more qualities,
              products and the services that our customers use to prefer or
              like.
            </p>
          </div>
          <div className="mb-5">
            <h2 className="text-gray-600 text-sm mb-2 font-medium">
              Description
            </h2>
            <p>
              Your data or your credentials do not ever sell with the other
              parties by us in any condition. At www.binsaeedfabric.com, we use
              to gather as well as save the information of our customers in
              order to improve your experience. The aim of this privacy policy
              is to help you to understand the information which we collect
              about you at the time you visit our website as well as how that
              information is being used.
            </p>
          </div>
          <div className="mb-5">
            <h2 className="text-gray-600 text-sm mb-2 font-medium">
              Personal Information
            </h2>
            <p>
              Information is collected when you visit our website. The
              information which is gathered may comprises of your name, e-mail
              address, mailing address, shipping address, billing address and
              contact number. This occurs for the purpose of shipping your
              products to you as well as for the verification of your billing
              information. Our customer names, e-mail address or the mailing
              address are not to be shared with any unofficial person.
            </p>
          </div>
          <div className="mb-5">
            <h2 className="text-gray-600 text-sm mb-2 font-medium">
              Online Collected Personal Information Utilized
            </h2>
            <p>
              Your personal information is used for delivering your ordered
              products, for responding to your queries as well as for delivering
              the services and the information regarding our products, events
              and promotions.
            </p>
          </div>
          <div className="mb-5">
            <h2 className="text-gray-600 text-sm mb-2 font-medium">
              Sharing of Information with Third Parties
            </h2>
            <p>
              Your information is shared with the third parties just to fulfill
              the orders, observing the site activity, processing payments,
              conducting surveys, observing e-mail and data base.
            </p>
          </div>
          <div className="mb-5">
            <h2 className="text-gray-600 text-sm mb-2 font-medium">
              Other Websites and Services Links
            </h2>
            <p>
              Links for other sites may be available in our website for your
              ease. The appearing links on www.binsaeedfabric.com must not
              consider that we use to have any connection with the linked
              websites. It is not the responsibility of www.binsaeedfabric.com
              for the privacy activities or any content of these linked
              websites. You must need to go through the privacy policies of
              these linked websites.
            </p>
          </div>
          <div className="mb-5">
            <h2 className="text-gray-600 text-sm mb-2 font-medium">
              Considerations or Questions
            </h2>
            <p>
              You may contact us at{" "}
              <span className="text-blue-500">info@binsaeedfabric.com </span>if
              you have any problem or query regarding our privacy policy.
              <br />
              <br />
              Note:
              <br />
              <br />
              Due to various types of lighting and flash used while photo shoot,
              or maybe due to the difference in electronic digital device
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
