"use client"
import { ArrowBigLeft, ArrowBigRight, ChevronLeft, ChevronRight } from 'lucide-react'
import React, { useEffect, useState } from 'react'

export default function ImageSlider({imgUrl}:{imgUrl:string[]}) {
    const [imageindex,setImageIndex] = useState<number>(0)
    function showPrevImage(){
        setImageIndex(index =>{
            if (index == imgUrl.length -1) return 0;
            return index + 1
        })
    }
    function showNextImage(){
        setImageIndex(index =>{
            if(index == 0 ) return imgUrl.length -1
            return index - 1
        })
    }

    useEffect(() => {
      const interval = setInterval(() => {
        setImageIndex((prevIndex) =>
          prevIndex === imgUrl.length - 1 ? 0 : prevIndex + 1
        );
      }, 5000); 

      return () => clearInterval(interval); 
    }, [imgUrl.length]);
  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          overflow: "hidden",
        }}
      >
        {imgUrl.map((url) => (
          <img
            key={url}
            src={url}
            alt=""
            className="img-slider-img"
            style={{ translate: `${-100 * imageindex}%`,
             }}
          />
        ))}
      </div>

      <button
        onClick={showPrevImage}
        style={{ left: "0" }}
        className="img-slider-btn"
      >
        <ChevronLeft size={30} />
      </button>
      <button
        onClick={showNextImage}
        style={{ right: "0" }}
        className="img-slider-btn"
      >
        <ChevronRight size={30} />
      </button>
      <div
        style={{
          position: "absolute",
          bottom: "1.5rem",
          left: "50%",
          translate: "-50%",
          display: "flex",
          gap: ".75rem",
        }}
      >
        {imgUrl.map((_, index) => (
          <button
          key={index}
            onClick={() => setImageIndex(index)}
            className={`size-3 ${
              index == imageindex
                ? "border border-black bg-transparent"
                : "bg-gray-500"
            }   rounded-full  cursor-pointer`}
          ></button>
        ))}
      </div>
    </div>
  );
}
