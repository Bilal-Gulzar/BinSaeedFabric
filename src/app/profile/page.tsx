"use client"
import React, { useEffect, useRef, useState } from 'react'
import OrderPageFooter from '../components/orderPageFooter';
import OrderPageNavBar from '../components/orderPageNavBar';
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";
import { GrEdit } from 'react-icons/gr';
import SkeletonForProfile from './skeletonForProfile';
import { MdOutlineErrorOutline } from 'react-icons/md';
import { getCookies, UpdateUserInfo, UserProfile } from '@/action';
import cities from "./postalcode.json";
import { useRouter } from 'next/navigation';
interface userInfo {
  name:string,
  fname:string,
  lname:string,
  email:string,
  phone?:number,
  country?:string,
  city?:string,
  address?:string,
  postalcode?:number,
} 

export default function Profile() {
     const modalRef = useRef<HTMLDivElement| null>(null);
      const router = useRouter()
       const [editInfo,setEditInfo]= useState<boolean>(false);
       const [editProfile,setEditProfile]= useState<boolean>(false);
       const [message,setMessage]= useState<boolean>(false);
       const [profileMessage,setProfileMessage]= useState<boolean>(false);
       const [email, setEmail] = useState<string>('');
       const [fName, setFName] = useState<string>("");
       const [lName, setLName] = useState<string>("");
       const [phone, setPhone] = useState<string | number>("");
       const [city, setCity] = useState<string>(cities[0].city);
       const [address, setAddress] = useState<string>("");
       const [postal, setPostal] = useState<string | number>('');
       const [country, setCountry] = useState<string>("");
       const [saving, setSaving] = useState<boolean>(false);
       const [checkNum, setCheckNum] = useState<boolean>(false);
       const [isChange, setIsChange] = useState<boolean>(false);
       const [isloading, setIsloading] = useState<boolean>(true);
       const [userInfo, setUserInfo] = useState<{[Key:string]: number |string}>({
         name: "",
         phone: "",
         city: "",
         country: "",
         address: "",
         postal: "",
       });
    

       useEffect(() => {
         if (!modalRef.current) return;

         if (editInfo || editProfile) {
           disableBodyScroll(modalRef.current);
         } else {
           enableBodyScroll(modalRef.current);
         }
         return () => {
           if (modalRef.current) enableBodyScroll(modalRef.current);
         };
       }, [editInfo, editProfile]);

const getuser =  async()=>{
const userdata:userInfo =  await UserProfile()
if(userdata){
 const fullName =
   (userdata.fname || "").trim() + " " + (userdata.lname || "").trim();

   setUserInfo({
     name: fullName.trim() || "",
     phone: userdata?.phone || "",
     address: userdata?.address || "",
     city: userdata?.city || "",
     country: userdata?.country || "",
     postal: userdata?.postalcode || "",
   });
   setEmail(userdata.email)
   setFName(userdata?.fname || "");
   setLName(userdata?.lname || "");
   setPhone(userdata?.phone || "");
   setCity(userdata?.city || "");
   setCountry(userdata?.country || "");
   setPostal(userdata?.postalcode || '');
   setAddress(userdata?.address || "");
   
   setIsloading(false)
}
}

useEffect(() => {
  const check = cities.filter((x) => x.city == city);
  setPostal(check[0]?.postal_code || "");
}, [city]);

useEffect(()=>{
  getuser();
},[])

async function updateUser(evt:React.FormEvent<HTMLFormElement>) {
  evt.preventDefault();
     if(editInfo){
      const length = `${phone}`.length;
      if (length < 11 || length > 11)
        return setCheckNum(true), router.push("###");
      setCheckNum(false);
     }
     setSaving(true);
  await UpdateUserInfo(fName, lName, country, city, postal, address, phone);
  await getuser()
  setIsChange(!isChange);
  setTimeout(() => {
    setSaving(false);
    if(editInfo){
       setEditInfo(false)
       showMessageForAddress()
    }else{

      setEditProfile(false);
      showMessageForProfile()
    }
    
  }, 1500);

  const showMessageForProfile = () => {
    setProfileMessage(true);
    setTimeout(() => {
      setProfileMessage(false);
    }, 1500);
  };
}

const showMessageForAddress = () => {
  setMessage(true);
  setTimeout(() => {
    setMessage(false);
  }, 1500);
};


  return (
    <div className="bg-[#f5f5f5] flex flex-col justify-between overflow-hidden min-h-screen ">
      <div>
        <OrderPageNavBar />
        {isloading ? (
          <SkeletonForProfile />
        ) : (
          <div className="mt-5 px-5  lg:max-w-[1200px] lg:mx-auto lg:px-14">
            <h1 className="font-medium text-2xl">Profile</h1>

            <div className="flex gap-7 flex-col mt-10">
              <div className="bg-white px-7 py-7 rounded-md flex flex-col gap-3 ">
                <p className="flex gap-5 items-center text-sm text-gray-500 ">
                  {userInfo.name ? (
                    <span className="text-sm text-black font-medium break-all ">
                      {userInfo.name}
                    </span>
                  ) : (
                    <span className="text-black font-medium">Edit Name</span>
                  )}
                  <button
                    onClick={() => setEditProfile(true)}
                    className="cursor-pointer"
                  >
                    <GrEdit className="size-3.5 text-red-600" />
                  </button>
                </p>
                <div className="text-sm">
                  <p className="text-gray-500">Email</p>
                  <p>{email}</p>
                </div>
              </div>

              <div className="bg-white px-7 py-7 rounded-md flex flex-col gap-3 ">
                <p className="font-medium">Address</p>
                <div className="hover:bg-[#f5f5f5] rounded-md p-4">
                  <p className="text-gray-500  text-sm flex justify-between items-center">
                    Default Address
                    <button
                      onClick={() => setEditInfo(true)}
                      className="cursor-pointer"
                    >
                      <GrEdit className="size-3.5 text-red-600" />
                    </button>
                  </p>
                  <div className="mt-3 flex flex-col gap-0.5">
                    <div className="text-sm">{userInfo.name}</div>
                    <div className="text-sm">{userInfo.address}</div>
                    <div className="text-sm">
                      {userInfo.city + " " + userInfo.postal}
                    </div>
                    <div className="text-sm">{userInfo.country}</div>
                    <div className="text-sm">{userInfo.phone}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div
          className={`fixed right-0  overflow-hidden ${
            editInfo ? "flex" : " translate-y-full "
          } justify-center left-0 top-0  backdrop-blur-sm bg-[#666666]/80 w-full h-full  items-end md:items-center z-50`}
        >
          <div
            className={`${
              editInfo ? "translate-y-0" : "translate-y-full"
            } transition-all  duration-200 ease-in w-full scrollbar-hide max-h-[87vh] md:w-[690px] lg:w-[750px] overflow-y-auto hide-scrollbar rounded-t-xl md:rounded-md  md:max-h-[465px] px-5 bg-white`}
            ref={modalRef}
          >
            <div className="mt-3 ">
              <div className="flex justify-between items-center">
                <h1 className="text-xl font-semibold">Edit address</h1>
                <div
                  id="##"
                  onClick={() => setEditInfo(false)}
                  className="hover:bg-[#f5f5f5] rounded-md p-1 cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="23"
                    height="23"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M6.07797 6.07797C6.22442 5.93153 6.46186 5.93153 6.6083 6.07797L12 11.4697L17.3917 6.07797C17.5381 5.93153 17.7756 5.93153 17.922 6.07797C18.0685 6.22442 18.0685 6.46186 17.922 6.6083L12.5303 12L17.922 17.3917C18.0685 17.5381 18.0685 17.7756 17.922 17.922C17.7756 18.0685 17.5381 18.0685 17.3917 17.922L12 12.5303L6.6083 17.922C6.46186 18.0685 6.22442 18.0685 6.07797 17.922C5.93153 17.7756 5.93153 17.5381 6.07797 17.3917L11.4697 12L6.07797 6.6083C5.93153 6.46186 5.93153 6.22442 6.07797 6.07797Z"
                      stroke="gray"
                      strokeWidth="1"
                      fill="none"
                    />
                  </svg>
                </div>
              </div>
              <div
                className={`${
                  checkNum ? "" : "hidden "
                } flex my-4 items-center gap-3 text-red-950 font-medium text-sm rounded border  border-red-200  p-3 bg-red-50`}
              >
                <span>
                  <MdOutlineErrorOutline className="size-6 text-red-500" />
                </span>{" "}
                Phone number is not valid
              </div>
              <form onSubmit={updateUser}>
                <div className="mt-3 grid md:grid-cols-2 gap-3 ">
                  <div className="relative md:col-span-2 ">
                    <input
                      id="country"
                      type="text"
                      autoComplete="off"
                      placeholder=""
                      required
                      disabled={saving}
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="py-2.5 input-field px-5 w-full tex-sm pt-5 border border-gray-300 focus:border-[2px] outline-0 focus:border-red-600 rounded-md"
                    />
                    <label
                      htmlFor="country"
                      className="left-5 top-7 floating-label transform -translate-y-1/2  transition-all duration-200  absolute text-sm text-gray-500"
                    >
                      country/region
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      id="firstName"
                      type="text"
                      autoComplete="off"
                      placeholder=""
                      required
                      value={fName}
                      disabled={saving}
                      onChange={(e) => setFName(e.target.value)}
                      className="py-2.5 input-field  px-5 w-full tex-sm pt-5 border border-gray-300 focus:border-[2px] outline-0 focus:border-red-600 rounded-md"
                    />
                    <label
                      htmlFor="firstName"
                      className="left-5 top-7 floating-label transform -translate-y-1/2  transition-all duration-200 absolute text-sm text-gray-500"
                    >
                      First name
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      id="lastName"
                      type="text"
                      autoComplete="off"
                      placeholder=""
                      value={lName}
                      disabled={saving}
                      onChange={(e) => setLName(e.target.value)}
                      required
                      className="py-2.5 px-5 input-field w-full tex-sm pt-5 border border-gray-300 focus:border-[2px] outline-0 focus:border-red-600 rounded-md"
                    />
                    <label
                      htmlFor="lastName"
                      className="left-5 top-7 floating-label transform -translate-y-1/2  transition-all duration-200 absolute text-sm text-gray-500"
                    >
                      Last name
                    </label>
                  </div>
                  <div className="relative md:col-span-2 ">
                    <input
                      id="address"
                      type="text"
                      autoComplete="off"
                      placeholder=""
                      required
                      value={address}
                      disabled={saving}
                      onChange={(e) => setAddress(e.target.value)}
                      className="py-2.5 px-5 input-field w-full tex-sm pt-5 border border-gray-300 focus:border-[2px] outline-0 focus:border-red-600 rounded-md"
                    />
                    <label
                      htmlFor="address"
                      className="left-5 top-7 floating-label transform -translate-y-1/2  transition-all duration-200 absolute text-sm text-gray-500"
                    >
                      Address
                    </label>
                  </div>
                  <div className="relative">
                    <select
                      id="city"
                      autoComplete="off"
                      required
                      disabled={saving}
                      onChange={(e) => setCity(e.target.value)}
                      value={city}
                      className="py-2.5 px-5 input-field w-full tex-sm pt-5 border border-gray-300 focus:border-[2px] outline-0 focus:border-red-600 rounded-md"
                    >
                      {cities &&
                        cities.map((city, index) => (
                          <option
                            key={index}
                            value={city.city}
                            className="text-[#8D8D8D]"
                          >
                            {city.city}
                          </option>
                        ))}
                    </select>
                    <label
                      htmlFor="city"
                      className="left-5 top-7 floating-label transform -translate-y-1/2  transition-all duration-200 absolute text-sm text-gray-500"
                    >
                      City
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      id="postalcode"
                      type="number"
                      autoComplete="off"
                      readOnly
                      required
                      disabled
                      value={postal}
                      className="py-2.5 input-field px-5 w-full tex-sm pt-5 border border-gray-300 focus:border-[2px] outline-0 focus:border-red-600 rounded-md"
                    />
                    <label
                      htmlFor="postalcode"
                      className="left-5 top-7 floating-label transform -translate-y-1/2  transition-all duration-200  absolute text-sm text-gray-500"
                    >
                      Postal code
                    </label>
                  </div>
                  <div className="relative md:col-span-2 ">
                    <input
                      id="phone"
                      type="number"
                      autoComplete="off"
                      placeholder=""
                      required
                      disabled={saving}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="py-2.5 input-field px-5 w-full tex-sm pt-5 border border-gray-300 focus:border-[2px] outline-0 focus:border-red-600 rounded-md"
                    />
                    <label
                      htmlFor="phone"
                      className="left-5 top-7 floating-label transform -translate-y-1/2  transition-all duration-200  absolute text-sm text-gray-500"
                    >
                      Phone
                    </label>
                  </div>
                </div>
                <div className="py-5 flex justify-end ">
                  <button
                    onClick={() => setEditInfo(false)}
                    type="button"
                    className="p-3 text-sm text-red-500 rounded-md "
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-[53px] flex justify-center items-center bg-[#D12442] text-sm hover:bg-[#a51a32] rounded-md font-medium text-white"
                  >
                    {" "}
                    {saving ? (
                      <svg
                        fill="none"
                        height="24"
                        viewBox="0 0 24 23"
                        width="24"
                        className="animate-spin"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          clipRule="evenodd"
                          d="M12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19ZM12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                          fill="currentColor"
                          fillRule="evenodd"
                          opacity="0.2"
                        />
                        <path
                          d="M2 12C2 6.47715 6.47715 2 12 2V5C8.13401 5 5 8.13401 5 12H2Z"
                          fill="currentColor"
                        />
                      </svg>
                    ) : (
                      "Save"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div
          className={`fixed right-0 ${
            editProfile ? "" : "translate-y-full"
          } justify-center  flex left-0 top-0 backdrop-blur-sm bg-[#666666]/80 w-full h-full items-end sm:items-center z-50 `}
        >
          <div
            className={`${
              editProfile ? "translate-y-0" : "translate-y-full"
            }   duration-200 transition-all ease-in  w-full sm:w-[550px] md:w-[680px] lg:w-[750px] overflow-y-auto hide-scrollbar  sm:rounded-md rounded-t-xl  px-5 bg-white`}
            ref={modalRef}
          >
            <div className="flex justify-between items-center mt-3">
              <h1 className="text-xl font-semibold">Edit profile</h1>
              <div
                onClick={() => setEditProfile(false)}
                className="hover:bg-[#f5f5f5] rounded-md p-1 cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="23"
                  height="23"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M6.07797 6.07797C6.22442 5.93153 6.46186 5.93153 6.6083 6.07797L12 11.4697L17.3917 6.07797C17.5381 5.93153 17.7756 5.93153 17.922 6.07797C18.0685 6.22442 18.0685 6.46186 17.922 6.6083L12.5303 12L17.922 17.3917C18.0685 17.5381 18.0685 17.7756 17.922 17.922C17.7756 18.0685 17.5381 18.0685 17.3917 17.922L12 12.5303L6.6083 17.922C6.46186 18.0685 6.22442 18.0685 6.07797 17.922C5.93153 17.7756 5.93153 17.5381 6.07797 17.3917L11.4697 12L6.07797 6.6083C5.93153 6.46186 5.93153 6.22442 6.07797 6.07797Z"
                    stroke="gray"
                    strokeWidth="1"
                    fill="none"
                  />
                </svg>
              </div>
            </div>
            <form onSubmit={updateUser}>
              <div className="mt-5 grid md:grid-cols-2 gap-3 ">
                <div className="relative">
                  <input
                    id="firstName"
                    type="text"
                    autoComplete="off"
                    required
                    disabled={saving}
                    value={fName}
                    onChange={(e) => setFName(e.target.value)}
                    placeholder=""
                    className="py-2.5 px-5 w-full input-field  tex-sm pt-5 border border-gray-300 focus:border-[2px] outline-0 focus:border-red-600 rounded-md"
                  />
                  <label
                    htmlFor="firstName"
                    className="left-5 top-7 floating-label transform -translate-y-1/2  transition-all duration-200  absolute text-sm text-gray-500"
                  >
                    First name
                  </label>
                </div>
                <div className="relative">
                  <input
                    id="lastName"
                    type="text"
                    disabled={saving}
                    autoComplete="off"
                    placeholder=""
                    required
                    value={lName}
                    onChange={(e) => setLName(e.target.value)}
                    className="py-2.5 px-5 input-field w-full tex-sm pt-5 border border-gray-300 focus:border-[2px] outline-0 focus:border-red-600 rounded-md"
                  />
                  <label
                    htmlFor="lastName"
                    className="left-5 top-7 floating-label transform -translate-y-1/2  transition-all duration-200  absolute text-sm text-gray-500"
                  >
                    Last name
                  </label>
                </div>
                <div className="relative md:col-span-2 ">
                  <label
                    htmlFor="email"
                    className="left-5 top-1.5   absolute text-sm text-gray-500"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    autoComplete="off"
                    required
                    value={email}
                    readOnly
                    className="py-2.5 px-5 w-full outline-none bg-gray-100 text-gray-500 text-sm pt-6 border border-gray-300  outline-0  rounded-md"
                  />
                </div>
                <legend className="text-gray-500 text-xs -mt-1">
                  Email used for login can't be changed
                </legend>
              </div>
              <div className="pb-5 flex justify-end">
                <button
                  onClick={() => setEditProfile(false)}
                  type="button"
                  className="underline outline-none p-3 text-red-500 text-sm rounded-md "
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-[55px] flex justify-center items-center bg-[#D12442] outline-none text-sm hover:bg-[#a51a32] text-white rounded-md font-medium"
                >
                  {saving ? (
                    <svg
                      fill="none"
                      height="23"
                      viewBox="0 0 24 23"
                      width="24"
                      className="animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        clipRule="evenodd"
                        d="M12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19ZM12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                        fill="currentColor"
                        fillRule="evenodd"
                        opacity="0.2"
                      />
                      <path
                        d="M2 12C2 6.47715 6.47715 2 12 2V5C8.13401 5 5 8.13401 5 12H2Z"
                        fill="currentColor"
                      />
                    </svg>
                  ) : (
                    "Save"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div
        className={`${
          message ? "" : "translate-y-full"
        } z-40 w-screen fixed bottom-12 flex justify-center items-center`}
      >
        <span
          className={`bg-[#4c4c4c] ${
            message ? "" : "translate-y-full"
          } p-5 flex justify-between items-center rounded-md  text-white text-sm `}
        >
          Default address updated &nbsp;x
        </span>
      </div>
      <div
        className={`${
          profileMessage ? "" : "translate-y-full"
        } z-40 w-screen fixed bottom-12 flex justify-center items-center`}
      >
        <span
          className={`bg-[#4c4c4c] ${
            profileMessage ? "" : "translate-y-full"
          } p-5 flex justify-between items-center rounded-md  text-white text-sm `}
        >
          Profile updated &nbsp;x
        </span>
      </div>

      <OrderPageFooter />
    </div>
  );
}
