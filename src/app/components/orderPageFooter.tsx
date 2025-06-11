"use client"
import React, { useState } from 'react'
import RefundPolicy from './refundPolicy';
import ShippingPolicy from './shippingPolicy';
import PrivacyPolicy from './privacyPolicy';
import TermOfservice from './termOfService';
import ContactInformation from './contactInformation';

export default function OrderPageFooter() {
  const [refund,setRefund] = useState<boolean>(false)
  const [shipping,setShipping] = useState<boolean>(false)
  const [privacy,setPrivacy] = useState<boolean>(false)
  const [term,setTerm] = useState<boolean>(false)
  const [contact,setContact] = useState<boolean>(false)
  return (
    <div className="border-t  lg:max-w-[1085px] lg:mx-auto px-5  text-xs flex lg:flex-row flex-col items-center  underline gap-7 py-5  text-red-500  w-full  border-gray-300 mt-14">
      <div onClick={() => setRefund(true)} className="cursor-pointer">
        Refund policy
      </div>
      <div onClick={() => setShipping(true)} className="cursor-pointer">
        Shipping policy
      </div>
      <div onClick={() => setPrivacy(true)} className="cursor-pointer">
        {" "}
        Privacy Policy
      </div>
      <div onClick={() => setTerm(true)} className="cursor-pointer">
        Terms of service
      </div>
      <div onClick={() => setContact(true)} className="cursor-pointer">
        contact information
      </div>
      <RefundPolicy refund={refund} setRefund={setRefund} />
      <ShippingPolicy shipping={shipping} setShipping={setShipping} />
      <PrivacyPolicy privacy={privacy} setPrivacy={setPrivacy} />
      <TermOfservice term={term} setTerm={setTerm} />
      <ContactInformation contact={contact} setContact={setContact}/>
    </div>
  );
}
