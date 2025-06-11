"use client"
import React, { useEffect, useState } from 'react'
import { TbUserEdit } from "react-icons/tb";
import { IoStar } from "react-icons/io5";
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function FeedBackSection() {


 const numbers = Array.from({ length: 4 }, (_, i) => i + 1);
 const [index,setIndex] = useState(0)

 useEffect(() => {
      const interval = setInterval(() => {
        setIndex((prevIndex) =>
          prevIndex === numbers.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000); 

      return () => clearInterval(interval); 
    }, [numbers.length]);

const feedBack = [
  {
    UserName: "Shilpi Shanaulla",
    date: "Friday,Jan,26,2024",
    comment:
      "Yap bin saed febric quality is good and responsable you can wash them again an again which is not possible for other pakistani brand's and other pakistani brands are too much expensive👍",
    like: "Awesome...",
  },
  {
    UserName: "Erum Mushir",
    date: "Friday,Jan,29,2023",
    comment: "Dresses are really good..Material stitching colors❤️",
    like: "Satisfied",
  },
  {
    UserName: "Mehreen Muneer",
    date: "Saturday,May,05,2024",
    comment: "Very nice brand and best thing is Affordable for everyone ❤️",
    like: "Affordable",
  },
  {
    UserName: "Umma Anwer",
    date: "Thursday,July,11,2024",
    comment: "wakai buht achy hoty hai dresses aur bki brand k mukably me price bhe ",
    like: "Very nice",
  },
];
function showPrevImage() {
  setIndex((indx) => {
    if (indx == feedBack.length - 1) return 0;
    return indx + 1;
  });
}
function showNextImage() {
  setIndex((indx) => {
    if (indx == 0) return feedBack.length - 1;
    return indx - 1;
  });
}
  return (
    <section className="mt-20 relative mx-auto bg-gray-100  py-14 ">
      <h2 className="text-center font-semibold text-xl">Top Reviews</h2>
      <div
        style={{
          maxWidth: "1900px",
          width: "100%",
          height: "100%",
          margin: "0 auto",
          display: "flex",
          transform: `translateX(-${100 * index}%)`,
          transition: "transform 300ms ease-in-out",
        }}
      >
        {feedBack.map((k, index) => (
          <div
            style={{
              width: "100%",
              height: "100%",
              flexShrink: 0,
              flexGrow: 0,
            }}
            key={index}
            className="flex md:flex-row flex-col   gap-5 items-baseline mt-6 px-5 lg:px-14"
          >
            <div className="basis-[40%] space-y-4">
              <div className="font-medium">{k.like}</div>
              <div className="text-sm text-black  gap-3 flex items-center">
                <span className="size-8 text-white bg-gray-300 rounded-full flex justify-center items-center">
                  <TbUserEdit size={18} />
                </span>
                <div>
                  {k.UserName} <span className="text-gray-500">{k.date}</span>
                </div>
              </div>
            </div>
            <div className="basis-[60%] mt-6 md:mt-0 text-sm">
              <p>{k.comment}</p>
              <div className=" mt-6 flex items-center gap-1">
                <IoStar size={18} />
                <IoStar size={18} />
                <IoStar size={18} />
                <IoStar size={18} />
                <IoStar size={18} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-4 pl-10">
        {feedBack.map((_, ind) => (
          <button
            key={ind}
            onClick={() => setIndex(ind)}
            className={`size-3 ${
              ind == index ? " bg-black" : "bg-transparent border border-black"
            }   rounded-full  cursor-pointer mt-4`}
          ></button>
        ))}
      </div>
      <div className="hidden md:block">
        <button
          onClick={showPrevImage}
          className="bg-white  left-6 absolute top-[50%] flex justify-center items-center border border-gray-100 duration-300 hover:bg-gray-200  rounded-full size-8"
        >
          <ChevronLeft size={25} />
        </button>
        <button
          onClick={showNextImage}
          className="bg-white right-6 absolute top-[50%] flex justify-center items-center border border-gray-100 rounded-full size-8 duration-300 hover:bg-gray-200 "
        >
          <ChevronRight size={25} />
        </button>
      </div>
    </section>
  );
}
